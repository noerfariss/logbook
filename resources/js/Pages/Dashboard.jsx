import Layout from '@/Layouts/Layout'
import {
    Card,
    CardContent
} from "@/components/ui/card"
import React, { useEffect, useState } from 'react'
import AlertComponent from '@/components/AlertComponent'
import PaginationComponent from '@/components/PaginationComponent'
import axios from 'axios'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useForm } from '@inertiajs/react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@headlessui/react'
import TextError from '@/components/TextError'
import { Input } from '@/components/ui/input'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import dayjs from 'dayjs'
import "dayjs/locale/id"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("id")

dayjs.tz.setDefault("Asia/Jakarta")


const Dashboard = ({ message }) => {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [datas, setDatas] = useState(null);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const minDate = dayjs().tz().startOf('month').toDate();
    const maxDate = dayjs().tz().toDate(); // hari ini
    const [dates, setDates] = React.useState({
        from: minDate,
        to: maxDate
    });


    const getData = async (page = 1) => {
        setLoading(true);
        try {
            const req = await axios.get(route('pengajuan.ajax', { page, search, dates }));
            const res = await req.data;
            setDatas(res);
            setLoading(false);
            return res;
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const handleDetail = (val) => {
        setSelected(val);
        setOpen(true);
    }

    const { data, setData, post, reset, errors, processing } = useForm({
        pengajuan_id: '',
        keterangan: '',
        status: 0,
    });

    const handleDialog = () => {
        setData("pengajuan_id", selected.idpengajuan);
        setOpenDialog(true);
    }

    const handleSubmit = async () => {
        post(route('pengajuan.updatelogs'), {
            // preserveScroll: true,
            // preserveState: true,
            onSuccess: async () => {
                setData('keterangan', '');
                setOpenDialog(false);

                // refresh data list
                const res = await getData(); // ⬅️ ini sekarang ada nilai

                if (selected && res?.data) {
                    const updated = res.data.find(
                        (item) => item.idpengajuan === selected.idpengajuan
                    );
                    setSelected(updated);
                }
            }
        });
    }

    return (
        <Layout pageTitle='Data Log Book'>
            <div className="mx-auto w-full">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    getData();
                }}>
                    <div className='mb-4 w-1/2 flex items-center gap-2'>
                        <DateRangePicker value={dates} onChange={setDates} minDate={minDate} maxDate={maxDate} />
                        <Input className='bg-white' placeholder='Cari No. pengajuan dan keterangan...' value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button type='submit'>GO</Button>
                    </div>
                </form>

                <Card>
                    {loading
                        ? <h4 className='mx-auto py-8 text-center'>Loading...</h4>
                        :
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Divisi</TableHead>
                                    <TableHead>Keterangan</TableHead>
                                    <TableHead>Klien</TableHead>
                                    <TableHead>UserInput</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    datas &&
                                    datas.data.map((val, key) => {
                                        return (
                                            <TableRow key={key} className='cursor-pointer' onClick={() => handleDetail(val)}>
                                                <TableCell>
                                                    <div className='text-gray-800 text-sm'>{val.time_input}</div>
                                                    <h3 className='font-semibold  mt-1'>{val.nopengajuan}</h3>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='text-xs bg-blue-300 rounded-sm inline px-1'>{val.divisi}</div>
                                                    <div>{val.subdivisi}</div>
                                                </TableCell>
                                                <TableCell className='w-[500px]'>
                                                    <p>{val.keterangan}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='font-semibold text-xs'>{val.klien}</div>
                                                    <div className='text-sm'>{val.klien_kota}</div>
                                                </TableCell>
                                                <TableCell>{val.user_input}</TableCell>
                                                <TableCell>
                                                    <div
                                                        className={`capitalize text-center rounded-sm text-sm
                                                                    ${val.status_pengajuan === 'done' ? 'bg-green-500 ' : ''}
                                                                    ${val.status_pengajuan === 'process' ? 'bg-blue-500 ' : ''}
                                                                    ${val.status_pengajuan === 'new' ? 'bg-red-500 ' : ''}`
                                                        }
                                                    >
                                                        {val.status_pengajuan}
                                                    </div>

                                                </TableCell>
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
                    <DrawerContent className="h-[80vh]">
                        <DrawerHeader className="text-left">
                            <DrawerTitle className='pl-8'>Detail Pengajuan</DrawerTitle>

                            <div className='grid grid-cols-2 px-8'>
                                {selected && (
                                    <div className="w-full overflow-y-scroll h-[340px] md:h-[70vh] mt-8 space-y-4">
                                        {/* No Pengajuan */}
                                        <div className="grid grid-cols-12 gap-4">
                                            <Label className="col-span-12 md:col-span-3 flex items-center">No Pengajuan</Label>
                                            <div className="col-span-12 md:col-span-9">
                                                {selected.nopengajuan}
                                            </div>
                                        </div>

                                        {/* Tanggal */}
                                        <div className="grid grid-cols-12 gap-4">
                                            <Label className="col-span-12 md:col-span-3 flex items-center">Tanggal</Label>
                                            <div className="col-span-12 md:col-span-9">
                                                {selected.time_input}
                                            </div>
                                        </div>

                                        {/* User Input */}
                                        <div className="grid grid-cols-12 gap-4">
                                            <Label className="col-span-12 md:col-span-3 flex items-center">User Input</Label>
                                            <div className="col-span-12 md:col-span-9">
                                                {selected.user_input}
                                            </div>
                                        </div>

                                        {/* Nominal */}
                                        <div className="grid grid-cols-12 gap-4">
                                            <Label className="col-span-12 md:col-span-3 flex items-center">Nominal</Label>
                                            <div className="col-span-12 md:col-span-9 font-semibold">
                                                Rp {selected.nominal.toLocaleString("id-ID")}
                                            </div>
                                        </div>

                                        {/* Keterangan */}
                                        <div className="grid grid-cols-12 gap-4">
                                            <Label className="col-span-12 md:col-span-3 flex items-center">Keterangan</Label>
                                            <div className="col-span-12 md:col-span-9">
                                                {selected.keterangan}
                                            </div>
                                        </div>

                                        {/* Subdivisi / Divisi */}
                                        <div className="grid grid-cols-12 gap-4">
                                            <Label className="col-span-12 md:col-span-3 flex items-center">Subdivisi</Label>
                                            <div className="col-span-12 md:col-span-9">
                                                {selected.subdivisi} / {selected.divisi}
                                            </div>
                                        </div>

                                        {/* Klien */}
                                        <div className="grid grid-cols-12 gap-4">
                                            <Label className="col-span-12 md:col-span-3 flex items-center">Klien</Label>
                                            <div className="col-span-12 md:col-span-9">
                                                <div className="font-medium">{selected.klien}</div>
                                                <div className="text-sm text-gray-500">{selected.klien_alias}</div>
                                                <div className="text-sm text-gray-500">{selected.klien_kota}</div>
                                            </div>
                                        </div>

                                        {/* Status Pengajuan */}
                                        <div className="grid grid-cols-12 gap-4">
                                            <Label className="col-span-12 md:col-span-3 flex items-center">Status</Label>
                                            <div className="col-span-12 md:col-span-9">
                                                <span
                                                    className={`px-3 rounded-sm text-sm capitalize
                                                            ${selected.status_pengajuan === "done"
                                                            ? "bg-green-500"
                                                            : selected.status_pengajuan === "process"
                                                                ? "bg-blue-500"
                                                                : "bg-red-500"
                                                        }`}
                                                >
                                                    {selected.status_pengajuan}
                                                </span>
                                            </div>
                                        </div>

                                        {selected.status_pengajuan !== 'done' &&
                                            <>
                                                <div className="grid grid-cols-12 gap-4">
                                                    <Label className="col-span-12 md:col-span-3 flex items-center"></Label>
                                                    <div className="col-span-12 md:col-span-9">
                                                        <Button className='w-3/4 mt-12' onClick={handleDialog}>Follow up</Button>
                                                    </div>
                                                </div>

                                                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Follow Up Pengajuan</DialogTitle>
                                                        </DialogHeader>

                                                        <div className="space-y-4">
                                                            <div className='font-semibold'>No. Pengajuan : {selected.nopengajuan}</div>

                                                            <Textarea
                                                                className={'w-full rounded-sm h-32'}
                                                                placeholder="Masukkan keterangan"
                                                                value={data.keterangan}
                                                                onChange={(e) => setData("keterangan", e.target.value)}
                                                            />
                                                            {(errors || errors.keterangan) && <TextError message={errors.keterangan} />}
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className='font-semibold'>Status</div>

                                                            <div className='flex items-center gap-4'>
                                                                <div className='flex items-center gap-1'>
                                                                    <input
                                                                        type='radio'
                                                                        name='status'
                                                                        id='followup'
                                                                        value={0}
                                                                        checked={data.status === 0}
                                                                        onChange={() => setData('status', 0)}
                                                                    />
                                                                    <label htmlFor='followup'>Follow Up</label>
                                                                </div>

                                                                <div className='flex items-center gap-1'>
                                                                    <input
                                                                        type='radio'
                                                                        name='status'
                                                                        id='done'
                                                                        value={1}
                                                                        checked={data.status === 1}
                                                                        onChange={() => setData('status', 1)}
                                                                    />
                                                                    <label htmlFor='done'>Done</label>
                                                                </div>
                                                            </div>

                                                            {errors.status && <TextError message={errors.status} />}
                                                        </div>

                                                        <DialogFooter>
                                                            <Button type="button" className='bg-green-600' onClick={handleSubmit}>
                                                                Proses
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </>

                                        }

                                    </div>
                                )}

                                <div className='w-full'>
                                    <h3 className='font-semibold text-lg'>Log Book</h3>

                                    {message && <AlertComponent title='Sukses' description={message} />}
                                    <div className='overflow-y-scroll h-[340px] md:h-[64vh] mt-8 space-y-4'>
                                        {
                                            selected && selected.logs.length > 0 ?
                                                selected.logs.map((val, i) => {
                                                    return (
                                                        <Card key={i}>
                                                            <CardContent className='p-4'>
                                                                <p>{val.keterangan}</p>
                                                                <h5 className='italic font-semibold text-gray-500 text-sm mt-2'>- {val.created_at} ({val.user.name})</h5>
                                                            </CardContent>
                                                        </Card>
                                                    )
                                                })
                                                : <div className='w-full p-4 text-center border border-gray-400 rounded-lg'>Belum ada follow up</div>
                                        }
                                    </div>

                                </div>
                            </div>
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

export default Dashboard
