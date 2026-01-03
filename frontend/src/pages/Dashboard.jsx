// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import Navbar from "../components/Navbar";

// export default function Dashboard() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     api.get("/auth/me").then(res => setUser(res.data.data));
//   }, []);

//   return (
//     <>
//       <Navbar user={user} />

//       <div className="dashboard">
//         <h2>Dashboard</h2>

//         <div className="stats">
//           <div className="card">
//             <h3>Total Projects</h3>
//             <p>—</p>
//           </div>
//           <div className="card">
//             <h3>Total Tasks</h3>
//             <p>—</p>
//           </div>
//           <div className="card">
//             <h3>Completed</h3>
//             <p>—</p>
//           </div>
//           <div className="card">
//             <h3>Pending</h3>
//             <p>—</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import Navbar from "../components/Navbar";
// import "../App.css";

// export default function Dashboard() {
//   const [user, setUser] = useState(null);
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     api.get("/auth/me").then(res => setUser(res.data.data));
//     api.get("/projects").then(res => setProjects(res.data.data.projects || []));
//   }, []);

//   return (
//     <>
//       <Navbar user={user} />

//       <div className="dashboard-container">
//         <h2 className="page-title">Dashboard</h2>

//         {/* STATS */}
//         <div className="stats-grid">
//           <StatCard title="Total Projects" value={projects.length} />
//           <StatCard title="Total Tasks" value="—" />
//           <StatCard title="Completed Tasks" value="—" />
//           <StatCard title="Pending Tasks" value="—" />
//         </div>

//         {/* RECENT PROJECTS */}
//         <div className="section-card">
//           <h3>Recent Projects</h3>

//           {projects.length === 0 ? (
//             <p className="empty-text">No projects yet</p>
//           ) : (
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Status</th>
//                   <th>Created At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {projects.slice(0, 5).map(project => (
//                   <tr key={project.id}>
//                     <td>{project.name}</td>
//                     <td>
//                       <span className={`badge ${project.status}`}>
//                         {project.status}
//                       </span>
//                     </td>
//                     <td>{new Date(project.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// function StatCard({ title, value }) {
//   return (
//     <div className="stat-card">
//       <p className="stat-title">{title}</p>
//       <h2 className="stat-value">{value}</h2>
//     </div>
//   );
// }

// import "./Dashboard.css";
// export default function Dashboard() {
//   return (
//     <div className="dashboard">
//       <h1>Dashboard</h1>

//       {/* STATS */}
//       <div className="stats-grid">
//         <div className="stat-card blue">
//           <h3>Total Projects</h3>
//           <p>4</p>
//         </div>
//         <div className="stat-card green">
//           <h3>Total Tasks</h3>
//           <p>12</p>
//         </div>
//         <div className="stat-card purple">
//           <h3>Completed</h3>
//           <p>7</p>
//         </div>
//         <div className="stat-card orange">
//           <h3>Pending</h3>
//           <p>5</p>
//         </div>
//       </div>

//       {/* RECENT PROJECTS */}
//       <div className="section">
//         <h2>Recent Projects</h2>
//         <div className="card-list">
//           <div className="card">
//             <h4>Website Revamp</h4>
//             <span className="badge active">Active</span>
//           </div>
//           <div className="card">
//             <h4>Mobile App</h4>
//             <span className="badge completed">Completed</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import "./Dashboard.css";

// export default function Dashboard() {
//   const [projects, setProjects] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   const loadDashboard = async () => {
//     try {
//       // 1️⃣ Fetch projects
//       const projRes = await api.get("/projects");
//       const projectList = Array.isArray(projRes.data?.data)
//         ? projRes.data.data
//         : projRes.data?.data?.projects || [];

//       setProjects(projectList);

//       // 2️⃣ Fetch tasks (from all projects)
//       let allTasks = [];
//       for (const p of projectList) {
//         try {
//           const taskRes = await api.get(`/projects/${p.id}/tasks`);
//           const t = Array.isArray(taskRes.data?.data)
//             ? taskRes.data.data
//             : [];
//           allTasks = allTasks.concat(t);
//         } catch {}
//       }

//       setTasks(allTasks);
//     } catch (err) {
//       console.error("Dashboard load failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p>Loading dashboard...</p>;

//   const completedTasks = tasks.filter(t => t.status === "completed").length;
//   const pendingTasks = tasks.length - completedTasks;

//   return (
//     <div className="dashboard">
//       <h1>Dashboard</h1>

//       {/* STATS */}
//       <div className="stats-grid">
//         <div className="stat-card blue">
//           <h3>Total Projects</h3>
//           <p>{projects.length}</p>
//         </div>

//         <div className="stat-card green">
//           <h3>Total Tasks</h3>
//           <p>{tasks.length}</p>
//         </div>

//         <div className="stat-card purple">
//           <h3>Completed</h3>
//           <p>{completedTasks}</p>
//         </div>

//         <div className="stat-card orange">
//           <h3>Pending</h3>
//           <p>{pendingTasks}</p>
//         </div>
//       </div>

//       {/* RECENT PROJECTS */}
//       <div className="section">
//         <h2>Recent Projects</h2>

//         {projects.length === 0 ? (
//           <p>No projects yet</p>
//         ) : (
//           <div className="card-list">
//             {projects.slice(0, 5).map(project => (
//               <div key={project.id} className="card">
//                 <h4>{project.name}</h4>
//                 <span className={`badge ${project.status || "active"}`}>
//                   {project.status || "active"}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/projects");

      const projectList =
        res.data?.data?.projects && Array.isArray(res.data.data.projects)
          ? res.data.data.projects
          : [];

      setProjects(projectList);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card blue">
          <h3>Total Projects</h3>
          <p>{projects.length}</p>
        </div>
      </div>

      <div className="section">
        <h2>Projects</h2>

        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          <div className="card-list">
            {projects.map((p) => (
              <div key={p.id} className="card">
                <h4>{p.name}</h4>
                <span className="badge active">
                  {p.status || "active"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
