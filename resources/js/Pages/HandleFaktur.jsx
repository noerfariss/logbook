import { EditIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ButtonComponent from '@/components/ButtonComponent';
import { useForm } from '@inertiajs/react';

export const HandleFaktur = () => {
    const [open, setOpen] = useState(false);
    const { post, data, setData, processing, errors } = useForm({
        deadline: null
    });

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(data);
    }

    return (
        <>
            <button type='button' onClick={setOpen} className='border border-gray-300 px-4 py-1 rounded-md hover:bg-blue-500'><EditIcon size={16} /></button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className='mb-4'>Update Faktur</DialogTitle>
                        </DialogHeader>

                        <div className="mb-6 flex justify-center">

                        </div>

                        <div className='mt-8'>
                            <ButtonComponent text='Simpan Faktur' isLoading={processing} />
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
