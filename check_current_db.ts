import fs from "fs";

function run() {
  const db = JSON.parse(fs.readFileSync("db-fallback.json", "utf8"));
  
  // Find any team rosters
  for (const k of Object.keys(db.users || {})) {
    const u = db.users[k];
    if (u.teamMembers) {
      console.log(`User ${k} has team members:`, u.teamMembers);
    }
  }
}

run();
