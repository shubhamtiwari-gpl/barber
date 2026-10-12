import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'crown-blade-secret-key-982347102934';
const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'crownblade2026';

export function verifyAdminCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;
  return username.trim() === DEFAULT_USERNAME && password.trim() === DEFAULT_PASSWORD;
}

export function generateToken(username: string): string {
  const payload = {
    username,
    role: 'admin',
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

export function verifyToken(token?: string): { username: string; role: string } | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payloadB64)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin credentials' });
  }

  (req as any).adminUser = decoded;
  next();
}
