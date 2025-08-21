
import {
    ChevronsUpDown,
    CircleUserRound,
    FileLock,
    LockKeyhole,
    LogOutIcon,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

import { router, usePage } from "@inertiajs/react"
import DialogComponent from "./DialogComponent"

export function NavUser() {
    const { isMobile } = useSidebar();
    const { user } = usePage().props;

    const handleLogout = (e) => {
        e.preventDefault();
        router.get(route('logout'));
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.photourl} alt={user.name} className="object-cover w-full h-full" />
                                <AvatarFallback className="rounded-lg">{user.name}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold capitalize">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "bottom"}
                        align="end"
                        sideOffset={4}>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => router.get(route('profile'))}>
                                <CircleUserRound />
                                Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.get(route('password'))}>
                                <LockKeyhole />
                                Ganti Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.get(route('log'))}>
                                <FileLock />
                                Log Aktivitas
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DialogComponent
                            title='Logout'
                            description='Anda yakin ingin logout?'
                            handleSubmit={handleLogout}
                        >
                            <div className='flex gap-1 items-center justify-center mt-2 hover:text-red-700'>
                                <LogOutIcon size={16} />
                                Logout
                            </div>
                        </DialogComponent>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
