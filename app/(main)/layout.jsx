import SidebarNav from "./_components/sidebar-nav";
import PageTitle from "./_components/page-title";

export default function AppLayout({ children }) {
  return (
    <>
      <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-indigo-50 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <SidebarNav />

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 pb-20 md:pb-8">
            <PageTitle />
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
