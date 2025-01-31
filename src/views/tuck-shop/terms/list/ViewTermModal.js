// @packages
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Alert,
  Badge
} from 'reactstrap'
import { useState } from 'react'
import moment from 'moment'
import { apiRequest } from '@utils'

const ViewTermModal = ({ isOpen, toggle, term, isCurrentTerm, onCurrentTermUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  if (!term) return null

  const handleSetCurrentTerm = async () => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      await apiRequest({
        url: '/terms/set-current',
        method: 'POST',
        body: JSON.stringify({ termId: term.id })
      })
      setSuccess('Term has been set as the current term successfully')
      setShowConfirmation(false)
      onCurrentTermUpdate()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setIsSubmitting(false)
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size='lg'>
      <ModalHeader toggle={toggle}>
        <div className='d-flex align-items-center'>
          <span className='mr-1'>{term.name}</span>
          {isCurrentTerm && <Badge color='success' pill>Current Term</Badge>}
        </div>
      </ModalHeader>
      <ModalBody>
        {error && <Alert color='danger'>{error}</Alert>}
        {success && <Alert color='success'>{success}</Alert>}
        {showConfirmation ? (
          <Alert color='warning'>
            <h6 className='alert-heading'>Confirm Action</h6>
            <div className='alert-body'>
              Are you sure you want to set this as the current term? This will replace the existing current term.
            </div>
            <div className='mt-2'>
              <Button
                color='warning'
                size='sm'
                className='mr-1'
                onClick={handleSetCurrentTerm}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Setting...' : 'Yes, Set as Current'}
              </Button>
              <Button
                color='secondary'
                size='sm'
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </Alert>
        ) : null}
        <Row>
          <Col sm='12'>
            <h6 className='mb-1'>Description</h6>
            <p className='mb-2'>{term.description}</p>
          </Col>
          <Col sm='6'>
            <h6 className='mb-1'>Start Date</h6>
            <p>{moment(term.startDate).format('LL')}</p>
          </Col>
          <Col sm='6'>
            <h6 className='mb-1'>End Date</h6>
            <p>{moment(term.endDate).format('LL')}</p>
          </Col>
          {term.createdAt && (
            <Col sm='6'>
              <h6 className='mb-1'>Created At</h6>
              <p>{moment(term.createdAt).format('LLL')}</p>
            </Col>
          )}
          {term.updatedAt && (
            <Col sm='6'>
              <h6 className='mb-1'>Last Updated</h6>
              <p>{moment(term.updatedAt).format('LLL')}</p>
            </Col>
          )}
        </Row>
      </ModalBody>
      <ModalFooter>
        {!isCurrentTerm && (
          <Button 
            color='primary' 
            className='mr-1'
            onClick={() => setShowConfirmation(true)}
            disabled={isSubmitting || showConfirmation}
          >
            Set as Current Term
          </Button>
        )}
        <Button color='secondary' onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ViewTermModal 