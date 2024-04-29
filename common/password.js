import bcrypt from 'bcrypt'

export const cryptPassword = (password) => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = (plainPass, hashword) => {
    return bcrypt.compare(plainPass, hashword);
};