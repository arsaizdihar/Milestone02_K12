import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import { trpc } from '~/utils/trpc';
import { uploadFile } from '~/utils/uploadFile';

type Inputs = {
  name: string;
  email: string;
  password: string;
  WANumber: string;
  lineId: string;
  image: FileList;
};

const StudentRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const signup = trpc.useMutation('auth.registerStudent');
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async ({ image, ...data }) => {
    const file = image[0];
    if (!file) return;
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const uploadRes = await uploadFile(file);
        const photoUrl = uploadRes.Location;
        signup.mutateAsync({ ...data, photoUrl }).then(() => {
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
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <h1 className="font-bold text-xl">REGISTER STUDENT</h1>
        <input placeholder="Name" {...register('name', { required: true })} />
        <input
          placeholder="Email"
          type="email"
          {...register('email', { required: true })}
        />
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: true, minLength: 8 })}
        />
        <input
          placeholder="WA Number"
          {...register('WANumber', { required: true })}
        />
        <input
          placeholder="Line ID"
          {...register('lineId', { required: true })}
        />
        <label>Photo</label>
        <input
          type="file"
          accept="image/*"
          {...register('image', { required: true })}
        />
        <Button type="submit">REGISTER</Button>
        <Button
          href="/auth/register/tutor"
          className="flex justify-center"
          variant="secondary"
        >
          Register as a Tutor
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

export default StudentRegister;
