import { Outlet } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import GlobalNav from './GlobalNav'
export default function Layout({children}) {
    return(
        <div>
            <GlobalNav>
                {children}
            </GlobalNav>
            <Container>
                <Outlet />
            </Container>
        </div>
    )
}