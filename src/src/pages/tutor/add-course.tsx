import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '~/components/Button';
import ErrorRenderer from '~/components/ErrorRenderer';
import Input from '~/components/Input';
import TextArea from '~/components/Textarea';
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
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
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
          placeholder="Subject"
          {...register('subject', { required })}
        />
        <ErrorMessage errors={errors} name="subject" render={ErrorRenderer} />
        <Input
          type="text"
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
