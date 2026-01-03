// import { useEffect, useState } from 'react';
// import api from '../services/api';

// export default function Projects() {
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     api.get('/projects').then(res => setProjects(res.data.data.projects || []));
//   }, []);

//   return (
//     <>
//       <h2>Projects</h2>
//       {projects.map(p => <div key={p.id}>{p.name}</div>)}
//     </>
//   );
// }

// import Layout from "../components/Layout";

// export default function Projects() {
//   return (
//     <Layout>
//       <h1>Projects</h1>

//       <table
//         style={{
//           width: "100%",
//           marginTop: "20px",
//           background: "white",
//           borderCollapse: "collapse",
//         }}
//       >
//         <thead>
//           <tr style={{ background: "#e5e7eb" }}>
//             <th>Name</th>
//             <th>Status</th>
//             <th>Created By</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
//               No projects yet
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </Layout>
//   );
// }

// export default function Projects() {
//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
//         <h2>Projects</h2>
//         <button className="btn-primary">+ New Project</button>
//       </div>

//       <div className="grid">
//         {[1,2,3].map((p) => (
//           <div key={p} className="card">
//             <h3>Project Alpha</h3>
//             <p className="muted">Task management platform</p>
//             <span className="badge">Active</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import "./Projects.css";

// export default function Projects() {
//   return (
//     <div className="projects-page">
//       <div className="projects-header">
//         <h1>Projects</h1>
//         <button className="btn-primary">+ New Project</button>
//       </div>

//       <div className="projects-grid">
//         <div className="project-card">
//           <h3>Website Revamp</h3>
//           <p>Redesign company website</p>
//           <span className="status active">Active</span>
//         </div>

//         <div className="project-card">
//           <h3>Mobile App</h3>
//           <p>Customer mobile application</p>
//           <span className="status completed">Completed</span>
//         </div>

//         <div className="project-card empty">
//           <p>No more projects</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import "../App.css";

// export default function Projects() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const res = await api.get("/projects");
//       setProjects(res.data.data || []);
//     } catch (err) {
//       console.error("Failed to fetch projects");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateProject = () => {
//     alert("Create Project clicked (modal next step)");
//   };

//   if (loading) {
//     return <p>Loading projects...</p>;
//   }

//   return (
//     <div className="page">
//       <div className="page-header">
//         <h2>Projects</h2>
//         <button className="btn-primary" onClick={handleCreateProject}>
//           + New Project
//         </button>
//       </div>

//       {projects.length === 0 ? (
//         <p>No projects found.</p>
//       ) : (
//         <div className="card-grid">
//           {projects.map((project) => (
//             <div
//               key={project.id}
//               className="card"
//               onClick={() => navigate(`/projects/${project.id}`)}
//             >
//               <h3>{project.name}</h3>
//               <p className="muted">
//                 {project.description || "No description"}
//               </p>

//               <div className="card-footer">
//                 <span className="badge">{project.status || "active"}</span>
//                 <span className="muted">
//                   {new Date(project.created_at).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");

      // SAFETY: handle all backend response shapes
      const data = res.data?.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.projects)
        ? data.projects
        : [];

      setProjects(list);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // VERY IMPORTANT
    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  if (loading) return <p>Loading projects...</p>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Projects</h2>
        <button
          className="btn-primary"
          onClick={() => alert("Create Project (optional modal)")}
        >
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="card-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <h3>{project.name}</h3>

              <p className="muted">
                {project.description || "No description"}
              </p>

              <div className="card-footer">
                <span className="badge">
                  {project.status || "active"}
                </span>

                <span className="muted">
                  {project.created_at
                    ? new Date(project.created_at).toLocaleDateString()
                    : ""}
                </span>
              </div>

              <div style={{ marginTop: "8px" }}>
                <button
                  className="btn-danger"
                  onClick={(e) => handleDelete(project.id, e)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
