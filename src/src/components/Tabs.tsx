import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

interface TabsProps {
  tab1: {
    label: string;
    href: string;
  };
  tab2: {
    label: string;
    href: string;
  };
  activeIndex: 0 | 1;
}

const Tabs: React.FC<TabsProps> = (p) => {
  return (
    <div className="flex justify-center font-extrabold gap-8 text-primary-grey py-4">
      <Link href={p.tab1.href}>
        <a
          className={classNames(
            'py-2 relative',
            p.activeIndex === 0 &&
              'text-primary-blue after:absolute after:bg-secondary-brown after:h-0.5 after:top-full after:left-1/2 after:-translate-x-1/2 after:w-12',
          )}
        >
          {p.tab1.label}
        </a>
      </Link>
      <Link href={p.tab2.href}>
        <a
          className={classNames(
            'py-2 relative',
            p.activeIndex === 1 &&
              'text-primary-blue after:absolute after:bg-secondary-brown after:h-0.5 after:top-full after:left-1/2 after:-translate-x-1/2 after:w-12',
          )}
        >
          {p.tab2.label}
        </a>
      </Link>
    </div>
  );
};

export default Tabs;
