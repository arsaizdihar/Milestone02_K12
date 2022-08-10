import Button from '~/components/Button';
import { useLogout } from '~/hooks/useLogout';
import { useRedirect } from '~/hooks/useRedirect';
import useSession from '~/hooks/useSession';

const StudentHomePage = () => {
  const logout = useLogout();
  const session = useSession();
  useRedirect('STUDENT');
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <p>{session.data?.name}</p>
      <Button onClick={logout}>Log out</Button>
    </div>
  );
};

export default StudentHomePage;