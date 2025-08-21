import React from 'react'
import { Button } from './ui/button'
import { Loader2Icon } from 'lucide-react'

const ButtonComponent = ({ type = 'submit', text = 'Login', isLoading = false }) => {
    return (
        <Button type={type} className="w-full h-9" disabled={isLoading}>
            {isLoading && <Loader2Icon className="animate-spin" />}
            {text}
        </Button>
    )
}

export default ButtonComponent
