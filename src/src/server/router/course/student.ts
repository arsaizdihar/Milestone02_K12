import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createStudentRouter } from '../context';

export const studentRouter = createStudentRouter();
