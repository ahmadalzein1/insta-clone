import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext/AuthContext';

export const useAuth = () => {
    return useContext(AuthContext);
};
