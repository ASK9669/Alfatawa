import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

const dir = path.join('backups', new Date().toISOString().slice(0, 10));
fs.mkdirSync(dir, { recursive: true });

// password hashes and temporary counters are not backed up
const skip = new Set(['admins', 'ratelimits']);

for (const c of await db.listCollections().toArray()) {
  if (skip.has(c.name)) continue;
  const docs = await db.collection(c.name).find({}).toArray();
  fs.writeFileSync(path.join(dir, `${c.name}.json`), JSON.stringify(docs, null, 2));
  console.log(c.name, docs.length);
}

await mongoose.disconnect();
console.log('Saved in', dir);