import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
const UserPosts = () => {
    const [post, setPost] = useState([]);
    const [posttodelete, setPosttodelete] = useState([]); 
    const [comment, setComment] = useState("");
    const selectUser = state => state.user;
    const user = useSelector(selectUser);
    const history = useHistory();
    const userId = (history.location.pathname.split('/'))[2];
    useEffect(() => {
        document.querySelector('.hello').style.display = 'none';
        fetch(`/userpost/${userId}`, {
            method: "GET",
            headers: { 'auth-token': localStorage.getItem('token') }
        }).then(res => res.json())
            .then(data => {
                setPost(data.post);
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
                const newData = post.map(item => {
                    if (item._id == result._id) { return result } else { return item }
                })
                setPost(newData)
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
                const newData = post.map(item => {
                    if (item._id == result._id) { return result } else { return item }
                })
                setPost(newData)
            }).catch(err => console.log(err))
        e.target.style.color = '';
    }
    const handleClick = (postId) => {
        fetch('/comment', {
            method: 'put', headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('token') },
            body: JSON.stringify({
                comment, postId
            })
        }).then(data => data.json())
            .then(result => {
                setComment("");
                const newData = post.map(item => {
                    if (item._id == result._id) { return result } else { return item }
                })
                setPost(newData)
            }).catch(err => { console.log(err) })
    }
    const getMenu=(postId) => {
        setPosttodelete(postId);
        document.querySelector('.bg-modal').style.display = 'flex';
    }
    const closeButton = () => {
        document.querySelector('.bg-modal').style.display = 'none'
    }
    const deletePost = () => {
        fetch(`/deletepost/${posttodelete}`, {
            method: 'DELETE',
            headers: {'auth-token': localStorage.getItem('token')}
        }).then(res => res.json)
        .then(result => {
            const newPost = post.filter(item => {
                return item._id != posttodelete;
            })
            setPost(newPost);
        })
        .catch(err => console.log(err))
    }
    const hidePost = () => {
        fetch(`/hidepost/${posttodelete}`, {
            method: 'PUT',
            headers: {'auth-token': localStorage.getItem('token')}
        }).then(res => res.json)
        .then(result => {
            const newPost = post.filter(item => {
                return item._id != posttodelete;
            })
            setPost(newPost);
        })
        .catch(err => console.log(err))
    }
    return (
        <div>
        <div className="container" style={{ width: "45%" }}>
            {console.log(post)}
            {post.map(post => {
                return (
                        <div className="card" key={post._id}>
                            <h6 style={{ padding: "10px 10px" }}>{post.postedBy.name} {(userId === user.id)&&<button onClick ={()=> {getMenu(post._id)}} style= {{float:'right'}}>Click me!</button>}</h6>
                            <div className="card-image">
                                <img src={post.photo} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: post.likes.includes(user.id) ? 'red' : '', cursor: 'pointer' }} onClick={(e) => { console.log(post); (post.likes.includes(user.id)) ? (dislike(e, post._id)) : (like(e, post._id)) }}>favorite_border</i>
                                <p>{post.likes.length} likes</p>
                                <h6>{post.title}</h6>
                                <p style={{ marginBottom: '8px' }}>{post.body}</p>
                                {post.comments.map(item => {
                                    return (
                                        <h6><b>{item.postedBy.name}</b> {item.text}</h6>
                                    )
                                })}
                                <form style={{ display: 'flex', borderTop: '1px solid rgba(0, 0, 0, .2)', paddingTop: '10px' }}>
                                    <textarea className="mycomment" value={comment} placeholder="Add a comment..." autoComplete="ofF" autoCorrect="off" onChange={e => { setComment(e.target.value) }}></textarea>
                                    <button className="commentBtn" disabled={comment ? false : true} onClick={(e) => { e.preventDefault(); handleClick(post._id) }}>Post</button>
                                </form>
                            </div>
                        </div>
                        
                )
            })}

        </div>
        <div className="bg-modal">
                            <div className="modal-content">
                                <button>Edit</button>
                                <button onClick ={() => {hidePost();closeButton();}}>Hide</button>
                                <button onClick ={() => {deletePost();closeButton();}}>Delete</button>
                                <button onClick={() => { closeButton() }}>Close</button>
                            </div>
                        </div>
        </div>
    )
}

export default UserPosts;