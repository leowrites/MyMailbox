import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Google } from 'react-bootstrap-icons'
import { useAuth } from '../context/auth'
import { useLocation, useNavigate } from 'react-router-dom'


// const { google } = require('googleapis')
// const path = require('path')

// require('dotenv').config({
//     path: path.join(path.resolve(), '.env')
// })
// console.log(path.join(path.resolve(), '.env'))

const simulateAuthentication = new Promise((res, rej) => {
    setTimeout(() => {
        res('success')
    }, 2000)
})

export default function AuthForm(props) {
    const auth = useAuth()
    const navigate = useNavigate()
    // const location = useLocation()
    // const from = location.state?.from?.pathname || '/app'
    const [apiResponse, setApiResponse] = useState('')
    const handleClick = async (e) => {
        setApiResponse(true)
        simulateAuthentication
            .then(value => {
                setApiResponse(false)
                auth.signInApp(() => (navigate('/appage')))
                }
            )
            .catch(err => {
                console.log('something went wrong!')
            })
        // fetch('/api/mail/login', {
        //     method: 'POST',
        // })
        //     .then(res => console.log(res))
        //     .then(res => setApiResponse(res))
    }
    return (
        <>
            <Form>
                <Button
                    variant='dark'
                    disabled={apiResponse}
                    onClick={!apiResponse ? handleClick : null} >
                    {apiResponse ?
                        <p><Google /> Authorizing... </p> :
                        <p><Google />  <strong>Authorize with Google</strong></p>}
                </Button>
            </Form>
        </>
    )
}