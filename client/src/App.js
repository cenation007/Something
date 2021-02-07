import Navbar from './components/Navbar'
import { BrowserRouter, Route, useHistory } from 'react-router-dom'
import Home from './components/Home';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Signin from './components/Signin';
import createPost from './components/post'
import UserPosts from './components/UserPosts'
import UserProfile from './components/userProfile'
import EditDetails from './components/EditProfile'
import EditProfile from './components/manageEditProfile/editProfile'
import EditImage from './components/manageEditProfile/EditImage'
import ChangePassword from './components/manageEditProfile/changePassword'
import ForgotPassword from './components/manageForgotPassword/forgotPassword'
import ResetPassword from './components/manageForgotPassword/resetPassword'
import EmailVerify from './components/email-verification'

import ChatHome from './components/Chat/ChatHome'
import React, { Component, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
const App = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user)
    if (user) {
      dispatch({ type: "user", payload: user });
    } else {
      console.log(history.location.pathname,"!")
      if(!history.location.pathname.startsWith('/forgot') && !history.location.pathname.startsWith('/authentication'))
        history.push('/signin');
    }

  })
  return (
    <div className="App">
      <Navbar />
      <Route exact path='/' component={Home} />
      <Route path='/profile' component={Profile} />
      <Route path='/signup' component={Signup} />
      <Route path='/signin' component={Signin} />
      <Route path='/userposts/:userId' component={UserPosts} />
      <Route path='/createpost' component={createPost} />
      <Route path='/userprofile/:userid' component={UserProfile} />
      <Route path='/editdetails' component={EditDetails} />
      <Route path='/forgotpasswordclientside' component={ForgotPassword} />
      <Route exact path='/forgotpassword/:token' component={ResetPassword} />
      <Route exact path='/authentication/activate/:token' component={EmailVerify} />
      <Route exact path='/chathome' component = {ChatHome} />
    </div>
  );
}

export default App;
