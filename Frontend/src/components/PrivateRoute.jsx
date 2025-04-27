import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PrivateRoute = () => {
  const {loggedInUser} = useAuthStore();

  return loggedInUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
