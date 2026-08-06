import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { router, useForm, usePage } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { EditIcon, LogInIcon, PlusIcon, Trash2Icon } from 'lucide-react'
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

const emptyForm = {
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [],
}

const UsersTab = () => {
    const { user: currentUser, permissions = [] } = usePage().props;
    const canLoginAs = permissions.includes('user-update');

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [datas, setDatas] = useState(null);
    const [roleOptions, setRoleOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm(emptyForm);

    const getData = async (page = 1) => {
        setLoading(true);
        try {
            const req = await axios.get(route('management-user.users.ajax'), { params: { page, search } });
            setDatas(req.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const getRoleOptions = async () => {
        try {
            const req = await axios.get(route('management-user.roles.options'));
            setRoleOptions(req.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
        getRoleOptions();
    }, []);

    const openCreate = () => {
        clearErrors();
        reset();
        setEditing(null);
        setOpen(true);
    }

    const openEdit = (user) => {
        clearErrors();
        setEditing(user);
        setData({
            name: user.name,
            username: user.username,
            email: user.email,
            password: '',
            password_confirmation: '',
            roles: user.roles.map((r) => r.name),
        });
        setOpen(true);
    }

    const toggleRole = (name) => {
        setData('roles', data.roles.includes(name) ? data.roles.filter((r) => r !== name) : [...data.roles, name]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                toast.success(editing ? 'User berhasil diperbarui' : 'User berhasil ditambahkan');
                getData();
            },
            onError: () => toast.error('Terjadi kesalahan, periksa kembali form'),
        };

        if (editing) {
            put(route('management-user.users.update', editing.uuid), options);
        } else {
            post(route('management-user.users.store'), options);
        }
    }

    const handleDelete = () => {
        router.delete(route('management-user.users.destroy', deleteTarget.uuid), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteTarget(null);
                toast.success('User berhasil dihapus');
                getData();
            },
            onError: (err) => {
                toast.error(Object.values(err)[0] ?? 'Terjadi kesalahan');
                setDeleteTarget(null);
            },
        });
    }

    const handleLoginAs = (user) => {
        router.post(route('management-user.users.login-as', user.uuid), {}, {
            onError: (err) => toast.error(Object.values(err)[0] ?? 'Terjadi kesalahan'),
        });
    }

    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); getData(); }} className="flex items-center justify-between gap-2 mb-4 flex-col md:flex-row">
                <div className="flex gap-2 w-full md:w-auto">
                    <Input className="bg-white flex-1 md:w-[300px]" placeholder="Cari nama, username, email..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Button type="submit">GO</Button>
                </div>
                <Button type="button" onClick={openCreate} className="w-full md:w-auto">
                    <PlusIcon size={16} /> Tambah User
                </Button>
            </form>

            <Card>
                {loading
                    ? <h4 className="mx-auto py-8 text-center">Loading...</h4>
                    : <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {datas && datas.data.map((val) => (
                                <TableRow key={val.id}>
                                    <TableCell className="font-medium">{val.name}</TableCell>
                                    <TableCell>{val.username}</TableCell>
                                    <TableCell className="hidden md:table-cell">{val.email}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {val.roles.length > 0
                                                ? val.roles.map((r) => (
                                                    <span key={r.id} className="text-xs bg-blue-300 rounded-sm px-1 capitalize">{r.name}</span>
                                                ))
                                                : <span className="text-xs text-gray-400">-</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {canLoginAs && val.id !== currentUser.id &&
                                                <button type="button" onClick={() => handleLoginAs(val)} title="Login As" className="border border-gray-300 px-2 py-1 rounded-md hover:bg-yellow-400"><LogInIcon size={16} /></button>
                                            }
                                            <button type="button" onClick={() => openEdit(val)} className="border border-gray-300 px-2 py-1 rounded-md hover:bg-blue-500"><EditIcon size={16} /></button>
                                            <button type="button" onClick={() => setDeleteTarget(val)} className="border border-gray-300 px-2 py-1 rounded-md hover:bg-red-500"><Trash2Icon size={16} /></button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {datas && datas.data.length === 0 && (
                                <TableRow><TableCell colSpan={5} className="h-24 text-center">Belum ada user</TableCell></TableRow>
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
                            <DialogTitle className="mb-4">{editing ? 'Edit User' : 'Tambah User'}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                            <div>
                                <Label className="mb-1 block">Nama</Label>
                                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <TextError message={errors.name} />}
                            </div>
                            <div>
                                <Label className="mb-1 block">Username</Label>
                                <Input value={data.username} onChange={(e) => setData('username', e.target.value)} />
                                {errors.username && <TextError message={errors.username} />}
                            </div>
                            <div>
                                <Label className="mb-1 block">Email</Label>
                                <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <TextError message={errors.email} />}
                            </div>
                            <div>
                                <Label className="mb-1 block">Password {editing && '(kosongkan jika tidak diubah)'}</Label>
                                <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                {errors.password && <TextError message={errors.password} />}
                            </div>
                            <div>
                                <Label className="mb-1 block">Konfirmasi Password</Label>
                                <Input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                            </div>
                            <div>
                                <Label className="mb-2 block">Role</Label>
                                <div className="flex flex-wrap gap-3">
                                    {roleOptions.map((name) => (
                                        <label key={name} className="flex items-center gap-2 text-sm capitalize">
                                            <Checkbox checked={data.roles.includes(name)} onCheckedChange={() => toggleRole(name)} />
                                            {name}
                                        </label>
                                    ))}
                                    {roleOptions.length === 0 && <span className="text-sm text-gray-400">Belum ada role</span>}
                                </div>
                                {errors.roles && <TextError message={errors.roles} />}
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <ButtonComponent text={editing ? 'Simpan Perubahan' : 'Tambah User'} isLoading={processing} />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus User</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">Anda yakin ingin menghapus user <b>{deleteTarget?.name}</b>?</p>
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
                        <Button type="button" variant="destructive" onClick={handleDelete}>Ya, Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UsersTab
