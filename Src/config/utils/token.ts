import {authenticator} from 'otplib';
import { authConfig } from "@config/utils/auth.config";

export function generateToken(secret: string = authConfig.secretKey): string {
  try {
    const token = authenticator.generate(secret);
    if (!token) {
      throw new Error("Failed to generate token");
    }
    console.log(`Generated token: ${token}`);
    return token;
  } catch (error) {
    console.error(`Error generating token: ${error}`);
    throw error;
  }
}
