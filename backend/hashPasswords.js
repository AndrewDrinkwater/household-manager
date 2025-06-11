// hashPasswords.js
const bcrypt = require('bcrypt');

let models;
try {
  models = require('./src/models');
} catch (e) {
  console.error('Failed to load models:', e);
  process.exit(1);
}

async function hashPlainPasswords() {
  const { User } = models;
  if (!User) {
    throw new Error('User model not found in models export');
  }

  const users = await User.findAll();
  for (const user of users) {
    const pwd = user.password || '';
    if (!pwd.startsWith('$2')) { // bcrypt hashes start with $2b$, $2a$, etc.
      const hashed = await bcrypt.hash(pwd, 10);
      await user.update({ password: hashed });
      console.log(`Hashed password for user: ${user.username}`);
    } else {
      console.log(`Password already hashed for user: ${user.username}`);
    }
  }
}

hashPlainPasswords()
  .then(() => {
    console.log('Done hashing passwords');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
