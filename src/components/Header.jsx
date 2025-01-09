import React from 'react'
import { LogOut } from 'react-feather'
import { useAuth } from '../utils/AuthContext'

const Header = () => {
    const {user, handleUserLogout} = useAuth()
  return (
    <div id='header--wrapper'>
        {user ? (
            <>
                <div className='profile-con'>
                <p id='profile'>{user.name.slice(0,1)}</p>  {user.name} 
                </div>

                <div className='logout-con header--link' onClick={handleUserLogout} >
                <p className=''>Sign out</p>
                <LogOut className='header--link'/>

                <p className='logout-text'>sign out</p>
                </div>
            </>
        ) : (
            <button>Guest</button>
        )}
    </div>
  )
}

export default Header