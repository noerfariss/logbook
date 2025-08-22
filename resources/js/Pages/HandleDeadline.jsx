import { EditIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ButtonComponent from '@/components/ButtonComponent';
import { useForm, usePage } from '@inertiajs/react';
import { Calendar } from '@/components/ui/calendar';
import dayjs from 'dayjs'
import "dayjs/locale/id"
import { toast } from 'react-toastify';
dayjs.locale("id")

export const HandleDeadline = ({ selected, setSelected, setRefresh }) => {
    const [open, setOpen] = useState(false);
    const { post, data, setData, processing, errors } = useForm({
        pengajuan_id: null,
        deadline: null
    });

    useEffect(() => {
        if (selected?.idpengajuan) {
            setData('pengajuan_id', selected.idpengajuan);
        }
    }, [selected]);

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('pengajuan.updatedeadline'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (data) => {
                const item = data.props.item;
                const updateSelected = {
                    ...selected,
                    deadline: item
                }

                setSelected(updateSelected);
                setRefresh(true);

                toast.success('Deadline berhasil diperbaruhi');
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
                            <DialogTitle className='mb-4'>Update Deadline</DialogTitle>
                        </DialogHeader>

                        <div className="mb-6 flex justify-center">
                            <Calendar
                                mode='single'
                                selected={data.deadline}
                                onSelect={(date) => {
                                    const localDate = dayjs(date).format('YYYY-MM-DD');
                                    setData('deadline', localDate)
                                }}
                            />
                        </div>

                        <div className='mt-8'>
                            <ButtonComponent text='Simpan Deadline' isLoading={processing} />
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </>
    )
}
