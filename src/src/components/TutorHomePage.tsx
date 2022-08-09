import { useRouter } from 'next/router';
import Button from './Button';

const TutorHomePage = () => {
  const router = useRouter();
  return (
    <div>
      <Button onClick={() => router.push('/tutor/add-schedule')}>
        Add new schedule
      </Button>
    </div>
  );
};

export default TutorHomePage;
