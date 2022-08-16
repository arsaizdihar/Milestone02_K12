import dayjs from 'dayjs';
import Image from 'next/image';
import React from 'react';
import { toRupiah } from '~/utils/toRupiah';
import { inferQueryOutput } from '~/utils/trpc';
import Button from '../Button';

interface CourseInfoProps {
  course: inferQueryOutput<'allCourses'>[number];
  onEnroll?: () => void;
}

const CourseInfo: React.FC<CourseInfoProps> = ({ course, onEnroll }) => {
  let day = dayjs(course.startTime);
  day = day.add(day.utcOffset() - 420, 'minute');
  const end = course.duration
    ? dayjs(course.startTime).add(course.duration, 'minute')
    : null;
  return (
    <li>
      <h3 className="font-extrabold text-xl mb-3 mt-4">{course.user.name}</h3>
      <div className="rounded-lg p-2 flex border-2 border-secondary-brown gap-3 items-center relative">
        <Image
          src={'/static/user.png'}
          width={125}
          height={125}
          className="flex-shrink-0 rounded-md object-center bg-white"
          objectFit="cover"
        />
        <div className="">
          <h4 className="font-extrabold text-primary-blue text-lg">
            {course.subject}
          </h4>
          <table className="text-sm font-medium leading-4">
            <tbody>
              <tr>
                <td>Time</td>
                <td>
                  : {day.format('HH.mm')}
                  {end && end.format(' - HH.mm')} WIB
                </td>
              </tr>
              {course.slot !== 0 && (
                <tr>
                  <td>Kuota</td>
                  <td>
                    : {course._count.participants}/{course.slot}
                  </td>
                </tr>
              )}
              <tr>
                <td>Price</td>
                <td>: {course.price ? toRupiah(course.price) : 'FREE'}</td>
              </tr>
              <tr>
                <td>Materi</td>
                <td>: {course.materi}</td>
              </tr>
            </tbody>
          </table>
          {onEnroll && (
            <Button
              onClick={onEnroll}
              size="sm"
              variant="blue"
              className="mt-2.5"
            >
              enroll
            </Button>
          )}
        </div>
        <div className="absolute right-0 translate-x-1/2 top-0 -translate-y-1/2 bg-black w-10 h-10 p-1 flex justify-center items-center text-center text-white text-xs leading-3 rounded-full">
          {day.format('DD MMM')}
        </div>
      </div>
    </li>
  );
};

export default CourseInfo;
