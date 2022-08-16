import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSession from '~/hooks/useSession';

const Home: NextPage = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (session.data) {
      router.push(session.data.role === 'TUTOR' ? '/tutor' : '/student');
    }
  }, [session]);

  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center gap-1">
        Loading...
      </div>
    </>
  );
};

export default Home;
