import React from "react"

const Notify = ({ errorMessage }) => {
    if (!errorMessage) {
        return null
    }
    return (
        <div style={{ width: '100%', textAlign: 'center', color: 'red', fontWeight: 600, fontSize: '20px', backgroundColor: 'lightgrey', padding: '1em 0' }}>
            {errorMessage}
        </div>
    )

}

export default Notify