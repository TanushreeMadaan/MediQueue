const bcrypt = require('bcrypt');

async function hashPasswords() {
  const password = '123';
  const saltRounds = 10;
  
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('Hashed password for "123":', hashedPassword);
}

hashPasswords(); 