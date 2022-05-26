import React from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TitleText from './components/TitleText'
import AuthForm from './components/AuthForm'
import Container from 'react-bootstrap/Container'
// import { useNavigate, useLocation,} from 'react-router-dom'

export default function App() {
  // const navigate = useNavigate()
  // const location = useLocation()
  // const auth = useAuth()
  // const from = location.state?.from?.pathname || ""
  // console.log(from)
  // const handleLoginSubmit = (e) => {
  //   e.preventDefault()
  //   auth.signInApp(navigate(from, { replace: true }))
  // }
  return (
    <Container className='position-absolute top-50 start-50 translate-middle'>
        <TitleText className='mx-auto' />
        <AuthForm className='col-md-5' />
    </Container>
)
}
