// import Layout from "../components/Layout";

// export default function Users() {
//   return (
//     <Layout>
//       <h1>Users</h1>

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
//             <th>Email</th>
//             <th>Role</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>Demo Admin</td>
//             <td>admin@demo.com</td>
//             <td>Tenant Admin</td>
//           </tr>
//         </tbody>
//       </table>
//     </Layout>
//   );
// }
import "./Users.css";

export default function Users() {
  return (
    <div className="users-page">
      <div className="users-header">
        <h1>Users</h1>
        <button className="btn-primary">+ Add User</button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Demo Admin</td>
            <td>admin@demo.com</td>
            <td><span className="badge admin">Admin</span></td>
            <td><span className="badge active">Active</span></td>
          </tr>
          <tr>
            <td>Test User</td>
            <td>user@demo.com</td>
            <td><span className="badge user">User</span></td>
            <td><span className="badge active">Active</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

