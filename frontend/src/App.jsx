// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Projects from './pages/Projects';
// import Users from './pages/Users';
// import ProtectedRoute from './routes/ProtectedRoute';

// export default function App() {
//   return (
//     <Routes>
//       {/* default redirect */}
//       <Route path="/" element={<Navigate to="/login" />} />

//       {/* public routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* protected routes */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/projects"
//         element={
//           <ProtectedRoute>
//             <Projects />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/users"
//         element={
//           <ProtectedRoute>
//             <Users />
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// }

// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Projects from "./pages/Projects";
// import Users from "./pages/Users";
// import ProtectedRoute from "./routes/ProtectedRoute";

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       <Route
//         path="/dashboard"
//         element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
//       />
//       <Route
//         path="/projects"
//         element={<ProtectedRoute><Projects /></ProtectedRoute>}
//       />
//       <Route
//         path="/users"
//         element={<ProtectedRoute><Users /></ProtectedRoute>}
//       />
//     </Routes>
//   );
// }


import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Users from "./pages/Users";
import ProjectDetails from "./pages/ProjectDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes (any logged-in user) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/projects/:projectId"
            element={<ProjectDetails />}
          />
        </Route>
      </Route>

      {/* Tenant admin only */}
      <Route element={<ProtectedRoute roles={["tenant_admin"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
}
