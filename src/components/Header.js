import React from 'react'
import logo from '../images/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import profileLogo from '../images/user-profile.png'
import { useAuth } from '../contexts/AuthContext'
import { doSignOut } from '../auth'

const Navbar = () => {
  const navigate = useNavigate();
  const signout = async () => {
    try{
      await doSignOut();
      navigate('/');
    }catch(error){
      console.error('Could not sign out')
    }
  }
  return (
        <header className='header'>
            <img className="logo" src={logo} />
            <div style={{
                          display: 'flex', 
                          justifyContent: 'space-evenly', 
                          width: '45%', 
                          fontSize: '2rem',
                          alignItems:'center'
                        }}>
              <button className="addNewButton" onClick={signout}>Sign out</button>
              <Link to={`/inventory`}> Inventory </Link>
              <Link to={`/dashboard`}> Dashboard </Link>
              <Link to={`/profile`}><img className="profileLogo" src={profileLogo}/></Link>       
            </div>
        </header>
  )
}

export default Navbar