import fs from "fs";
import path from "path";

// Simple mock for express-like req
const req = {
  session: {
    user: {
      email: "perseusbotx@gmail.com"
    }
  }
};

async function run() {
  const dbData = JSON.parse(fs.readFileSync("db-fallback.json", "utf8"));
  
  // Let's implement the resolution logic to find what data is loaded
  const userEmail = "perseusbotx@gmail.com";
  
  const userDoc = dbData.users[userEmail];
  console.log("userDoc:", userDoc);
  
  const sessionId = `fb_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  console.log("sessionId:", sessionId);
  
  const sessionDoc = dbData.sessions?.[sessionId];
  console.log("sessionDoc page count:", sessionDoc?.pages?.length);
  
  let baseFbData = null;
  if (userDoc?.facebook?.pages?.length > 0) {
    baseFbData = userDoc.facebook;
  }
  
  if (!baseFbData || !baseFbData.pages || baseFbData.pages.length === 0) {
    if (sessionDoc) {
      baseFbData = sessionDoc;
    }
  }
  
  console.log("Resolved baseFbData page count:", baseFbData?.pages?.length);
  
  // Wait, let's look at getFacebookData logic
  let workspaceId = "1"; // from userDoc.workspaceId
  let workspaceConfig = null;
  
  const ownerEmail = "ahsan.shabbir292@gmail.com"; // ahsan is owner since we mapped in db
  
  // In getFacebookData:
  const ownerDoc = dbData.users[ownerEmail];
  if (ownerDoc) {
    if (workspaceId && ownerDoc.facebookWorkspaces && ownerDoc.facebookWorkspaces[workspaceId]) {
      workspaceConfig = ownerDoc.facebookWorkspaces[workspaceId];
    }
  }
  
  console.log("workspaceConfig key count:", workspaceConfig ? Object.keys(workspaceConfig) : null);
  
  let result = null;
  if (baseFbData) {
    result = {
      ...baseFbData,
      selectedPageIds: (workspaceConfig && Array.isArray(workspaceConfig.selectedPageIds) && workspaceConfig.selectedPageIds.length > 0)
        ? workspaceConfig.selectedPageIds
        : (baseFbData.selectedPageIds || [])
    };
  } else if (workspaceConfig) {
    result = workspaceConfig;
  }
  
  console.log("Final data returned from getFacebookData has pages:", result?.pages?.length);
}

run();
