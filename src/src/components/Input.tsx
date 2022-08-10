import classNames from 'classnames';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { children, className, icon, ...props },
  ref,
) {
  return (
    <div className="relative">
      <input
        className={classNames(
          'rounded-lg bg-white w-full focus:outline-none border border-primary-grey py-2 placeholder:text-[#787373] focus:ring-1 focus:ring-[#787373] duration-300',
          icon ? 'pr-3 pl-10' : 'px-3',
          className,
        )}
        ref={ref}
        {...props}
      />
      {icon ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </span>
      ) : null}
    </div>
  );
});

export default Input;
