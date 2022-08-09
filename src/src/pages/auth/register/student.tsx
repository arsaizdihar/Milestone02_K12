import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { trpc } from '~/utils/trpc';
import { uploadFile } from '~/utils/uploadFile';

const StudentRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [WANumber, setWANumber] = useState('');
  const [lineId, setLineId] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);
  const register = trpc.useMutation('auth.registerStudent');
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const file = imageRef.current?.files?.[0];
          if (!file) return;
          const promise = new Promise<void>(async (resolve, reject) => {
            try {
              const uploadRes = await uploadFile(file);
              const photoUrl = uploadRes.Location;
              register
                .mutateAsync({
                  email,
                  name,
                  password,
                  WANumber,
                  lineId,
                  photoUrl,
                })
                .then(() => {
                  resolve();
                  router.push('/auth/login');
                });
            } catch (error) {
              reject(error);
            }
          });

          toast.promise(
            promise,
            {
              loading: 'Registering...',
              success: 'Register success. Please login.',
              error: 'Register failed',
            },
            { id: 'register' },
          );
        }}
        className="flex flex-col"
      >
        <h1 className="font-bold text-xl">REGISTER STUDENT</h1>
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
        <label>Photo</label>
        <input type="file" name="image" ref={imageRef} accept="image/*" />
        <button type="submit">REGISTER</button>
        <Link href="/auth/register/tutor">Register as a Tutor</Link>
      </form>
    </div>
  );
};

export default StudentRegister;
