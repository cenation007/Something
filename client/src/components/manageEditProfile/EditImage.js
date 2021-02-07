import '../../App.css'
import React,{ useState,useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
import convertBase64 from './image_functions/convertToBase64'
import M from 'materialize-css'

const EditImage =() => {
    const dispatch = useDispatch();
    const [picurl,setPicurl] = useState("");
    const [pic, setPic] = useState("");
    const [newpic, setNewpic] = useState("");
    const [image, setImage] = useState("");
    const selectUser = state => state.user;
    const user = useSelector(selectUser);
    const [imagefilter, setImagefilter] = useState([])
    useEffect(() => {
        setPicurl(user.photo);
        if(newpic) {
            fetch("/updateimage", {
                method:"PUT",
                body: JSON.stringify({
                    photo: newpic
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
                setImagefilter([])
                setPicurl(photo);
            })
        }
    },[newpic])
    const onChange = (e) => {
        setPic(e.target.files[0])
        const config = {
            headers: {
              "content-type": "multipart/form-data"
            }
          };
        const data = new FormData();
        data.append('image',e.target.files[0]);
        axios.post('/imagefilter', data).then(res=>{
            let arr = (res.data.url).split(','); 
            setImagefilter(arr)

        }).catch(err=>console.log(err))
        
    }
    const submit =() => {
        fetch('/cloudupload',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({image})
        }).then(data=>data.json()).then(data=> {
            setNewpic(data);
            
            console.log(data);
        }).catch(err=>console.log(err))
    }
    return (
        <div>
        <div className="file-field input-field">
                    <div className="btn #64b6f6 blue darken-1" style={{ borderRadius: "3px" }}>
                        <span>Update Profile pic</span>
                        <input type="file" onChange={(e) => { onChange(e) }} />
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text" />
                    </div>
        </div>
        <div className="gallery">
        <img src={picurl}></img>
        {imagefilter.map((image,key) => {
            return <img src = {'uploads/'+image} onClick = {(e) => {console.log(image);setImage(image)}}></img>
            })}
        </div>
        <button onClick ={(e) => {e.preventDefault();submit()}}>Submit</button>
        </div>
    )
}

export default EditImage;