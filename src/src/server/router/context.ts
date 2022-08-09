// src/server/router/context.ts
import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from '../db/client';
import { getUserById, getUserId } from '../user';

export const createContext = (opts: trpcNext.CreateNextContextOptions) => {
  const req = opts.req;
  const res = opts.res;

  return {
    req,
    res,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

export const createAuthRouter = () =>
  createRouter().middleware(({ ctx, next }) => {
    const userId = getUserId(ctx.req, ctx.res);
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({ ctx: { ...ctx, userId } });
  });

export const createTutorRouter = () =>
  createAuthRouter().middleware(async ({ ctx, next }) => {
    const user = await getUserById(ctx.userId);
    if (!user || user.role !== 'TUTOR') {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({ ctx: { ...ctx, user } });
  });
