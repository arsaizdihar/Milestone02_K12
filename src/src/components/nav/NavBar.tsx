import { useRouter } from 'next/router';
import { useState } from 'react';
import useSession from '~/hooks/useSession';
import MenuButton from './MenuButton';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const router = useRouter();

  return (
    <nav className="fixed inset-x-0 top-0 bg-primary-cream z-40">
      <div className="w-full max-w-screen-mobile flex justify-between mx-auto border-x px-8 py-5">
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
      </div>
    </nav>
  );
};

export default NavBar;
