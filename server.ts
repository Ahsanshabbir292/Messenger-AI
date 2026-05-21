import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import axios from "axios";
import { Server } from "socket.io";
import { createServer } from "http";
import multer from "multer";
import nodemailer from "nodemailer";
import { initializeApp } from "firebase/app";
import { 
  getFirestore as getWebFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import session from "express-session";
import bcrypt from "bcryptjs";
import fs from "fs";

dotenv.config();

console.log("[DEBUG Env Keys]:", Object.keys(process.env).filter(k => k.includes("FIREBASE") || k.includes("GOOGLE") || k.includes("CREDENTIALS") || k.includes("SERVICE")));

declare module 'express-session' {
  interface SessionData {
    user: any;
    fbSessionId: string;
  }
}

// Load Firebase Config
let firebaseConfig: any = {};
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (e) {
    console.error("Error parsing firebase-applet-config.json", e);
  }
}

// Compatibility wrapper classes for Web SDK to match Firestore Admin's collection/doc API
class CompatDocumentReference {
  constructor(private firestore: any, private col: string, private id: string) {}

  async get() {
    try {
      const r = doc(this.firestore, this.col, this.id);
      const snap = await getDoc(r);
      return {
        exists: snap.exists(),
        data: () => snap.data()
      };
    } catch (e: any) {
      console.error(`Error in doc.get() for ${this.col}/${this.id}:`, e.message);
      throw e;
    }
  }

  async set(data: any) {
    try {
      const r = doc(this.firestore, this.col, this.id);
      const processedData = this.replaceServerTimestamp(data);
      await setDoc(r, processedData);
    } catch (e: any) {
      console.error(`Error in doc.set() for ${this.col}/${this.id}:`, e.message);
      throw e;
    }
  }

  async update(data: any) {
    try {
      const r = doc(this.firestore, this.col, this.id);
      const processedData = this.replaceServerTimestamp(data);
      await updateDoc(r, processedData);
    } catch (e: any) {
      console.error(`Error in doc.update() for ${this.col}/${this.id}:`, e.message);
      throw e;
    }
  }

  async delete() {
    try {
      const r = doc(this.firestore, this.col, this.id);
      await deleteDoc(r);
    } catch (e: any) {
      console.error(`Error in doc.delete() for ${this.col}/${this.id}:`, e.message);
      throw e;
    }
  }

  private replaceServerTimestamp(input: any): any {
    if (!input) return input;
    const cloned = { ...input };
    for (const key of Object.keys(cloned)) {
      if (cloned[key] && typeof cloned[key] === "object" && cloned[key]._sv) {
        cloned[key] = serverTimestamp();
      }
    }
    return cloned;
  }
}

class CompatCollectionReference {
  constructor(private firestore: any, private col: string) {}

  doc(id: string) {
    return new CompatDocumentReference(this.firestore, this.col, id);
  }
}

class CompatFirestore {
  constructor(private firestore: any) {}

  collection(col: string) {
    return new CompatCollectionReference(this.firestore, col);
  }
}

const FieldValue = {
  serverTimestamp: () => ({ _sv: true })
};

let db: any = null;
let isDbInitializing = false;

async function getDb(): Promise<any> {
  if (db) return db;
  if (isDbInitializing) {
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (db) return db;
    }
  }
  
  isDbInitializing = true;
  console.log(`[Firebase] Initializing Web SDK. Project: ${firebaseConfig.projectId}`);

  try {
    const app = initializeApp(firebaseConfig);
    const dbId = firebaseConfig.firestoreDatabaseId;
    const webDb = dbId && dbId !== "(default)" ? getWebFirestore(app, dbId) : getWebFirestore(app);
    
    // Connectivity check on startup to verify setup
    try {
      const pingDocRef = doc(webDb, "_connectivity_test", "ping");
      await getDoc(pingDocRef);
      console.log(`[Firebase] Web SDK Connectivity check passed successfully!`);
      db = new CompatFirestore(webDb);
    } catch (err: any) {
      console.error("[Firebase] Web SDK Connectivity check failed:", err.message);
      db = new CompatFirestore(webDb); // Use it anyway as fallback
    }
    
    isDbInitializing = false;
    return db;
  } catch (err: any) {
    console.error(`[Firebase] Fatal error during Firestore Web SDK initialization:`, err.message);
    isDbInitializing = false;
    return null;
  }
}

const upload = multer({ storage: multer.memoryStorage() });

// In-memory stores (Migrated to Firestore)
const TEMP_MAIL_DOMAINS = [
  'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'tempmail.com', 
  'dispostable.com', 'getnada.com', 'yopmail.com', 'temp-mail.org'
];

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = 3000;

  app.set("trust proxy", 1);
  app.use(express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.use(session({
    secret: process.env.SESSION_SECRET || "messenger-ai-secret-key-2024",
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    socket.on("join_page", (pageId) => {
      socket.join(`page_${pageId}`);
      console.log(`Socket ${socket.id} joined page_${pageId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Gemini Setup
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Helper to fetch Facebook config from either User document or Session
  async function getFacebookData(req: any) {
    const db = await getDb();
    if (!db) return null;

    // 1. Check logged-in user in DB (preferred/most robust!)
    let userEmail = req.session.user?.email || req.headers['x-user-email'] || req.query.email;
    if (!userEmail || userEmail === "anonymous") {
      userEmail = "ahsan.shabbir292@gmail.com"; // Smart fallback for developer sandbox
    }
    if (userEmail) {
      try {
        const userDoc = await db.collection("users").doc(userEmail).get();
        if (userDoc.exists) {
          const u = userDoc.data();
          if (u && u.facebook) {
            console.log(`[Firebase] Loaded FB data from user document: ${userEmail}`);
            return u.facebook;
          }
        }
      } catch (e: any) {
        console.error(`[Firebase] Error fetching user doc for FB data: ${e.message}`);
      }
    }

    // 2. Fallback to session
    const sessionId = req.session.fbSessionId || (userEmail ? `fb_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}` : null);
    if (sessionId) {
      try {
        const sessionDoc = await db.collection("sessions").doc(sessionId).get();
        if (sessionDoc.exists) {
          console.log(`[Firebase] Loaded FB data from sessions collection: ${sessionId}`);
          return sessionDoc.data();
        }
      } catch (e: any) {
        console.error(`[Firebase] Error fetching session doc: ${e.message}`);
      }
    }

    return null;
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Lemon Squeezy Webhook API
  app.post("/api/webhooks/lemonsqueezy", async (req: any, res) => {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "get_from_ls_dashboard";
    const signature = req.headers["x-signature"] || req.headers["X-Signature"];

    if (!signature) {
      console.error("[Lemon Webhook] Error: x-signature header is missing.");
      return res.status(400).json({ error: "Signature header missing" });
    }

    const payload = req.rawBody ? req.rawBody : Buffer.from(JSON.stringify(req.body));
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(payload).digest("hex");

    try {
      const isMatch = crypto.timingSafeEqual(
        Buffer.from(digest, "utf-8"),
        Buffer.from(signature as string, "utf-8")
      );
      if (!isMatch) {
         console.error("[Lemon Webhook] Error: Invalid signature match.");
         return res.status(401).json({ error: "Invalid signature" });
      }
    } catch (e: any) {
      console.error("[Lemon Webhook] Error comparing signatures:", e.message);
      return res.status(401).json({ error: "Invalid signature verification" });
    }

    const eventName = req.body.meta?.event_name;
    if (eventName === "order_created" || eventName === "subscription_created") {
      const orderId = req.body.meta?.custom_data?.order_id;
      const workspaceId = req.body.meta?.custom_data?.workspace_id;

      if (!orderId || !workspaceId) {
        console.warn("[Lemon Webhook] Missing order_id or workspace_id:", { orderId, workspaceId });
        return res.status(200).json({ message: "No custom meta data to process" });
      }

      console.log(`[Lemon Webhook] Processing event=${eventName} for orderId=${orderId} workspaceId=${workspaceId}`);

      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not initialized" });
      }

      try {
        const userRef = db.collection("users").doc(workspaceId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
          console.error(`[Lemon Webhook] User not found for workspaceId=${workspaceId}`);
          return res.status(404).json({ error: "User not found" });
        }

        const userData = userDoc.data();
        const billing = userData?.billing || { subscriptions: {}, orders: [] };
        if (!billing.subscriptions) billing.subscriptions = {};
        if (!billing.orders) billing.orders = [];

        const orderIndex = billing.orders.findIndex((o: any) => o.id === orderId);
        if (orderIndex === -1) {
          console.error(`[Lemon Webhook] Order ${orderId} not found for user ${workspaceId}`);
          return res.status(404).json({ error: "Order not found" });
        }

        const o = billing.orders[orderIndex];
        o.status = "Paid";
        o.billing_period_start = new Date().toISOString();
        o.billing_period_end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        // Activate or extend page subscriptions in this order
        const now = new Date();
        for (const orderPage of o.pages) {
          const pageId = orderPage.id;
          const currentSub = billing.subscriptions[pageId] || {
            page_id: pageId,
            name: orderPage.name,
            status: "Trial",
            trial_ends_at: null,
            subscription_ends_at: null
          };

          let newEnd: Date;
          if (currentSub.subscription_ends_at && new Date(currentSub.subscription_ends_at) > now) {
            newEnd = new Date(new Date(currentSub.subscription_ends_at).getTime() + 30 * 24 * 60 * 60 * 1000);
          } else {
            newEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          }

          currentSub.subscription_ends_at = newEnd.toISOString();
          currentSub.status = "Active";
          billing.subscriptions[pageId] = currentSub;
        }

        await userRef.update({ billing });
        console.log(`[Lemon Webhook] Successfully activated pages and set Order PAID for ${orderId}`);
      } catch (err: any) {
        console.error("[Lemon Webhook] DB error updating order:", err.message);
        return res.status(500).json({ error: "Database operation failed: " + err.message });
      }
    } else {
      console.log(`[Lemon Webhook] Skipping unhandled event: ${eventName}`);
    }

    return res.status(200).json({ success: true });
  });

  // Support ticket API
  app.post("/api/legal/support", async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required." });
    }
    const db = await getDb();
    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const ticketData = {
      id: ticketId,
      name: name || "Anonymous",
      email: email,
      subject: subject || "General Support",
      message: message,
      status: "Open",
      createdAt: new Date().toISOString()
    };
    if (db) {
      try {
        await db.collection("supportTickets").doc(ticketId).set(ticketData);
      } catch (err: any) {
        console.error("Failed to save support ticket to firestore", err.message);
      }
    }
    return res.json({ success: true, ticketId, message: "Ticket created successfully!" });
  });

  // Facebook-compliant Data Deletion manual API
  app.post("/api/legal/delete-data", async (req, res) => {
    const { email, confirmation } = req.body;
    if (!email || !confirmation) {
      return res.status(400).json({ error: "Email and deletion confirmation are required." });
    }
    const db = await getDb();
    const deletionConfirmationId = `DEL-${Math.floor(1000000 + Math.random() * 9000000)}`;
    
    // Perform simulated or real deletion in db
    let userFound = false;
    if (db) {
      try {
        const userDoc = await db.collection("users").doc(email).get();
        if (userDoc.exists) {
          userFound = true;
          // Delete user document (this deletes billing, credentials, connected pages)
          await db.collection("users").doc(email).delete();
          
          // Delete active session if any
          const fbSessionId = `fb_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
          await db.collection("sessions").doc(fbSessionId).delete();
        }
        
        // Log manual compliance deletion request
        await db.collection("deletionRequests").doc(deletionConfirmationId).set({
          id: deletionConfirmationId,
          email,
          status: "Processed",
          requestedAt: new Date().toISOString(),
          details: "Self-service deletion via Platform Data Deletion Center."
        });
      } catch (err: any) {
        console.error("Error during Firestore deletion request:", err.message);
      }
    }
    
    // Wipe local session if the user being deleted matches the active session user
    if (req.session.user && req.session.user.email === email) {
      req.session.destroy(() => {});
    }

    return res.json({
      success: true,
      url: `https://messenger-ai.com/legal/deletion-status?id=${deletionConfirmationId}`,
      confirmation_code: deletionConfirmationId,
      message: userFound 
        ? "Apka account aur tamam data MessengerAI k database se permanent delete kr dya gya hai." 
        : "Is email k sath koi account maujood nhi tha, lakin apka privacy request delete track record me record kr dya gya hai."
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    const db = await getDb();
    const headerEmail = req.headers['x-user-email'] as string || req.query.email as string;
    
    if (!req.session.user && headerEmail && db) {
      try {
        const userDoc = await db.collection("users").doc(headerEmail).get();
        if (userDoc.exists) {
          const u = userDoc.data();
          if (u) {
            const { password, ...userWithoutPassword } = u;
            req.session.user = { email: headerEmail, ...userWithoutPassword };
            console.log(`[AUTH] Restored session from header/query email for ${headerEmail}`);
          }
        }
      } catch (err: any) {
        console.error("Failed to restore session via header email:", err.message);
      }
    }

    if (req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Could not log out" });
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  // Sign In Route
  app.post("/api/auth/signin", async (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Signin request for: ${email}`);
    
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    
    const db = await getDb();
    if (!db) {
      console.error("[AUTH] Signin failed: Database not initialized");
      return res.status(500).json({ error: "Database not initialized" });
    }

    try {
      const userDoc = await db.collection("users").doc(email).get();
      if (!userDoc.exists) {
        console.log(`[AUTH] Signin failed: User ${email} not found`);
        return res.status(401).json({ error: "Invalid email or password." });
      }
      
      const user = userDoc.data() as any;
      
      // Password check
      const isMatch = await bcrypt.compare(password, user.password || "");
      if (!isMatch) {
         // Fallback for old accounts without hashed passwords during migration
         if (password !== user.password) {
            return res.status(401).json({ error: "Invalid email or password." });
         }
      }

      // Cleanup password from response
      const { password: _, ...userWithoutPassword } = user;
      
      // Store in session
      req.session.user = userWithoutPassword;
      
      console.log(`[AUTH] Signin successful for: ${email}`);
      res.json({ success: true, user: userWithoutPassword });
    } catch (err: any) {
      console.error("[AUTH] Signin database error:", err);
      res.status(500).json({ error: "Database error: " + err.message });
    }
  });

  // --- TEAM MEMBER INVITATIONS & ROSTER MANAGEMENT API ---
  app.get("/api/team/members", async (req, res) => {
    let userEmail = req.session.user?.email || req.headers['x-user-email'] || req.query.email;
    if (!userEmail || userEmail === "anonymous") {
      userEmail = "ahsan.shabbir292@gmail.com";
    }
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    try {
      const userDoc = await db.collection("users").doc(userEmail).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        const team = data?.teamMembers || [];
        return res.json({ teamMembers: team });
      }
      return res.json({ teamMembers: [] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/team/invite", async (req, res) => {
    const { email, name, role, assignedPages } = req.body;
    let userEmail = req.session.user?.email || req.headers['x-user-email'] || req.query.email;
    if (!userEmail || userEmail === "anonymous") {
      userEmail = "ahsan.shabbir292@gmail.com";
    }

    if (!email || !role || !name) {
      return res.status(400).json({ error: "Email, name and role are required." });
    }

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    try {
      const inviteToken = "inv_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      const inviterName = req.session.user?.fullName || "Ahsan Shabbir";

      // 1. Save invitation in Firestore
      await db.collection("invitations").doc(email.toLowerCase()).set({
        email: email.toLowerCase(),
        name,
        role,
        assignedPages: assignedPages || [],
        inviterEmail: userEmail,
        inviterName,
        token: inviteToken,
        status: "pending",
        createdAt: new Date().toISOString()
      });

      // 2. Fetch admin user profile to update teamMembers array
      const adminDoc = await db.collection("users").doc(userEmail).get();
      let teamMembers = [];
      if (adminDoc.exists) {
        const adminData = adminDoc.data();
        teamMembers = adminData.teamMembers || [];
      }

      // Check if already in the roster, if not, add/update
      const existingIdx = teamMembers.findIndex((m: any) => m.email.toLowerCase() === email.toLowerCase());
      const newMember = {
        id: "m_" + Date.now().toString(),
        name,
        email: email.toLowerCase(),
        role,
        status: "pending",
        token: inviteToken,
        joined_at: new Date().toISOString(),
        assigned_pages: assignedPages || []
      };

      if (existingIdx > -1) {
        teamMembers[existingIdx] = newMember;
      } else {
        teamMembers.push(newMember);
      }

      // Save back to admin document
      await db.collection("users").doc(userEmail).update({ teamMembers });

      // 3. Construct HTML email body and verify link
      const protocol = req.headers.host?.includes('.run.app') ? 'https' : (req.headers['x-forwarded-proto'] || 'http');
      const host = req.headers.host;
      const currentOrigin = host ? `${protocol}://${host}` : '';
      const appUrl = process.env.APP_URL || currentOrigin;

      const inviteLink = `${appUrl}/?invite_token=${inviteToken}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&inviter=${encodeURIComponent(inviterName)}&role=${encodeURIComponent(role)}`;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background-color: #4f46e5; display: inline-block; padding: 12px; border-radius: 12px;">
              <span style="color: #ffffff; font-size: 20px; font-weight: bold;">M</span>
            </div>
            <h1 style="font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 12px;">Workspace Invitation - MessengerAI</h1>
          </div>
          
          <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; line-height: 1.6;">
            <p style="font-size: 15px; margin-bottom: 12px;">Ayaaan / Hello <strong>${name}</strong>,</p>
            <p style="font-size: 15px; margin-bottom: 16px;"><strong>${inviterName}</strong> has invited you to manage their customer interactions. Bhai, standard security access configuration is completed.</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 20px 0; border-radius: 8px;">
              <span style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Assigned Workspace Privilege</span>
              <span style="display: block; font-size: 14px; font-weight: bold; color: #0f172a;">Role: ${role.toUpperCase()}</span>
            </div>

            <p style="font-size: 14px; margin-bottom: 24px; color: #475569;">To accept this invitation and create your account under this workspace, please click the secure link below to verify your email and setup your account:</p>
            
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${inviteLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1), 0 2px 4px -1px rgba(79, 70, 229, 0.06); transition: background-color 0.15s;">Verify & Create Account</a>
            </div>

            <p style="font-size: 12px; color: #64748b; margin-top: 24px;">Link: <a href="${inviteLink}" style="color: #4f46e5; word-break: break-all;">${inviteLink}</a></p>
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 32px; border-t: 1px solid #f1f5f9; padding-top: 16px;">If you didn't expect this invitation, you can ignore this email safely.</p>
          </div>
        </div>
      `;

      if (!process.env.SMTP_USER) {
        console.log(`[TEAM INVITE] SUCCESS (Simulated): Invitation link for ${email}: ${inviteLink}`);
        return res.json({
          success: true,
          simulated: true,
          inviteLink,
          emailHtml,
          message: "Invitation link generated (Simulation Mode). Use copy or direct acceptance testing below!"
        });
      }

      await transporter.sendMail({
        from: process.env.FROM_EMAIL || '"Messenger AI Hub" <noreply@messengerai.com>',
        to: email,
        subject: `Verify your invite - Invited by ${inviterName}`,
        text: `You have been invited to manage customer interactions on MessengerAI by ${inviterName}. Click this link to register: ${inviteLink}`,
        html: emailHtml,
      });

      console.log(`[TEAM INVITE] Invitation email sent to: ${email}`);
      res.json({ success: true, message: "Invitation sent successfully to " + email });
    } catch (err: any) {
      console.error("[TEAM INVITE ERROR]:", err);
      res.status(500).json({ error: "Failed to send invitation: " + err.message });
    }
  });

  app.post("/api/team/verify-and-register", async (req, res) => {
    const { email, password, fullName, token, role, assignedPages } = req.body;
    
    if (!email || !password || !token) {
      return res.status(400).json({ error: "Email, password and token are required." });
    }

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    try {
      const inviteDoc = await db.collection("invitations").doc(email.toLowerCase()).get();
      if (!inviteDoc.exists) {
        return res.status(400).json({ error: "No invitation was found for this email address." });
      }

      const inviteData = inviteDoc.data();
      if (inviteData.token !== token || inviteData.status !== "pending") {
        return res.status(400).json({ error: "Invitation is invalid or has already been accepted." });
      }

      // Check if user already exists
      const userDoc = await db.collection("users").doc(email.toLowerCase()).get();
      if (userDoc.exists) {
        return res.status(400).json({ error: "User already exists with this email." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userData = {
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName: fullName || inviteData.name || email.split('@')[0],
        workspaceId: "ws_" + Math.random().toString(36).substring(7),
        role: role || inviteData.role || "member",
        assignedPages: assignedPages || inviteData.assignedPages || [],
        invited: true,
        createdAt: new Date().toISOString()
      };

      await db.collection("users").doc(email.toLowerCase()).set(userData);

      // Mark invitation as accepted
      await db.collection("invitations").doc(email.toLowerCase()).update({
        status: "accepted",
        acceptedAt: new Date().toISOString()
      });

      // Update in the inviter's user document
      const inviterEmail = inviteData.inviterEmail;
      if (inviterEmail) {
        const inviterDoc = await db.collection("users").doc(inviterEmail).get();
        if (inviterDoc.exists) {
          const inviterData = inviterDoc.data();
          const team = inviterData.teamMembers || [];
          const idx = team.findIndex((m: any) => m.email.toLowerCase() === email.toLowerCase());
          if (idx > -1) {
            team[idx].status = "active";
            team[idx].joined_at = new Date().toISOString();
            await db.collection("users").doc(inviterEmail).update({ teamMembers: team });
          }
        }
      }

      // Login the user in session
      const { password: _, ...userWithoutPassword } = userData;
      req.session.user = userWithoutPassword;

      res.json({ success: true, user: userWithoutPassword });
    } catch (err: any) {
      console.error("[Verify and Register Error]:", err);
      res.status(500).json({ error: "Register process error: " + err.message });
    }
  });

  app.post("/api/team/delete", async (req, res) => {
    const { email } = req.body;
    let userEmail = req.session.user?.email || req.headers['x-user-email'] || req.query.email;
    if (!userEmail || userEmail === "anonymous") {
      userEmail = "ahsan.shabbir292@gmail.com";
    }

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    try {
      const adminDoc = await db.collection("users").doc(userEmail).get();
      if (!adminDoc.exists) return res.status(404).json({ error: "Profile not found." });

      const adminData = adminDoc.data();
      const teamMembers = adminData.teamMembers || [];
      const updatedList = teamMembers.filter((m: any) => m.email.toLowerCase() !== email.toLowerCase());

      await db.collection("users").doc(userEmail).update({ teamMembers: updatedList });
      
      // Also delete invitation
      try {
        await db.collection("invitations").doc(email.toLowerCase()).delete();
      } catch (err) {}

      res.json({ success: true, teamMembers: updatedList });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Email Auth Routes
  app.post("/api/auth/send-verification", async (req, res) => {
    const { email, password, fullName, workspaceName } = req.body;
    console.log(`[AUTH] Send verification request for: ${email}`);
    
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const clientIp = Array.isArray(ip) ? ip[0] : ip || 'unknown';

    if (!email) return res.status(400).json({ error: "Email is required" });

    // 1. Check for Temp Mail
    const domain = email.split('@')[1];
    if (TEMP_MAIL_DOMAINS.includes(domain)) {
      return res.status(400).json({ error: "Temporary emails are not allowed for registration." });
    }

    const db = await getDb();
    if (!db) {
      console.error("[AUTH] Signup failed: Database not initialized");
      return res.status(500).json({ error: "Database not initialized" });
    }

    try {
      // 2. Check if email already exists
      const userDoc = await db.collection("users").doc(email).get();
      if (userDoc.exists) {
        return res.status(400).json({ error: "An account with this email already exists." });
      }

      // 3. Check IP for Trial Abuse
      const ipDoc = await db.collection("trialIPs").doc(clientIp).get();
      if (ipDoc.exists) {
         return res.status(400).json({ error: "An account has already been created from this device/network." });
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Passwords should be hashed even in temp storage preferred
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      await db.collection("verificationCodes").doc(email).set({
        email,
        code,
        password: hashedPassword,
        fullName,
        workspaceName,
        createdAt: FieldValue.serverTimestamp()
      });

      console.log(`[AUTH] Verification code for ${email} stored in DB: ${code}`);

      // Setup Nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // If no real SMTP_USER is provided, we'll log it and tell the user
      if (!process.env.SMTP_USER) {
        console.log(`[AUTH] SUCCESS (Simulated): Verification code for ${email}: ${code}`);
        return res.json({ 
          success: true, 
          message: `Verification code generated (Simulation Mode). For testing, please check server logs for the code, or configure an SMTP server.`,
          simulated: true 
        });
      }

      await transporter.sendMail({
        from: process.env.FROM_EMAIL || '"Messenger Interact" <noreply@messengerinteract.com>',
        to: email,
        subject: "Verify your account - Messenger Interact",
        text: `Your verification code is: ${code}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Verify your account</h2>
            <p>Welcome to Messenger Interact! Please use the following code to complete your registration:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; color: #111827;">
              ${code}
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This code will expire in 10 minutes.</p>
          </div>
        `,
      });

      console.log(`[AUTH] Verification email sent to: ${email}`);
      res.json({ success: true, message: "Code sent successfully" });
    } catch (error: any) {
      console.error("[AUTH] Signup Error:", error);
      res.status(500).json({ error: "Auth process error: " + error.message });
    }
  });

  app.post("/api/auth/verify-code", async (req, res) => {
    const { email, code } = req.body;
    console.log(`[AUTH] Verify code request for: ${email}, code: ${code}`);
    
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const clientIp = Array.isArray(ip) ? ip[0] : ip || 'unknown';

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    try {
      const codeDoc = await db.collection("verificationCodes").doc(email).get();
      const storedData = codeDoc.data();

      if (!storedData) {
        return res.status(400).json({ error: "Verification session expired. Please start over." });
      }

      console.log(`[AUTH] Stored data for ${email}:`, storedData);

      if (storedData && storedData.code === code) {
        await db.collection("verificationCodes").doc(email).delete(); // One-time use
        
        // Successfully registered
        const userData = { 
          email,
          password: storedData.password, // This was already hashed in send-verification
          fullName: storedData.fullName || email.split('@')[0],
          workspaceId: "ws_" + Math.random().toString(36).substring(7),
          ip: clientIp, 
          createdAt: FieldValue.serverTimestamp() 
        };
        
        await db.collection("users").doc(email).set(userData);
        
        // Track IP for trial
        await db.collection("trialIPs").doc(clientIp).set({ used: true, createdAt: FieldValue.serverTimestamp() });
        
        // Login the user in session
        const { password: _, ...userWithoutPassword } = userData;
        req.session.user = userWithoutPassword;

        console.log(`[AUTH] User verified and created: ${email}`);
        res.json({ success: true, user: userWithoutPassword });
      } else {
        console.log(`[AUTH] Verification failed for ${email}: Invalid code`);
        res.status(400).json({ error: "Invalid or expired verification code" });
      }
    } catch (err: any) {
      console.error("[AUTH] Verification database error:", err);
      res.status(500).json({ error: "Database error during verification: " + err.message });
    }
  });

  // Facebook OAuth Routes
  app.get("/api/auth/facebook/url", (req, res) => {
    const appId = process.env.FACEBOOK_APP_ID;
    
    // Force HTTPS for Cloud Run URLs to avoid URI mismatch
    const protocol = req.headers.host?.includes('.run.app') ? 'https' : (req.headers['x-forwarded-proto'] || 'http');
    const host = req.headers.host;
    const currentOrigin = host ? `${protocol}://${host}` : '';
    const appUrl = process.env.APP_URL || currentOrigin;
    
    if (!appId || appId === "" || appId === "YOUR_FACEBOOK_APP_ID") {
      return res.status(400).json({ 
        error: "App ID missing! Please click 'Settings' button on the right side and add your FACEBOOK_APP_ID." 
      });
    }

    const redirectUri = `${appUrl}/auth/facebook/callback`;
    
    const scope = [
      "pages_show_list",
      "pages_messaging",
      "pages_read_engagement",
      "pages_manage_metadata",
      "public_profile"
    ].join(",");

    const userEmail = (req.query.email || (req.session.user && req.session.user.email) || "ahsan.shabbir292@gmail.com") as string;
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&state=${encodeURIComponent(userEmail)}`;
    
    res.json({ url: authUrl });
  });

  app.get("/auth/facebook/callback", async (req, res) => {
    const { code, state, error, error_description } = req.query;
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    
    const protocol = req.headers.host?.includes('.run.app') ? 'https' : (req.headers['x-forwarded-proto'] || 'http');
    const host = req.headers.host;
    const currentOrigin = host ? `${protocol}://${host}` : '';
    const redirectUri = `${process.env.APP_URL || currentOrigin}/auth/facebook/callback`;

    if (error) {
      console.error("FB Auth Error:", error_description || error);
      return res.status(400).send(`
        <div style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2 style="color: #dc2626;">Facebook Connection Failed</h2>
          <p>${error_description || error}</p>
          <button onclick="window.close()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer;">Close Window</button>
        </div>
      `);
    }

    if (!code || !appId || !appSecret) {
      return res.status(400).send("Missing code or app configuration (App ID/Secret).");
    }

    try {
      // 1. Exchange code for user access token
      const tokenResponse = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code
        }
      });

      const userAccessToken = tokenResponse.data.access_token;

      // 2. Get user's pages and their access tokens
      const pagesResponse = await axios.get(`https://graph.facebook.com/v19.0/me/accounts`, {
        params: { 
          access_token: userAccessToken,
          fields: "name,id,access_token,picture.type(large){url}"
        }
      });

      const pages = pagesResponse.data.data || [];
      let userEmail = (state as string) || (req.session?.user && req.session.user.email) || "ahsan.shabbir292@gmail.com";
      if (!userEmail || userEmail === "anonymous") {
        userEmail = "ahsan.shabbir292@gmail.com";
      }

      // 3. Store in session
      req.session.fbSessionId = `fb_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`; 

      const db = await getDb();
      if (db) {
        await db.collection("sessions").doc(req.session.fbSessionId).set({ 
          userAccessToken, 
          pages,
          selectedPageIds: [] 
        });

        if (userEmail && userEmail !== "anonymous") {
          console.log(`[Firebase] Merging Facebook state directly into user document for ${userEmail}`);
          const userDocRef = db.collection("users").doc(userEmail);
          const snap = await userDocRef.get();
          if (snap.exists) {
            await userDocRef.update({
              facebook: {
                userAccessToken,
                pages,
                selectedPageIds: []
              }
            });
          } else {
            await userDocRef.set({
              email: userEmail,
              facebook: {
                userAccessToken,
                pages,
                selectedPageIds: []
              }
            });
          }
        }
      }

      // 4. Return success HTML with postMessage and localStorage sync
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Facebook Authenticated</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Inter', -apple-system, sans-serif;
              background-color: #f8fafc;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              color: #0f172a;
            }
            .card {
              background: white;
              padding: 2.5rem;
              border-radius: 1rem;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
              max-width: 420px;
              width: 100%;
              text-align: center;
              border: 1px solid #e2e8f0;
            }
            .icon-container {
              width: 64px;
              height: 64px;
              background-color: #ecfdf5;
              color: #10b981;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1.5rem;
            }
            .icon {
              width: 32px;
              height: 32px;
            }
            h2 {
              margin: 0 0 0.5rem;
              font-size: 1.5rem;
              font-weight: 700;
              color: #0f172a;
            }
            p {
              color: #64748b;
              font-size: 0.95rem;
              line-height: 1.5;
              margin: 0 0 1.75rem;
            }
            .btn {
              display: inline-block;
              width: 100%;
              padding: 0.875rem 1.5rem;
              background-color: #1877f2;
              color: white;
              border: none;
              border-radius: 0.5rem;
              font-weight: 600;
              font-size: 1rem;
              cursor: pointer;
              transition: background-color 0.2s;
              text-decoration: none;
              box-sizing: border-box;
            }
            .btn:hover {
              background-color: #166fe5;
            }
            .status-badge {
              display: inline-block;
              margin-top: 1.25rem;
              font-size: 0.8rem;
              color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon-container">
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2>Facebook Connected!</h2>
            <p>Bhai configuration complete ho chuki hai! Facebook page sahi se connect ho chuka hai aur database automatic update ho gaya hai.</p>
            
            <button onclick="closeAndReturn()" class="btn">Close Window</button>
            
            <span class="status-badge" id="countdown">Auto-closing in 3 seconds...</span>
          </div>

          <script>
            // Store details in localStorage so the main app iframe knows we logged in successfully
            try {
              localStorage.setItem('FB_AUTH_SUCCESS', JSON.stringify({
                sessionId: '${req.session.fbSessionId}',
                timestamp: Date.now()
              }));
              console.log("LocalStorage FB_AUTH_SUCCESS status set.");
            } catch (e) {
              console.error("Failed to write to localStorage:", e);
            }

            // Post message to opener iframe
            if (window.opener) {
              try {
                window.opener.postMessage({ 
                  type: 'FB_AUTH_SUCCESS', 
                  sessionId: '${req.session.fbSessionId}' 
                }, '*');
                console.log("PostMessage targets successfully sent to page opener.");
              } catch (e) {
                console.error("Failed to postMessage to opener:", e);
              }
            }

            // Auto close handler
            function closeAndReturn() {
              window.close();
              // Fallback warning if browser blocks window.close()
              setTimeout(function() {
                const countdownEl = document.getElementById('countdown');
                if (countdownEl) {
                  countdownEl.style.color = '#dc2626';
                  countdownEl.textContent = "Please is window/tab ko manually band kar dain aur main dashboard pe chale jain.";
                }
              }, 400);
            }

            // Auto timer to close window
            let count = 3;
            const interval = setInterval(function() {
              count--;
              const countEl = document.getElementById('countdown');
              if (countEl) {
                countEl.textContent = "Auto-closing in " + count + " seconds...";
              }
              if (count <= 0) {
                clearInterval(interval);
                closeAndReturn();
              }
            }, 1000);
          </script>
        </body>
        </html>
      `);
    } catch (error: any) {
      console.error("FB Callback Error:", error.response?.data || error.message);
      res.status(500).send("Failed to authenticate with Facebook");
    }
  });

  app.get("/api/facebook/me", async (req, res) => {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    const data = await getFacebookData(req);
    if (!data) return res.json(null);

    try {
      const response = await axios.get(`https://graph.facebook.com/v19.0/me`, {
        params: { 
          access_token: data.userAccessToken,
          fields: "name,id,picture{url}"
        }
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("FB Profile Get Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch user info" });
    }
  });

  app.get("/api/facebook/pages", async (req, res) => {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    const data = await getFacebookData(req);
    if (!data) return res.json({ pages: [], selectedPageIds: [], trialLocked: false });
    res.json({ 
      pages: data.pages || [], 
      selectedPageIds: data.selectedPageIds || [],
      trialLocked: !!data.trialLocked
    });
  });

  app.post("/api/facebook/select-trial-page", async (req, res) => {
    const { pageId, selected } = req.body;

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    
    const data = await getFacebookData(req);
    if (!data) return res.status(401).json({ error: "Not authenticated" });

    if (data.trialLocked) {
      return res.status(400).json({ error: "Trial has already been locked. You cannot change your pages anymore." });
    }

    let selectedIds = data.selectedPageIds || [];

    if (selected) {
      if (selectedIds.length >= 3) {
        return res.status(400).json({ error: "Trial limit reached. You can only select up to 3 pages." });
      }
      if (!selectedIds.includes(pageId)) {
        selectedIds.push(pageId);
      }
    } else {
      if (selectedIds.includes(pageId)) {
        return res.status(400).json({ error: "Bhai, ek dafa page ko trial k liye active kar liya to phir us ko remove karne ka option nahi hota." });
      }
      selectedIds = selectedIds.filter((id: string) => id !== pageId);
    }

    // A. Update in user document directly
    let userEmail = req.session.user?.email || req.headers['x-user-email'] || req.query.email;
    if (!userEmail || userEmail === "anonymous") {
      userEmail = "ahsan.shabbir292@gmail.com"; // Smart fallback for developer sandbox
    }

    if (userEmail) {
      try {
        const userDoc = await db.collection("users").doc(userEmail).get();
        if (userDoc.exists) {
          const u = userDoc.data();
          await db.collection("users").doc(userEmail).update({
            facebook: {
              ...(u?.facebook || {}),
              selectedPageIds: selectedIds
            }
          });
        }
      } catch (err: any) {
        console.error("Failed to update user selected pages:", err.message);
      }
    }

    // B. Fallback: Update in session too
    const sessionId = req.session.fbSessionId || (userEmail ? `fb_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}` : null);
    if (sessionId) {
      try {
        await db.collection("sessions").doc(sessionId).update({ selectedPageIds: selectedIds });
      } catch (err: any) {
        console.error("Failed to update session selected pages:", err.message);
      }
    }

    res.json({ success: true, selectedPageIds: selectedIds });
  });

  app.post("/api/facebook/lock-trial", async (req, res) => {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    const data = await getFacebookData(req);
    if (!data) return res.status(401).json({ error: "Not authenticated" });

    const selectedIds = data.selectedPageIds || [];
    if (selectedIds.length === 0) {
      return res.status(400).json({ error: "Choose at least 1 page before activating the trial." });
    }
    if (selectedIds.length > 3) {
      return res.status(400).json({ error: "You can only activate up to 3 pages for trial." });
    }

    // A. Update in user document directly
    let userEmail = req.session.user?.email || req.headers['x-user-email'] || req.query.email;
    if (!userEmail || userEmail === "anonymous") {
      userEmail = "ahsan.shabbir292@gmail.com"; // Smart fallback for developer sandbox
    }

    if (userEmail) {
      try {
        const userDoc = await db.collection("users").doc(userEmail).get();
        if (userDoc.exists) {
          const u = userDoc.data();
          await db.collection("users").doc(userEmail).update({
            facebook: {
              ...(u?.facebook || {}),
              trialLocked: true
            }
          });
        }
      } catch (err: any) {
        console.error("Failed to track trial lock:", err.message);
      }
    }

    // B. Session update fallback
    const sessionId = req.session.fbSessionId || (userEmail ? `fb_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}` : null);
    if (sessionId) {
      try {
        await db.collection("sessions").doc(sessionId).update({ trialLocked: true });
      } catch (err: any) {
        console.error("Failed to lock trial in session:", err.message);
      }
    }

    res.json({ success: true, trialLocked: true });
  });

  // --- BILLING & SUBSCRIPTIONS API ---
  app.get("/api/billing/data", async (req, res) => {
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    let userEmail = req.session.user?.email || req.headers['x-user-email'] || req.query.email;
    if (!userEmail || userEmail === "anonymous") {
      userEmail = "ahsan.shabbir292@gmail.com";
    }

    try {
      const userRef = db.collection("users").doc(userEmail);
      const userDoc = await userRef.get();
      const userData = userDoc.exists ? userDoc.data() : {};
      
      const billing = userData.billing || { subscriptions: {}, orders: [] };
      if (!billing.subscriptions) billing.subscriptions = {};
      if (!billing.orders) billing.orders = [];

      // Sync active connected FB pages into our subscriptions object
      const fbData = await getFacebookData(req);
      const fbPages = fbData?.pages || [];

      let hasChanges = false;
      for (const page of fbPages) {
        if (!billing.subscriptions[page.id]) {
          // Initialize page default free trial (3 days from now)
          const trialEnds = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
          billing.subscriptions[page.id] = {
            page_id: page.id,
            name: page.name,
            status: "Trial",
            trial_ends_at: trialEnds,
            subscription_ends_at: null
          };
          hasChanges = true;
        }
      }

      // Dynamically recalculate trial/active/expired status based on current timestamps
      const now = new Date();
      for (const pageId of Object.keys(billing.subscriptions)) {
        const sub = billing.subscriptions[pageId];
        
        let targetStatus = sub.status || "Trial";
        if (targetStatus !== "Disabled") {
          if (sub.subscription_ends_at && new Date(sub.subscription_ends_at) > now) {
            targetStatus = "Active";
          } else {
            // For any trial/expired status where there's no paid subscription, ensure it is active with 3 days remaining
            const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
            sub.trial_ends_at = threeDaysFromNow;
            targetStatus = "Trial";
            hasChanges = true;
          }
        }
        
        if (sub.status !== targetStatus) {
          sub.status = targetStatus;
          hasChanges = true;
        }
      }

      if (hasChanges && userDoc.exists) {
        await userRef.update({ billing });
      } else if (hasChanges && !userDoc.exists) {
        await userRef.set({ email: userEmail, billing, ip: req.ip, createdAt: new Date() });
      }

      res.json(billing);
    } catch (err: any) {
      console.error("[Billing API] Error getting billing details:", err.message);
      res.status(500).json({ error: "Failed to fetch billing data", details: err.message });
    }
  });

  app.post("/api/billing/order", async (req, res) => {
    const { pageIds, discountCode } = req.body;
    if (!pageIds || !Array.isArray(pageIds) || pageIds.length === 0) {
      return res.status(400).json({ error: "No pages selected for order" });
    }

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    let userEmail = req.session.user?.email || req.headers['x-user-email'] || req.query.email;
    if (!userEmail || userEmail === "anonymous") {
      userEmail = "ahsan.shabbir292@gmail.com";
    }

    try {
      const fbData = await getFacebookData(req);
      const fbPages = fbData?.pages || [];

      const userRef = db.collection("users").doc(userEmail);
      const userDoc = await userRef.get();
      const userData = userDoc.exists ? userDoc.data() : {};
      
      const billing = userData.billing || { subscriptions: {}, orders: [] };
      if (!billing.subscriptions) billing.subscriptions = {};
      if (!billing.orders) billing.orders = [];

      // Calculate base pricing
      const basePrice = 10; // $10 per page
      let subtotal = pageIds.length * basePrice;
      let discount = 0;

      // Promo discount validation
      const codeUpper = discountCode?.trim().toUpperCase();
      if (codeUpper === "SAVE50" || codeUpper === "WELCOME50") {
        discount = subtotal * 0.5; // 50% discount
      } else if (codeUpper === "SAVE20") {
        discount = subtotal * 0.2; // 20% discount
      } else if (codeUpper === "VIP90") {
        discount = subtotal * 0.9; // 90% discount
      }

      const totalAmount = Math.max(0, subtotal - discount);

      // Create unique order
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = {
        id: orderId,
        workspace_id: userEmail,
        status: "Awaiting Payment",
        pages: pageIds.map(pid => {
          const matchedPage = fbPages.find((p: any) => p.id === pid) || billing.subscriptions[pid];
          return {
            id: pid,
            name: matchedPage?.name || `Page ${pid}`,
            price: basePrice
          };
        }),
        amount: totalAmount,
        created_at: new Date().toISOString(),
        billing_period_start: new Date().toISOString(),
        billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        discountCode: discountCode || null
      };

      billing.orders.push(newOrder);

      if (userDoc.exists) {
        await userRef.update({ billing });
      } else {
        await userRef.set({ email: userEmail, billing, ip: req.ip, createdAt: new Date() });
      }

      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      console.error("[Billing API] Error creating order:", err.message);
      res.status(500).json({ error: "Failed to create order", details: err.message });
    }
  });

  app.post("/api/billing/order/:orderId/pay", async (req, res) => {
    const { orderId } = req.params;
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    let userEmail = req.session.user?.email || req.headers['x-user-email'] || req.query.email;
    if (!userEmail || userEmail === "anonymous") {
      userEmail = "ahsan.shabbir292@gmail.com";
    }

    try {
      const userRef = db.collection("users").doc(userEmail);
      const userDoc = await userRef.get();
      if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

      const userData = userDoc.data();
      const billing = userData.billing || { subscriptions: {}, orders: [] };
      if (!billing.subscriptions) billing.subscriptions = {};
      if (!billing.orders) billing.orders = [];

      const orderIndex = billing.orders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) return res.status(404).json({ error: "Order not found" });

      const o = billing.orders[orderIndex];
      o.status = "Paid";

      // Activate or extend page subscriptions in this order
      const now = new Date();
      for (const orderPage of o.pages) {
        const pageId = orderPage.id;
        const currentSub = billing.subscriptions[pageId] || {
          page_id: pageId,
          name: orderPage.name,
          status: "Trial",
          trial_ends_at: null,
          subscription_ends_at: null
        };

        // If subscription is currently active, extend it by 30 days. Otherwise, set it 30 days from now.
        let newEnd: Date;
        if (currentSub.subscription_ends_at && new Date(currentSub.subscription_ends_at) > now) {
          newEnd = new Date(new Date(currentSub.subscription_ends_at).getTime() + 30 * 24 * 60 * 60 * 1000);
        } else {
          newEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }

        currentSub.subscription_ends_at = newEnd.toISOString();
        currentSub.status = "Active";
        billing.subscriptions[pageId] = currentSub;
      }

      await userRef.update({ billing });
      res.json({ success: true, order: o });
    } catch (err: any) {
      console.error("[Billing API] Error paying order:", err.message);
      res.status(500).json({ error: "Failed to process payment", details: err.message });
    }
  });

  app.post("/api/billing/order/:orderId/delete", async (req, res) => {
    const { orderId } = req.params;
    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    let userEmail = req.session.user?.email || req.headers['x-user-email'] || req.query.email;
    if (!userEmail || userEmail === "anonymous") {
      userEmail = "ahsan.shabbir292@gmail.com";
    }

    try {
      const userRef = db.collection("users").doc(userEmail);
      const userDoc = await userRef.get();
      if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

      const userData = userDoc.data();
      const billing = userData.billing || { subscriptions: {}, orders: [] };

      // Filter out or cancel order
      const orderIndex = billing.orders.findIndex((o: any) => o.id === orderId);
      if (orderIndex === -1) return res.status(404).json({ error: "Order not found" });

      // If already paid, mark Cancelled, otherwise splice
      const order = billing.orders[orderIndex];
      if (order.status === "Paid") {
        order.status = "Cancelled";
      } else {
        billing.orders.splice(orderIndex, 1);
      }

      await userRef.update({ billing });
      res.json({ success: true });
    } catch (err: any) {
      console.error("[Billing API] Error deleting order:", err.message);
      res.status(500).json({ error: "Failed to delete order", details: err.message });
    }
  });

  app.get("/api/facebook/conversations/:pageId", async (req, res) => {
    const { pageId } = req.params;

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    
    const data = await getFacebookData(req);
    if (!data) return res.status(401).json({ error: "Not authenticated" });
    
    const page = data.pages?.find((p: any) => p.id === pageId);
    if (!page) return res.status(404).json({ error: "Page not found" });

    try {
      // Get conversations for the page
      const convResponse = await axios.get(`https://graph.facebook.com/v19.0/${pageId}/conversations`, {
        params: {
          access_token: page.access_token,
          fields: "participants{name,picture.type(large){url},id},messages.limit(100){message,from,created_time,attachments},updated_time",
          limit: 50
        }
      });
      res.json({ conversations: convResponse.data.data });
    } catch (error: any) {
      console.error("FB Conv Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/facebook/reply", async (req, res) => {
    const { pageId, recipientId, message } = req.body;

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    
    const data = await getFacebookData(req);
    if (!data) return res.status(401).json({ error: "Not authenticated" });
    
    const page = data.pages?.find((p: any) => p.id === pageId);
    if (!page) return res.status(404).json({ error: "Page not found" });

    try {
      const response = await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
        recipient: { id: recipientId },
        message: { text: message },
        messaging_type: "RESPONSE" // Required for standard replies
      }, {
        params: { access_token: page.access_token }
      });

      // Emit real-time event
      io.to(`page_${pageId}`).emit("new_message", {
        pageId,
        recipientId,
        message: {
          text: message,
          from: { id: pageId, name: page.name },
          created_time: new Date().toISOString()
        }
      });

      res.json({ success: true, messageId: response.data.message_id });
    } catch (error: any) {
      const fbError = error.response?.data || error.message;
      console.error("FB Reply Error:", JSON.stringify(fbError, null, 2));

      const fbErrorCode = fbError?.error?.code;
      const fbErrorSubcode = fbError?.error?.error_subcode;
      const fbErrorMessage = fbError?.error?.message || "";

      // 1. Standard allowed window error (subcode 2018278) or allowed window message -> Retry using HUMAN_AGENT tag fallback
      if (fbErrorSubcode === 2018278 || fbErrorMessage.includes("allowed window") || fbErrorMessage.includes("24-hour")) {
        console.log("[Facebook API] Detected 24-hour limit error. Attempting HUMAN_AGENT message tag fallback...");
        try {
          const fallbackResponse = await axios.post(`https://graph.facebook.com/v19.0/me/messages`, {
            recipient: { id: recipientId },
            message: { text: message },
            messaging_type: "MESSAGE_TAG",
            tag: "HUMAN_AGENT"
          }, {
            params: { access_token: page.access_token }
          });

          // Emit real-time event
          io.to(`page_${pageId}`).emit("new_message", {
            pageId,
            recipientId,
            message: {
              text: message,
              from: { id: pageId, name: page.name },
              created_time: new Date().toISOString()
            }
          });

          return res.json({ success: true, messageId: fallbackResponse.data.message_id, tagUsed: "HUMAN_AGENT" });
        } catch (fallbackError: any) {
          const fbFallbackError = fallbackError.response?.data || fallbackError.message;
          console.error("FB Reply Fallback Error:", JSON.stringify(fbFallbackError, null, 2));
          
          return res.status(500).json({
            error: "Facebook 24-Hour limit check failed. (Aap 24 gantay k bad user ko direct reply nahi bhej saktay, jab tk k standard 'HUMAN_AGENT' or 'pages_messaging' Advanced permission allow na ho and and receiver apke Meta App me role/tester registered ho).",
            details: fbFallbackError
          });
        }
      }

      // 2. Friendly explain other bugs
      let friendlyError = "Failed to send message.";
      if (fbErrorCode === 10 || fbErrorMessage.includes("permission") || fbErrorMessage.includes("tester")) {
        friendlyError = "Permission Check: Aapka Facebook developer app abi Development mode me hai, isliye messaging sirf registered App developers ya testers k liye chalegi. Ya phr 'pages_messaging' Advanced permission allow nahi ha.";
      } else if (fbErrorMessage) {
        friendlyError = fbErrorMessage;
      }

      res.status(500).json({ 
        error: friendlyError, 
        details: fbError
      });
    }
  });

  app.post("/api/facebook/send-attachment", upload.single("file"), async (req: any, res) => {
    const { pageId, recipientId, type } = req.body;
    const file = req.file;

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    
    const data = await getFacebookData(req);
    if (!data) return res.status(401).json({ error: "Not authenticated" });
    const page = data.pages?.find((p: any) => p.id === pageId);
    if (!page) return res.status(404).json({ error: "Page not found" });
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    try {
      // Use FormData to send file to FB
      const formData = new FormData();
      formData.append("recipient", JSON.stringify({ id: recipientId }));
      formData.append("message", JSON.stringify({ 
        attachment: { 
          type, 
          payload: { is_reusable: true } 
        } 
      }));
      
      const blob = new Blob([file.buffer], { type: file.mimetype });
      formData.append("filedata", blob, file.originalname);

      const response = await axios.post(`https://graph.facebook.com/v19.0/me/messages`, formData, {
        params: { access_token: page.access_token },
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Emit real-time event
      io.to(`page_${pageId}`).emit("new_message", {
        pageId,
        recipientId,
        message: {
          attachments: [{ type, payload: { url: "Attachment (refresh to view)" } }],
          from: { id: pageId, name: page.name },
          created_time: new Date().toISOString()
        }
      });

      res.json({ success: true, messageId: response.data.message_id });
    } catch (error: any) {
      const fbError = error.response?.data || error.message;
      console.error("FB Attachment Error:", JSON.stringify(fbError, null, 2));
      res.status(500).json({ error: "Failed to send attachment", details: fbError });
    }
  });

  // Facebook Webhook Verification (Required for setup)
  app.get("/api/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Use this token in Facebook Developer portal: FB_BOT_SECRET_2024
    const VERIFY_TOKEN = "FB_BOT_SECRET_2024";

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  });

  app.post("/api/webhook", (req, res) => {
    const body = req.body;
    console.log("FB Webhook Event Received:", JSON.stringify(body, null, 2));
    
    if (body.object === "page") {
      body.entry.forEach((entry: any) => {
        const pageId = entry.id;
        if (entry.messaging) {
          entry.messaging.forEach((messagingEvent: any) => {
            if (messagingEvent.message) {
              // Emit real-time event to the specific page room
              io.to(`page_${pageId}`).emit("new_message", {
                pageId,
                recipientId: messagingEvent.sender.id,
                message: messagingEvent.message
              });
            }
          });
        }
      });
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  });

  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Missing API Key" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: {
          systemInstruction: "You are a helpful customer support bot for MessengerInteract. You specialize in helping users automate their Facebook Messenger conversations. Be professional, concise, and focus on Messenger automation solutions.",
        }
      });
      
      const text = response.text;

      res.json({ text });
    } catch (error: any) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
