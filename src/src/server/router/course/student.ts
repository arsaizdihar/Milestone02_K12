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
})

  .query('getAllTutors', {
    input: z.object({ past: z.boolean(), search: z.string().optional() }),
    async resolve({ ctx, input }) {
      const now = new Date();
      return await ctx.prisma.user.findMany({
        where: {
          role : "TUTOR"
        },
      });
    },
  });

  
