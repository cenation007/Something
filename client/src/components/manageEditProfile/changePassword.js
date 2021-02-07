import '../../App.css'
import React,{ useState,useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import M from 'materialize-css'
const ChangePassword =() => {
    const [oldPass,setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmNew, setConfirmNew] = useState("");
    const handleClick =() => {
        if(newPass == confirmNew) {
        fetch('/changepassword', { 
            method: 'PUT',
            headers: {'Content-Type': 'application/json','auth-token': localStorage.getItem('token')},
            body: JSON.stringify({
                oldPass,
                newPass
            })
        }).then(data => data.json())
        .then(data=> M.toast({ html: "Password changed", classes: '#2196f3 blue' }))
        .catch(err=>M.toast({ html: "Old password incorrect", classes: 'rounded #f44336 red' }))
    } else {
        M.toast({ html: "Passwords doesnot match", classes: 'rounded #f44336 red' });
    }
    }
    return (
        <div>
            <input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)}></input>
            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}></input>
            <input type="password" value={confirmNew} onChange={(e) => setConfirmNew(e.target.value)}></input>
            <button onClick={() => handleClick()}>Change Password</button>
        </div>
    )
}

export default ChangePassword