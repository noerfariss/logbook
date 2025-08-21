import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Layout from '@/Layouts/Layout'
import { Link } from '@inertiajs/react'
import React from 'react'

const Ktp = () => {
    return (
        <Layout pageTitle='KTP'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-center'>
                <Link href={route('submission.ktp.new')}>
                    <Card className='hover:bg-blue-200 min-h-32'>
                        <CardHeader className='pb-2'>
                            <CardTitle>Pengajuan Baru</CardTitle>
                        </CardHeader>
                        <CardContent className='mt-0 text-sm'>
                            Pengajuan KTP yang sebelumnya belum pernah membuat
                        </CardContent>
                    </Card>
                </Link>
                <Link href={route('submission.ktp.recreate')}>
                    <Card className='hover:bg-blue-200 min-h-32'>
                        <CardHeader className='pb-2'>
                            <CardTitle>Perubahan Data</CardTitle>
                        </CardHeader>
                        <CardContent className='mt-0 text-sm'>
                            Pengajuan perubahan data pada KTP
                        </CardContent>
                    </Card>
                </Link>
                <Link href={route('submission.ktp.reprint')}>
                    <Card className='hover:bg-blue-200 min-h-32'>
                        <CardHeader className='pb-2'>
                            <CardTitle>Cetak Ulang</CardTitle>
                        </CardHeader>
                        <CardContent className='mt-0 text-sm'>
                            Jika KTP mengalami kerusakan / hilang
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </Layout>
    )
}

export default Ktp
