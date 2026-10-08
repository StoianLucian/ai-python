import React from 'react'
import { Navigate } from 'react-router-dom';
import { APP_PATHS } from './routes';
import { CircularProgress } from '@mui/material';
import { useAuthContext } from '../api/context/authContext/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {

    const { isAuthenticated, loading } = useAuthContext();

    if (loading) {
        return <CircularProgress />
    }

    return (
        isAuthenticated ? children : <Navigate to={APP_PATHS.LOGIN} replace />
    )
}

export default PrivateRoute