import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "../../redux/slices/authSlice";
import Loading from "../Loading";

export default function RequireRole({ allowedRoles }) {
  const dispatch = useDispatch();
  const { currentUserData, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (
    (!isLoading == false && !currentUserData.role == "ADMIN") ||
    !currentUserData?.role === "USER" ||
    !currentUserData?.role === "SUPER_ADMIN"
  ) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const normalizedRole = currentUserData?.role?.toUpperCase();
  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
