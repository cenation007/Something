import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import M from 'materialize-css'
const ForgotPassword =() => {
    const [email,setEmail] = useState("");
    const handleClick=() => {
        fetch('/forgotpassword', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email
            })
        }).then(data=>data.json())
        .then(data=>M.toast({ html: data.message, classes: '#42a5f5 blue lighten-1' }))
        .catch(err=> M.toast({ html: err.error, classes: 'rounded #f44336 red' }))
    }
    return (
        <div>
            <div>Enter you email to get password reset link</div>
            <input type="text" value={email} placeholder ="email" onChange ={(e) => setEmail(e.target.value)}></input>
            <a className="waves-effect waves-light btn-small mybtn" onClick={() => {handleClick() }}>Send Login Link</a>
        </div>
    )
}

export default ForgotPassword