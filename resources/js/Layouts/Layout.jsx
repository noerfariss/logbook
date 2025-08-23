import { AppSidebar } from "@/components/app-sidebar"
import { NavUser } from "@/components/nav-user"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link, usePage } from "@inertiajs/react"
import dayjs from "dayjs"
import 'dayjs/locale/id' // <- import locale Indonesia
import { ToastContainer } from "react-toastify"
dayjs.locale('id') // <- set locale global ke Indonesia

export default function Layout({ children, pageTitle = 'Kuaat' }) {
    const { logo } = usePage().props;

    return (
        <SidebarProvider>
            {/* <AppSidebar /> */}
            <SidebarInset>
                <header className="flex px-6 h-16 border-b-2 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                            <Link href={route('dashboard')}>
                                <div className="flex items-center gap-4">
                                    <img src={logo} width={100} />
                                    <h4 className="font-bold text-lg hidden md:block">Log Book</h4>
                                </div>
                            </Link>
                            {/* <SidebarTrigger className="-ml-1" /> */}
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4 hidden md:block"
                            />
                            <Breadcrumb className='hidden md:block'>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{dayjs().format('dddd, DD MMMM YYYY')}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div>
                            <NavUser />
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-0 mt-4 w-full">
                    <div className=''>
                        <h2 className='font-normal text-xl capitalize'>{pageTitle}</h2>
                    </div>
                    {children}
                </div>

            </SidebarInset>
            <ToastContainer />
        </SidebarProvider>
    )
}
