import React from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { ShieldAlert } from 'lucide-react'

const AlertComponent = ({ title = '', description = '', variant = 'default' }) => {
    return (
        <Alert variant={variant} className='flex mb-6'>
            <ShieldAlert />
            <div className='ml-2'>
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>
                    {description}
                </AlertDescription>
            </div>
        </Alert>
    )
}

export default AlertComponent
