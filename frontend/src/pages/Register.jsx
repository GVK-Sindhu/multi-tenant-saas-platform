// import { useState } from 'react';
// import api from '../services/api';
// import { useNavigate } from 'react-router-dom';

// export default function Register() {
//   const [form, setForm] = useState({});
//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     await api.post('/auth/register-tenant', form);
//     alert('Registered successfully');
//     navigate('/login');
//   };

//   return (
//     <form onSubmit={submit}>
//       <h2>Register Tenant</h2>
//       <input placeholder="Organization Name" onChange={e=>setForm({...form, name:e.target.value})}/>
//       <input placeholder="Subdomain" onChange={e=>setForm({...form, subdomain:e.target.value})}/>
//       <input placeholder="Admin Email" onChange={e=>setForm({...form, email:e.target.value})}/>
//       <input placeholder="Admin Full Name" onChange={e=>setForm({...form, fullName:e.target.value})}/>
//       <input type="password" placeholder="Password" onChange={e=>setForm({...form, password:e.target.value})}/>
//       <button>Create Tenant</button>
//     </form>
//   );
// // }
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";
// import "../App.css";

// export default function Register() {
//   const [form, setForm] = useState({
//     tenantName: "",
//     subdomain: "",
//     adminEmail: "",
//     adminFullName: "",
//     adminPassword: "",
//   });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await api.post("/auth/register-tenant", form);
//       setMessage("Tenant registered successfully");
//       setTimeout(() => navigate("/login"), 1500);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Register Tenant</h1>

//       <form onSubmit={handleSubmit}>
//         {[
//           ["tenantName", "Organization Name"],
//           ["subdomain", "Subdomain"],
//           ["adminFullName", "Admin Name"],
//           ["adminEmail", "Admin Email"],
//           ["adminPassword", "Password"],
//         ].map(([name, label]) => (
//           <div className="form-group" key={name}>
//             <label>{label}</label>
//             <input
//               name={name}
//               type={name.includes("Password") ? "password" : "text"}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         ))}

//         <button className="btn-primary">Register</button>
//       </form>

//       {message && <p className="success">{message}</p>}

//       <div className="link">
//         <Link to="/login">Back to login</Link>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenantName: "",
    subdomain: "",
    adminEmail: "",
    adminFullName: "",
    adminPassword: "",
    confirmPassword: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.adminPassword !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (!form.agree) {
      return setError("You must accept Terms & Conditions");
    }

    try {
      setLoading(true);
      await api.post("/auth/register-tenant", {
        tenantName: form.tenantName,
        subdomain: form.subdomain,
        adminEmail: form.adminEmail,
        adminFullName: form.adminFullName,
        adminPassword: form.adminPassword,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create your tenant</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Organization Name</label>
            <input name="tenantName" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Subdomain</label>
            <input name="subdomain" onChange={handleChange} required />
            <small className="hint">{form.subdomain || "demo"}.yourapp.com</small>
          </div>

          <div className="form-group">
            <label>Admin Full Name</label>
            <input name="adminFullName" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Admin Email</label>
            <input type="email" name="adminEmail" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="adminPassword" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" onChange={handleChange} required />
          </div>

          <div className="checkbox">
            <input type="checkbox" name="agree" onChange={handleChange} />
            <span>I agree to Terms & Conditions</span>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
