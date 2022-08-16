import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createStudentRouter } from '../context';

export const studentRouter = createStudentRouter()
  .query('myCourses', {
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
        include: {
          _count: { select: { participants: true } },
          user: {
            select: {
              name: true,
              photoUrl: true,
            },
          },
        },
      });
    },
  })
  .query('getAllTutors', {
    input: z.object({ past: z.boolean(), search: z.string().optional() }),
    async resolve({ ctx, input }) {
      const now = new Date();
      return await ctx.prisma.user.findMany({
        where: {
          role: 'TUTOR',
        },
        select: {
          name: true,
          email: true,
          id: true,
          IPK: true,
          semester: true,
          lineId: true,
          major: true,
          updatedAt: true,
          createdAt: true,
          description: true,
          photoUrl: true,
          WANumber: true,
        },
      });
    },
  })
  .mutation('takeCourse', {
    input: z.object({ courseId: z.string() }),
    async resolve({ ctx, input }) {
      const course = await ctx.prisma.course.findFirst({
        where: { id: input.courseId },
        include: { _count: { select: { participants: true } } },
      });
      if (course) {
        if (course.slot === 0 || course.slot != course._count.participants) {
          const alreadyTaken = await ctx.prisma.course.findFirst({
            where: {
              participants: {
                some: { userId: ctx.userId },
              },
              id: course.id,
            },
            select: { id: true },
          });
          if (alreadyTaken) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              cause: 'already-taken',
            });
          }
          const newParticipant = await ctx.prisma.participation.create({
            data: { userId: ctx.userId, courseId: input.courseId },
          });
          return newParticipant;
        }

        throw new TRPCError({
          message: 'Course full',
          code: 'BAD_REQUEST',
        });
      }
      throw new TRPCError({
        message: 'Course not found',
        code: 'NOT_FOUND',
      });
    },
  })
  .mutation('editProfile', {
    input: z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      password: z.string().min(8).optional(),
      WANumber: z.string().optional(),
      lineId: z.string().optional(),
      imageUrl: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: {
          ...input,
          password: input.password
            ? bcrypt.hashSync(input.password, 10)
            : undefined,
        },
        select: {
          id: true,
          name: true,
          email: true,
          WANumber: true,
          lineId: true,
          photoUrl: true,
        },
      });
      return updatedUser;
    },
  })
  .query('profile', {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
        select: {
          id: true,
          name: true,
          email: true,
          WANumber: true,
          lineId: true,
          photoUrl: true,
        },
      });
    },
  });
