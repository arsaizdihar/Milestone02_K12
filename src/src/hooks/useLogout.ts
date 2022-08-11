import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';

export const useLogout = () => {
  const logout = trpc.useMutation('auth.logout');
  const queryClient = trpc.useContext();
  const router = useRouter();

  return () =>
    logout.mutate(null, {
      onSuccess() {
        queryClient.setQueryData(['auth.currentUser'], undefined);
      },
    });
};
