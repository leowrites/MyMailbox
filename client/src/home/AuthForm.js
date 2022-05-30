import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Google } from 'react-bootstrap-icons'


export default function AuthForm() {
    return (
        <Form action='api/mail/login' method='POST'>
            <Button
                variant='dark'
                type='submit'
                >
                <p className='mb-0'><Google /> <strong>Authorize with Google</strong></p>
            </Button>
        </Form>
    )
}