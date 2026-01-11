
import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { AdminSidebar } from "./layout/AdminSidebar";
import { AdminHeader } from "./layout/AdminHeader";

function LayoutContent() {
    const { isExpanded, isHovered, isMobileOpen, toggleMobileSidebar } = useSidebar();

    return (
        <div className="min-h-screen xl:flex bg-gray-50 dark:bg-gray-900 font-outfit overflow-x-hidden">
            <div>
                <AdminSidebar />
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
                        onClick={toggleMobileSidebar}
                    />
                )}
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                    } ${isMobileOpen ? "ml-0" : ""}`}
            >
                <AdminHeader />
                <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export function AdminLayout() {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
}
