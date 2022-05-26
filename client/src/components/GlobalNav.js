import { Navbar, Container } from 'react-bootstrap'
import { useAuth } from '../context/auth'
export default function GlobalNav({children}) {
    const auth = useAuth()
    return (
        <Navbar>
            <Container>
                <Navbar.Brand href="#home">Unsubscribe.</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {
                            auth.isSignedIn? 'Welcome': 'Sign In'
                        }
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}