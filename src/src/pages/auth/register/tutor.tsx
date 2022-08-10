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
  semester: number;
  major: string;
  IPK: number;
  description: string;
  image: FileList;
  cv: FileList;
};

const TutorRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: 'onBlur' });
  const signup = trpc.useMutation('auth.registerTutor');
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async ({ image, cv, ...data }) => {
    const imageFile = image[0];
    const cvFile = cv[0];
    console.log(imageFile);
    console.log(cvFile);
    if (!imageFile || !cvFile) return;
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const [photoRes, cvRes] = await Promise.all([
          uploadFile(imageFile),
          uploadFile(cvFile),
        ]);
        const photoUrl = photoRes.Location;
        const CVUrl = cvRes.Location;
        signup.mutateAsync({ ...data, photoUrl, CVUrl }).then(() => {
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

    promise.catch(console.log);
  };

  const required = 'This field is required';

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
        <h1 className="font-bold text-xl">REGISTER TUTOR</h1>
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
          {...register('password', { required, minLength: 8 })}
        />
        <ErrorMessage errors={errors} name="password" render={ErrorRenderer} />
        <input
          placeholder="WA Number"
          {...register('WANumber', { required })}
        />
        <ErrorMessage errors={errors} name="WANumber" render={ErrorRenderer} />
        <input placeholder="Line ID" {...register('lineId', { required })} />
        <ErrorMessage errors={errors} name="lineId" render={ErrorRenderer} />
        <input
          type="number"
          placeholder="Semester"
          {...register('semester', { required, valueAsNumber: true })}
        />
        <ErrorMessage errors={errors} name="semester" render={ErrorRenderer} />
        <input
          type="number"
          placeholder="IPK TPB"
          {...register('IPK', { required, valueAsNumber: true })}
        />
        <ErrorMessage errors={errors} name="IPK" render={ErrorRenderer} />
        <input
          type="text"
          placeholder="Major"
          {...register('major', { required })}
        />
        <ErrorMessage errors={errors} name="major" render={ErrorRenderer} />
        <textarea
          rows={3}
          placeholder="About yourself"
          {...register('description', { required })}
        />
        <ErrorMessage
          errors={errors}
          name="description"
          render={ErrorRenderer}
        />
        <label>Photo</label>
        <input
          type="file"
          accept="image/*"
          {...register('image', { required })}
        />
        <ErrorMessage errors={errors} name="image" render={ErrorRenderer} />
        <label>CV</label>
        <input
          type="file"
          accept="application/pdf"
          {...register('cv', { required })}
        />
        <ErrorMessage errors={errors} name="cv" render={ErrorRenderer} />
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
