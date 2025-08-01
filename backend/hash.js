const bcrypt = require('bcrypt');

async function hashPasswords() {
  const password = 'pass123';
  const saltRounds = 10;
  
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('Hashed password for "pass123":', hashedPassword);
}

hashPasswords(); 