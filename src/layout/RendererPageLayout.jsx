import { Outlet } from "react-router-dom";
import RendererNavbar from "../components/RendererNavbar";
import RendererFooter from "../components/RendererFooter";

function RendererPageLayout() {
  return (
    <div className="bg-white min-h-screen flex flex-col ">
      <RendererNavbar />
      <main className="flex-grow overflow-hidden">
        <Outlet />
      </main>
      <div className="overflow-hidden">
        <RendererFooter />
      </div>
    </div>
  );
}

export default RendererPageLayout;
