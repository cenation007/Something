import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import {Link, useHistory} from 'react-router-dom'

const Home = () => {
    const selectUser = state => state.user;
    const selectSearch = state => state.userList;
    const user = useSelector(selectUser);
    const userList = useSelector(selectSearch);
    const [data, setData] = useState([]);
    const history = useHistory();
    const [comment, setComment] = useState("");
    useEffect(() => {
        
        document.querySelector('.hello').style.display = 'block';
        document.querySelector('input').value = '';
        fetch('/allpost', {
            method: "GET",
            headers: { 'auth-token': localStorage.getItem('token') }
        }).then(res => res.json())
            .then(data => {
                setData(data.posts);
            }).catch(err => { console.log(err) })
    }, [])
    const like = (e, postId) => {
        fetch('/like', {
            method: 'put', headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
            body: JSON.stringify({
                postId
            })
        }).then(data => data.json())
            .then(result => {
                const newData = data.map(item => {
                    if(item._id == result._id) { return result} else {return item}
                })
                setData(newData)
            }).catch(err => console.log({ error: err }))
        e.target.style.color = 'red';
    }
    const dislike = (e, postId) => {
        fetch('/unlike', {
            method: 'put', headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
            body: JSON.stringify({
                postId
            })
        }).then(data => data.json())
            .then(result => {
                const newData = data.map(item => {
                    if(item._id == result._id) { return result} else {return item}
                })
                setData(newData)
            }).catch(err => console.log(err))
        e.target.style.color = '';
    }
    const handleClick =(postId) => {
        fetch('/comment', {method: 'put', headers: {'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token')},
                body: JSON.stringify({
                    comment,postId
                })
    }).then(data=>data.json())
    .then(result => {
        console.log("asjskdjksdg")
        console.log(result);
        setComment("");
        const newData = data.map(item => {
            if(item._id == result._id) { return result} else {return item}
        })
        setData(newData)
    }).catch(err => {console.log(err)})
    }
    return (
        <div>
        <button onClick={() => history.push('/chathome')}>Chat</button>
        <div className="container" style={{width: "40%"}} onClick ={() => {document.querySelector('.check').style.display = 'none';document.querySelector('input').value = '';}}>
            {data.map(post => {
                return ((user.following.includes(post.postedBy._id)) &&(
                    <div className="card" key={post._id}>
                        <h6 style={{ padding: "10px 10px" }}>{post.postedBy.name}</h6>
                        <div className="card-image">
                            <img src={post.photo} />
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{color: post.likes.includes(user.id)? 'red': '', cursor: 'pointer'}}  onClick={(e) => { console.log(post);(post.likes.includes(user.id)) ? (dislike(e, post._id)) : (like(e, post._id)) }}>favorite_border</i>
                            <p>{post.likes.length} likes</p>
                            <h6>{post.title}</h6>
                            <p style={{marginBottom: '8px'}}>{post.body}</p>
                            {post.comments.map(item => {
                                return (
                                    <h6><b>{item.postedBy.name}</b> {item.text}</h6>
                                )
                            })}
                            <form style= {{display: 'flex' , borderTop: '1px solid rgba(0, 0, 0, .2)', paddingTop: '10px'}}>
                                <textarea className="mycomment" value={comment}placeholder="Add a comment..." autoComplete="ofF" autoCorrect="off" onChange={e => {setComment(e.target.value)}}></textarea>
                                <button  className="commentBtn" disabled={comment?false:true} onClick={(e)=>{e.preventDefault();handleClick(post._id)}}>Post</button>
                            </form>
                        </div>
                        
                    </div>
                ))
            })}
            

        </div>
        <div className="check">
            <div className="check1">
                {(userList.length>0) &&
                    <a className="usercheck" >
                        <div className = "username">Search result...</div>
                </a>
}
                {(userList.length == 0) &&
                    <a className="usercheck" >
                    <div className="usercheck1">No user found...
                    </div>
                </a>
                }
                    {userList.map(user => {
                        return (
                            <Link to={(user._id !== (JSON.parse(localStorage.getItem('user'))).id) ?"/userprofile/"+ user._id: '#'}>
                            <a className="usercheck" >
                                
                                <div className="usercheck1">
                                    <div className = "username">{user.name}</div>
                                </div>
                               
                            </a>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    </div>
    )
}

export default Home;