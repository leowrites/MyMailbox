import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { EnvelopeCheck } from 'react-bootstrap-icons'
import EmailForm from './EmailForm'

export default function ControllBar({ buttonDisable, labels, handleOptionChange,
    allChecked, handleCheckAll, handleUnsubscribe,
    handleSubmitEmail, showEmailForm, setShowEmailForm
}) {
    return (
        <Container>
            <Row>
                <Col>
                    <Form.Select
                        defaultValue='CATEGORY_PROMOTIONS'
                        onChange={e => handleOptionChange(e.target.value)}>
                        {
                            labels && labels.map(item => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </option>
                            ))
                        }
                    </Form.Select>
                </Col>
                <Col className='m-auto'>
                    <Form.Check
                        type={'checkbox'}
                        id='select-all'
                        value={allChecked}
                        label={<strong>select all</strong>}
                        onChange={handleCheckAll} />
                </Col>
                <Col className='m-auto'>
                    <Button variant='dark'
                        size='sm'
                        disabled={buttonDisable}
                        onClick={handleUnsubscribe}>
                        {buttonDisable ?
                            <strong>Deleting...</strong> :
                            <strong>Delete! </strong>
                        }
                        <EnvelopeCheck />
                    </Button>
                </Col>
                <Col className='m-auto'>
                    <Button variant='dark'
                        size='sm'
                        onClick={() => setShowEmailForm(true)}>
                            <strong>New Email</strong>
                    </Button>
                </Col>
            </Row>
            <EmailForm show={showEmailForm}
                handleClose={() => setShowEmailForm(false)}
                handleSubmitEmail={handleSubmitEmail} />
        </Container>
    )
}