import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

interface Props {
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary' | 'blue';
  children?: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: 'submit' | 'button';
  disabled?: boolean;
}

const Button = React.forwardRef<any, Props>(function Button(
  { className, children, size = 'md', variant = 'primary', ...props },
  ref,
) {
  const buttonClassName = classNames(
    'rounded-md',
    size === 'md' && 'py-2.5 px-4',
    size === 'sm' && 'py-1 px-2',
    {
      primary: 'bg-primary-brown text-white',
      secondary: 'border border-primary-grey',
      blue: 'bg-primary-blue text-white',
    }[variant],
    className,
  );
  if (props.href) {
    return (
      <Link href={props.href}>
        <a className={buttonClassName} {...props} ref={ref}>
          {children}
        </a>
      </Link>
    );
  }
  return (
    <button ref={ref} className={buttonClassName} {...props}>
      {children}
    </button>
  );
});

export default Button;
