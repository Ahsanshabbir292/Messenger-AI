import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environmental variables
dotenv.config();

const SOURCE_DB_ID = "ai-studio-29c3908b-22bc-437d-90bc-108c053233ac";
const TARGET_DB_ID = undefined; // defaults to "(default)"
const COLLECTIONS_TO_MIGRATE = ["users", "sessions", "announcements", "trialIPs"];

async function migrate() {
  console.log("=== FIRESTORE DATA MIGRATION TRIGGERED ===");
  console.log(`Source DB ID     : ${SOURCE_DB_ID}`);
  console.log(`Target DB ID     : (default)`);
  console.log(`Collections List : ${JSON.stringify(COLLECTIONS_TO_MIGRATE)}`);

  // Detect and parse Service Account to extract the accurate projectId
  let saKey: any = null;
  let saProjectId = "";
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      saKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      saProjectId = saKey.project_id || "";
    } catch (e: any) {
      console.warn("[Setup] Could not parse FIREBASE_SERVICE_ACCOUNT_KEY JSON to find project_id:", e.message);
    }
  }

  const TARGET_PROJECT_ID = saProjectId || process.env.FIREBASE_PROJECT_ID || "";
  console.log(`Resolved Target Project ID: ${TARGET_PROJECT_ID}`);

  // Initialize Firebase Admin
  let app: admin.app.App;
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    console.log("[Setup] Initializing using GOOGLE_APPLICATION_CREDENTIALS file path.");
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      projectId: TARGET_PROJECT_ID
    }, "migration-app");
  } else if (saKey) {
    console.log("[Setup] Initializing using parsed FIREBASE_SERVICE_ACCOUNT_KEY object.");
    app = admin.initializeApp({
      credential: admin.credential.cert(saKey),
      projectId: TARGET_PROJECT_ID
    }, "migration-app");
  } else {
    console.log("[Setup] Initializing via default credentials.");
    app = admin.initializeApp({
      projectId: TARGET_PROJECT_ID
    }, "migration-app");
  }

  const sourceDb = getFirestore(app, SOURCE_DB_ID);
  const targetDb = getFirestore(app);

  let totalDocsCopied = 0;
  let batch = targetDb.batch();
  let operationCount = 0;

  async function commitBatchIfNeeded(force = false) {
    if (operationCount >= 400 || (force && operationCount > 0)) {
      console.log(`[Batch] Committing ${operationCount} writes to target database...`);
      await batch.commit();
      totalDocsCopied += operationCount;
      batch = targetDb.batch(); // Re-initialize new batch
      operationCount = 0;
    }
  }

  // Recursive copy mechanism to support nested subcollections perfectly
  async function copyDocumentAndSubcollections(
    sourceDocRef: admin.firestore.DocumentReference,
    targetDocRef: admin.firestore.DocumentReference,
    pathLog = ""
  ) {
    const docSnap = await sourceDocRef.get();
    if (!docSnap.exists) {
      return;
    }

    const docData = docSnap.data();
    if (docData) {
      // Add standard write to target batch
      batch.set(targetDocRef, docData);
      operationCount++;
      await commitBatchIfNeeded();
      console.log(`[Copied Doc] ${pathLog}`);
    }

    // Identify nested subcollections recursively
    try {
      const subcollections = await sourceDocRef.listCollections();
      for (const subColl of subcollections) {
        const subCollId = subColl.id;
        const subDocs = await subColl.get();
        for (const subDoc of subDocs.docs) {
          const nextSourceRef = subDoc.ref;
          const nextTargetRef = targetDocRef.collection(subCollId).doc(subDoc.id);
          await copyDocumentAndSubcollections(
            nextSourceRef,
            nextTargetRef,
            `${pathLog} -> subcollection: ${subCollId}/${subDoc.id}`
          );
        }
      }
    } catch (err: any) {
      // Some read operations on non-existent subcollections or rule constraints may warn; log & proceed
      console.warn(`[Subcollection Check Warn] Path ${pathLog} check: ${err.message}`);
    }
  }

  // Migrate each root collection
  for (const collName of COLLECTIONS_TO_MIGRATE) {
    console.log(`\n--- Migrating collection: '${collName}' ---`);
    try {
      const sourceColl = sourceDb.collection(collName);
      const snapshot = await sourceColl.get();

      console.log(`Found ${snapshot.size} root documents in '${collName}'`);

      for (const docSnap of snapshot.docs) {
        const sourceDocRef = docSnap.ref;
        const targetDocRef = targetDb.collection(collName).doc(docSnap.id);
        await copyDocumentAndSubcollections(
          sourceDocRef,
          targetDocRef,
          `${collName}/${docSnap.id}`
        );
      }
    } catch (err: any) {
      console.error(`[Error] Failed to read or migrate collection '${collName}':`, err.message);
    }
  }

  // Force commit any remaining writes in final batch
  await commitBatchIfNeeded(true);

  console.log(`\n=== MIGRATION COMPLETE ===`);
  console.log(`Successfully migrated ${totalDocsCopied} total documents/records into default database.`);
}

migrate().catch(err => {
  console.error("FATAL: Migration execution failed:", err);
  process.exit(1);
});
