import { z } from 'zod';
import { createStudentRouter } from '../context';

export const studentRouter = createStudentRouter().query('myCourses', {
  input: z.object({ past: z.boolean(), search: z.string().optional() }),
  async resolve({ ctx, input }) {
    const now = new Date();
    return await ctx.prisma.course.findMany({
      where: {
        participants: { some: { userId: ctx.userId } },
        startTime: input?.past ? { lte: now } : { gt: now },
        OR: [
          { materi: { contains: input.search, mode: 'insensitive' } },
          { subject: { contains: input.search, mode: 'insensitive' } },
        ],
      },
    });
  },
});



import { ErrorMessage } from '@hookform/error-message';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
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

const editprofile = () => {
  <Button type="submit">EDIT PROFILE</Button>

  return (
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
          {...register('password', {
              minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
          }})},
      />
      <ErrorMessage errors={errors} name="password" render={ErrorRenderer} />


      <Input
          type="tel"
          placeholder="WA Number"
          autoComplete="tel"
          {...register('WANumber')}
      />
      <ErrorMessage errors={errors} name="WANumber" render={ErrorRenderer} />


      <Input 
          placeholder="Line ID" 
          {...register('lineId')} 
      />
      <ErrorMessage errors={errors} name="lineId" render={ErrorRenderer} />


      accept="image/*"
      name="image"
      control={control as any}
      placeholder="Upload Photo"
      />
      <ErrorMessage errors={errors} name="image" render={ErrorRenderer} />

      <Button type="submit">
          <Link href = "/auth/student/courses">
          UPDATE PROFILE
      </Button>

)}

prisma.user.update({where: {id: ctx.userId}, data: {editprofile}})