import AlertComponent from '@/components/AlertComponent'
import ButtonComponent from '@/components/ButtonComponent'
import { SelectComponent } from '@/components/SelectComponent'
import TextError from '@/components/TextError'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Layout from '@/Layouts/Layout'
import { Link, useForm } from '@inertiajs/react'
import React from 'react'

const Create = ({ user, message }) => {
    console.log(user);

    const { post, data, setData, processing, errors, reset } = useForm({
        name: '',
        gender: '',
        religion: '',
        work: '',
        married: '',
        address: '',
        district: '',
        village: ''
    });

    const handlePassword = (e) => {
        e.preventDefault();
        console.log(data);

        // post(route('password.update'), {
        //     onSuccess: () => reset(),
        // });
    }
    return (
        <Layout pageTitle='Pengajuan Baru'>
            <div className="mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Pemohon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {message && <AlertComponent title='Sukses' description={message} />}
                        {errors[0] && <AlertComponent title="Error" description={errors[0]} variant="destructive" />}

                        <div className='w-full md:w-1/2'>
                            <div className='grid gap-4 grid-cols-12 mb-4'>
                                <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Email</Label>
                                <div className='col-span-12 md:col-span-9'>
                                    <h4>{user.email}</h4>
                                </div>
                            </div>
                            <div className='grid gap-4 grid-cols-12 mb-4'>
                                <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Nama</Label>
                                <div className='col-span-12 md:col-span-9'>
                                    <h4>{user.name}</h4>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardHeader>
                        <CardTitle>Data Pemohon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePassword}>
                            <div className='w-full md:w-1/2'>
                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Nama</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type={'text'} />
                                        {(errors || errors.password_old) && <TextError message={errors.password_old} />}
                                    </div>
                                </div>
                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Jenis Kelamin</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type={'text'} />
                                        {(errors || errors.password_old) && <TextError message={errors.password_old} />}
                                    </div>
                                </div>
                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Agama</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type={'text'} />
                                        {(errors || errors.password_old) && <TextError message={errors.password_old} />}
                                    </div>
                                </div>
                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Pekerjaan</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type={'text'} />
                                        {(errors || errors.password_old) && <TextError message={errors.password_old} />}
                                    </div>
                                </div>
                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Status Perkawinan</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type={'text'} />
                                        {(errors || errors.password_old) && <TextError message={errors.password_old} />}
                                    </div>
                                </div>
                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Alamat</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <Input type={'text'} />
                                        {(errors || errors.password_old) && <TextError message={errors.password_old} />}
                                    </div>
                                </div>
                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Kecamatan</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <SelectComponent
                                            value={data.district}
                                            onChange={(e) => setData('district', e)}
                                            route={route('drop-district')}
                                        />
                                        {(errors || errors.password_old) && <TextError message={errors.password_old} />}
                                    </div>
                                </div>
                                <div className='grid gap-4 grid-cols-12 mb-4'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Kelurahan</Label>
                                    <div className='col-span-12 md:col-span-9'>
                                        <SelectComponent
                                            value={data.village}
                                            onChange={(e) => setData('village', e)}
                                            route={route('drop-village')}
                                            parentRequired={!data.district ? true : false}
                                            parent={data.district}
                                        />
                                        {(errors || errors.password_old) && <TextError message={errors.password_old} />}
                                    </div>
                                </div>

                                <div className='grid gap-4 grid-cols-12 mb-4 mt-16'>
                                    <Label className='col-span-12 md:col-span-3 items-center flex'></Label>
                                    <div className='col-span-12 md:col-span-9 md:w-[100px] flex flex-row items-center gap-4'>
                                        <ButtonComponent text='Simpan' isLoading={processing} />
                                        <Link href={route('submission.ktp.index')}>
                                            Kembali
                                        </Link>
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

export default Create
