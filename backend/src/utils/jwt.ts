import jwt, { type SignOptions } from "jsonwebtoken";

export function signToken(
  payload: object,
  secret: string,
  expiresIn: SignOptions["expiresIn"] = "1d",
) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret) as jwt.JwtPayload;
}
