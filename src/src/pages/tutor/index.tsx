import Button from '~/components/Button';
import { useLogout } from '~/hooks/useLogout';
import { useRedirect } from '~/hooks/useRedirect';
import { trpc } from '~/utils/trpc';

const TutorHomePage = () => {
  const logout = useLogout();
  useRedirect('TUTOR');

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-1">
      <h1>ALL COURSES</h1>
      <div>
        <h2 className="text-lg font-bold">Upcoming</h2>
        <Courses />
      </div>
      <div>
        <h2 className="text-lg font-bold">Past</h2>
        <Courses past />
      </div>
      <Button href="/tutor/courses" className="block">
        Your Courses
      </Button>
      <Button onClick={logout}>Sign out</Button>
    </div>
  );
};

interface CoursesProps {
  past?: boolean;
}

const Courses: React.FC<CoursesProps> = ({ past = false }) => {
  const query = trpc.useQuery(['allCourses', { past }]);
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

export default TutorHomePage;
