import { useState } from "react";

export const useField = ({type = 'text', name = null}) => {
    const [ value, setValue ] = useState('')

    const onChange = (e) => {
        setValue(e.target.value)
    }

    return {
        type,
        value,
        onChange,
        name
    }
}