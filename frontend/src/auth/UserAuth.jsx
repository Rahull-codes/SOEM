import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user.context'
import { Navigate, useNavigate } from 'react-router-dom'

const UserAuth = ({children}) => {

    const navigate= useNavigate()
    const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token');

    
    // console.log(user , token );
    useEffect(() =>{

        if(user){
        setLoading(false)
        }
        
        if(!token ){
            navigate('/login')
        }

        if(!user){
            navigate('/login')
        }

    },[])

    if(loading){
        return <div>Loading...</div>
    }
    
  return (
    <>
        {children}
    </>
  )
}

export default UserAuth
