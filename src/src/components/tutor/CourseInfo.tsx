import { Course } from '@prisma/client';
import dayjs from 'dayjs';
import React from 'react';
import { toRupiah } from '~/utils/toRupiah';

interface CourseInfoProps {
  course: Course;
  onEditClick?: () => void;
}

const CourseInfo: React.FC<CourseInfoProps> = ({ course, onEditClick }) => {
  let day = dayjs(course.startTime);
  day = day.add(day.utcOffset() - 420, 'minute');
  const end = course.duration
    ? dayjs(course.startTime).add(course.duration, 'minute')
    : null;
  return (
    <li className="rounded-lg border-2 border-secondary-brown">
      <div className="flex justify-between items-center py-2 px-3 border-b-2 border-secondary-brown">
        <h4 className="font-extrabold text-primary-blue text-lg">
          {course.subject}
        </h4>
        {onEditClick && (
          <button
            type="button"
            onClick={onEditClick}
            className="bg-primary-blue rounded-full w-6 h-6 flex justify-center items-center"
          >
            <svg
              width="8"
              height="7"
              viewBox="0 0 8 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 5.54187V7H1.66644L6.58131 2.69949L4.91487 1.24136L0 5.54187ZM7.87002 1.57186C8.04333 1.42022 8.04333 1.17525 7.87002 1.02361L6.83016 0.113734C6.65685 -0.0379114 6.37689 -0.0379114 6.20358 0.113734L5.39036 0.825302L7.0568 2.28343L7.87002 1.57186V1.57186Z"
                fill="white"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex justify-between items-end py-3 px-3.5">
        <table className="text-sm font-bold leading-4">
          <tbody>
            <tr>
              <td>Time</td>
              <td>
                : {day.format('HH.mm')}
                {end && end.format(' - HH.mm')} WIB
              </td>
            </tr>
            <tr>
              <td>Tanggal</td>
              <td>
                :{' '}
                {course.startTime.toLocaleDateString('id', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </td>
            </tr>
            <tr>
              <td>Kuota</td>
              <td>: {course.slot}</td>
            </tr>
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
        <svg
          width="51"
          height="35"
          viewBox="0 0 51 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M38.4564 31.4L27.2391 17.2283V9.58333L29.8501 6.485C30.3529 5.88 29.9081 5 29.0958 5H17.6465C16.8342 5 16.3894 5.88 16.8922 6.485L19.5031 9.58333V17.2283L8.28589 31.4C7.33822 32.61 8.24721 34.3333 9.83309 34.3333H36.9092C38.4951 34.3333 39.404 32.61 38.4564 31.4Z"
            fill="#787373"
          />
          <path
            d="M15.7655 33.2L9.97788 26.1142V22.2917L11.325 20.7425C11.5845 20.44 11.3549 20 10.9358 20H5.02846C4.60935 20 4.37984 20.44 4.63929 20.7425L5.98641 22.2917V26.1142L0.198774 33.2C-0.290181 33.805 0.178817 34.6667 0.997069 34.6667H14.9672C15.7855 34.6667 16.2545 33.805 15.7655 33.2Z"
            fill="black"
          />
          <path
            d="M46.8394 30.3092C48.7793 30.3092 50.3665 31.9138 50.3665 33.875H25.677C25.677 31.9138 27.2642 30.3092 29.2041 30.3092H36.2582V26.7434H30.9676C29.0277 26.7434 27.4405 25.1388 27.4405 23.1776H41.5488C44.4763 23.1776 46.8394 20.7885 46.8394 17.8289C46.8394 15.8856 45.7989 14.1918 44.2646 13.2647C44.7761 12.5337 45.0759 11.6601 45.0759 10.6974C45.0759 10.323 45.0053 9.94854 44.9171 9.59196C48.1091 10.9291 50.3665 14.1205 50.3665 17.8289C50.3665 22.7497 46.4161 26.7434 41.5488 26.7434V30.3092H46.8394Z"
            fill="black"
          />
          <path
            d="M40.5611 6.25796C38.1804 6.31145 36.2581 8.27263 36.2581 10.6974C36.2581 12.0345 36.8401 13.2112 37.7571 14.0314L36.7166 16.9197L35.0589 16.3135L34.4593 17.9894L31.1439 16.777L31.7435 15.1011L30.0858 14.4949L34.9178 1.06974L36.5755 1.67592L37.1751 0L40.4906 1.21237L39.891 2.88829L41.5487 3.5123L40.5611 6.25796Z"
            fill="black"
          />
          <path
            d="M40.667 13.3718C39.206 13.3718 38.0217 12.1744 38.0217 10.6974C38.0217 9.22041 39.206 8.02307 40.667 8.02307C42.1279 8.02307 43.3123 9.22041 43.3123 10.6974C43.3123 12.1744 42.1279 13.3718 40.667 13.3718Z"
            fill="black"
          />
        </svg>
      </div>
    </li>
  );
};

export default CourseInfo;
