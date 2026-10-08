import React from 'react'
import { Navigate } from 'react-router-dom';
import { APP_PATHS } from './routes';
import { useAuthContext } from '../api/context/authContext/AuthContext';
import LoadingPage from '../pages/loading/LoadingPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {

    const { isAuthenticated, loading } = useAuthContext();

    if (loading) {
        return <LoadingPage />
    }

    return (
        isAuthenticated ? children : <Navigate to={APP_PATHS.LOGIN} replace />
    )
}

export default PrivateRoute