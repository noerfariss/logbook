import Layout from '@/Layouts/Layout'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import PaginationComponent from '@/components/PaginationComponent'
import ButtonComponent from '@/components/ButtonComponent'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
dayjs.locale('id')

const JENIS_KERJA_LABEL = {
    survei: 'Survei',
    implementasi: 'Implementasi',
    survei_implementasi: 'Survei + Implementasi',
}

const defaultJenisKerja = (row) => {
    if (row.has_survei && row.has_implementasi) return 'survei_implementasi'
    if (row.has_survei) return 'survei'
    return 'implementasi'
}

// Combobox pencarian server-side (dataset toko/vendor terlalu besar untuk dimuat sekaligus).
// Sengaja tidak pakai Radix Popover: portal-nya ke document.body bentrok dengan portal
// Vaul Drawer (dua top-level dialog saling menganggap yang lain "di bawah"), sehingga klik
// pada item kedua dst di dalam drawer tidak pernah sampai ke elemennya. Dropdown polos yang
// mengikuti alur DOM form menghindari masalah itu sama sekali.
const AsyncSelect = ({ placeholder = 'Cari data...', label, value, onChange, optionsRoute }) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const wrapperRef = useRef(null)

    useEffect(() => {
        if (!open) return
        setLoading(true)
        const timeout = setTimeout(async () => {
            try {
                const req = await axios.get(optionsRoute, { params: { search } })
                setOptions(req.data.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }, 300)
        return () => clearTimeout(timeout)
    }, [search, open])

    useEffect(() => {
        if (!open) return
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open])

    return (
        <div className="relative" ref={wrapperRef}>
            <Button
                type="button"
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal"
                onClick={() => setOpen((o) => !o)}
            >
                <span className="truncate">{label || placeholder}</span>
                <ChevronsUpDown className="opacity-50 shrink-0" />
            </Button>
            {open && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                    <Command shouldFilter={false}>
                        <CommandInput placeholder={placeholder} onValueChange={setSearch} autoFocus />
                        <CommandList>
                            {loading && <div className="p-3 text-sm text-center text-gray-400">Mencari...</div>}
                            {!loading && options.length === 0 && <div className="p-3 text-sm text-center text-gray-400">Tidak ada hasil</div>}
                            {!loading && options.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={String(item.id)}
                                    onSelect={() => { onChange(item); setOpen(false); setSearch('') }}
                                >
                                    <span className="truncate">{item.label}</span>
                                    <CheckIcon className={cn('ml-auto h-4 w-4', value === item.id ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </div>
            )}
        </div>
    )
}

const emptyForm = {
    pengajuan_id: null,
    po_msb: '',
    toko_id: null,
    toko_label: '',
    toko_manual: '',
    jenis_kerja: 'implementasi',
    suggest_vendor_id: null,
    suggest_vendor_label: '',
    vendor_id: null,
    vendor_label: '',
    tanggal_vendor: '',
    dp: '',
    biaya_lain: '',
    biaya_fee: '',
    kelengkapan_dokumen: false,
    tgl_tf: '',
    done: false,
}

const VendorList = () => {
    const today = new Date();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [dates, setDates] = useState({
        from: dayjs().startOf('month').format('YYYY-MM-DD'),
        to: dayjs(today).format('YYYY-MM-DD')
    });
    const [doneFilter, setDoneFilter] = useState('');
    const [datas, setDatas] = useState(null);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm(emptyForm);

    const getData = async (page = 1) => {
        setLoading(true);
        try {
            const req = await axios.get(route('vendor-list.ajax'), { params: { page, search, dates, doneFilter } });
            setDatas(req.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, [dates, doneFilter]);

    const handleDetail = (row) => {
        setSelected(row);
        setData({
            pengajuan_id: row.idpengajuan,
            po_msb: row.po_msb || '',
            toko_id: row.toko_id,
            toko_label: row.toko_name || '',
            toko_manual: row.toko_manual || '',
            jenis_kerja: row.jenis_kerja || defaultJenisKerja(row),
            suggest_vendor_id: row.suggest_vendor_id,
            suggest_vendor_label: row.suggest_vendor_name || '',
            vendor_id: row.vendor_id,
            vendor_label: row.vendor_name || '',
            tanggal_vendor: row.tanggal_vendor || '',
            dp: row.dp ?? '',
            biaya_lain: row.biaya_lain ?? '',
            biaya_fee: row.biaya_fee ?? '',
            kelengkapan_dokumen: !!row.kelengkapan_dokumen,
            tgl_tf: row.tgl_tf || '',
            done: !!row.done,
        });
        setOpen(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('vendor-list.update'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Data berhasil disimpan');
                setOpen(false);
                getData(datas?.current_page ?? 1);
            },
            onError: () => toast.error('Terjadi kesalahan, periksa kembali form'),
        });
    }

    return (
        <Layout pageTitle='Vendor Survey + Implementasi'>
            <div className="mx-auto w-full">
                <form onSubmit={(e) => { e.preventDefault(); getData(); }}>
                    <div className='mb-4 w-full flex items-start gap-2 flex-col md:flex-row md:items-center'>
                        <DateRangePicker onChange={(val) => setDates({
                            from: val.from,
                            to: val.to
                        })} />
                        <div className='flex gap-2 w-full md:w-auto'>
                            <Input className='bg-white flex-1 md:w-[300px]' placeholder='Cari No. pengajuan dan keterangan...' value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button type='submit'>GO</Button>
                        </div>
                        <div className='flex items-center gap-4'>
                            <label className='flex items-center gap-1 text-sm'>
                                <input type="radio" name="doneFilter" checked={doneFilter === ''} onChange={() => setDoneFilter('')} />
                                Semua
                            </label>
                            <label className='flex items-center gap-1 text-sm'>
                                <input type="radio" name="doneFilter" checked={doneFilter === 'pending'} onChange={() => setDoneFilter('pending')} />
                                Belum Done
                            </label>
                            <label className='flex items-center gap-1 text-sm'>
                                <input type="radio" name="doneFilter" checked={doneFilter === 'done'} onChange={() => setDoneFilter('done')} />
                                Done
                            </label>
                        </div>
                    </div>
                </form>

                <Card>
                    {loading
                        ? <h4 className='mx-auto py-8 text-center'>Loading...</h4>
                        : <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead className='hidden md:table-cell'>Area</TableHead>
                                    <TableHead className='hidden md:table-cell'>Toko</TableHead>
                                    <TableHead>Sur/S+I/Im</TableHead>
                                    <TableHead className='hidden md:table-cell'>Vendor</TableHead>
                                    <TableHead>Done</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {datas && datas.data.map((row) => {
                                    const jenisKerja = row.jenis_kerja || defaultJenisKerja(row);
                                    return (
                                        <TableRow key={row.idpengajuan} className='cursor-pointer' onClick={() => handleDetail(row)}>
                                            <TableCell>
                                                <div className='text-gray-800 text-sm'>{row.tanggal}</div>
                                                <h3 className='font-semibold mt-1'>{row.nopengajuan}</h3>
                                            </TableCell>
                                            <TableCell className='max-w-[320px]'>
                                                <p className='truncate'>{row.keterangan}</p>
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell'>{row.area || '-'}</TableCell>
                                            <TableCell className='hidden md:table-cell'>{row.toko_name || row.toko_manual || '-'}</TableCell>
                                            <TableCell>
                                                <span className='text-xs bg-blue-300 rounded-sm inline px-1'>{JENIS_KERJA_LABEL[jenisKerja]}</span>
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell'>{row.vendor_name || '-'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 rounded-sm text-xs ${row.done ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {row.done ? 'Done' : 'Belum'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {datas && datas.data.length === 0 && (
                                    <TableRow><TableCell colSpan={7} className='h-24 text-center'>Tidak ada data pada rentang tanggal ini</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    }
                </Card>

                <PaginationComponent data={datas} onPageChange={(page) => getData(page)} />

                <Drawer open={open} onOpenChange={setOpen} modal={false}>
                    <DrawerContent className="h-full md:h-[95vh]">
                        <DrawerHeader className="text-left">
                            <DrawerTitle className='pl-0 md:pl-8'>Detail Vendor Survey / Implementasi</DrawerTitle>

                            {selected && (
                                <form onSubmit={handleSubmit} className="px-0 md:px-8 overflow-y-scroll h-[70vh] md:h-[78vh] mt-3 md:mt-6 space-y-6">
                                    <div>
                                        <h4 className='font-semibold mb-3 text-sm uppercase text-gray-500'>Permintaan dari Marketing</h4>
                                        <div className='space-y-3'>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">No Pengajuan</Label>
                                                <div className="col-span-12 md:col-span-9 font-medium">{selected.nopengajuan}</div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Tanggal</Label>
                                                <div className="col-span-12 md:col-span-9">{dayjs(selected.tanggal).format('dddd, DD MMM YYYY')}</div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Jenis</Label>
                                                <div className="col-span-12 md:col-span-9">{selected.keterangan}</div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Area</Label>
                                                <div className="col-span-12 md:col-span-9">{selected.area || '-'}</div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Klien</Label>
                                                <div className="col-span-12 md:col-span-9">{selected.klien || '-'}</div>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">PO MSB</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <Input value={data.po_msb} onChange={(e) => setData('po_msb', e.target.value)} placeholder="Nomor PO MSB (manual)" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Toko</Label>
                                                <div className="col-span-12 md:col-span-9 space-y-2">
                                                    <AsyncSelect
                                                        placeholder="Cari toko..."
                                                        label={data.toko_label}
                                                        value={data.toko_id}
                                                        optionsRoute={route('vendor-list.toko.options')}
                                                        onChange={(item) => { setData('toko_id', item.id); setData('toko_label', item.label); }}
                                                    />
                                                    <Input value={data.toko_manual} onChange={(e) => setData('toko_manual', e.target.value)} placeholder="Atau ketik manual jika toko belum ada di master" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Sur / S+I / Im</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <select
                                                        className="border rounded-md h-9 px-2 w-full md:w-64"
                                                        value={data.jenis_kerja}
                                                        onChange={(e) => setData('jenis_kerja', e.target.value)}
                                                    >
                                                        <option value="survei">Survei</option>
                                                        <option value="implementasi">Implementasi</option>
                                                        <option value="survei_implementasi">Survei + Implementasi</option>
                                                    </select>
                                                    <div className='text-xs text-gray-400 mt-1'>
                                                        Terdeteksi otomatis: {JENIS_KERJA_LABEL[defaultJenisKerja(selected)]} (bisa diubah manual)
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Suggest Vendor</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <AsyncSelect
                                                        placeholder="Cari vendor..."
                                                        label={data.suggest_vendor_label}
                                                        value={data.suggest_vendor_id}
                                                        optionsRoute={route('vendor-list.vendor.options')}
                                                        onChange={(item) => { setData('suggest_vendor_id', item.id); setData('suggest_vendor_label', item.label); }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Tgl Deadline</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    {selected.deadline
                                                        ? <span className='text-blue-800'>{dayjs(selected.deadline).format('dddd, DD MMM YYYY')}</span>
                                                        : <span className='text-red-600'>Belum diset (kelola di Dashboard)</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className='font-semibold mb-3 text-sm uppercase text-gray-500'>Action dari Purchasing</h4>
                                        <div className='space-y-3'>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Vendor</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <AsyncSelect
                                                        placeholder="Cari vendor..."
                                                        label={data.vendor_label}
                                                        value={data.vendor_id}
                                                        optionsRoute={route('vendor-list.vendor.options')}
                                                        onChange={(item) => { setData('vendor_id', item.id); setData('vendor_label', item.label); }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Tanggal</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <Input type="date" value={data.tanggal_vendor} onChange={(e) => setData('tanggal_vendor', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">DP</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <Input type="number" value={data.dp} onChange={(e) => setData('dp', e.target.value)} placeholder="0" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Biaya Lain-lain</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <Input type="number" value={data.biaya_lain} onChange={(e) => setData('biaya_lain', e.target.value)} placeholder="0" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Biaya Fee Jasa</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <Input type="number" value={data.biaya_fee} onChange={(e) => setData('biaya_fee', e.target.value)} placeholder="0" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Kelengkapan Dokumen</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <Checkbox checked={data.kelengkapan_dokumen} onCheckedChange={(v) => setData('kelengkapan_dokumen', !!v)} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Tgl TF</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <Input type="date" value={data.tgl_tf} onChange={(e) => setData('tgl_tf', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                <Label className="col-span-12 md:col-span-3">Done</Label>
                                                <div className="col-span-12 md:col-span-9">
                                                    <Checkbox checked={data.done} onCheckedChange={(v) => setData('done', !!v)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='pb-8'>
                                        <ButtonComponent text='Simpan' isLoading={processing} />
                                    </div>
                                </form>
                            )}
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

export default VendorList
