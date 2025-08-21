import * as React from "react"
import {
    ChartPie,
    ScrollText,
    Settings2,
    UserRound,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Data",
            url: route('dashboard'),
            icon: ChartPie,
            items: []
        },
        {
            title: "Pengaturan",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "Pengaturan",
                    url: "#",
                },
                {
                    title: "Userweb",
                    url: "#",
                },
                {
                    title: "Role",
                    url: "#",
                },
                {
                    title: "Permission",
                    url: "#",
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
