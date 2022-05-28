import React from 'react'
import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import './ContentCard.css'

export default function ContentCard({ data, checked, profileColor, handleCheck }) {
    return (
        <Card>
            <Card.Header>
                <Stack direction='horizontal'>
                    <p className='mb-0'>Sender: {data.email}</p>
                    <Form.Check className='ms-auto'
                        aria-label={`Checkbox for email from ${data.email}`}
                        checked={checked}
                        onChange={e => handleCheck(data.id)} />
                </Stack>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col xs={2}>
                        <Container
                            className='profile-image'
                            style={{'backgroundColor': `#${profileColor}`}}>
                            <h3 className='profile-letter'>{data.email[0].toUpperCase()}</h3>
                        </Container>
                    </Col>
                    <Col>
                        {data.body}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}