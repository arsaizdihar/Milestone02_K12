import { createRouter } from '../context';
import { tutorAndStudentRouter } from './both';
import { tutorRouter } from './tutor';
import { studentRouter } from './student';

export const courseRouter = createRouter()
  .merge('tutor.', tutorRouter)
  .merge('student.', studentRouter)
  .merge(tutorAndStudentRouter);
