import TitleText from './TitleText'
import AuthForm from './AuthForm'
import Container from 'react-bootstrap/Container'

export default function ShowInfo() {
    return (
        <Container className='position-absolute top-50 start-50 translate-middle'>
            <TitleText className='mx-auto' />
            <AuthForm className='col-md-5' />
        </Container>
    )
}