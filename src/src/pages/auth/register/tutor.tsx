import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import { trpc } from '~/utils/trpc';
import { uploadFile } from '~/utils/uploadFile';

const TutorRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [WANumber, setWANumber] = useState('');
  const [lineId, setLineId] = useState('');
  const [semester, setSemester] = useState('');
  const [major, setMajor] = useState('');
  const [IPK, setIPK] = useState('');
  const [description, setDescription] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const register = trpc.useMutation('auth.registerTutor');
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const imageFile = imageRef.current?.files?.[0];
          const cvFile = cvRef.current?.files?.[0];
          const semesterNum = parseInt(semester);
          const ipkNum = parseFloat(IPK);
          if (!imageFile || !cvFile || isNaN(semesterNum) || isNaN(ipkNum))
            return;
          const promise = new Promise<void>(async (resolve, reject) => {
            try {
              const [photoRes, cvRes] = await Promise.all([
                uploadFile(imageFile),
                uploadFile(cvFile),
              ]);
              const photoUrl = photoRes.Location;
              const CVUrl = cvRes.Location;
              register
                .mutateAsync({
                  email,
                  name,
                  password,
                  WANumber,
                  lineId,
                  photoUrl,
                  major,
                  semester: semesterNum,
                  IPK: ipkNum,
                  CVUrl,
                  description,
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
        className="flex flex-col gap-1"
      >
        <h1 className="font-bold text-xl">REGISTER TUTOR</h1>
        <input
          type="text"
          name="name"
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          required
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          required
          type="text"
          name="WANumber"
          placeholder="WA Number"
          value={WANumber}
          onChange={(e) => setWANumber(e.target.value)}
        />
        <input
          required
          type="text"
          name="lineId"
          placeholder="Line ID"
          value={lineId}
          onChange={(e) => setLineId(e.target.value)}
        />
        <input
          required
          type="number"
          name="semester"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <input
          type="number"
          name="ipk"
          placeholder="IPK TPB"
          value={IPK}
          onChange={(e) => setIPK(e.target.value)}
        />
        <input
          required
          type="text"
          name="major"
          placeholder="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
        />
        <textarea
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="About yourself"
        />
        <label>Photo</label>
        <input type="file" name="image" ref={imageRef} accept="image/*" />
        <label>CV</label>
        <input type="file" name="image" ref={cvRef} accept="application/pdf" />
        <Button type="submit">REGISTER</Button>
        <Button
          href="/auth/register/student"
          className="flex justify-center"
          variant="secondary"
        >
          Register as a Student
        </Button>
        <p>
          Already have an account?{' '}
          <Link href="/auth/login">
            <a className="font-bold text-blue-600">Sign In</a>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default TutorRegister;
