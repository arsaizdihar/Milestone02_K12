import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import UserIcon from '~/assets/UserIcon';
import Button from '~/components/Button';
import ErrorRenderer from '~/components/ErrorRenderer';
import FileInput from '~/components/FileInput';
import Input from '~/components/Input';
import Title from '~/components/Title';
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

const StudentUpdateProfile = () => {
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
        loading: 'Changing profile...',
        success: 'User profile updated',
        error: 'An error occured',
      },
      { id: 'register' },
    );
  };

  const required = 'This field is required';

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <Title>EDIT USER PROFILE</Title>
        <Input
          icon={<UserIcon />}
          placeholder="Name"
          {...register('name')}
        />
        <ErrorMessage errors={errors} name="name" render={ErrorRenderer} />
        <Input
          placeholder="Email"
          type="email"
          {...register('email')}
        />
        <ErrorMessage errors={errors} name="email" render={ErrorRenderer} />
        <Input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          {...register('password',
              minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          )}
        />
        <ErrorMessage errors={errors} name="password" render={ErrorRenderer} />
        <Input
          type="tel"
          placeholder="WA Number"
          autoComplete="tel"
          {...register('WANumber')}
        />
        <ErrorMessage errors={errors} name="WANumber" render={ErrorRenderer} />
        <Input placeholder="Line ID" {...register('lineId')} />
        <ErrorMessage errors={errors} name="lineId" render={ErrorRenderer} />
        <FileInput
          accept="image/*"
          name="image"
          control={control as any}
          rules={{ required }}
          placeholder="Upload Photo"
        />
        <ErrorMessage errors={errors} name="image" render={ErrorRenderer} />
        <Button type="submit">UPDATE</Button>
      </form>
    </div>
  );
};

prisma.user.update({where: {id: ctx.userId}, data: {StudentUpdateProfile}})