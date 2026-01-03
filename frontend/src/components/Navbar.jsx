// import { Link, useNavigate } from "react-router-dom";
// import "../App.css";

// export default function Navbar() {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav
//       style={{
//         background: "#1f2937",
//         padding: "15px 30px",
//         color: "white",
//         display: "flex",
//         justifyContent: "space-between",
//       }}
//     >
//       <h2>Multi-Tenant SaaS</h2>

//       <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
//         <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
//         <Link to="/projects" style={{ color: "white" }}>Projects</Link>
//         <Link to="/users" style={{ color: "white" }}>Users</Link>
//         <button onClick={logout} className="btn-primary" style={{ width: "auto" }}>
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }

// import { Link, useNavigate } from "react-router-dom";
// import "../App.css";

// export default function Navbar({ user }) {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <span className="logo">MultiTenant SaaS</span>
//         <Link to="/dashboard">Dashboard</Link>
//         <Link to="/projects">Projects</Link>
//         {user?.role === "tenant_admin" && <Link to="/users">Users</Link>}
//       </div>

//       <div className="nav-right">
//         <span className="user-info">
//           {user?.role}
//         </span>
//         <button onClick={logout} className="logout-btn">Logout</button>
//       </div>
//     </nav>
//   );
// }

// import { Link, useNavigate } from "react-router-dom";
// import "./Navbar.css";

// export default function Navbar() {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo">MultiTenant SaaS</div>

//       <div className="nav-links">
//         <Link to="/dashboard">Dashboard</Link>
//         <Link to="/projects">Projects</Link>
//         <Link to="/users">Users</Link>
//       </div>

//       <div className="nav-right">
//         <span className="role">tenant_admin</span>
//         <button onClick={logout}>Logout</button>
//       </div>
//     </nav>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">MultiTenant SaaS</span>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/users">Users</Link>
      </div>

      <div className="navbar-right">
        <span className="role">tenant_admin</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
