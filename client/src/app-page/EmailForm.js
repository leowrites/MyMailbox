import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Formik } from 'formik'
import * as yup from 'yup'

const EmailForm = ({ show, handleClose, handleSubmitEmail }) => {
    const userSchema = yup.object().shape({
        to: yup.string().email().required('Email is required'),
        title: yup.string().required('Title is required'),
        body: yup.string().required('Body is required')
    })

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Send a New Email</Modal.Title>
            </Modal.Header>
            <Modal.Body className='pb-0'>
                <Formik
                    initialValues={{ to: '', body: '', title: ''}}
                    onSubmit={
                        (values) => handleSubmitEmail(values)
                    }
                    validationSchema={userSchema}>
                    {({
                        values, touched, errors, dirty, isSubmitting, handleChange,
                        handleBlur, handleSubmit, handleReset
                    }) => (

                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label>Recipient</Form.Label>
                                <Form.Control
                                    id="to"
                                    type='to'
                                    value={values.to}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={!errors.to && touched.to}
                                />
                                <Form.Control.Feedback>
                                    Looks Good!
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Label>
                                Title
                            </Form.Label>
                            <Form.Group className='mb-3'>
                                <Form.Control
                                    id='title'
                                    type='text'
                                    value={values.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={!errors.title && touched.title}
                                />
                                <Form.Control.Feedback>
                                    Looks Good!
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    id='body'
                                    name='body'
                                    as='textarea'
                                    rows={4}
                                    value={values.body}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isValid={!errors.body && touched.body}
                                />
                                <Form.Control.Feedback>
                                    Looks Good!
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Modal.Footer>
                                <Button variant='secondary' onClick={handleClose}>
                                    Close
                                </Button>
                                <Button type='submit' disabled={isSubmitting}>
                                    Send!
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default EmailForm