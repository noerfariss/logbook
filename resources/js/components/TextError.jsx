import React from 'react'

const TextError = ({ message = '' }) => {
    return (
        <div className="text-red-600 text-sm">{message}</div>
    )
}

export default TextError
