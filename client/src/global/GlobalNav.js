import { Navbar, Container } from 'react-bootstrap'
import { useAuth } from '../context/auth'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Form from 'react-bootstrap/Form'


export default function GlobalNav() {
    const auth = useAuth()
    return (
        <Navbar>
            <Container>
                <Navbar.Brand href="/">Delete.</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {
                            auth.isSignedIn ?
                                (
                                    <Stack direction='horizontal' gap={3}>
                                        {`Welcome, ${auth.username}`}
                                        <Form action='api/mail/logout' method='POST'>
                                            <Button type='submit' variant='light' size='sm'>
                                                Logout
                                            </Button>
                                        </Form>
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