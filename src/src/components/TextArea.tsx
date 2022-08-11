import classNames from 'classnames';
import React from 'react';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function Input({ children, className, ...props }, ref) {
    return (
      <div className="relative text-sm">
        <textarea
          className={classNames(
            'rounded-lg bg-white w-full focus:outline-none border border-primary-grey p-2 placeholder:text-[#787373] focus:ring-1 focus:ring-[#787373] duration-300',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

export default TextArea;
