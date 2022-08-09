// src/server/router/index.ts
import superjson from 'superjson';
import { createRouter } from './context';

import { authRouter } from './auth';
import { scheduleRouter } from './shedule';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('auth.', authRouter)
  .merge(scheduleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
