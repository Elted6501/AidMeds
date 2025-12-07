import bcrypt from 'bcryptjs';

export const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const matchPassword = async (password, savedPassword) => {
    return await bcrypt.compare(password, savedPassword);
};

export const generateRandomString = (length = 8) => {
    return Math.random().toString(36).substring(2, length + 2);
};
