import classNames from 'classnames';
import React, { useRef } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import Button from './Button';

interface InputProps extends UseControllerProps<any> {
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  accept?: string;
}

function FileInput({
  className,
  icon,
  placeholder,
  accept,
  ...props
}: InputProps) {
  const { field } = useController(props);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const value: string = field.value ?? '';
  return (
    <div
      className={classNames(
        'rounded-lg bg-white w-full border border-primary-grey p-2 duration-300 flex justify-between items-center text-sm',
        className,
      )}
    >
      <input
        className="hidden"
        type="file"
        accept={accept}
        {...field}
        value={value}
        ref={(e) => {
          inputRef.current = e;
          field.ref(e);
        }}
      />
      <div className="flex items-center gap-1">
        {icon}
        <span className={classNames(value ? '' : 'text-[#787373] select-none')}>
          {value ? inputRef.current?.files?.[0]?.name : placeholder}
        </span>
      </div>
      <Button type="button" size="sm" onClick={() => inputRef.current?.click()}>
        Choose File
      </Button>
    </div>
  );
}

export default FileInput;
