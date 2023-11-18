import Cookies from 'js-cookie'
import React from 'react'
import { Navigate, Route } from 'react-router-dom'

const protectedRoute = props => {
    const token = Cookies.get("jwt_token")
    if(token !== true){
        return <Navigate to="/login" />
    }
  return <Route {...props}/>
}

export default protectedRoute