import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import Form from 'react-bootstrap/Form'
export default function ContentCard({data, checked, handleCheck}) {
    return (
        <Card>
            <Card.Header>
                <Stack direction='horizontal'>
                    <p className='mb-0'>Sender: {data.email}</p>
                    <Form.Check className='ms-auto' 
                                aria-label={`Checkbox for email from ${data.email}`}
                                checked={checked}
                                onChange={e => handleCheck(data.id)}/>
                </Stack>
            </Card.Header>
            <Card.Body>
                {data.body}
            </Card.Body>
        </Card>
    )
}