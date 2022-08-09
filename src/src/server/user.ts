import { getCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';
import jwt from 'jsonwebtoken';
import { env } from '~/env/server.mjs';
import { prisma } from '~/server/db/client';

export const SIMPLE_USER_QUERY = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export const getUserId = (req: OptionsType['req'], res: OptionsType['res']) => {
  const id = (req as any).userId;
  if (id) return id as string;
  const token = getCookie('token', { req, res });
  if (!token || typeof token !== 'string') return null;
  try {
    const decoded = jwt.verify(token, env.TOKEN_SECRET);
    if (typeof decoded !== 'object') return null;
    return decoded.id as string;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUser = async (
  req: OptionsType['req'],
  res: OptionsType['res'],
) => {
  const id = getUserId(req, res);
  if (!id) return null;
  const user = await prisma.user.findUnique({
    where: { id },
    select: SIMPLE_USER_QUERY,
  });
  return user;
};
