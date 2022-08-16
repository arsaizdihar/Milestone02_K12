import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useLogout } from '~/hooks/useLogout';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import useSession from '~/hooks/useSession';
import Button from '../Button';
import MenuButton from './MenuButton';

interface LinkProps {
  href: string;
  text: string;
  activeHref?: string[];
}

const guestLinks: LinkProps[] = [
  {
    href: '/auth/login',
    text: 'SIGN IN',
  },
  {
    href: '/auth/register/student',
    text: 'SIGN UP',
    activeHref: ['/auth/register/student', '/auth/register/tutor'],
  },
];

const tutorLinks: LinkProps[] = [
  {
    href: '/tutor',
    text: 'HOME',
  },
  {
    href: '/tutor/courses',
    text: 'COURSE',
  },
];

const studentLinks: LinkProps[] = [
  {
    href: '/student',
    text: 'HOME',
  },
  {
    href: '/student/courses',
    text: 'COURSE',
  },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const router = useRouter();
  const logout = useLogout();
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsOpen(false));
  const links = session.data
    ? session.data.role === 'TUTOR'
      ? tutorLinks
      : studentLinks
    : guestLinks;

  return (
    <nav className="fixed inset-x-0 top-0 bg-primary-cream z-40">
      <div
        className="w-full max-w-screen-mobile flex justify-between mx-auto border-x px-8 py-5 relative"
        ref={ref}
      >
        <MenuButton
          isOpen={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        />
        <button
          className="font-extrabold"
          onClick={() => {
            if (session.data) {
              router.push(`/${session.data.role.toLowerCase()}`);
            }
          }}
          disabled={!session.data}
        >
          <span className="text-primary-brown text-base">BEAR</span> WITH TPB
        </button>
        <AnimatePresence exitBeforeEnter>
          {isOpen && (
            <motion.div
              className="absolute top-0 h-screen left-0 bg-primary-cream text-black max-w-full"
              variants={{
                closed: {
                  width: 0,
                  transition: {
                    when: 'afterChildren',
                  },
                },
                opened: {
                  width: '298px',
                  transition: {
                    when: 'beforeChildren',
                  },
                },
              }}
              initial={'closed'}
              animate={'opened'}
              exit={'closed'}
            >
              <motion.div
                variants={{
                  closed: { opacity: 0 },
                  opened: { opacity: 1 },
                }}
                className="pt-12 pb-8 px-8 h-full flex flex-col justify-between"
              >
                <div className="">
                  <button
                    className="font-extrabold"
                    onClick={() => {
                      if (session.data) {
                        router.push(`/${session.data.role.toLowerCase()}`);
                      }
                    }}
                    disabled={!session.data}
                  >
                    <span className="text-primary-brown text-base">BEAR</span>{' '}
                    WITH TPB
                  </button>
                  <div className="flex flex-col mt-5 gap-4">
                    {links.map((link, idx) => (
                      <NavItem
                        key={idx}
                        href={link.href}
                        text={link.text}
                        onClick={() => setIsOpen(false)}
                        active={
                          link.activeHref
                            ? link.activeHref.some((l) => l === router.asPath)
                            : link.href === router.asPath
                        }
                      />
                    ))}
                  </div>
                </div>
                {session.data && (
                  <div className="flex flex-col gap-8 items-center">
                    <Button onClick={logout}>LOGOUT</Button>
                    <div className="flex gap-4 w-full">
                      <Image
                        src={session.data.photoUrl}
                        width={40}
                        height={40}
                        objectFit="cover"
                        className="rounded-full border border-primary-grey"
                      />
                      <div className="">
                        <p className="font-bold">{session.data.name}</p>
                        <p className="text-sm text-secondary-brown">
                          {session.data.role === 'STUDENT'
                            ? 'Student'
                            : 'Tutor'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const NavItem: React.FC<{
  href: string;
  text: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ href, text, active, onClick }) => {
  return (
    <Link href={href}>
      <a
        className={classNames(
          'py-2 px-2.5 font-extrabold rounded-md',
          active
            ? 'text-primary-blue bg-white'
            : 'hover:bg-white hover:text-primary-blue',
        )}
        onClick={onClick}
      >
        {text}
      </a>
    </Link>
  );
};

export default NavBar;
