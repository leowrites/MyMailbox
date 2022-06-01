import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

export default function FlashMessage({ handleMessageClick, show, header, message }) {
    // set a timer on render
    return (
        <Alert show={show} variant='success'>
            <Alert.Heading>{header}</Alert.Heading>
            <p>{message}</p>
            <hr />
            <div className='d-flex justify-content-end'>
                <Button variant='outline-success'
                    onClick={handleMessageClick}>Go away!</Button>
            </div>
        </Alert>
    )
}