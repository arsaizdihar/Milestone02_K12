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
import ImageIcon from '~/assets/ImageIcon';
import Button from '~/components/Button';
import ErrorRenderer from '~/components/ErrorRenderer';
import FileInput from '~/components/FileInput';
import Input from '~/components/Input';
import Tabs from '~/components/Tabs';
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

  const required = 'This field is required';

  return (
    <div>
      <div className='text-4xl font-extrabold text-[#80785C] mt-8 ml-4'>Bear</div>
      <div className='text-4xl font-extrabold mt-2 ml-4'>With TPB</div>
      <div className='text-xl font-extrabold text-[#80785C] mt-10 ml-4 '>Register Account</div>

      <div className='bg-[#FFF7E2] mt-2 mb-8 rounded-2xl px-6 pb-8 '>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Tabs
            activeIndex={0}
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
            {...register('password', {
              required,
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
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
          <FileInput
            icon={<ImageIcon />}
            accept="image/*"
            name="image"
            control={control as any}
            rules={{ required }}
            placeholder="Upload Photo"
          />
          <ErrorMessage errors={errors} name="image" render={ErrorRenderer} />
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

export default StudentRegister;
