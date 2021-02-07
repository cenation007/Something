import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom'
import { useSelector } from 'react-redux';
import '../App.css'
import { useDispatch, } from 'react-redux'
import { useHistory } from 'react-router-dom'
const Navbar = () => {
    const history =useHistory();
    const [search, setSearch] = useState("");
    const selectSearch = state => state.userList;
    const userList = useSelector(selectSearch);
    const dispatch = useDispatch();
    const NavItems = () => {    
        
        const selectUser = state => state.user;
        const user = useSelector(selectUser);
        
        const history = useHistory();
        if (user) {
            
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/createpost"><i className="material-icons" style={{ color: "black" }}>add_circle_outline</i></Link></li>,
                <li>
                    <i className="material-icons" style={{ color: "black" }} onClick={() => { localStorage.clear(); dispatch({ type: "logout" }); history.push('/signin') }}>close</i>
                </li>
            ]
        } else {
            return [
                <li><Link to="/signin">SignIn</Link></li>,
                <li><Link to="/signup">SignUp</Link></li>
            ]
        }
    }
    
    const handleSearch = (e) => {
        setSearch(e.target.value);
        if(e.target.value) {
            fetch(`/searchuser/${e.target.value}`, { 
                method: "GET",
                headers: {'auth-token': localStorage.getItem('token')}
            }).then(data=>data.json())
            .then(data=> {
                dispatch({type: "SEARCH_USERS", payload: data})
            })
            .catch(err => console.log(err))
            document.querySelector('.check').style.display = 'block';
        } else {
            document.querySelector('.check').style.display = 'none';
        }
    }
    const selectUser = state => state;
    const user = useSelector(selectUser);
    return (
        <div class="navbar-fixed">
            < nav>
                <div className="nav-wrapper white" style={{ padding: "0px 30px", }}>
                    <Link to={user ? "/" : "/signin"} className="brand-logo">Instagram</Link>

                    <ul id="nav-mobile" className="right  ">
                        <li>
                        <div class="center row">
                          <div class="col s12 " >
                            <div class="row" id="topbarsearch">
                              <div class="input-field col s6 s12 red-text hello">
                                <input  type="text" placeholder="search" value={search} onChange = {(e) => {handleSearch(e)}}/>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        {NavItems()}
                    </ul>
                </div>
            </nav >
        </div>
    )
}

export default Navbar;