import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };


export const EmployerProtectedRoute = ({ children }) => {
    const { employer } = useSelector((state) => state.employer);
    if (isEmptyObject(employer)) {
      // toast.warning("please login to continue")
      return <Navigate to="/employer/employer-login" replace />;
    }
  
    return children;
  };