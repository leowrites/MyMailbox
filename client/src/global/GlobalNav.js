import { Navbar, Container } from 'react-bootstrap'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'

const simulateAuthentication = new Promise((res, rej) => {
    setTimeout(() => {
        res('success')
    }, 2000)
})

export default function GlobalNav() {
    const auth = useAuth()
    const navigate = useNavigate()
    const handleClick = () => {
        simulateAuthentication
            .then(() => (
                auth.signOutApp(
                    () => {
                        navigate('/')
                    }
                )
            )
            )
    }
    return (
        <Navbar>
            <Container>
                <Navbar.Brand href="#home">Unsubscribe.</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {
                            auth.isSignedIn ?
                                (
                                    <Stack direction='horizontal' gap={3}>
                                        {`Welcome, ${auth.username}`}
                                        <Button variant='light' size='sm' onClick={handleClick}>
                                            Logout
                                        </Button>
                                    </Stack>
                                ) :
                                ''
                        }
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}