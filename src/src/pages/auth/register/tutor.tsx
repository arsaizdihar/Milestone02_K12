import { ErrorMessage } from '@hookform/error-message';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import UserIcon from '~/assets/UserIcon';
import MailIcon from '~/assets/MailIcon';
import LockIcon from '~/assets/LockIcon';
import WhatsAppIcon from '~/assets/WhatsAppIcon';
import LineIcon from '~/assets/LineIcon';
import BookIcon from '~/assets/BookIcon';
import ImageIcon from '~/assets/ImageIcon';
import CvIcon from '~/assets/CvIcon';
import Button from '~/components/Button';
import ErrorRenderer from '~/components/ErrorRenderer';
import FileInput from '~/components/FileInput';
import Input from '~/components/Input';
import Tabs from '~/components/Tabs';
import TextArea from '~/components/TextArea';
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
    control,
  } = useForm<Inputs>({ mode: 'onBlur' });
  const signup = trpc.useMutation('auth.registerTutor');
  const router = useRouter();
  const queryClient = trpc.useContext();

  const onSubmit: SubmitHandler<Inputs> = async ({ image, cv, ...data }) => {
    const imageFile = image[0];
    const cvFile = cv[0];

    if (!imageFile || !cvFile) return;
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const [photoRes, cvRes] = await Promise.all([
          uploadFile(imageFile),
          uploadFile(cvFile),
        ]);
        const photoUrl = photoRes.Location;
        const CVUrl = cvRes.Location;
        signup.mutateAsync({ ...data, photoUrl, CVUrl }).then((res) => {
          resolve();
          queryClient.setQueryData(['auth.currentUser'], res);
          router.push('/tutor');
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
    <div className="">
      <div className='text-4xl font-extrabold text-[#80785C] mt-8 ml-4'>Bear</div>
      <div className='text-4xl font-extrabold mt-2 ml-4'>With TPB</div>
      <div className='text-xl font-extrabold text-[#80785C] mt-10 ml-4 '>Register Account</div>

      <div className='bg-[#FFF7E2] mt-2 mb-8 rounded-2xl px-6 pb-8 '>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Tabs
            activeIndex={1}
            tab1={{ label: 'Student', href: '/auth/register/student' }}
            tab2={{ label: 'Tutor', href: '/auth/register/tutor' }}
          />
          <Input
            icon={<UserIcon />}
            placeholder="Name"
            {...register('name', { required })}
          />
          <ErrorMessage errors={errors} name="name" render={ErrorRenderer} />
          <Input
            icon={<MailIcon />}
            placeholder="Email"
            type="email"
            {...register('email', { required })}
          />
          <ErrorMessage errors={errors} name="email" render={ErrorRenderer} />
          <Input
            icon={<LockIcon />}
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            {...register('password', { required, minLength: 8 })}
          />
          <ErrorMessage errors={errors} name="password" render={ErrorRenderer} />
          <Input
            icon={<WhatsAppIcon />}
            type="tel"
            placeholder="WA Number"
            autoComplete="tel"
            {...register('WANumber', { required })}
          />
          <ErrorMessage errors={errors} name="WANumber" render={ErrorRenderer} />
          <Input icon={<LineIcon />} placeholder="Line ID" {...register('lineId', { required })} />
          <ErrorMessage errors={errors} name="lineId" render={ErrorRenderer} />
          <Input
            icon={<BookIcon />}
            type="number"
            placeholder="Semester"
            {...register('semester', { required, valueAsNumber: true })}
          />
          <ErrorMessage errors={errors} name="semester" render={ErrorRenderer} />
          <Input
            icon={<BookIcon />}
            type="number"
            placeholder="IPK TPB"
            {...register('IPK', { required, valueAsNumber: true })}
          />
          <ErrorMessage errors={errors} name="IPK" render={ErrorRenderer} />
          <Input
            icon={<BookIcon />}
            type="text"
            placeholder="Major"
            {...register('major', { required })}
          />
          <ErrorMessage errors={errors} name="major" render={ErrorRenderer} />
          <TextArea
            rows={3}
            placeholder="About yourself"
            {...register('description', { required })}
          />
          <ErrorMessage
            errors={errors}
            name="description"
            render={ErrorRenderer}
          />
          <FileInput
            icon={<ImageIcon />}
            placeholder="Upload Photo"
            accept="image/*"
            name="image"
            control={control as any}
            rules={{ required }}
          />
          <ErrorMessage errors={errors} name="image" render={ErrorRenderer} />
          <FileInput
            icon={<CvIcon />}
            placeholder="Upload CV"
            accept="application/pdf"
            name="cv"
            control={control as any}
            rules={{ required }}
          />
          <ErrorMessage errors={errors} name="cv" render={ErrorRenderer} />
          <Button className="mt-6 mx-24" type="submit">REGISTER</Button>
          <p>
            Already have an account?{' '}
            <Link href="/auth/login">
              <a className="font-bold text-blue-600">Sign In</a>
            </Link>
          </p>
        </form>
      </div>

    </div>
  );
};

export default TutorRegister;
