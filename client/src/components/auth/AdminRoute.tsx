
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '@/services/auth';

export const AdminRoute = () => {
    const isAuth = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    if (!isAuth || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
