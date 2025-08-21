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
import React, { useState } from 'react'
import EditPhoto from './EditPhoto'
import AlertComponent from '@/components/AlertComponent'
import TextError from '@/components/TextError'
import { Checkbox } from '@/components/ui/checkbox'

const Password = ({ user, message }) => {
    const [isPassword, setIsPassword] = useState(true);

    const { post, data, setData, processing, errors, reset } = useForm({
        password_old: '',
        password: '',
        password_confirmation: '',
    });

    const handlePassword = (e) => {
        e.preventDefault();
        post(route('password.update'), {
            onSuccess: () => reset(),
        });
    }
    return (
        <Layout pageTitle='ganti password'>
            <div className="mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {message && <AlertComponent title='Sukses' description={message} />}
                        {errors[0] && <AlertComponent title="Error" description={errors[0]} variant="destructive" />}

                        <form onSubmit={handlePassword}>
                            <div className='w-full md:w-1/2'>
                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Password lama</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type={isPassword ? 'password' : 'text'} value={data.password_old} onChange={(e) => setData('password_old', e.target.value)} />
                                        {(errors || errors.password_old) && <TextError message={errors.password_old} />}
                                    </div>
                                </div>

                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Password baru</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type={isPassword ? 'password' : 'text'} value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                        {(errors || errors.password) && <TextError message={errors.password} />}
                                    </div>
                                </div>

                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Konfirmasi password</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type={isPassword ? 'password' : 'text'} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                                        {(errors || errors.password_confirmation) && <TextError message={errors.password_confirmation} />}
                                    </div>
                                </div>

                                <div className='grid gap-4 grid-cols-12 mb-6'>
                                    <div className='col-span-12 md:col-span-3'></div>
                                    <div className='col-span-12 md:col-span-9 flex items-center gap-2'>
                                        <Checkbox id="showpassword" onClick={() => setIsPassword(!isPassword)} />
                                        <Label htmlFor="showpassword">Tampilkan Password</Label>
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

export default Password
