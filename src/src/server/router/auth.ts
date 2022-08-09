import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { deleteCookie } from 'cookies-next';
import { z } from 'zod';
import signJWT from '../signJWT';
import { getUser, SIMPLE_USER_QUERY } from '../user';
import { createRouter } from './context';

export const authRouter = createRouter()
  .mutation('registerStudent', {
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
      WANumber: z.string(),
      lineId: z.string(),
      photoUrl: z.string(),
    }),
    async resolve({ input, ctx }) {
      const user = await ctx.prisma.user.create({
        data: {
          ...input,
          password: bcrypt.hashSync(input.password, 10),
          role: 'STUDENT',
        },
      });

      return user.id;
    },
  })
  .mutation('registerTutor', {
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
      WANumber: z.string(),
      lineId: z.string(),
      major: z.string(),
      semester: z.number().int(),
      photoUrl: z.string(),
    }),
    async resolve({ input, ctx }) {
      const user = await ctx.prisma.user.create({
        data: {
          ...input,
          password: bcrypt.hashSync(input.password, 10),
          role: 'TUTOR',
        },
      });

      return user.id;
    },
  })
  .mutation('login', {
    input: z.object({ email: z.string(), password: z.string() }),
    async resolve({ input, ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
        select: { ...SIMPLE_USER_QUERY, password: true },
      });
      if (!user || !bcrypt.compareSync(input.password, user.password)) {
        throw new TRPCError({
          message: 'Invalid email or password',
          code: 'BAD_REQUEST',
        });
      }
      signJWT(user, ctx.req, ctx.res);
      return { ...user, password: undefined };
    },
  })
  .mutation('logout', {
    async resolve({ ctx }) {
      deleteCookie('token', { req: ctx.req, res: ctx.res });
      return true;
    },
  })
  .query('currentUser', {
    async resolve({ ctx }) {
      const user = await getUser(ctx.req, ctx.res);
      if (!user) {
        return;
      }
      return user;
    },
  });
