import * as React from "react"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react";

export function TeamSwitcher() {
    const { isMobile } = useSidebar();
    const { logo, website } = usePage().props;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="py-12 bg-gray-100 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <div
                        className="flex ">
                        <img src={logo} />
                    </div>
                    <div className="grid flex-1 text-left text-sm">
                        <span className="font-semibold text-sm text-gray-900">
                            {website}
                        </span>
                    </div>

                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
