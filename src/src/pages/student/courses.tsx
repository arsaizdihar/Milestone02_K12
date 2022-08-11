import { useState } from 'react';
import SearchField from '~/components/SearchField';
import Title from '~/components/Title';
import { useRedirect } from '~/hooks/useRedirect';
import { trpc } from '~/utils/trpc';

const TutorCoursesPage = () => {
  const [search, setSearch] = useState('');
  useRedirect('STUDENT');
  return (
    <div className="flex flex-col gap-1">
      <Title>YOUR COURSES</Title>
      <SearchField onSearch={setSearch} />
      <div>
        <h2 className="text-lg font-bold">Upcoming</h2>
        <Courses search={search} />
      </div>
      <div>
        <h2 className="text-lg font-bold">Past</h2>
        <Courses past search={search} />
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
