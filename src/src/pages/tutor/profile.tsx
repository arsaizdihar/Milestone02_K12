import { ErrorMessage } from '@hookform/error-message';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import ErrorRenderer from '~/components/ErrorRenderer';
import Input from '~/components/Input';
import TextArea from '~/components/TextArea';
import { trpc } from '~/utils/trpc';

type Inputs = {
  name: string;
  email: string;
  password: string;
  WANumber: string;
  lineId: string;
  semester: number;
  major: string;
  IPK: number;
  description: string;
};

const StudentProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: 'onBlur' });
  const editProfile = trpc.useMutation('tutor.editProfile');
  const profile = trpc.useQuery(['tutor.profile']);
  const queryClient = trpc.useContext();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const promise = editProfile
      .mutateAsync({
        ...data,
        password: data.password ? data.password : undefined,
      })
      .then((res) => {
        queryClient.refetchQueries(['auth.currentUser']);
        queryClient.setQueryData(['tutor.profile'], res);
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
            placeholder="Name"
            label="Name"
            defaultValue={profile.data.name}
            {...register('name', { required })}
          />
          <ErrorMessage errors={errors} name="name" render={ErrorRenderer} />
          <Input
            placeholder="Email"
            label="Email"
            type="email"
            defaultValue={profile.data.email}
            {...register('email', { required })}
          />
          <ErrorMessage errors={errors} name="email" render={ErrorRenderer} />
          <Input
            type="password"
            placeholder="Password"
            label="Password"
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
            type="tel"
            placeholder="WA Number"
            label="WA Number"
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
            placeholder="Line ID"
            label="Line ID"
            defaultValue={profile.data.lineId}
            {...register('lineId', { required })}
          />
          <ErrorMessage errors={errors} name="lineId" render={ErrorRenderer} />
          <Input
            type="number"
            placeholder="Semester"
            label="Semester"
            defaultValue={profile.data.semester ?? undefined}
            {...register('semester', { required, valueAsNumber: true })}
          />
          <ErrorMessage
            errors={errors}
            name="semester"
            render={ErrorRenderer}
          />
          <Input
            type="number"
            placeholder="IPK TPB"
            label="IPK TPB"
            defaultValue={profile.data.IPK ?? undefined}
            {...register('IPK', { required, valueAsNumber: true })}
          />
          <ErrorMessage errors={errors} name="IPK" render={ErrorRenderer} />
          <Input
            type="text"
            placeholder="Major"
            label="Major"
            defaultValue={profile.data.major!}
            {...register('major', { required })}
          />
          <ErrorMessage errors={errors} name="major" render={ErrorRenderer} />
          <TextArea
            rows={3}
            placeholder="About yourself"
            label="About yourself"
            defaultValue={profile.data.description!}
            {...register('description', { required })}
          />
          <ErrorMessage
            errors={errors}
            name="description"
            render={ErrorRenderer}
          />
          <Button className="mt-6 mx-24" type="submit">
            SAVE
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
