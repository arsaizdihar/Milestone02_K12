import classNames from 'classnames';
import React from 'react';

interface TitleProps {
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Title = React.forwardRef<
  HTMLHeadingElement,
  React.PropsWithChildren<TitleProps>
>(function Title({ children, as: Variant = 'h1', className, ...props }, ref) {
  return (
    <Variant
      ref={ref}
      className={classNames(
        'font-extrabold text-lg text-center my-4',
        className,
      )}
    >
      {children}
    </Variant>
  );
});

export default Title;
