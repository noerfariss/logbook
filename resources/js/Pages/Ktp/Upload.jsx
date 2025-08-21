import AlertComponent from '@/components/AlertComponent'
import ButtonComponent from '@/components/ButtonComponent'
import DialogComponent from '@/components/DialogComponent'
import TextError from '@/components/TextError'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { router, useForm, usePage } from '@inertiajs/react'
import { Trash2Icon } from 'lucide-react'
import React from 'react'

const Upload = ({ user }) => {
    const { message } = usePage().props;
    const { post, data, setData, processing, progress, errors } = useForm({
        photo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.update.photo'));
    }

    const handleDelete = (e) => {
        e.preventDefault();
        router.delete(route('profile.delete.photo'));
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ganti foto</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='w-full md:w-1/2'>
                    <form onSubmit={handleSubmit} encType='multipart/form-data'>
                        <div className='grid gap-4 grid-cols-12'>
                            <div className='col-span-3'>
                                {
                                    <Avatar className="h-22 w-22 rounded-lg">
                                        <AvatarImage src={user.photourl} alt={user.name} className="object-cover w-full h-full" />
                                        <AvatarFallback className="rounded-lg">{user.name}</AvatarFallback>
                                    </Avatar>
                                }

                                {user.photo &&
                                    <DialogComponent
                                        title='Hapus foto profil?'
                                        description='Anda sudah yakin ingin menghapus foto profil?'
                                        handleSubmit={handleDelete}
                                    >
                                        <div className='flex gap-1 items-center justify-center mt-2 hover:text-red-700'>
                                            <Trash2Icon size={16} />
                                            Hapus
                                        </div>
                                    </DialogComponent>
                                }
                            </div>
                            <div className='col-span-9'>
                                {message && <AlertComponent title='Sukses' description={message} />}

                                <Label>Ganti Foto</Label>
                                <div className='mb-4'>
                                    <Input type="file" accept='image/*' onChange={(e) => setData('photo', e.target.files[0])} />
                                    {(errors || errors.photo) && <TextError message={errors.photo} />}
                                    {progress && <Progress value={progress.percentage} />}
                                </div>

                                <div className='w-full md:w-[100px]'>
                                    <ButtonComponent text='Simpan' isLoading={processing} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}

export default Upload
