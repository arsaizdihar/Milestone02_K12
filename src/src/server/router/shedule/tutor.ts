import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTutorRouter } from '../context';

export const tutorRouter = createTutorRouter()
  .mutation('createSchedule', {
    input: z.object({
      startTime: z.date().refine((date) => date.getTime() > Date.now()),
      duration: z.number().positive(),
      materi: z.string(),
      materiDescription: z.string(),
      slot: z.number().positive().optional(),
      meetingInfo: z.string().optional(),
      price: z.number().default(0),
    }),
    async resolve({ ctx, input }) {
      const newSchedule = await ctx.prisma.tutorSchedule.create({
        data: { ...input, userId: ctx.userId },
      });
      return newSchedule;
    },
  })
  .mutation('addMeetingInfo', {
    input: z.object({ scheduleId: z.string(), meetingInfo: z.string() }),
    async resolve({ ctx, input }) {
      const schedule = await ctx.prisma.tutorSchedule.findFirst({
        where: { id: input.scheduleId, userId: ctx.userId },
        select: { id: true },
      });
      if (!schedule) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      const updatedSchedule = await ctx.prisma.tutorSchedule.update({
        where: { id: schedule.id },
        data: { meetingInfo: input.meetingInfo },
      });
      return updatedSchedule;
    },
  });
