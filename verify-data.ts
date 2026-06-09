import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const configPath = "./firebase-applet-config.json";
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
firebaseConfig.firestoreDatabaseId = firebaseConfig.firestoreDatabaseId || "ai-studio-29c3908b-22bc-437d-90bc-108c053233ac";

async function run() {
  console.log(`[Diagnostic] Initializing app ${firebaseConfig.projectId}, database: ${firebaseConfig.firestoreDatabaseId}`);
  const app = initializeApp(firebaseConfig);
  const webDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);

  const email = "ahsan.shabbir292@gmail.com";
  const userDocRef = doc(webDb, "users", email);
  
  try {
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      console.log(`[Diagnostic] Document for user ${email} DOES NOT EXIST in Firestore!`);
    } else {
      const data = snap.data();
      console.log(`[Diagnostic] Document exists for ${email}:`);
      console.log(`- fullName:`, data.fullName);
      console.log(`- role:`, data.role);
      console.log(`- workspaceId:`, data.workspaceId);
      console.log(`- workspaceName:`, data.workspaceName);
      console.log(`- teamMembers exists?:`, !!data.teamMembers);
      if (data.teamMembers) {
        console.log(`- teamMembers count:`, Array.isArray(data.teamMembers) ? data.teamMembers.length : typeof data.teamMembers);
        console.log(`- teamMembers details:`, JSON.stringify(data.teamMembers, null, 2));
      }
      console.log(`- facebook connected?:`, !!data.facebook);
      if (data.facebook) {
        console.log(`  - name:`, data.facebook.name);
        console.log(`  - keys:`, Object.keys(data.facebook));
        console.log(`  - pages present?:`, !!data.facebook.pages);
        if (data.facebook.pages) {
          console.log(`  - pages count:`, data.facebook.pages.length);
          console.log(`  - pages details:`, data.facebook.pages.map((p: any) => ({ id: p.id, name: p.name, hasToken: !!p.access_token })));
        }
        console.log(`  - selectedPageIds:`, data.facebook.selectedPageIds);
      }
      
      console.log(`- facebookWorkspaces exists?:`, !!data.facebookWorkspaces);
      if (data.facebookWorkspaces) {
        console.log(`  - keys under facebookWorkspaces:`, Object.keys(data.facebookWorkspaces));
        for (const k of Object.keys(data.facebookWorkspaces)) {
          console.log(`    - workspace key [${k}]:`);
          const wb = data.facebookWorkspaces[k];
          console.log(`      - name:`, wb?.name);
          console.log(`      - pages count:`, wb?.pages?.length);
          console.log(`      - pages:`, wb?.pages?.map((p: any) => ({ id: p.id, name: p.name, hasToken: !!p.access_token })));
          console.log(`      - selectedPageIds:`, wb?.selectedPageIds);
        }
      }
      
      // Let's also search if there are other fields in the user object starting with "facebookWorkspaces."
      const rootKeys = Object.keys(data);
      const dotKeys = rootKeys.filter(k => k.startsWith("facebookWorkspaces."));
      if (dotKeys.length > 0) {
        console.log(`- dotted flat keys matching facebookWorkspaces.*:`, dotKeys);
        for (const dk of dotKeys) {
          const val = data[dk];
          console.log(`  - key [${dk}]: pages count=${val?.pages?.length}, selectedPageIds:`, val?.selectedPageIds);
        }
      }
    }
  } catch (err: any) {
    console.error(`[Diagnostic] Failed to query Firestore document:`, err.message);
  }
}

run();
