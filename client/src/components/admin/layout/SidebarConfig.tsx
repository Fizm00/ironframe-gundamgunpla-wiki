import {
    Grid as GridIcon,
    Box as BoxCubeIcon,
    UserCircle as UserCircleIcon,
    PieChart as PieChartIcon,
    FileText as PageIcon,
    Settings as SettingsIcon,
} from "lucide-react";

export type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const mainNavItems: NavItem[] = [
    {
        icon: <GridIcon />,
        name: "Dashboard",
        path: "/admin/dashboard",
    },
    {
        icon: <BoxCubeIcon />,
        name: "Gunpla Database",
        subItems: [
            { name: "List Gunpla", path: "/admin/gunpla", pro: false },
            { name: "Add Gunpla", path: "/admin/gunpla/new", pro: false },
        ],
    },
    {
        icon: <BoxCubeIcon />,
        name: "Mobile Suits",
        subItems: [
            { name: "List Units", path: "/admin/mobile-suits", pro: false },
            { name: "Add Unit", path: "/admin/mobile-suits/new", pro: false },
        ],
    },
    {
        icon: <PageIcon />,
        name: "Lore Archives",
        subItems: [
            { name: "Timeline", path: "/admin/timeline", pro: false },
            { name: "Factions", path: "/admin/factions", pro: false },
            { name: "Pilots", path: "/admin/pilots", pro: false },
        ],
    },
    {
        icon: <UserCircleIcon />,
        name: "User Management",
        path: "/admin/users",
    },
];

export const otherNavItems: NavItem[] = [
    {
        icon: <PieChartIcon />,
        name: "Analytics",
        path: "/admin/analytics",
    },
    {
        name: "Settings",
        icon: <SettingsIcon />,
        path: "/admin/settings",
    },
];
