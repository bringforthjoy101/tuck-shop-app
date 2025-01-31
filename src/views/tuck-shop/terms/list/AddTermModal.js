// @packages
import { useState } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap'
import { apiRequest } from '@utils'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const AddTermModal = ({ isOpen, toggle, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name, dates) => {
    setFormData(prev => ({ ...prev, [name]: dates[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
        const body = JSON.stringify({
            ...formData,
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
        })
        await apiRequest({url: '/terms', method: 'POST', body})
      onSuccess()
      setFormData({ name: '', description: '', startDate: '', endDate: '' })
    } catch (err) {
        console.log(err)
      setError(err.response?.data?.message || 'Something went wrong')
    }

    setIsSubmitting(false)
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>Add New Term</ModalHeader>
        <ModalBody>
          {error && <Alert color='danger'>{error}</Alert>}
          
          <FormGroup>
            <Label for='name'>Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for='description'>Description</Label>
            <Input
              type='textarea'
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for='startDate'>Start Date</Label>
            <Flatpickr
              className='form-control'
              value={formData.startDate}
              onChange={(dates) => handleDateChange('startDate', dates)}
              options={{
                dateFormat: 'Y-m-d',
                minDate: 'today'
              }}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for='endDate'>End Date</Label>
            <Flatpickr
              className='form-control'
              value={formData.endDate}
              onChange={(dates) => handleDateChange('endDate', dates)}
              options={{
                dateFormat: 'Y-m-d',
                minDate: formData.startDate || 'today'
              }}
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggle} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button color='primary' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default AddTermModal 