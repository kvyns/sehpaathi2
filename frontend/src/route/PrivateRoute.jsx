// PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/user/userSlice.js";

const PrivateRoute = ({ element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect to /signin if the user is not authenticated
  return isAuthenticated ? element : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
