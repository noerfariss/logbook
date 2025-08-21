import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Layout from '@/Layouts/Layout'
import { Link } from '@inertiajs/react'
import React from 'react'

const Kk = () => {
    return (
        <Layout pageTitle='Kartu Keluarga'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-center'>
                <Link href={route('submission.ktp.new')}>
                    <Card className='hover:bg-blue-200 min-h-32'>
                        <CardHeader className='pb-2'>
                            <CardTitle>Pengajuan Baru</CardTitle>
                        </CardHeader>
                        <CardContent className='mt-0 text-sm'>
                            Pengajuan Kartu Keluarga Baru
                        </CardContent>
                    </Card>
                </Link>
                <Link href={route('submission.ktp.recreate')}>
                    <Card className='hover:bg-blue-200 min-h-32'>
                        <CardHeader className='pb-2'>
                            <CardTitle>Perubahan Data</CardTitle>
                        </CardHeader>
                        <CardContent className='mt-0 text-sm'>
                            Penambahan atau pengurangan anggota keluarga
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </Layout>
    )
}

export default Kk
