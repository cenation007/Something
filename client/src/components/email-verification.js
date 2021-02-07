import '../App.css'
import React,{ useState,useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'
const EmailVerify =() => {
    const history = useHistory();
    const {token} = useParams();
    const handleClick =() => {
        fetch(`/email-activate/`,{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token
            })
        }).then(data => data.json()).then(data=>{M.toast({ html: data.message, classes: '#42a5f5 blue lighten-1' });history.push('/signin');}).catch(err=> M.toast({ html: err.error, classes: 'rounded #f44336 red' }))
    }
    return (
        <div>
            <a className="waves-effect waves-light btn-small mybtn" onClick={() => {handleClick() }}>Confirm</a>
        </div>
    )
}

export default EmailVerify