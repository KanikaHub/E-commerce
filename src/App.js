
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'
import NoMatchPage from './NoMatchPage'
import Navbar from './Navbar'
import { useState } from 'react'
import { uc } from './UserContext'
import Store from './Store'
import ProductList from './ProductList'
function App() {

  let [user, setUser] = useState({
    isLoggedIn: false,
    currentUserId: null,
    currentUserName: null,
    currentUserRole:null
  });


  return (
    <uc.Provider value={{user,setUser}}>
 <BrowserRouter>
 <div className="container-fluid">
  <Navbar/>
  <Routes>
    <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/> 
      <Route path='/store' element={<Store/>}/> 
      <Route path='*' element={<NoMatchPage/>}/>
      <Route path='/products' element={<ProductList/>}/>

  </Routes>
 </div>

 </BrowserRouter>
 </uc.Provider>
  );
}
export default App;
