import React,{useState} from 'react'
import{useParams} from 'react-router-dom'
import {useHistory}  from 'react-router-dom'
import M from 'materialize-css'
const ResetPassword=() => {
    const [newPass, setNewPass] = useState("");
    const { token } = useParams();
    const history = useHistory();
    const handleClick =() => {
        fetch('/resetpassword',{
            method:'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                newPass,
                resetLink: token
            })
        }).then(data=>data.json()).then(data=>M.toast({ html: data.message, classes: '#42a5f5 blue lighten-1' })).catch(err=>M.toast({ html: err.error, classes: 'rounded #f44336 red' }))
        history.push('/signin')
    }
    return (
        <div>
            <div>Enter new Password</div>
            <input type="password" value={newPass} placeHolder="Password" onChange={(e)=>setNewPass(e.target.value)}></input>
            <a className="waves-effect waves-light btn-small mybtn" onClick={() => {handleClick() }}>Confirm</a>
        </div>
    )
}

export default ResetPassword