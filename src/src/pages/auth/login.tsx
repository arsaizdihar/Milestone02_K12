import { useRouter } from 'next/router';
import { useState } from 'react';
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
          login.mutateAsync(
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

        <button type="submit">LOGIN</button>
      </form>
    </div>
  );
};

export default LoginPage;
