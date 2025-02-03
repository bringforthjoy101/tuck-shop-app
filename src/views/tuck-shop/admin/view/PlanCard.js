import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {useHistory, Link } from 'react-router-dom'
// ** Reactstrap
import { Card, CardHeader, CardBody, Badge, UncontrolledTooltip, Button } from 'reactstrap'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

import { getAllData, deleteAdmin } from '../store/action'
import { store } from '@store/storeConfig/store'
import { EditAdmin } from './EditAdmin'
import { apiRequest } from '@utils'

const PlanCard = ({ selectedAdmin }) => {

  // state
  const [toggleButton, setToggleButton] = useState(false)

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
        const deleted = await dispatch(deleteAdmin(id))
        if (deleted) {
          await dispatch(getAllData())
            MySwal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Admin has been deleted.',
                customClass: {
                  confirmButton: 'btn btn-primary'
                }
              })
          history.push(`/admins/list`)
        }
        
      }
    })
  
}

  const handleResetPassword = async (id) => {
    return MySwal.fire({
      title: 'Reset Password?',
      text: "This will reset the admin's password. They will receive new credentials via email.",
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
        const response = await apiRequest({ url: `/reset-admin-password/${id}`, method: "GET" }, dispatch)
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
         onClick={() => { handleDelete(selectedAdmin.id) } }
       >
         Delete Admin
       </Button.Ripple>
        <EditAdmin selectedAdmin={selectedAdmin} />
        <Button.Ripple 
          className='text-center mb-1' 
          color='info'
          outline
          block
          onClick={() => { handleResetPassword(selectedAdmin.id) }}
        >
          Reset Password
        </Button.Ripple>
      </CardBody> 
    </Card>
  ) 
}

export default PlanCard
