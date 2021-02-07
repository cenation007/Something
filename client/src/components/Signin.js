import React, { Component, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {useHistory, Link} from 'react-router-dom'
import M from 'materialize-css'
function Signin(){
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const history = useHistory();
    const [password, setPassword] = useState("");
    const handleClick = () => {
        fetch('/signin', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
            })
        }).then(data => data.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: 'rounded #f44336 red' });
                } else {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    
                    dispatch({type: "user", payload: data.user});
                    history.push('/')
                }
            }

            )
            .catch((err) => console.log(err))
    }
        return (
            <div className="mycard">
                <div class="card-panel signin input-field">
                    <h3>Instagram</h3>
                    <input type="text" placeholder="email" onChange={e => { setEmail(e.target.value ) }} />
                    <input type="password" placeholder="password" onChange={e => { setPassword(e.target.value ) }} />
                    <a className="waves-effect waves-light btn-small mybtn" onClick={() => {handleClick() }}>Sign In</a>
                    <Link to="/forgotpasswordclientside">Forgot Password?</Link>
                </div>
            </div>
        )
    }

export default Signin;