import React from "react";
import { Link } from 'react-router-dom'

const style = {
    display: 'flex',
    marginBottom: '2em'
}

const NavButton = () => {
    return (
        <div style={style}>
        <Link to={'/authors'}><button>Authors</button></Link>
        <Link to={'/books'}><button>Books</button></Link>
        </div>
    )
}

export default NavButton