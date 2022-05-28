import React, { useEffect } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const AuthContext = React.createContext(null)

const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = React.useState(false)
  const [username, setUsername] = React.useState(null)
  const signInApp = (username, callback) => {
    setUsername(username)
    setIsSignedIn(true)
    callback()
  }
  const signOutApp = (callback) => {
    setIsSignedIn(false)
    setUsername(null)
    callback()
  }
  return <AuthContext.Provider value={{ isSignedIn, username, signInApp, signOutApp }}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  return React.useContext(AuthContext)
}
const RequireAuth = ({ children }) => {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // request user information and setting authcontext
  useEffect(() => {
    fetch("api/mail/auth")
    .then(res => res.json())
    .then(data => {
      // redirect user to the login page
      auth.signInApp(data.emailAddress, () => (navigate('/appage')))
    })
  },[])

  if (!auth.isSignedIn) {
    console.log('You are not signed in!')
    return <Navigate to='/' state={{ from: location }} replace />
  }
  return children
}

export {AuthProvider, AuthContext, useAuth, RequireAuth}