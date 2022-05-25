import React, { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import logo from './logo.svg';
import './App.css';

function App() {
  // const [apiResponse, updateApiResponse] = useImmer({
  //   apiResponse: ''
  // })
  const [apiResponse, setApiResponse] = useState('')
  useEffect(() => {
    fetch('http://localhost:8000/testAPI')
      .then(res => res.text())
      .then(res => setApiResponse(res))
  })
  return (
    <div className='App'>
      <p className='App-intro'>{apiResponse}</p>
    </div>
  )
}

export default App;
