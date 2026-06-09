import axios from 'axios';
import fs from 'fs';

async function test() {
  try {
    const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
    const pId = config.projectId;
    const dId = config.firestoreDatabaseId || "ai-studio-29c3908b-22bc-437d-90bc-108c053233ac";
    const key = config.apiKey;
    
    console.log(`Config:\nProjectId: ${pId}\nDatabaseId: ${dId}\nApiKey: ${key}`);
    
    const runQueryUrl = `https://firestore.googleapis.com/v1/projects/${pId}/databases/${dId}/documents:runQuery?key=${key}`;
    console.log(`Sending POST to ${runQueryUrl} for collection group broadcasts`);
    const payload = {
      structuredQuery: {
        from: [{ collectionId: "broadcasts", allDescendants: true }]
      }
    };

    try {
      const resQuery = await axios.post(runQueryUrl, payload);
      console.log("Success runQuery! Documents count:", Array.isArray(resQuery.data) ? resQuery.data.length : typeof resQuery.data);
      if (Array.isArray(resQuery.data)) {
        resQuery.data.forEach((item: any, idx: number) => {
          if (item.document) {
            console.log(`Doc ${idx}:`, item.document.name);
          }
        });
      }
    } catch (errQuery: any) {
      console.error("runQuery HTTP Error Status:", errQuery.response?.status);
      console.error("runQuery HTTP Error Data:", JSON.stringify(errQuery.response?.data, null, 2));
    }
  } catch (err: any) {
    console.error("General Error:", err.message);
  }
}

test();
