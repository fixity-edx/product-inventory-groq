import React from "react";
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../lib/auth";

export default function ProtectedRoute({ children, roles=[] }){
  const user = getUserFromToken();
  if(!user) return <Navigate to="/login" replace />;

  if(roles.length > 0 && !roles.includes(user.role)){
    return <Navigate to="/" replace />;
  }
  return children;
}
