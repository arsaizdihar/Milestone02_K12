import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import SearchField from '~/components/SearchField';
import CourseInfo from '~/components/student/CourseInfo';
import Title from '~/components/Title';
import { useLogout } from '~/hooks/useLogout';
import { useRedirect } from '~/hooks/useRedirect';
import { trpc } from '~/utils/trpc';
import TimeSelect from '~/components/TimeSelect';
import Tabs from '~/components/Tabs';

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
      tab2={{ label: 'Available', href: '/student' }} 
      />
      <Title>ALL COURSES</Title>
      <SearchField onSearch={setSearch} />
      <TimeSelect value={selectedTime as any} onChange={setSelectedTime} />
      <Courses search={search} past={selectedTime === 'past'} />
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
  const enroll = trpc.useMutation('student.takeCourse');
  if (!query.data) return <>Loading...</>;
  return (
    <ul className="flex flex-col gap-4">
      {query.data.map((course) => (
        <CourseInfo
          key={course.id}
          course={course}
          onEnroll={
            past
              ? undefined
              : () => {
                  const promise = enroll.mutateAsync({ courseId: course.id });
                  promise.catch(console.log);
                  toast.promise(promise, {
                    loading: 'Enrolling...',
                    success: 'Enroll success.',
                    error: (error) => {
                      if (error.shape?.message === 'already-taken') {
                        return "You've already enrolled in this course";
                      }
                      return 'Enroll failed';
                    },
                  });
                }
          }
        />
      ))}
    </ul>
  );
};

export default StudentHomePage;
