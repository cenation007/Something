import '../App.css'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import EditProfile from './manageEditProfile/editProfile'
import ChangePassword from './manageEditProfile/changePassword'
import EditImage from './manageEditProfile/EditImage'
import { useHistory } from 'react-router-dom'
const EditDetails = () => {
    const history = useHistory();
    const [message, setMessage] = useState("");
    const [key, setKey] = useState("");
    const handleClick = (key) => {
        setKey(key);
    }
    return (
        <div>
            <ul>
                <li key="1" onClick={(e) => { handleClick("1") }}>Edit Profile</li>
                <li key="2" onClick={(e) => { handleClick("2") }}>Change Password</li>
                <li key="3" onClick={() => { handleClick("3") }}>Edit Image</li>
            </ul>
            <div id="edit-content">
                {(() => {
                    switch (key) {
                        case '1':
                            return (
                                <EditProfile />
                            )
                        case '2':
                            return (
                                <ChangePassword />
                            )
                        case '3':
                            return (
                                <EditImage />
                            )
                        default:
                            return (
                                <a>hello</a>
                            )
                    }
                })()
            }
        </div>

        </div>
    )
}

export default EditDetails