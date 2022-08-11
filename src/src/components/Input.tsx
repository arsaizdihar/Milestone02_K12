import classNames from 'classnames';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, icon, label, ...props },
  ref,
) {
  const Wrapper = label ? 'div' : React.Fragment;
  return (
    <Wrapper>
      {label && (
        <label
          htmlFor={props.name}
          className="text-secondary-brown pb-1.5 pl-1 text-sm"
        >
          {label}
        </label>
      )}
      <div className="relative text-sm">
        <input
          className={classNames(
            'rounded-lg bg-white w-full focus:outline-none border border-primary-grey py-2 placeholder:text-secondary-brown focus:ring-1 focus:ring-secondary-brown duration-300',
            icon ? 'pr-2 pl-9' : 'px-2',
            className,
          )}
          ref={ref}
          {...props}
        />
        {icon ? (
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        ) : null}
      </div>
    </Wrapper>
  );
});

export default Input;
