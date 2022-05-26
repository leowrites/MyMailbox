import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { useImmer } from 'use-immer'
import { Google } from 'react-bootstrap-icons'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'


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

export default function AuthForm() {
    const auth = useAuth()
    const navigate = useNavigate()
    // const location = useLocation()
    // const from = location.state?.from?.pathname || '/app'
    const [apiResponse, setApiResponse] = useState(false)
    const [formData, setFormData] = useState(
        {
            username: ''
        }
    )
    const handleClick = async (e) => {
        if (!auth.isSignedIn) {
            setApiResponse(true)
            simulateAuthentication
                .then(value => {
                    setApiResponse(false)
                    auth.signInApp(formData.username, () => (navigate('/appage')))
                }
                )
                .catch(err => {
                    console.log('something went wrong!')
                    console.error(err)
                })
            // fetch('/api/mail/login', {
            //     method: 'POST',
            // })
            //     .then(res => console.log(res))
            //     .then(res => setApiResponse(res))
        } else {
            navigate('/appage')
        }
    }
    return (
        <>
            <InputGroup>
                <FormControl
                    id='username'
                    value={formData.username}
                    placeholder='Your username'
                    onChange={e => {
                        setFormData({
                            username: e.target.value
                            }
                        )
                    }
                    } />
            </InputGroup>
            <Button
                variant='dark'
                disabled={apiResponse}
                onClick={!auth.isSignedIn ? handleClick : null} >
                {apiResponse ?
                    <p><Google /> Authorizing... </p> :
                    <p><Google />  <strong>Authorize with Google</strong></p>}
            </Button>
        </>
    )
}