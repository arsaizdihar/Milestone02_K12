import { useState } from 'react';
import Button from '~/components/Button';
import SearchField from '~/components/SearchField';
import Tabs from '~/components/Tabs';
import CourseInfo from '~/components/student/CourseInfo';
import { useLogout } from '~/hooks/useLogout';
import { useRedirect } from '~/hooks/useRedirect';
import { trpc } from '~/utils/trpc';
import TimeSelect from '~/components/TimeSelect';

const StudentHomePage = () => {
  const logout = useLogout();
  const [search, setSearch] = useState('');
  const [selectedTime, setSelectedTime] = useState('upcoming');
  useRedirect('STUDENT');

  return (
    <div className="flex flex-col gap-1"> 
      <Tabs
        activeIndex={1}
        tab1={{ label: 'Your Courses', href: '/student/courses' }}
        tab2={{ label: 'All Session', href: '/student' }}
      />
      <SearchField onSearch={setSearch} />
      <TimeSelect value={selectedTime as any} onChange={setSelectedTime} />
      <Courses search={search} past={selectedTime === 'past'} />
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
