// ** Reactstrap
import { Card, CardHeader, CardBody, Badge, UncontrolledTooltip, Button } from 'reactstrap'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

import { updateStudentStatus, resetStudentPassword  } from '../store/action'
import { PasswordReset, BlacklistUser, TrackingDetails, AddFunds, DeductFunds } from './AddFunds'
import { store } from '@store/storeConfig/store'
import { selectThemeColors, isUserLoggedIn } from '@utils'

const PlanCard = ({ studentDetails }) => {

  const [userData, setUserData] = useState(null)
  const [isStatusLoading, setIsStatusLoading] = useState(false)
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false)
  
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])

  const handleStatusUpdate = (id, newStatus) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${newStatus === 'active' ? 'activate' : 'suspend'} this student?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'btn btn-primary mr-1',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) {
        setIsStatusLoading(true)
        store.dispatch(updateStudentStatus(id, newStatus))
          .then(() => {
            setIsStatusLoading(false)
          })
          .catch(() => {
            setIsStatusLoading(false)
          })
      }
    })
  }

  const handlePasswordReset = (id) => {
    Swal.fire({
      title: 'Confirm Password Reset',
      text: 'Are you sure you want to reset the password for this student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset it!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'btn btn-primary mr-1',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) {
        setIsPasswordResetLoading(true)
        store.dispatch(resetStudentPassword(id))
          .then(() => {
            setIsPasswordResetLoading(false)
          })
          .catch(() => {
            setIsPasswordResetLoading(false)
          })
      }
    })
  }

  return (
    <Card className='plan-card border-primary'>
      <CardHeader className='d-flex justify-content-between align-items-center pt-75 pb-1'>
      </CardHeader>
      <CardBody>
        {studentDetails.status === "active" ? (
          <Button.Ripple 
            className='text-center mb-1' 
            color='danger' 
            outline 
            block 
            disabled={isStatusLoading}
            onClick={() => handleStatusUpdate(studentDetails.id, 'suspended')}
          > 
            {isStatusLoading ? 'Processing...' : 'Suspend Student'}
          </Button.Ripple>
        ) : (
          <Button.Ripple 
            className='text-center mb-1' 
            color='success' 
            outline
            block
            disabled={isStatusLoading}
            onClick={() => handleStatusUpdate(studentDetails.id, 'active')}
          >
            {isStatusLoading ? 'Processing...' : 'Activate Student'}
          </Button.Ripple>
        )}
        {userData?.role === "manager" || userData?.role === "bursary" ? <div><AddFunds studentDetails={studentDetails} /> <DeductFunds studentDetails={studentDetails} /> </div> : ''}
        <Button.Ripple 
          className='text-center mb-1' 
          color='info' 
          outline
          block
          disabled={isPasswordResetLoading}
          onClick={() => handlePasswordReset(studentDetails.id)}
        >
          {isPasswordResetLoading ? 'Resetting...' : 'Reset Password'}
        </Button.Ripple>
      </CardBody>
    </Card>
  )
}

export default PlanCard
