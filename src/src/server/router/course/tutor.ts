import { TRPCError } from '@trpc/server';
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
  });
