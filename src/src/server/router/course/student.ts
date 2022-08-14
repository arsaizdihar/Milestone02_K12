import { z } from 'zod';
import { createStudentRouter } from '../context';

export const studentRouter = createStudentRouter().query('myCourses', {
  input: z.object({ past: z.boolean(), search: z.string().optional() }),
  async resolve({ ctx, input }) {
    const now = new Date();
    return await ctx.prisma.course.findMany({
      where: {
        participants: { some: { userId: ctx.userId } },
        startTime: input?.past ? { lte: now } : { gt: now },
        OR: [
          { materi: { contains: input.search, mode: 'insensitive' } },
          { subject: { contains: input.search, mode: 'insensitive' } },
        ],
      },
    });
  },
});


import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import signJWT from '.../signJWT';
import { getUser, SIMPLE_USER_QUERY } from '.../user';
import { createRouter } from '../context';

export const authRouter = createRouter()
  .mutation('editStudentProfile', {
    input: z.object({
      name: z.string(),
      email: z
        .string()
        .trim()
        .email()
        .transform((email) => email.toLowerCase()),
      password: z.string().min(8),
      WANumber: z.string(),
      lineId: z.string(),
      photoUrl: z.string(),
    }),
    async resolve({ input, ctx }) {
      const ununiqueEmail = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (ununiqueEmail) {
        throw new TRPCError({
          message: 'Email is already registered',
          code: 'BAD_REQUEST',
        });
      }
      const user = await ctx.prisma.user.create({
        data: {
          ...input,
          password: bcrypt.hashSync(input.password, 10),
          role: 'STUDENT',
        },
        select: SIMPLE_USER_QUERY,
      });
      signJWT(user, ctx.req, ctx.res);

      return user;
    },
  })