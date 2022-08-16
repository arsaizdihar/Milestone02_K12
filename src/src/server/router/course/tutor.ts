import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createTutorRouter } from '../context';

export const tutorRouter = createTutorRouter()
  .mutation('createCourse', {
    input: z.object({
      startTime: z.date().refine((date) => date.getTime() > Date.now()),
      duration: z.number().positive(),
      materi: z.string(),
      materiDescription: z.string(),
      slot: z.number().positive().optional(),
      meetingInfo: z.string().optional(),
      price: z.number().default(0),
      subject: z.string(),
    }),
    async resolve({ ctx, input }) {
      const newCourse = await ctx.prisma.course.create({
        data: { ...input, userId: ctx.userId },
      });
      return newCourse;
    },
  })
  .mutation('addMeetingInfo', {
    input: z.object({ courseId: z.string(), meetingInfo: z.string() }),
    async resolve({ ctx, input }) {
      const course = await ctx.prisma.course.findFirst({
        where: { id: input.courseId, userId: ctx.userId },
        select: { id: true },
      });
      if (!course) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      const updatedCourse = await ctx.prisma.course.update({
        where: { id: course.id },
        data: { meetingInfo: input.meetingInfo },
      });
      return updatedCourse;
    },
  })
  .query('myCourses', {
    input: z.object({ past: z.boolean(), search: z.string().optional() }),
    async resolve({ ctx, input }) {
      const now = new Date();
      return await ctx.prisma.course.findMany({
        where: {
          userId: ctx.userId,
          startTime: input?.past ? { lte: now } : { gt: now },
          OR: [
            { materi: { contains: input.search, mode: 'insensitive' } },
            { subject: { contains: input.search, mode: 'insensitive' } },
          ],
        },
      });
    },
  })
  .mutation('deleteCourse', {
    input: z.object({ courseId: z.string() }),
    async resolve({ ctx, input }) {
      const course = await ctx.prisma.course.findFirst({
        where: { id: input.courseId, userId: ctx.userId },
        include: { _count: { select: { participants: true } } },
      });
      if (!course) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      if (course._count.participants > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This course already has participants',
        });
      }
      const deletedCourse = await ctx.prisma.course.delete({
        where: { id: input.courseId },
      });
      return deletedCourse;
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
      });
      return updatedUser;
    },
  });
