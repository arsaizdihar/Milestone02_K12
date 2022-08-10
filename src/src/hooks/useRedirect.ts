import { Role } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSession from './useSession';

export const useRedirect = (role?: Role) => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (role && session.data) {
      if (session.data.role !== role) {
        router.push(role === 'TUTOR' ? '/student' : '/tutor');
      }
    }
  }, [session]);
};
