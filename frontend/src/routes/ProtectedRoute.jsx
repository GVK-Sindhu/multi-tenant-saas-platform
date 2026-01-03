// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;

// import { Navigate, Outlet } from "react-router-dom";

// export default function ProtectedRoute() {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// }

// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ roles }) {
//   // const { user, loading } = useAuth();
//   const auth = useAuth();

//   if (!auth) {
//     return <p>Auth not ready...</p>;
//   }

//   const { user, loading } = auth;

//   if (loading) return <p>Loading...</p>;

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roles && !roles.includes(user.role)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// }
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ roles }) {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roles && !roles.includes(user.role)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// }

import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
