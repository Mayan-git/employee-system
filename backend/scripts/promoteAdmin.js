// One-off maintenance script: promote an existing user to admin.
// Needed after the RBAC rollout, since pre-existing users have no role field
// and default to "manager" — someone has to be admin to manage the rest.
//
// Usage:
//   MONGO_URI="<your connection string>" node scripts/promoteAdmin.js user@example.com
import mongoose from "mongoose";
import User from "../models/User.js";

const email = process.argv[2];
const mongoUri = process.env.MONGO_URI;

if (!email) {
  console.error("Usage: MONGO_URI=<uri> node scripts/promoteAdmin.js <email>");
  process.exit(1);
}
if (!mongoUri) {
  console.error("Missing MONGO_URI environment variable.");
  process.exit(1);
}

await mongoose.connect(mongoUri);

const user = await User.findOneAndUpdate(
  { email: email.toLowerCase().trim() },
  { role: "admin" },
  { new: true }
);

if (!user) {
  console.error(`No user found with email: ${email}`);
  process.exitCode = 1;
} else {
  console.log(`${user.email} is now an admin.`);
}

await mongoose.disconnect();
