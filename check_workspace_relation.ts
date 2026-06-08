import fs from "fs";

function run() {
  const db = JSON.parse(fs.readFileSync("db-fallback.json", "utf8"));
  
  const user = db.users["perseusbotx@gmail.com"];
  console.log("perseusbotx user:", user);
  
  const ahsan = db.users["ahsan.shabbir292@gmail.com"];
  console.log("ahsan user:", ahsan ? { ...ahsan, facebookWorkspaces: Object.keys(ahsan.facebookWorkspaces || {}) } : null);
  
  // Find workspaces and look up owners
}

run();
