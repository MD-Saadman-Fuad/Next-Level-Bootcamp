import jwt, {JwtPayload, SignOptions } from "jsonwebtoken"

const createTokens = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {
    const token = jwt.sign(payload, secret, {expiresIn: expiresIn} as SignOptions);
    return token;
}


export const jwtUtils = {
    createTokens
}