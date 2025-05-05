import dotenv from "dotenv"

dotenv.config()

const JWtKey = process.env.jwtPassword;

export default {
    JWtKey,
}