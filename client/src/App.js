import React from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import ShowInfo from './components/ShowInfo';

export default function App() {
  return (
    <Container className='vh-100'>
      <ShowInfo />
    </Container>
  )
}
