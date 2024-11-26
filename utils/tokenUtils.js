import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.SECRET || " ";

export const generateToken = (email, name) => {
    const payload = { email, name };
    const options = { expiresIn: "24h" }; 
    return jwt.sign(payload, secret, options);
};