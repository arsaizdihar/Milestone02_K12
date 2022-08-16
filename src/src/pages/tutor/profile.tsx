import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import ErrorRenderer from '~/components/ErrorRenderer';
import Input from '~/components/Input';
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

const StudentProfile = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({ mode: 'onBlur' });
  const signup = trpc.useMutation('auth.registerStudent');
  const router = useRouter();
  const queryClient = trpc.useContext();

  const onSubmit: SubmitHandler<Inputs> = async ({ image, ...data }) => {
    const file = image[0];
    if (!file) return;
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const uploadRes = await uploadFile(file);
        const photoUrl = uploadRes.Location;
        signup.mutateAsync({ ...data, photoUrl }).then((res) => {
          resolve();
          queryClient.setQueryData(['auth.currentUser'], res);
          router.push('/student');
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
    <div>
      <div className="text-4xl font-extrabold text-black mt-8 ml-4 text-center">
        Profile
      </div>

      <div className="mt-2 mb-8 rounded-2xl px-6 pb-8 ">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input label="Username" placeholder="hello01" />
          <Input label="Full Name" placeholder="hello student" />
          <Input
            label="Email"
            placeholder="hellostudent01@gmail.com"
            type="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="**********"
            autoComplete="new-password"
            {...register('password', {
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="password"
            render={ErrorRenderer}
          />
          <Input
            label="Fakultas/Jurusan"
            placeholder="STEI-Teknik Informatika"
          />
          <Input
            label="No. Telpon"
            type="tel"
            placeholder="08123456789"
            autoComplete="tel"
          />
          <ErrorMessage
            errors={errors}
            name="WANumber"
            render={ErrorRenderer}
          />
          <Input label="ID Line" placeholder="helo_student" />
          <ErrorMessage errors={errors} name="lineId" render={ErrorRenderer} />
          <Button className="mt-6 mx-24" type="submit">
            SAVE
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
