import { useState } from 'react';
import Button from '~/components/Button';
import SearchField from '~/components/SearchField';
import CourseInfo from '~/components/student/CourseInfo';
import Title from '~/components/Title';
import { useLogout } from '~/hooks/useLogout';
import { useRedirect } from '~/hooks/useRedirect';
import { trpc } from '~/utils/trpc';

const StudentHomePage = () => {
  const logout = useLogout();
  const [search, setSearch] = useState('');
  useRedirect('STUDENT');

  return (
    <div className="flex flex-col gap-1">
      <Title>ALL COURSES</Title>
      <SearchField onSearch={setSearch} />
      <div>
        <h2 className="text-lg font-bold">Upcoming</h2>
        <Courses search={search} />
      </div>
      <div>
        <h2 className="text-lg font-bold">Past</h2>
        <Courses past search={search} />
      </div>
      <Button href="/student/courses" className="flex justify-center">
        Your Courses
      </Button>
      <Button onClick={logout}>Sign out</Button>
    </div>
  );
};

interface CoursesProps {
  past?: boolean;
  search?: string;
}

const Courses: React.FC<CoursesProps> = ({ past = false, search }) => {
  const query = trpc.useQuery(['allCourses', { past, search }]);
  if (!query.data) return <>Loading...</>;
  return (
    <ul className="flex flex-col gap-4">
      {query.data.map((course) => (
        <CourseInfo key={course.id} course={course} onEnroll={() => {}} />
      ))}
    </ul>
  );
};

export default StudentHomePage;
