import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'

const DialogComponent = ({ title = 'Anda yakin?', description = 'sudah yakin?', handleSubmit, children }) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type='button' variant='link' className={'w-full'}>
                    {children}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                    <div className='flex justify-end gap-4 mt-4 pt-8'>
                        <DialogClose asChild>
                            <Button type='button' variant='link'>Batal</Button>
                        </DialogClose>
                        <Button type='button' onClick={(e) => {
                            setOpen(false);
                            handleSubmit(e);
                        }} >Ya! Lanjutkan</Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default DialogComponent
