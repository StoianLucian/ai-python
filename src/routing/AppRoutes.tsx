import { Navigate, Route, Routes } from 'react-router-dom'
import { APP_PATHS } from './routes'
import PrivateRoute from './PrivateRoute'
import Dashboard from '../pages/Dashboard'
import LoginPage from '../pages/login/LoginPage'
import RegisterPage from '../pages/register/RegisterPage'
import ChatPage from '../pages/chat/ChatPage'
import { useAuthContext } from '../api/context/authContext/AuthContext'
import VideoPage from '../pages/video/VideoPage'
import LookupPage from '../pages/lookup/LookupPage'
import ProfilePage from '../pages/profile/ProfilePage'

const routes = [
    { path: APP_PATHS.LOGIN, element: <LoginPage />, isPrivate: false },
    { path: APP_PATHS.REGISTER, element: <RegisterPage />, isPrivate: false },
    { path: APP_PATHS.HOME, element: <Dashboard />, isPrivate: true },
    { path: `${APP_PATHS.CHAT}/:id`, element: <ChatPage />, isPrivate: true },
    { path: `${APP_PATHS.video}`, element: <VideoPage />, isPrivate: true },
    { path: APP_PATHS.LOOKUP, element: <LookupPage />, isPrivate: true },
    { path: APP_PATHS.PROFILE, element: <ProfilePage />, isPrivate: true },
    { path: "*", element: <>Page not found</>, isPrivate: false },
];

const useReturnRoutes = () => {
    const { isAuthenticated, loading } = useAuthContext()

    if (loading) {
        return [<Route key="loading" path="*" element={<>Loading...</>} />]
    }

    return routes.map((route) => {
        if (isAuthenticated && (route.path === APP_PATHS.LOGIN || route.path === APP_PATHS.REGISTER)) {
            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<Navigate to={APP_PATHS.HOME} replace />}
                />
            )
        }

        const element = route.isPrivate ? <PrivateRoute>{route.element}</PrivateRoute> : route.element

        return <Route key={route.path} path={route.path} element={element} />
    })
}

function AppRoutes() {
    const routes = useReturnRoutes()

    return (
        <Routes>
            {routes}
        </Routes>
    )
}

export default AppRoutes