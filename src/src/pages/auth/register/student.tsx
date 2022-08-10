import { ErrorMessage } from '@hookform/error-message';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import ErrorRenderer from '~/components/ErrorRenderer';
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
  } = useForm<Inputs>({ mode: 'onBlur' });
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

  const required = 'This field is required';

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <h1 className="font-bold text-xl">REGISTER STUDENT</h1>
        <input placeholder="Name" {...register('name', { required })} />
        <ErrorMessage errors={errors} name="name" render={ErrorRenderer} />
        <input
          placeholder="Email"
          type="email"
          {...register('email', { required })}
        />
        <ErrorMessage errors={errors} name="email" render={ErrorRenderer} />
        <input
          type="password"
          placeholder="Password"
          {...register('password', {
            required,
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />
        <ErrorMessage errors={errors} name="password" render={ErrorRenderer} />
        <input
          placeholder="WA Number"
          {...register('WANumber', { required })}
        />
        <ErrorMessage errors={errors} name="WANumber" render={ErrorRenderer} />
        <input placeholder="Line ID" {...register('lineId', { required })} />
        <ErrorMessage errors={errors} name="lineId" render={ErrorRenderer} />
        <label>Photo</label>
        <input
          type="file"
          accept="image/*"
          {...register('image', { required })}
        />
        <ErrorMessage errors={errors} name="image" render={ErrorRenderer} />
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
