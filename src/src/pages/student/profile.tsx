import { ErrorMessage } from '@hookform/error-message';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import ErrorRenderer from '~/components/ErrorRenderer';
import Input from '~/components/Input';
import { useRedirect } from '~/hooks/useRedirect';
import { trpc } from '~/utils/trpc';

type Inputs = {
  name: string;
  email: string;
  password: string;
  WANumber: string;
  lineId: string;
};

const StudentProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: 'onBlur' });
  const editProfile = trpc.useMutation('student.editProfile');
  const profile = trpc.useQuery(['student.profile']);
  const queryClient = trpc.useContext();
  useRedirect('STUDENT');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const promise = editProfile
      .mutateAsync({
        ...data,
        password: data.password ? data.password : undefined,
      })
      .then((res) => {
        queryClient.refetchQueries(['auth.currentUser']);
        queryClient.setQueryData(['student.profile'], res);
      });

    toast.promise(
      promise,
      {
        loading: 'Updating profile...',
        success: 'Update success.',
        error: 'Update failed',
      },
      { id: 'edit-profile' },
    );
  };

  if (!profile.data) {
    return <div>Loading...</div>;
  }

  const required = 'This field is required';

  return (
    <div>
      <div className="text-4xl font-extrabold text-black mt-8 ml-4 text-center">
        Profile
      </div>

      <div className="mt-2 mb-8 rounded-2xl px-6 pb-8 ">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            label="Name"
            placeholder="hello01"
            defaultValue={profile.data.name}
            {...register('name', { required })}
          />
          <ErrorMessage errors={errors} name="name" render={ErrorRenderer} />
          <Input
            label="Email"
            placeholder="hellostudent01@gmail.com"
            type="email"
            defaultValue={profile.data.email}
            {...register('email', { required })}
          />
          <ErrorMessage errors={errors} name="email" render={ErrorRenderer} />
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
            label="No. Whatsapp"
            type="tel"
            placeholder="08123456789"
            autoComplete="tel"
            defaultValue={profile.data.WANumber}
            {...register('WANumber', { required })}
          />
          <ErrorMessage
            errors={errors}
            name="WANumber"
            render={ErrorRenderer}
          />
          <Input
            label="ID Line"
            placeholder="helo_student"
            defaultValue={profile.data.lineId}
            {...register('lineId', { required })}
          />
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
