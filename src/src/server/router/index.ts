// src/server/router/index.ts
import superjson from 'superjson';
import { createRouter } from './context';

import { authRouter } from './auth';
import { courseRouter } from './course';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('auth.', authRouter)
  .merge(courseRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
