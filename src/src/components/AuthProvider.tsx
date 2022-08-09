import { User } from '@prisma/client';
import React from 'react';
import type { SIMPLE_USER_QUERY } from '~/server/user';
import { trpc } from '~/utils/trpc';

export type SessionUser = Pick<User, keyof typeof SIMPLE_USER_QUERY>;
export type Session =
  | {
      data: SessionUser;
      status: 'authenticated';
    }
  | {
      data?: undefined;
      status: 'loading' | 'unauthenticated';
    };

export const AuthContext = React.createContext<Session>({} as any);

export const AuthProvider = ({
  children,
  session,
}: {
  children?: React.ReactNode;
  session?: SessionUser;
}) => {
  const data = trpc.useQuery(['auth.currentUser'], { initialData: session });
  return (
    <AuthContext.Provider
      value={
        data.isLoading
          ? { status: 'loading' }
          : data.data
          ? { status: 'authenticated', data: data.data }
          : { status: 'unauthenticated' }
      }
    >
      {children}
    </AuthContext.Provider>
  );
};
