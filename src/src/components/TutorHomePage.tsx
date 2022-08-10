import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import Button from './Button';

const TutorHomePage = () => {
  const router = useRouter();
  const { data } = trpc.useQuery(['tutor.mySchedules']);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <ul className="list-disc">
        {data.map((schedule) => (
          <li key={schedule.id}>
            {schedule.subject} - {schedule.materi}
          </li>
        ))}
      </ul>
      <Button onClick={() => router.push('/tutor/add-schedule')}>
        Add new schedule
      </Button>
    </div>
  );
};

export default TutorHomePage;
