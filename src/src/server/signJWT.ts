import { setCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { env } from '~/env/server.mjs';

const signJWT = (
  user: { id: string },
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const now = new Date().getTime();
  const expiresTime = now + env.TOKEN_EXPIRES * 1000;
  const expires = new Date(expiresTime);

  try {
    const token = jwt.sign({ id: user.id }, env.TOKEN_SECRET, {
      issuer: env.TOKEN_ISSUER,
      algorithm: 'HS256',
      expiresIn: env.TOKEN_EXPIRES,
    });
    setCookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      expires,
      sameSite: 'strict',
      req,
      res,
    });
  } catch (err) {
    console.error(err);
  }
};

export default signJWT;
