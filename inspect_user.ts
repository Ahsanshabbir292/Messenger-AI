import fs from "fs";

const db = JSON.parse(fs.readFileSync("db-fallback.json", "utf8"));
const userKey = Object.keys(db.users || {}).find(k => k.toLowerCase().includes("perseus"));

console.log("Found userKey:", userKey);
if (userKey) {
  console.log("User doc structure:", JSON.stringify(db.users[userKey], null, 2));
} else {
  console.log("No user key found matching 'perseus'");
}
