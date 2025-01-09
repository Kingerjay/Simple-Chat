import React, {useEffect, useState} from 'react'
import { useAuth } from '../utils/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const {user, handleUserLogin} = useAuth()
    const navigate = useNavigate()

    const [credentials, setCredentials] = useState({
        email:'',
        password:''
    })

    const [error, setError] = useState(''); // State for error messages


    useEffect(() => {
        if (user)  {
            navigate('/')
        }

    }, [user, navigate])


    const handleInputChange = (e) => {
        let name = e.target.name
        let value = e.target.value

        setCredentials({...credentials, [name]:value})
       
    }


   const handleSubmit = (e) => {
        handleUserLogin(e, credentials, setError); // Pass setError to handleUserLogin
    };



  return (
    <div className='auth--container'>
        <div className='form--wrapper'>
            <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>} {/* Display error */}
                <div className='field--wrapper'>
                    <label>Email:</label>
                    <input 
                        type="email"  
                        required
                        name='email'
                        placeholder='Enter your email...'
                        value={credentials.email}
                        onChange={handleInputChange}
                    />
                </div>

                <div className='field--wrapper'>
                    <label>Password:</label>
                    <input 
                        type="password"  
                        required
                        name='password'
                        placeholder='Enter password...'
                        value={credentials.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='field--wrapper'>
                    <input className='btn btn--lg btn--main' type="submit" value="Login" />
                </div>
            </form>

            <p>Don't have an account? Register <Link to="/register">here</Link></p>

        </div>
    </div>
  )
}

export default LoginPage