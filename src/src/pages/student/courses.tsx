import { useState } from 'react';
import SearchField from '~/components/SearchField';
import TimeSelect from '~/components/TimeSelect';
import { useRedirect } from '~/hooks/useRedirect';
import { trpc } from '~/utils/trpc';
import Tabs from '~/components/Tabs';

const TutorCoursesPage = () => { 
  const [search, setSearch] = useState('');
  const [selectedTime, setSelectedTime] = useState('upcoming');
  useRedirect('STUDENT');
  return (
    <div className="flex flex-col gap-1">
      <Tabs
        activeIndex={0}
        tab1={{ label: 'Your Courses', href: '/student/courses' }}
        tab2={{ label: 'Available', href: '/student' }} 
      />
      <SearchField onSearch={setSearch} />
      <TimeSelect value={selectedTime as any} onChange={setSelectedTime} />
      <Courses search={search} past={selectedTime === 'past'} />
    <div>
      </div>
    </div>
  );
};

interface CoursesProps {
  past?: boolean;
  search?: string;
}

const Courses: React.FC<CoursesProps> = ({ past = false, search }) => {
  const query = trpc.useQuery(['student.myCourses', { past, search }]);
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
