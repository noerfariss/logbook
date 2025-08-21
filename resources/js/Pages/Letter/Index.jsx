import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Layout from '@/Layouts/Layout'
import { Link } from '@inertiajs/react'
import React from 'react'

const Index = () => {
    return (
        <Layout pageTitle='Surat Keterangan'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-center'>
                <Link href={route('submission.ktp.new')}>
                    <Card className='hover:bg-blue-200 min-h-32'>
                        <CardHeader className='pb-2'>
                            <CardTitle>SK Kelahiran</CardTitle>
                        </CardHeader>
                        <CardContent className='mt-0 text-sm'>
                            Pengajuan surat keterangan kematian
                        </CardContent>
                    </Card>
                </Link>
                <Link href={route('submission.ktp.recreate')}>
                    <Card className='hover:bg-blue-200 min-h-32'>
                        <CardHeader className='pb-2'>
                            <CardTitle>SK Kematian</CardTitle>
                        </CardHeader>
                        <CardContent className='mt-0 text-sm'>
                            Pengajuan surat keterangan kelahiran
                        </CardContent>
                    </Card>
                </Link>
                <Link href={route('submission.ktp.reprint')}>
                    <Card className='hover:bg-blue-200 min-h-32'>
                        <CardHeader className='pb-2'>
                            <CardTitle>SK Domisili</CardTitle>
                        </CardHeader>
                        <CardContent className='mt-0 text-sm'>
                            Pengajuan surat keterangan domisili
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </Layout>
    )
}

export default Index
