import { EditIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useForm } from '@inertiajs/react';
import ButtonComponent from '@/components/ButtonComponent';
import { toast } from 'react-toastify';

export const HandlePpn = ({ selected, setSelected, setRefresh }) => {
    const [open, setOpen] = useState(false);
    const { post, data, setData, processing, errors } = useForm({
        pengajuan_id: null,
        status: ''
    });

    useEffect(() => {
        if (selected?.idpengajuan) {
            setData('pengajuan_id', selected.idpengajuan);
            setData('status', selected?.ppn?.status);
        }
    }, [selected]);

    const handleSubmit = (e) => {
        e.preventDefault()

        post(route('pengajuan.updateppn'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (data) => {
                const item = data.props.item;
                const updateSelected = {
                    ...selected,
                    ppn: item
                }

                setSelected(updateSelected);
                setRefresh(true);

                toast.success('PPN berhasil diperbaruhi');
            },
            onError: () => toast.error('Terjadi kesalahan'),
        });
    }


    return (
        <>
            <button type='button' onClick={setOpen} className='border border-gray-300 px-4 py-1 rounded-md hover:bg-blue-500'><EditIcon size={16} /></button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className='mb-4'>Update PPN</DialogTitle>
                        </DialogHeader>

                        <div className="mb-6 flex justify-center gap-4">
                            <div className="flex items-center gap-1">
                                <input
                                    id="TIDAK"
                                    type="radio"
                                    value="0"
                                    name="status"
                                    checked={data.status == 0}
                                    onChange={() => setData('status', 0)}
                                />
                                <label htmlFor="TIDAK">TIDAK</label>
                            </div>
                            <div className="flex items-center gap-1">
                                <input
                                    id="YA"
                                    type="radio"
                                    value="1"
                                    name="status"
                                    checked={data.status == 1}
                                    onChange={() => setData('status', 1)}
                                />
                                <label htmlFor="YA">YA</label>
                            </div>
                        </div>


                        <div className='mt-8'>
                            <ButtonComponent text='Simpan ' isLoading={processing} />
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
