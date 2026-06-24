import Sidebar from "../dashboard/Sidebar";
import Topbar from "../dashboard/Topbar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Topbar />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
