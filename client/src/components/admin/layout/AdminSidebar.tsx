
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HorizontaLDots, ChevronDownIcon } from "@/icons";
import { useSidebar } from "@/context/SidebarContext";
import { type NavItem, mainNavItems, otherNavItems } from "./SidebarConfig";

export function AdminSidebar() {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
    const location = useLocation();

    const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback((path?: string) => (path ? location.pathname.startsWith(path) : false), [location.pathname]);

    useEffect(() => {
        let matched = false;
        const checkMenu = (items: NavItem[], type: "main" | "others") => {
            items.forEach((nav, index) => {
                if (nav.subItems?.some(sub => isActive(sub.path))) {
                    setOpenSubmenu({ type, index });
                    matched = true;
                }
            });
        };

        checkMenu(mainNavItems, "main");
        if (!matched) checkMenu(otherNavItems, "others");
        if (!matched && !location.pathname.startsWith("/admin")) setOpenSubmenu(null);
    }, [location.pathname, isActive]);

    useEffect(() => {
        if (openSubmenu) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            const el = subMenuRefs.current[key];
            if (el) {
                setSubMenuHeight(prev => ({ ...prev, [key]: el.scrollHeight }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
        setOpenSubmenu(prev =>
            prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index }
        );
    };

    const isSidebarOpen = isExpanded || isHovered || isMobileOpen;

    const renderMenuItem = (nav: NavItem, index: number, menuType: "main" | "others") => {
        const isMenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        const isItemActive = nav.path && isActive(nav.path);

        return (
            <li key={nav.name}>
                {nav.subItems ? (
                    <button
                        onClick={() => handleSubmenuToggle(index, menuType)}
                        className={`menu-item group cursor-pointer ${isMenuOpen ? "menu-item-active" : "menu-item-inactive"} ${!isSidebarOpen ? "lg:justify-center" : "lg:justify-start"}`}
                    >
                        <span className={`menu-item-icon-size ${isMenuOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                            {nav.icon}
                        </span>
                        {isSidebarOpen && <span className="menu-item-text">{nav.name}</span>}
                        {isSidebarOpen && (
                            <span className={`ml-auto w-5 h-5 transition-transform duration-200 flex items-center justify-center ${isMenuOpen ? "rotate-180 text-brand-500" : ""}`}>
                                <ChevronDownIcon />
                            </span>
                        )}
                    </button>
                ) : (
                    <Link
                        to={nav.path!}
                        onClick={() => isMobileOpen && toggleMobileSidebar()}
                        className={`menu-item group ${isItemActive ? "menu-item-active" : "menu-item-inactive"} ${!isSidebarOpen ? "lg:justify-center" : "lg:justify-start"}`}
                    >
                        <span className={`menu-item-icon-size ${isItemActive ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                            {nav.icon}
                        </span>
                        {isSidebarOpen && <span className="menu-item-text">{nav.name}</span>}
                    </Link>
                )}

                {nav.subItems && isSidebarOpen && (
                    <div
                        ref={(el) => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
                        className="overflow-hidden transition-all duration-300"
                        style={{ height: isMenuOpen ? `${subMenuHeight[`${menuType}-${index}`]}px` : "0px" }}
                    >
                        <ul className="mt-2 space-y-1 ml-9">
                            {nav.subItems.map((subItem) => (
                                <li key={subItem.name}>
                                    <Link
                                        to={subItem.path}
                                        onClick={() => isMobileOpen && toggleMobileSidebar()}
                                        className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                                    >
                                        {subItem.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </li>
        );
    };

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-999999 border-r border-gray-200 
            ${isSidebarOpen ? "w-[290px]" : "w-[90px]"}
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`py-8 flex ${!isSidebarOpen ? "lg:justify-center" : "justify-start"}`}>
                <Link to="/admin/dashboard" className="flex items-center gap-2 px-2">
                    {isSidebarOpen ? (
                        <>
                            <img src="/GundamLogo.png" alt="Ironframe Logo" className="w-8 h-auto shrink-0 object-contain" />
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight whitespace-nowrap">IRONFRAME</h1>
                        </>
                    ) : (
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center">IF</h1>
                    )}
                </Link>
            </div>

            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6 flex flex-col gap-4">
                    <div>
                        <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isSidebarOpen ? "lg:justify-center" : "justify-start"}`}>
                            {isSidebarOpen ? "Menu" : <span className="size-6 block"><HorizontaLDots /></span>}
                        </h2>
                        <ul className="flex flex-col gap-4">
                            {mainNavItems.map((nav, index) => renderMenuItem(nav, index, "main"))}
                        </ul>
                    </div>

                    <div>
                        <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isSidebarOpen ? "lg:justify-center" : "justify-start"}`}>
                            {isSidebarOpen ? "Others" : <span className="size-6 block"><HorizontaLDots /></span>}
                        </h2>
                        <ul className="flex flex-col gap-4">
                            {otherNavItems.map((nav, index) => renderMenuItem(nav, index, "others"))}
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>
    );
}
