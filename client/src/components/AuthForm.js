import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Google } from 'react-bootstrap-icons'

const simulateRequest = () => {
    return new Promise((resolve) => setTimeout(resolve, 1000))
}

export default function AuthForm(props) {
    const [apiResponse, setApiResponse] = useState('')
  // const [apiResponse, updateApiResponse] = useImmer({
  //   apiResponse: ''
  // })
  // const [apiResponse, setApiResponse] = useState('')
  // useEffect(() => {
  //   fetch('http://localhost:8000/')
  //     .then(res => res.text())
  //     .then(res => setApiResponse(res))
  // })
    const handleClick = (e) => {
        setApiResponse(true)
        fetch('http://localhost:8000/api/mail', {
            method: 'POST'
        })
        .then(res => res.text())
        .then(res => setApiResponse(res))
    }
    return (
        <>
            <Form action='/api/mail' method='POST' >
                    <Button
                        variant='dark'
                        disabled={apiResponse}
                        onClick={!apiResponse ? handleClick : null} >
                        {apiResponse ? 'Authorizing...' :
                            <p><Google />  <strong>Authorize with Google</strong></p>}
                    </Button>
            </Form>
        </>
    )
}