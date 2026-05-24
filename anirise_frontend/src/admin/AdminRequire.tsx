import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminRequire = () => {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/xkey/broadmin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRequire;
