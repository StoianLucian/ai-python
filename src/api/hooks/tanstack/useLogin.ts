import { useMutation } from '@tanstack/react-query';
import { login } from '../../authApi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { APP_PATHS } from '../../../routing/routes';
import type { LoginCredentials } from '../../../pages/login/LoginPage';
import { useAuthContext } from '../../context/authContext/AuthContext';

export type LoginResponse = {
    id: string
    username: string
    email: string
}

export function useLogin() {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useAuthContext();
    const { t } = useTranslation();
    return useMutation<LoginResponse, any, LoginCredentials>({
        mutationFn: async (credentials) => {
            const response = await login(credentials);
            return response;
        },
        onError: (error: any) => {
            const errorCode = error.response?.data?.detail?.errorCode;
            if (errorCode) {
                toast(t(`errors.${errorCode}`), { type: 'error' });
            } else {
                toast(t('errors.unknownError'), { type: 'error' });
            }
        },
        onSuccess(data) {
            setIsAuthenticated(true);
            setUser(data);
            navigate(APP_PATHS.HOME);
        }
    });
}