import { useRouter } from 'next/router';
import Button from '~/components/Button';
import { useRedirect } from '~/hooks/useRedirect';
import { trpc } from '~/utils/trpc';

const TutorCoursesPage = () => {
  const router = useRouter();
  useRedirect('TUTOR');
  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <h1>YOUR COURSES</h1>
        <div>
          <h2 className="text-lg font-bold">Upcoming</h2>
          <Courses />
        </div>
        <div>
          <h2 className="text-lg font-bold">Past</h2>
          <Courses past />
        </div>
        <Button onClick={() => router.push('/tutor/add-course')}>
          Add new schedule
        </Button>
      </div>
    </div>
  );
};

interface CoursesProps {
  past?: boolean;
}

const Courses: React.FC<CoursesProps> = ({ past = false }) => {
  const query = trpc.useQuery(['tutor.myCourses', { past }]);
  if (!query.data) return <>Loading...</>;
  return (
    <ul>
      {query.data.map((course) => (
        <li key={course.id}>
          {course.subject} - {course.materi}
        </li>
      ))}
    </ul>
  );
};

export default TutorCoursesPage;
