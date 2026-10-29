import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const name = (await rl.question("Name: ")).trim();
const email = (await rl.question("Email: ")).toLowerCase().trim();
const password = await rl.question("Password (at least 10 characters): ");
rl.close();

if (!name || !email || password.length < 10) {
  console.error("Name, email and a password of 10+ characters are required.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

// same shape as models/Admin.js
const Admin =
  mongoose.models.Admin ||
  mongoose.model(
    "Admin",
    new mongoose.Schema(
      {
        name: String,
        email: { type: String, unique: true, lowercase: true, trim: true },
        passwordHash: String,
        role: { type: String, default: "admin" },
      },
      { timestamps: true },
    ),
  );

const passwordHash = await bcrypt.hash(password, 12);
await Admin.create({ name, email, passwordHash });
console.log("Admin created:", email);
await mongoose.disconnect();
