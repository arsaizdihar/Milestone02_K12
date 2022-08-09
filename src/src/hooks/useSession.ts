import { useContext } from 'react';
import { AuthContext } from '~/components/AuthProvider';

export default function useSession() {
  return useContext(AuthContext);
}
