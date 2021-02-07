import '../App.css';
import { useState, useEffect } from 'react'
import {useDispatch, useSelector}  from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
const UserProfile = () => {
    const history = useHistory();
    const [post, setPost] = useState([]);
    const [userDetails, setUserdetails] = useState({});
    const { userid } = useParams();
    const dispatch = useDispatch();
    const selectUser = state => state.user;
    const user = useSelector(selectUser);
    useEffect(() => {
        document.querySelector('.hello').style.display = 'none';
        fetch(`/getuserposts/${userid}`, {
            method: "GET",
            headers: { 'auth-token': localStorage.getItem('token') }
        }).then(res => res.json())
            .then(data => {
                setPost(data.post);
            }).catch(err => { console.log(err) })
        fetch(`/getuserdetails/${userid}`, {
            method: "GET",
            headers: { 'auth-token': localStorage.getItem('token') }
        }).then(res => res.json())
            .then(data => {
                console.log(data[0],"aSD")
                setUserdetails(data[0])
            }).catch(err => { console.log(err) })
    }, [])
    const follow = () => {
        fetch(`/follow/${userid}`, {
            method: 'PUT',
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        })
            .then(data => data.json())
            .then(data => {
                setUserdetails((prevState) => {
                    return {
                        ...prevState,
                        followers: [...prevState.followers,data._id]
                    }
                })
                const {_id, name, email, followers, following, photo,gender} = data;
                dispatch({type: "UPDATE_FOLLOWERS", payload: {id: _id,name,email,followers,following, photo,gender}});
            })
    }
    const unfollow = () => {
        fetch(`/unfollow/${userid}`, {
            method: 'PUT',
            headers: {
                'auth-token': localStorage.getItem('token')
            }
        })
            .then(data => data.json())
            .then(data => {
                setUserdetails((prevState) => {
                    const newList = prevState.followers.filter(item => { return item != data._id})
                    return {
                        ...prevState,
                        followers: newList
                    }
                })
                const {_id, name, email, followers, following, gender} = data;
                dispatch({type: "UPDATE_FOLLOWERS", payload: {id: _id,name,email,followers,following,gender}});
            })
    }
    if(userDetails.followers) {
    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-around", margin: "25px 0px", borderBottom: "1px solid grey" }}>
                <div>
                    <img style={{ marginBottom: "30px", width: "160px", height: "160px", borderRadius: "80px", overflow: "hidden" }}
                        src={userDetails.photo} />
                </div>
                <div style={{}}>
                    <h5>{userDetails.name}</h5>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                        <h6>{post.length} posts</h6>
                        <h6>{userDetails.followers.length} followers</h6>
                        <h6>{userDetails.following.length} following</h6>
                    </div>
                    {(userDetails.followers.includes(JSON.parse(localStorage.getItem('user')).id))? 
                    <a className="waves-effect waves-light btn blue followButoon" onClick={() => {
                            unfollow()}}>UnFollow</a>: <a className="waves-effect waves-light btn blue followButoon" onClick={() => {
                                
                                follow()}}>Follow</a>}
                    
                </div>
            </div>
            <div className="gallery">
                {post.map(post => {
                    return (
                        <img src={post.photo} onClick={() => { history.push(`/userposts/${post.postedBy._id}`) }}></img>
                    )
                })}
            </div>
        </div>
    )
            } else {
                return <div>BSDK</div>
            }
}

export default UserProfile;