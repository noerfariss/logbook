import Layout from '@/Layouts/Layout'
import { Card } from "@/components/ui/card"
import React, { useEffect, useState } from 'react'
import AlertComponent from '@/components/AlertComponent'
import axios from 'axios'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import ShortText from '@/components/ShortText'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import PaginationComponent from '@/components/PaginationComponent'

const Log = ({ user, message }) => {
    const [loading, setLoading] = useState(false);
    const [datas, setDatas] = useState(null);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    const getData = async (page = 1) => {
        setLoading(true);
        try {
            const req = await axios.get(route('log.ajax', { page }));
            const res = await req.data;
            setDatas(res);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, [])

    const handleDetail = (val) => {
        setSelected(val);
        setOpen(true);
    }

    return (
        <Layout pageTitle='log aktivitas'>
            <div className="mx-auto w-full">

                <Card>
                    {message && <AlertComponent title='Sukses' description={message} />}

                    {loading
                        ? <h4 className='mx-auto py-8 text-center'>Loading...</h4>
                        :
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Page</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Log</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    datas &&
                                    datas.data.map((val, key) => {
                                        return (
                                            <TableRow key={key} className='cursor-pointer' onClick={() => handleDetail(val)}>
                                                <TableCell className="font-medium">{val.id}</TableCell>
                                                <TableCell className="font-medium">{val.causer_id}</TableCell>
                                                <TableCell>{val.log_name}</TableCell>
                                                <TableCell>{val.description}</TableCell>
                                                <TableCell><ShortText text={JSON.stringify(val.properties)} /></TableCell>
                                                <TableCell>{val.created_string}</TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    }

                </Card>

                <PaginationComponent data={datas} onPageChange={(page) => getData(page)} />



                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent className='h-[80vh]'>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>Detail Log</DrawerTitle>
                            {selected &&
                                <div className='w-full overflow-y-scroll h-[340px] md:h-[80vh] mt-8'>
                                    <div className='grid gap-4 grid-cols-12 mb-4'>
                                        <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>ID</Label>
                                        <div className='col-span-12 md:col-span-9'>
                                            {selected.id}
                                        </div>
                                    </div>
                                    <div className='grid gap-4 grid-cols-12 mb-4'>
                                        <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Page</Label>
                                        <div className='col-span-12 md:col-span-9'>
                                            {selected.log_name}
                                        </div>
                                    </div>
                                    <div className='grid gap-4 grid-cols-12 mb-4'>
                                        <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Action</Label>
                                        <div className='col-span-12 md:col-span-9'>
                                            {selected.description}
                                        </div>
                                    </div>
                                    <div className='grid gap-4 grid-cols-12 mb-4'>
                                        <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Log</Label>
                                        <div className='col-span-12 md:col-span-9'>
                                            <pre>
                                                {JSON.stringify(selected.properties, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                    <div className='grid gap-4 grid-cols-12 mb-4'>
                                        <Label className='col-span-12 md:col-span-3 items-center flex -mb-3 md:mb-0'>Time</Label>
                                        <div className='col-span-12 md:col-span-9'>
                                            {selected.created_string}
                                        </div>
                                    </div>
                                </div>
                            }
                        </DrawerHeader>
                        <DrawerFooter className="pt-2">
                            <DrawerClose asChild>
                                <Button variant="outline">Tutup</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        </Layout>
    )
}

export default Log
