// app.js
// cPanel Node.js Application Startup File
// Phusion Passenger will load this file to start the server.

process.env.NODE_ENV = "production";

// Start the compiled server bundle
console.log("[cPanel] Starting production server...");
require("./dist/server.cjs");
