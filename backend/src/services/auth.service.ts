import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'solcito-dev-secret-change-in-production';
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const TOKEN_EXPIRATION = '30m';

export interface LoginResult {
  success: boolean;
  token?: string;
  error?: string;
}

export async function login(username: string, password: string): Promise<LoginResult> {
  const user = await prisma.adminUser.findUnique({ where: { username } });

  if (!user) {
    return { success: false, error: 'Credenciales inválidas' };
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return { success: false, error: `Cuenta bloqueada. Intente en ${minutesLeft} minutos.` };
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    const newFailedAttempts = user.failedAttempts + 1;
    const updateData: any = { failedAttempts: newFailedAttempts };

    if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
      updateData.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
    }

    await prisma.adminUser.update({
      where: { id: user.id },
      data: updateData,
    });

    return { success: false, error: 'Credenciales inválidas' };
  }

  // Reset failed attempts on successful login
  await prisma.adminUser.update({
    where: { id: user.id },
    data: {
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

  return { success: true, token };
}
