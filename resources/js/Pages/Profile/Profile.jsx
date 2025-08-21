import Layout from '@/Layouts/Layout'
import ButtonComponent from '@/components/ButtonComponent'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@inertiajs/react'
import React from 'react'
import EditPhoto from './EditPhoto'
import AlertComponent from '@/components/AlertComponent'
import TextError from '@/components/TextError'

const Profile = ({ user, message }) => {
    const { post, data, setData, processing, errors } = useForm({
        username: user.username,
        name: user.name,
        email: user.email
    });

    const handleProfile = (e) => {
        e.preventDefault();
        post(route('profile.update'));
    }
    return (
        <Layout pageTitle='edit profil'>
            <div className="mx-auto w-full">
                <EditPhoto user={user} />
            </div>

            <div className="mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {message && <AlertComponent title='Sukses' description={message} />}

                        <form onSubmit={handleProfile}>
                            <div className='w-full md:w-1/2'>
                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Username</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type="text" value={data.username} onChange={(e) => setData('username', e.target.value)} disabled />
                                    </div>
                                </div>

                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Nama</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                        {(errors || errors.name) && <TextError message={errors.name} />}
                                    </div>
                                </div>

                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Email</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type="text" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                        {(errors || errors.email) && <TextError message={errors.email} />}
                                    </div>
                                </div>

                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex'></Label>
                                    <div className='col-span-12 md:col-span-9 md:w-[100px]'>
                                        <ButtonComponent text='Simpan' isLoading={processing} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
}

export default Profile
