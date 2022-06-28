import bcrypt from 'bcrypt';

const saltRounds = 12;
export const hashPassword = async (password: string) => {
  let salt = await bcrypt.genSalt(saltRounds);
  let hash = await bcrypt.hash(password, salt);
  return hash;
}