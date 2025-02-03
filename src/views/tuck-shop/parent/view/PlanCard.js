import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {useHistory, Link } from 'react-router-dom'
// ** Reactstrap
import { Card, CardHeader, CardBody, Badge, UncontrolledTooltip, Button, Spinner } from 'reactstrap'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

import { getAllData, deleteParent } from '../store/action'
import { store } from '@store/storeConfig/store'
import { EditParent } from './EditParent'
import { apiRequest } from '@utils'


const PlanCard = ({ selectedParent }) => {

  // state
  const [toggleButton, setToggleButton] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // ** Function to toggle sidebar
  const openButton = () => setToggleButton(!toggleButton)

  const history = useHistory()
  const dispatch = useDispatch()

  const handleDelete = async (id) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then(async function (result) {
      if (result.value) {
        setIsDeleting(true)
        try {
          const deleted = await dispatch(deleteParent(id))
          if (deleted) {
            await dispatch(getAllData())
            MySwal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Parent has been deleted.',
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            })
            history.push(`/parents/list`)
          }
        } finally {
          setIsDeleting(false)
        }
      }
    })
  }

  const handleResetPassword = async (id) => {
    return MySwal.fire({
      title: 'Reset Password?',
      text: "Are you sure you want to reset this parent's password?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reset it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then(async function (result) {
      if (result.value) {
        setIsResetting(true)
        try {
          const response = await apiRequest({ 
            url: `/reset-parent-password/${id}`, 
            method: "GET" 
          }, dispatch)
          
          if (response && response.data.status) {
            MySwal.fire({
              icon: 'success',
              title: 'Password Reset!',
              text: response.data.message,
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            })
          } else {
            MySwal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to reset password. Please try again.',
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            })
          }
        } finally {
          setIsResetting(false)
        }
      }
    })
  }

  return (
    <Card className='plan-card border-primary'>
      <CardHeader className='d-flex justify-content-between align-items-center pt-75 pb-1'>
        <h5 className='mb-0'>Actions</h5>
      </CardHeader>
      <CardBody>
        <Button.Ripple 
         className='text-center mb-1' 
         color='danger'
         block
         disabled={isDeleting}
         onClick={() => { handleDelete(selectedParent.id) }}
       >
         {isDeleting ? <><Spinner size='sm' className='mr-50' /> Deleting...</> : 'Delete Parent'}
       </Button.Ripple>
        <EditParent selectedParent={selectedParent} />
        <Button.Ripple 
          className='text-center mb-1' 
          color='info'
          block
          outline
          disabled={isResetting}
          onClick={() => { handleResetPassword(selectedParent.id) }}
        >
          {isResetting ? <><Spinner size='sm' className='mr-50' /> Resetting...</> : 'Reset Password'}
        </Button.Ripple>
      </CardBody> 
    </Card>
  ) 
}

export default PlanCard
