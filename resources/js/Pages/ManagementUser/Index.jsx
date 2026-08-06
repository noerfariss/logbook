import React from 'react'
import Layout from '@/Layouts/Layout'
import { usePage } from '@inertiajs/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AlertComponent from '@/components/AlertComponent'
import UsersTab from './UsersTab'
import RoleTab from './RoleTab'
import PermissionTab from './PermissionTab'

const Index = () => {
    const { permissions = [], message } = usePage().props;

    const tabs = [
        { key: 'users', label: 'Users', can: permissions.includes('user-read'), component: <UsersTab /> },
        { key: 'role', label: 'Role', can: permissions.includes('role-read'), component: <RoleTab /> },
        { key: 'permission', label: 'Permission', can: permissions.includes('permission-read'), component: <PermissionTab /> },
    ].filter((tab) => tab.can);

    return (
        <Layout pageTitle="management user">
            <div className="mx-auto w-full">
                {message && <AlertComponent title="Sukses" description={message} />}

                {tabs.length === 0
                    ? <div className="text-center py-8 text-gray-500">Anda tidak memiliki akses ke halaman ini.</div>
                    : <Tabs defaultValue={tabs[0].key}>
                        <TabsList>
                            {tabs.map((tab) => (
                                <TabsTrigger key={tab.key} value={tab.key}>{tab.label}</TabsTrigger>
                            ))}
                        </TabsList>
                        {tabs.map((tab) => (
                            <TabsContent key={tab.key} value={tab.key}>
                                {tab.component}
                            </TabsContent>
                        ))}
                    </Tabs>
                }
            </div>
        </Layout>
    )
}

export default Index
