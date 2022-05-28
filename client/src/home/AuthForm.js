import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Google, HandIndexFill } from 'react-bootstrap-icons'
// import { useAuth } from '../context/auth'
// import { useNavigate } from 'react-router-dom'


export default function AuthForm() {
    // const auth = useAuth()
    // const navigate = useNavigate()
    // const location = useLocation()
    // const from = location.state?.from?.pathname || '/app'

    const [isRedirecting, setIsRedirecting] = useState(false)
    const handleClick = () => {
        if (!isRedirecting) {
            setIsRedirecting(true)
        }
    }
    return (
        <Form action='api/mail/login' method='POST'>
            <Button
                variant='dark'
                type='submit'
                disabled={isRedirecting}
                >
                {isRedirecting ?
                <p className='mb-0'><Google /><strong> Redirecting you to Google...</strong></p> :
                <p className='mb-0'><Google /> <strong>Authorize with Google</strong></p>
                }
            </Button>
        </Form>
    )
}