import { ErrorMessage } from '@hookform/error-message';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import ErrorRenderer from '~/components/ErrorRenderer';
import { trpc } from '~/utils/trpc';

interface Inputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>({ mode: 'onBlur' });
  const login = trpc.useMutation('auth.login');
  const router = useRouter();
  const queryClient = trpc.useContext();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const promise = login.mutateAsync(data, {
      onSuccess(data) {
        queryClient.setQueryData(['auth.currentUser'], data);
        router.push(`/${data.role.toLowerCase()}`);
      },
    });
    toast.promise(
      promise,
      {
        error: 'Login failed',
        loading: 'Logging in...',
        success: 'Login success',
      },
      { id: 'login' },
    );
  };

  const required = 'This field is required';

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <input
          type="email"
          placeholder="Email"
          {...register('email', { required })}
        />
        <ErrorMessage errors={errors} name="email" render={ErrorRenderer} />
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required })}
        />
        <ErrorMessage errors={errors} name="password" render={ErrorRenderer} />
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
