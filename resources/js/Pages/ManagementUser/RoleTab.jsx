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
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import ButtonComponent from '@/components/ButtonComponent'
import TextError from '@/components/TextError'
import PaginationComponent from '@/components/PaginationComponent'

const emptyForm = { name: '', permissions: [] };

const groupPermissions = (names) => {
    return names.reduce((groups, name) => {
        const group = name.includes('-') ? name.split('-')[0] : 'lainnya';
        groups[group] = groups[group] ?? [];
        groups[group].push(name);
        return groups;
    }, {});
}

const RoleTab = () => {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [datas, setDatas] = useState(null);
    const [permissionOptions, setPermissionOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm(emptyForm);

    const getData = async (page = 1) => {
        setLoading(true);
        try {
            const req = await axios.get(route('management-user.roles.ajax'), { params: { page, search } });
            setDatas(req.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const getPermissionOptions = async () => {
        try {
            const req = await axios.get(route('management-user.permissions.options'));
            setPermissionOptions(req.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
        getPermissionOptions();
    }, []);

    const openCreate = () => {
        clearErrors();
        reset();
        setEditing(null);
        setOpen(true);
    }

    const openEdit = (role) => {
        clearErrors();
        setEditing(role);
        setData({
            name: role.name,
            permissions: (role.permissions ?? []).map((p) => p.name),
        });
        setOpen(true);
    }

    const togglePermission = (name) => {
        setData('permissions', data.permissions.includes(name) ? data.permissions.filter((p) => p !== name) : [...data.permissions, name]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                toast.success(editing ? 'Role berhasil diperbarui' : 'Role berhasil ditambahkan');
                getData();
            },
            onError: () => toast.error('Terjadi kesalahan, periksa kembali form'),
        };

        if (editing) {
            put(route('management-user.roles.update', editing.id), options);
        } else {
            post(route('management-user.roles.store'), options);
        }
    }

    const handleDelete = () => {
        router.delete(route('management-user.roles.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteTarget(null);
                toast.success('Role berhasil dihapus');
                getData();
            },
            onError: (err) => {
                toast.error(Object.values(err)[0] ?? 'Terjadi kesalahan');
                setDeleteTarget(null);
            },
        });
    }

    const grouped = groupPermissions(permissionOptions);

    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); getData(); }} className="flex items-center justify-between gap-2 mb-4 flex-col md:flex-row">
                <div className="flex gap-2 w-full md:w-auto">
                    <Input className="bg-white flex-1 md:w-[300px]" placeholder="Cari nama role..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Button type="submit">GO</Button>
                </div>
                <Button type="button" onClick={openCreate} className="w-full md:w-auto">
                    <PlusIcon size={16} /> Tambah Role
                </Button>
            </form>

            <Card>
                {loading
                    ? <h4 className="mx-auto py-8 text-center">Loading...</h4>
                    : <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Role</TableHead>
                                <TableHead>Jumlah Permission</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {datas && datas.data.map((val) => (
                                <TableRow key={val.id}>
                                    <TableCell className="font-medium capitalize">{val.name}</TableCell>
                                    <TableCell>{val.permissions_count}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => openEdit(val)} className="border border-gray-300 px-2 py-1 rounded-md hover:bg-blue-500"><EditIcon size={16} /></button>
                                            <button type="button" onClick={() => setDeleteTarget(val)} disabled={val.name === 'superadmin'} className="border border-gray-300 px-2 py-1 rounded-md hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-transparent"><Trash2Icon size={16} /></button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {datas && datas.data.length === 0 && (
                                <TableRow><TableCell colSpan={3} className="h-24 text-center">Belum ada role</TableCell></TableRow>
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
                            <DialogTitle className="mb-4">{editing ? 'Edit Role' : 'Tambah Role'}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                            <div>
                                <Label className="mb-1 block">Nama Role</Label>
                                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} disabled={editing?.name === 'superadmin'} />
                                {errors.name && <TextError message={errors.name} />}
                            </div>
                            <div>
                                <Label className="mb-2 block">Permission</Label>
                                <div className="space-y-3">
                                    {Object.keys(grouped).sort().map((group) => (
                                        <div key={group}>
                                            <div className="text-xs font-semibold uppercase text-gray-500 mb-1">{group}</div>
                                            <div className="flex flex-wrap gap-3">
                                                {grouped[group].map((name) => (
                                                    <label key={name} className="flex items-center gap-2 text-sm">
                                                        <Checkbox checked={data.permissions.includes(name)} onCheckedChange={() => togglePermission(name)} />
                                                        {name}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {permissionOptions.length === 0 && <span className="text-sm text-gray-400">Belum ada permission</span>}
                                </div>
                                {errors.permissions && <TextError message={errors.permissions} />}
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <ButtonComponent text={editing ? 'Simpan Perubahan' : 'Tambah Role'} isLoading={processing} />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Role</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">Anda yakin ingin menghapus role <b>{deleteTarget?.name}</b>?</p>
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
                        <Button type="button" variant="destructive" onClick={handleDelete}>Ya, Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RoleTab
