import { z } from 'zod';
import { createAuthRouter } from '../context';

export const tutorAndStudentRouter = createAuthRouter().query('allCourses', {
  input: z.object({ past: z.boolean(), search: z.string().optional() }),
  async resolve({ ctx, input }) {
    const now = new Date();
    return await ctx.prisma.course.findMany({
      where: {
        startTime: input.past ? { lte: now } : { gt: now },
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
          },
        },
      },
    });
  },
});
