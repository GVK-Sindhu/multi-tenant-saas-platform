// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import api from "../api/axios";

// // function Login() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [tenantSubdomain, setTenantSubdomain] = useState("");
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await api.post("/auth/login", {
// //         email,
// //         password,
// //         tenantSubdomain,
// //       });

// //       localStorage.setItem("token", res.data.data.token);
// //       navigate("/dashboard"); 
// //     } catch (err) {
// //       setError("Invalid credentials");
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleLogin}>
// //       <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
// //       <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
// //       <input placeholder="Tenant Subdomain" onChange={e => setTenantSubdomain(e.target.value)} />
// //       {error && <p>{error}</p>}
// //       <button type="submit">Login</button>
// //     </form>
// //   );
// // }

// // export default Login;
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";
// import "../App.css";

// export default function Login() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     tenantSubdomain: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await api.post("/auth/login", form);
//       localStorage.setItem("token", res.data.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   // return (
//   //   <div className="container">
//   //     <h1>Login</h1>

//   //     <form onSubmit={handleSubmit}>
//   //       <div className="form-group">
//   //         <label>Email</label>
//   //         <input name="email" type="email" onChange={handleChange} required />
//   //       </div>

//   //       <div className="form-group">
//   //         <label>Password</label>
//   //         <input name="password" type="password" onChange={handleChange} required />
//   //       </div>

//   //       <div className="form-group">
//   //         <label>Tenant Subdomain</label>
//   //         <input name="tenantSubdomain" onChange={handleChange} required />
//   //       </div>

//   //       <button className="btn-primary">Login</button>
//   //     </form>

//   //     {error && <p className="error">{error}</p>}

//   //     <div className="link">
//   //       <Link to="/register">Create new tenant</Link>
//   //     </div>
//   //   </div>
//   // );
//  return (
//   <div className="auth-page">
//     <div className="auth-card">
//       <h2 className="auth-title">Sign in to your account</h2>

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Email</label>
//           <input
//             name="email"
//             type="email"
//             placeholder="admin@company.com"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             name="password"
//             type="password"
//             placeholder="••••••••"
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Tenant Subdomain</label>
//           <input
//             name="tenantSubdomain"
//             placeholder="demo"
//             onChange={handleChange}
//             required
//           />
//           <small className="hint">demo.yourapp.com</small>
//         </div>

//         {error && <p className="error">{error}</p>}

//         <button className="btn-primary">Login</button>
//       </form>

//       <p className="auth-footer">
//         New here? <Link to="/register">Create a tenant</Link>
//       </p>
//     </div>
//   </div>
// );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function Login() {
  const { login } = useAuth(); 
  const [form, setForm] = useState({
    email: "",
    password: "",
    tenantSubdomain: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   try {
  //     await login(form);        
  //     navigate("/dashboard");  
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Login failed");
  //   }
  // };
//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   try {
//     await login({
//       ...form,
//       tenantSubdomain: form.tenantSubdomain.trim().toLowerCase(),
//     });
//     navigate("/dashboard");
//   } catch (err) {
//     setError(err.response?.data?.message || "Login failed");
//   }
// };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await api.post("/auth/login", {
      ...form,
      tenantSubdomain: form.tenantSubdomain.trim().toLowerCase(),
    });

    localStorage.setItem("token", res.data.data.token);

    window.location.href = "/dashboard";
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Sign in to your account</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="admin@company.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tenant Subdomain</label>
            <input
              name="tenantSubdomain"
              placeholder="demo"
              onChange={handleChange}
              required
            />
            <small className="hint">demo.yourapp.com</small>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn-primary">Login</button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Create a tenant</Link>
        </p>
      </div>
    </div>
  );
}
