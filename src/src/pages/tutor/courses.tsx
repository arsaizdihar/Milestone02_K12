import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '~/components/Button';
import SearchField from '~/components/SearchField';
import Tabs from '~/components/Tabs';
import TimeSelect from '~/components/TimeSelect';
import CourseInfo from '~/components/tutor/CourseInfo';
import { useRedirect } from '~/hooks/useRedirect';
import { trpc } from '~/utils/trpc';

const TutorCoursesPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedTime, setSelectedTime] = useState('upcoming');
  useRedirect('TUTOR');
  return (
    <div className="flex flex-col gap-1">
      <Tabs
        activeIndex={0}
        tab1={{ label: 'Your Courses', href: '/tutor/courses' }}
        tab2={{ label: 'All Session', href: '/tutor' }}
      />
      <SearchField onSearch={setSearch} />
      <TimeSelect value={selectedTime as any} onChange={setSelectedTime} />
      <Courses search={search} past={selectedTime === 'past'} />
      <Button onClick={() => router.push('/tutor/add-course')}>
        Add new schedule
      </Button>
    </div>
  );
};

interface CoursesProps {
  past?: boolean;
  search?: string;
}

const Courses: React.FC<CoursesProps> = ({ past = false, search }) => {
  const query = trpc.useQuery(['tutor.myCourses', { past, search }]);
  if (!query.data) return <>Loading...</>;
  return (
    <ul>
      {query.data.map((course) => (
        <CourseInfo key={course.id} course={course} onEditClick={() => {}} />
      ))}
    </ul>
  );
};

export default TutorCoursesPage;
