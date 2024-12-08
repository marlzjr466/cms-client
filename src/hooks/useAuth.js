import { useContext } from 'react';
import { AuthContext } from '@components/AuthProvider';

const useAtuh = () => useContext(AuthContext);

export default useAtuh;
