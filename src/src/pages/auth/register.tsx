import { useRouter } from 'next/router';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [WANumber, setWANumber] = useState('');
  const [lineId, setLineId] = useState('');
  const register = trpc.useMutation('auth.registerStudent');
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          register
            .mutateAsync({ email, name, password, WANumber, lineId })
            .then(() => {
              router.push('/api/auth/signin');
            });
        }}
        className="flex flex-col"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          type="text"
          name="WANumber"
          placeholder="WA Number"
          value={WANumber}
          onChange={(e) => setWANumber(e.target.value)}
        />
        <input
          type="text"
          name="lineId"
          placeholder="Line ID"
          value={lineId}
          onChange={(e) => setLineId(e.target.value)}
        />
        <button type="submit">REGISTER</button>
      </form>
    </div>
  );
};

export default RegisterPage;
