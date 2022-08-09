import { createRouter } from '../context';
import { tutorRouter } from './tutor';

export const scheduleRouter = createRouter().merge('tutor.', tutorRouter);
