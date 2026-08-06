import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { router, useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { EditIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import ButtonComponent from '@/components/ButtonComponent'
import TextError from '@/components/TextError'
import PaginationComponent from '@/components/PaginationComponent'

const emptyForm = { name: '' };

const PermissionTab = () => {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [datas, setDatas] = useState(null);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm(emptyForm);

    const getData = async (page = 1) => {
        setLoading(true);
        try {
            const req = await axios.get(route('management-user.permissions.ajax'), { params: { page, search } });
            setDatas(req.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const openCreate = () => {
        clearErrors();
        reset();
        setEditing(null);
        setOpen(true);
    }

    const openEdit = (permission) => {
        clearErrors();
        setEditing(permission);
        setData({ name: permission.name });
        setOpen(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                toast.success(editing ? 'Permission berhasil diperbarui' : 'Permission berhasil ditambahkan');
                getData();
            },
            onError: () => toast.error('Terjadi kesalahan, periksa kembali form'),
        };

        if (editing) {
            put(route('management-user.permissions.update', editing.id), options);
        } else {
            post(route('management-user.permissions.store'), options);
        }
    }

    const handleDelete = () => {
        router.delete(route('management-user.permissions.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteTarget(null);
                toast.success('Permission berhasil dihapus');
                getData();
            },
            onError: (err) => {
                toast.error(Object.values(err)[0] ?? 'Terjadi kesalahan');
                setDeleteTarget(null);
            },
        });
    }

    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); getData(); }} className="flex items-center justify-between gap-2 mb-4 flex-col md:flex-row">
                <div className="flex gap-2 w-full md:w-auto">
                    <Input className="bg-white flex-1 md:w-[300px]" placeholder="Cari nama permission..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Button type="submit">GO</Button>
                </div>
                <Button type="button" onClick={openCreate} className="w-full md:w-auto">
                    <PlusIcon size={16} /> Tambah Permission
                </Button>
            </form>

            <Card>
                {loading
                    ? <h4 className="mx-auto py-8 text-center">Loading...</h4>
                    : <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Permission</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {datas && datas.data.map((val) => (
                                <TableRow key={val.id}>
                                    <TableCell className="font-medium">{val.name}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => openEdit(val)} className="border border-gray-300 px-2 py-1 rounded-md hover:bg-blue-500"><EditIcon size={16} /></button>
                                            <button type="button" onClick={() => setDeleteTarget(val)} className="border border-gray-300 px-2 py-1 rounded-md hover:bg-red-500"><Trash2Icon size={16} /></button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {datas && datas.data.length === 0 && (
                                <TableRow><TableCell colSpan={2} className="h-24 text-center">Belum ada permission</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                }
            </Card>

            <PaginationComponent data={datas} onPageChange={(page) => getData(page)} />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className="mb-4">{editing ? 'Edit Permission' : 'Tambah Permission'}</DialogTitle>
                        </DialogHeader>

                        <div>
                            <Label className="mb-1 block">Nama Permission</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <TextError message={errors.name} />}
                        </div>

                        <DialogFooter className="mt-6">
                            <ButtonComponent text={editing ? 'Simpan Perubahan' : 'Tambah Permission'} isLoading={processing} />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Permission</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">Anda yakin ingin menghapus permission <b>{deleteTarget?.name}</b>?</p>
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
                        <Button type="button" variant="destructive" onClick={handleDelete}>Ya, Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PermissionTab
