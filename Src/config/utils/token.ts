import {TOTP} from 'otplib';
import authenticator from 'authenticator';

const totp = new TOTP();
export async function generateToken(secret: string): Promise<string> {
  return await totp.generate({secret});
}

export function generateToken1(secret: string): string {
  return authenticator.generateToken(secret);
}