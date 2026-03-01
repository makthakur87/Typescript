import {authenticator} from 'otplib';

export async function generateToken(secret: string): Promise<string> {
  const token = authenticator.generate(secret);
  if (!token) {
    throw new Error("Failed to generate token");
  } else {
    console.log(`Generated token: ${token}`);
  }
  return token;
}
