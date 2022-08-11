import classNames from 'classnames';
import React from 'react';

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function Input({ children, className, label, ...props }, ref) {
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
          <textarea
            className={classNames(
              'rounded-lg bg-white w-full focus:outline-none border border-primary-grey p-2 placeholder:text-secondary-brown focus:ring-1 focus:ring-secondary-brown duration-300',
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
      </Wrapper>
    );
  },
);

export default TextArea;
