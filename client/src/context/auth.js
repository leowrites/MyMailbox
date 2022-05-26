import React from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'

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

const AuthStatus = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  if (!auth.isSignedIn) {
    return <p>You are not logged in</p>
  }

  return (
    <p>Welcome
      <button
        onClick={
          auth.signOutApp(() => navigate('/'))
        }>
        Signout
      </button>
    </p>
  )
}
const RequireAuth = ({ children }) => {
  const auth = useAuth()
  const location = useLocation()
  if (!auth.isSignedIn) {
    console.log('You are not signed in!')
    return <Navigate to='/' state={{ from: location }} replace />
  }
  return children
}

export {AuthProvider, AuthContext, useAuth, AuthStatus, RequireAuth}