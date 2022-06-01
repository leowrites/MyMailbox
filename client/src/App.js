import React from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TitleText from './home/TitleText'
import AuthForm from './home/AuthForm'
import Container from 'react-bootstrap/Container'
import Stack from 'react-bootstrap/Stack'
// import { useNavigate, useLocation,} from 'react-router-dom'

export default function App() {
  return (
    <Container className='position-absolute top-50 start-50 translate-middle'>
      <Stack gap={3}>
        <TitleText className='mx-auto' />
        <AuthForm className='col-md-5' />
      </Stack>
    </Container>
)
}
