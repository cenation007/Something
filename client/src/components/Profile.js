import '../App.css';
import { useState, useEffect } from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
const Profile = () => {
    const history = useHistory();
    const [post, setPost] = useState([]);
    const selectUser = state => state.user;
    const user = useSelector(selectUser);
    useEffect(() => {
        console.log(user,"@")
        document.querySelector('.hello').style.display = 'none';
        fetch('/myposts', {
            method: "GET",
            headers: { 'auth-token': localStorage.getItem('token') }
        }).then(res => res.json())
            .then(data => {
                setPost(data.post);
            }).catch(err => { console.log(err) })
        }, [])
        if(user) {
    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-around", margin: "25px 0px", borderBottom: "1px solid grey" }}>
                <div>
                    <img style={{ marginBottom: "30px", width: "160px", height: "160px", borderRadius: "80px", overflow: "hidden" }} 
                        src={user.photo} />
                </div>
                <div style={{}}>
                    
                    <div style={{display: 'flex'}}><h5>{user.name}</h5><a className="waves-effect waves-light btn blue followButoon" onClick={()=>{history.push('/editdetails')}}>Edit Profile</a></div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                        <h6>{post.length} posts</h6>
                        <h6>{user.followers.length} followers</h6>
                        <h6>{user.following.length} following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {post.map(post => {
                    return (
                        <img src={post.photo} onClick={() => {history.push(`/userposts/${post.postedBy._id}`)}}></img>
                    )
                })}
            </div>
            </div>
    )
    }
    else {
        return <div>laude</div>
    }
}

export default Profile;