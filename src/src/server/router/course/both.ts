import { z } from 'zod';
import { createAuthRouter } from '../context';

export const tutorAndStudentRouter = createAuthRouter().query('allCourses', {
  input: z.object({ past: z.boolean() }),
  async resolve({ ctx, input }) {
    const now = new Date();
    return await ctx.prisma.course.findMany({
      where: {
        startTime: input.past ? { lte: now } : { gt: now },
      },
    });
  },
});
