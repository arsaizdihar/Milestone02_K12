import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

export interface TimeSelectProps {
  value: typeof options[number];
  onChange: (value: typeof options[number]) => void;
}

const options = ['upcoming', 'past'] as const;

const TimeSelect: React.FC<TimeSelectProps> = (p) => {
  return (
    <Listbox
      value={p.value}
      onChange={p.onChange}
      as="div"
      className={'flex py-5'}
    >
      <div className="relative text-sm">
        <Listbox.Button
          className={
            'rounded-full bg-primary-pink px-2.5 py-2 font-bold border border-secondary-brown flex justify-between items-center gap-3 w-28'
          }
        >
          {p.value}
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.94753 5.90009L0.765842 0.713429L9.3352 0.88648L4.94753 5.90009Z"
              fill="#004382"
            />
          </svg>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition ease-in duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute right-0 mt-1 w-24 overflow-auto rounded-md bg-white py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `relative select-none p-2 ${
                    active && 'bg-primary-pink'
                  } cursor-pointer`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {option}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default TimeSelect;
