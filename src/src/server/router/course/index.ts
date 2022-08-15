import { createRouter } from '../context';
import { tutorAndStudentRouter } from './both';
import { studentRouter } from './student';
import { tutorRouter } from './tutor';

export const courseRouter = createRouter()
  .merge('tutor.', tutorRouter)
  .merge('student.', studentRouter)
  .merge(tutorAndStudentRouter);
