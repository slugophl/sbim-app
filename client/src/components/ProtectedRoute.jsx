import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { isSignedIn, loading } = useAuth();

    if (loading) {
        return <div></div>;
    }

    return isSignedIn ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;