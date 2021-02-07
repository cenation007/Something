import '../../App.css'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { set } from 'mongoose'

const EditProfile = () => {
    const [pic, setPic] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [picUrl, setPicUrl] = useState("");
    const selectUser = (state) =>state.user;
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    var ch=0;
    useEffect (() => {
        if(!ch) {
        setName(user.name);
        setEmail(user.email);
        setGender(user.gender);
        ch=1;
    }
    },[picUrl])
    const getMenu=() => {
        document.querySelector('.bg-modal').style.display = 'flex';
    }
    const closeButton = () => {
        document.querySelector('.bg-modal').style.display = 'none'
    }
    const submit = async () => {
        
        fetch("/updateprofile", {
            method:"PUT",
            body: JSON.stringify({
                gender,
                name
            }),
            headers: {
                'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
            
        }}).then(data=>data.json()).then(data => {
            console.log(data);
            const {_id, name, email, followers, following, photo,gender } = data;
            const newUser = {id: _id, name, email, followers, following, photo, gender};
            localStorage.setItem('user', JSON.stringify(newUser));
            dispatch({type: 'UPDATE_FOLLOWERS', payload: newUser});
            setName(name);
            setGender(gender);

        })          
    }
    return (
        <div>
                
                <div>Name:</div>
                <input type="text" placeholder="Name"  value={name} onChange={(e) => { setName(e.target.value) }} />
                <div>Gender:</div>
                <div onClick={() => {getMenu()}}>Select gender: {gender}</div>
                <div className="bg-modal">
                    <div className="modal-content">
                        <button onClick={() => { setGender("Male");closeButton(); }}>Male</button>
                        <button onClick={() => {  setGender("Female");closeButton(); }}>Female</button>
                        <button onClick={() => {  setGender("");closeButton(); }}>Prefer not to say</button>
                        <button onClick={() => {  closeButton(); }}>Close</button>
                    </div>
                </div>
                <button onClick ={(e) => {e.preventDefault();submit()}}>Submit</button>
        </div>
    )
}

export default EditProfile