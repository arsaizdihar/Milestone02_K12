import type { Course } from '@prisma/client';
import dayjs from 'dayjs';
import Image from 'next/image';
import React from 'react';
import { toRupiah } from '~/utils/toRupiah';

interface CourseInfoProps extends Course {}

const CourseInfo: React.FC<CourseInfoProps> = (p) => {
  let day = dayjs(p.startTime);
  day = day.add(day.utcOffset() - 420, 'minute');
  const end = p.duration ? dayjs(p.startTime).add(p.duration, 'minute') : null;
  return (
    <li className="rounded-lg p-3 flex bg-primary-grey gap-3 items-center">
      <Image
        src={'/static/user.png'}
        width={125}
        height={125}
        className="flex-shrink-0 rounded-md object-center bg-white"
        objectFit="cover"
      />
      <div className="">
        <h4 className="font-extrabold text-primary-blue text-lg">
          {p.subject}
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
            <tr>
              <td>Kuota</td>
              <td>: {p.slot}</td>
            </tr>
            <tr>
              <td>Price</td>
              <td>: {p.price ? toRupiah(p.price) : 'FREE'}</td>
            </tr>
            <tr>
              <td>Materi</td>
              <td>: {p.materi}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </li>
  );
};

export default CourseInfo;
