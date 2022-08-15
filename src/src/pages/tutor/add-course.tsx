import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import ErrorRenderer from '~/components/ErrorRenderer';
import Input from '~/components/Input';
import TextArea from '~/components/TextArea';
import { useRedirect } from '~/hooks/useRedirect';
import { getNowValue } from '~/utils/getNowValue';
import { trpc } from '~/utils/trpc';

interface Inputs {
  startTime: Date;
  duration: number;
  subject: string;
  materi: string;
  materiDescription: string;
  slot?: number;
  meetingInfo?: string;
  price: number;
}

const AddCoursePage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ mode: 'onBlur' });
  const router = useRouter();
  useRedirect('TUTOR');

  const addMutation = trpc.useMutation('tutor.createCourse');

  const required = 'This field is required';

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const promise = addMutation.mutateAsync(data, {
      onSuccess: () => {
        router.push('/');
      },
    });

    toast.promise(promise, {
      loading: 'Creating course...',
      success: 'Course created',
      error: 'Failed to create course',
    });
  };

  return (
    <div className="m-10">
      <a className="inline-flex items-center py-2 px-4 text-sm text-black bg-transparent rounded-lg focus:shadow-outline border border-white-500 hover:bg-black" href="courses">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </a>
      <h1 className="text-2xl text-center mb-10">Add Course</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          type="datetime-local"
          placeholder="Start Time"
          defaultValue={getNowValue()}
          {...register('startTime', {
            required,
            valueAsDate: true,
            validate: (value) =>
              value > new Date() || 'Start time must be in the future',
          })}
        />
        <ErrorMessage errors={errors} name="startTime" render={ErrorRenderer} />
        <Input
          type="number"
          icon = {<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          placeholder="Duration (minutes)"
          {...register('duration', {
            required,
            min: {
              value: 0,
              message: 'Must be a positive number',
            },
            valueAsNumber: true,
          })}
        />
        <ErrorMessage errors={errors} name="duration" render={ErrorRenderer} />
        <Input
          type="text"
          icon = {<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>}
          placeholder="Subject"
          {...register('subject', { required })}
        />
        <ErrorMessage errors={errors} name="subject" render={ErrorRenderer} />
        <Input
          type="text"
          icon = {<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
          placeholder="Material"
          {...register('materi', { required })}
        />
        <ErrorMessage errors={errors} name="materi" render={ErrorRenderer} />
        <TextArea
          cols={3}
          placeholder="Material Description"
          {...register('materiDescription', { required })}
        />
        <ErrorMessage
          errors={errors}
          name="materiDescription"
          render={ErrorRenderer}
        />
        <Input
          type="number"
          icon = {<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          placeholder="Students slot"
          {...register('slot', {
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'Must be a positive number',
            },
          })}
        />
        <ErrorMessage errors={errors} name="slot" render={ErrorRenderer} />
        <TextArea
          cols={3}
          placeholder="Meeting info"
          {...register('meetingInfo')}
        />
        <ErrorMessage
          errors={errors}
          name="meetingInfo"
          render={ErrorRenderer}
        />
        <Input
          type="number"
          icon = {<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          placeholder="Price"
          {...register('price', {
            valueAsNumber: true,
            required,
            min: {
              value: 0,
              message: 'Must be a positive number',
            },
          })}
        ></Input>
        <ErrorMessage errors={errors} name="price" render={ErrorRenderer} />
        <Button type="submit" disabled={isSubmitting}>
          Add new course
        </Button>
      </form>
    </div>
  );
};

export default AddCoursePage;
