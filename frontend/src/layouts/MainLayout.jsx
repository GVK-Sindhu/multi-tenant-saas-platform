import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main style={{ padding: "30px", background: "#f5f7fb", minHeight: "100vh" }}>
        <Outlet />
      </main>
    </>
  );
}
