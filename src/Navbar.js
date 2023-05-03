
import React, { useContext } from 'react'
import  './Navbar.css'
import {NavLink, useNavigate} from 'react-router-dom'
import { uc } from './UserContext'
const Navbar = () => {
  let ur = useContext(uc)
  let nav = useNavigate()

const logouthandler =()=>{
  ur.setUser({
    ...uc.user, isLoggedIn: false,
    currentUserName: null,
    currentUserId:null,
    currentUserRole:null
  })
  nav('/')
}

  return (
<ul class='navbar'>

{
  ur.user.isLoggedIn && ur.user.currentUserRole==="user"? (
    <li><NavLink to="/dashboard">Dashboard</NavLink></li>
  ):('')
}

{
  ur.user.isLoggedIn && ur.user.currentUserRole==="user" ? (
    <li><NavLink to="/store">Store</NavLink></li>
  ):('')
}

{
  ur.user.isLoggedIn && ur.user.currentUserRole==="admin" ? (
    <li><NavLink to="/products">Products</NavLink></li>
  ):('')
}

{
  !ur.user.isLoggedIn ?(
    <li><NavLink to="/">Login</NavLink></li>
  ):('')
}

 {
  !ur.user.isLoggedIn ? (
    <li><NavLink to="/register">Register</NavLink></li>
  ):('')
 }

  <li className="user">{ur.user.currentUserName}
  
{
  ur.user.isLoggedIn ? (
    <NavLink class="lo" to="/" onClick={logouthandler}>LogOut</NavLink>
  ):('')
}

  </li>
</ul>
  )
}

export default Navbar