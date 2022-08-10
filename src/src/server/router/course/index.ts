import { createRouter } from '../context';
import { tutorAndStudentRouter } from './both';
import { tutorRouter } from './tutor';

export const courseRouter = createRouter()
  .merge('tutor.', tutorRouter)
  .merge(tutorAndStudentRouter);
