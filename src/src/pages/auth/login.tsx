import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import { trpc } from '~/utils/trpc';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = trpc.useMutation('auth.login');
  const router = useRouter();
  const queryClient = trpc.useContext();

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const promise = login.mutateAsync(
            {
              email,
              password,
            },
            {
              onSuccess(data) {
                queryClient.setQueryData(['auth.currentUser'], data);
                router.push('/');
              },
            },
          );
          toast.promise(
            promise,
            {
              error: 'Login failed',
              loading: 'Logging in...',
              success: 'Login success',
            },
            { id: 'login' },
          );
        }}
        className="flex flex-col"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">LOGIN</Button>
        <p>
          Don't have an account?{' '}
          <Link href="/auth/register/student">
            <a className="font-bold text-blue-600">Sign Up</a>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
