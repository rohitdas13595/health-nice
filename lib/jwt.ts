'use server'
import  {sign, verify}  from "jsonwebtoken";
import { settings } from "./settings";



export const verifyToken = async(token: string) => {
  try {
    const payload = verify(token, settings.jwtSecret);
    return payload;
  } catch (error) {
    console.error("error verifying token", error);
    return null;
  }
};

export const signToken = async (
  payload: { [key: string]: string },
  expiresIn?: string
) => {
  try {
    const token = sign(payload, settings.jwtSecret, {
      expiresIn: expiresIn ?? "1h",
    });
    return token;
  } catch (error) {
    console.error("error signing token", error);
    return null;
  }
};


export const isTokenExpired =async  (token: string) => {
  const payloadBase64 = token.split('.')[1];
  const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
  const decoded = JSON.parse(decodedJson)
  const exp = decoded.exp;
  const expired = (Date.now() >= exp * 1000)
  return expired
};
