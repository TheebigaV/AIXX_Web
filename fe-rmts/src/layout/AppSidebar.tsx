"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
    BoxCubeIcon,
    ChevronDownIcon,
    GridIcon,
    HorizontaLDots,
    TaskIcon,
    FolderIcon,
    PaperPlaneIcon,
    UserCircleIcon,
    RoleAndPermissionIcom,
} from "../icons/index";

import Can from "@/components/permissions/Can";
import CanAny from "@/components/permissions/CanAny";
import CanAll from "@/components/permissions/CanAll";

type SubItem = {
    name: string;
    path: string;
    permission?: string;
};

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: SubItem[];
    permission?: string; // single permission
    anyPermissions?: string[]; // any permission
    allPermissions?: string[]; // all permissions
    skipPermissionCheck?: boolean; // if true, skip permission check
};

// Main Menu
const navItems: NavItem[] = [
    {
        icon: <GridIcon />,
        name: "Dashboard",
        path: "/admin",
        permission: "dashboard-view",
        skipPermissionCheck: true,
    },
    {
        icon: <TaskIcon />,
        name: "Training",
        path: "/admin/training",
        permission: "training-view",
        skipPermissionCheck: true,
    },
    {
        icon: <BoxCubeIcon />,
        name: "Services",
        path: "/admin/categories",
        permission: "categories-view",
        skipPermissionCheck: false,
    },

];

const othersItems: NavItem[] = [
    {
        icon: <FolderIcon />,
        name: "General Settings",
        path: "/admin/settings",
        permission: "settings-view",
        skipPermissionCheck: false,
    },
    {
        icon: <UserCircleIcon />,
        name: "Users",
        path: "/admin/users",
        permission: "users-view",
        skipPermissionCheck: false,

    },
    {
        icon: <RoleAndPermissionIcom />,
        name: "Roles",
        path: "/admin/roles",
        permission: "roles-view",
        skipPermissionCheck: false,
    },
];

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState<{ index: number; category: string } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback(
        (path: string) => path === pathname,
        [pathname]
    );

    const handleSubmenuToggle = (index: number, category: string) => {
        setOpenSubmenu((prev) =>
            prev && prev.index === index && prev.category === category ? null : { index, category }
        );
    };

    // Keep submenu open when matching path
    useEffect(() => {
        // Check navItems
        navItems.forEach((nav, index) => {
            nav.subItems?.forEach((subItem) => {
                if (isActive(subItem.path)) {
                    setOpenSubmenu({ index, category: 'main' });
                }
            });
        });

        // Check othersItems
        othersItems.forEach((nav, index) => {
            nav.subItems?.forEach((subItem) => {
                if (isActive(subItem.path)) {
                    setOpenSubmenu({ index, category: 'others' });
                }
            });
        });
    }, [pathname, isActive]);

    useEffect(() => {
        if (openSubmenu) {
            const key = `submenu-${openSubmenu.category}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prev) => ({
                    ...prev,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);


    const renderMenuItems = (items: NavItem[], category: string) => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => {
                const content = (
                    <>
                        {nav.subItems ? (
                            <>
                                {/* Submenu button */}
                                <button
                                    onClick={() => handleSubmenuToggle(index, category)}
                                    className={`menu-item group ${openSubmenu?.index === index && openSubmenu?.category === category
                                        ? "menu-item-active"
                                        : "menu-item-inactive"
                                        } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                                >
                                    <span>{nav.icon}</span>
                                    {(isExpanded || isHovered || isMobileOpen) && <span>{nav.name}</span>}
                                    {(isExpanded || isHovered || isMobileOpen) && (
                                        <ChevronDownIcon
                                            className={`ml-auto w-5 h-5 transition-transform ${openSubmenu?.index === index && openSubmenu?.category === category ? "rotate-180" : ""
                                                }`}
                                        />
                                    )}
                                </button>

                                {/* Submenu list */}
                                <div
                                    ref={(el) => { subMenuRefs.current[`submenu-${category}-${index}`] = el; }}
                                    className="overflow-hidden transition-all"
                                    style={{
                                        height:
                                            openSubmenu?.index === index && openSubmenu?.category === category
                                                ? `${subMenuHeight[`submenu-${category}-${index}`]}px`
                                                : "0px",
                                    }}
                                >
                                    <ul className="ml-9 mt-2 space-y-1">
                                        {nav.subItems.map((sub) => (
                                            <li key={sub.name}>
                                                {sub.permission ? (
                                                    <Can permission={sub.permission}>
                                                        <Link
                                                            href={sub.path}
                                                            className={`menu-dropdown-item ${isActive(sub.path) ? "active" : ""}`}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    </Can>
                                                ) : (
                                                    <Link
                                                        href={sub.path}
                                                        className={`menu-dropdown-item ${isActive(sub.path) ? "active" : ""}`}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : nav.path ? (
                            <Link
                                href={nav.path}
                                className={`menu-item ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"} ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                                    }`}
                            >
                                <span>{nav.icon}</span>
                                {(isExpanded || isHovered || isMobileOpen) && <span>{nav.name}</span>}
                            </Link>
                        ) : null}
                    </>
                );

                // if (nav.permission) return <Can key={nav.name} permission={nav.permission}>{content}</Can>;
                // if (nav.anyPermissions) return <CanAny key={nav.name} permissions={nav.anyPermissions}>{content}</CanAny>;
                // if (nav.allPermissions) return <CanAll key={nav.name} permissions={nav.allPermissions}>{content}</CanAll>;
                // return <li key={`${category}-${nav.name}-${index}`}>{content}</li>;


                // Wrap with permission component if needed
                if (!nav.skipPermissionCheck) {
                    if (nav.permission) return <Can key={nav.name} permission={nav.permission}>{content}</Can>;
                    if (nav.anyPermissions) return <CanAny key={nav.name} permissions={nav.anyPermissions}>{content}</CanAny>;
                    if (nav.allPermissions) return <CanAll key={nav.name} permissions={nav.allPermissions}>{content}</CanAll>;
                }

                return <li key={`${category}-${nav.name}-${index}`}>{content}</li>;

            })}
        </ul>
    );

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo */}
            <div className="py-8 flex justify-center">
                <Link href="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <Image
                            src="/images/logo/logo.png"
                            alt="Logo"
                            width={150}
                            height={40}
                            priority
                        />
                    ) : (
                        <Image
                            src="/images/logo/logo.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            priority
                        />
                    )}
                </Link>
            </div>

            {/* Menu (Scrollable) */}
            <nav className="overflow-y-auto px-4 h-[calc(100vh-100px)] pb-6 custom-scrollbar">
                {/* Main Menu */}
                {navItems.length > 0 && (
                    <>
                        <h2 className="mb-4 text-xs uppercase text-gray-400">
                            {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
                        </h2>
                        {renderMenuItems(navItems, 'main')}
                    </>
                )}

                {/* Others Menu */}
                {othersItems.length > 0 && (
                    <>
                        <h2 className="mb-4 mt-8 text-xs uppercase text-gray-400">
                            {isExpanded || isHovered || isMobileOpen ? "Settings" : <HorizontaLDots />}
                        </h2>
                        {renderMenuItems(othersItems, 'others')}
                    </>
                )}
            </nav>
        </aside>
    );
};

export default AppSidebar;