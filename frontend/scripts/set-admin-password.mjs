import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import readline from 'node:readline/promises';

function askHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let value = '';
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          resolve(value);
          return;
        }
        if (ch === '\u0003') process.exit(1);
        if (ch === '\u007f' || ch === '\b') value = value.slice(0, -1);
        else value += ch;
      }
    };
    stdin.on('data', onData);
  });
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const email = (await rl.question('Admin email: ')).toLowerCase().trim();
rl.close();

const password = await askHidden('New password (12+ characters): ');
const again = await askHidden('Type it again: ');

if (!email || password.length < 12 || password !== again) {
  console.error('Stopped: an email is needed, the password must have 12+ characters, and both entries must match.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const Admin =
  mongoose.models.Admin ||
  mongoose.model(
    'Admin',
    new mongoose.Schema(
      {
        name: String,
        email: { type: String, unique: true, lowercase: true, trim: true },
        passwordHash: String,
        role: { type: String, default: 'admin' },
      },
      { timestamps: true }
    )
  );

const passwordHash = await bcrypt.hash(password, 12);
const existing = await Admin.findOne({ email });

if (existing) {
  existing.passwordHash = passwordHash;
  await existing.save();
  console.log('Password changed for', email);
} else {
  const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
  const name = (await rl2.question('New admin. Name: ')).trim() || 'Admin';
  rl2.close();
  await Admin.create({ name, email, passwordHash });
  console.log('Admin created:', email);
}

await mongoose.disconnect();