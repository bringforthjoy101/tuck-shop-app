// ** Custom Components
import { useState, useEffect } from 'react'
import Avatar from '@components/avatar'
import moment from 'moment'

import {useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { deleteStudent, getAllData, editStudent, getStudentDetails } from '../store/action'

const MySwal = withReactContent(Swal)

// ** Third Party Components
import { Card, CardBody, CardText, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, CustomInput } from 'reactstrap'
import { Pocket, Award, Hexagon, UserPlus, Check, Star, Flag, Phone } from 'react-feather'
import CardTitle from 'reactstrap/lib/CardTitle'
import { AvForm, AvInput } from 'availity-reactstrap-validation-safe'

const UserInfoCard = ({ studentDetails, userRole }) => {

  const renderStudentImg = () => {
    if (studentDetails !== null && studentDetails.avatar) {
      return <img src={studentDetails.avatar} alt='user-avatar' className='img-fluid rounded' height='104' width='104' />
    } else {
      const stateNum = Math.floor(Math.random() * 6),
        states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
        color = states[stateNum]
      return (
        <Avatar
          initials
          color={color}
          className='rounded'
          content={`${studentDetails.firstName} ${studentDetails.lastName}`}
          contentStyles={{
            borderRadius: 0,
            fontSize: 'calc(36px)',
            width: '100%',
            height: '100%'
          }}
          style={{
            height: '90px',
            width: '90px'
          }}
        />
      )
    }
  }

  const history = useHistory()
  const dispatch = useDispatch()

  // ** Handle Delete
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
            const deleted = await dispatch(deleteStudent(id))
            if (deleted) {
              await dispatch(getAllData())
                MySwal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Student has been deleted.',
                    customClass: {
                      confirmButton: 'btn btn-primary'
                    }
                  })
              history.push(`/students/list`)
            }
            
          }
        })
      
  }

  const getTotalSpent = (transactions) => {
    const debitTransactions = transactions.filter(item => { return item.type === 'debit' })
    const totalPrice = debitTransactions.reduce(function (accumulator, item) {
      return accumulator + item.amount
    }, 0)
    return totalPrice
  }

  const [userData, setUserData] = useState({
    avatar: studentDetails.avatar,
    firstName: studentDetails.firstName,
    lastName: studentDetails.lastName,
    otherName: studentDetails.otherName,
    type: studentDetails.type,
    class: studentDetails.class,
    year: studentDetails.year,
    group: studentDetails.group,
    status: studentDetails.status,
    role: studentDetails.role
  })
  const [formModal, setFormModal] = useState(false)

  const onSubmit = async (event, errors) => {
    event?.preventDefault()
    if (errors && !errors.length) {
      await dispatch(editStudent(studentDetails.id, userData))
      dispatch(getStudentDetails(studentDetails.id))
      setFormModal(!formModal)
   }
  }

  const uploadImage = async (event) => {
    event?.preventDefault()
      const formData = new FormData()
      formData.append("image", event.target.files[0])
      try {
        const response = await apiRequest({
          url: "/upload-images",
          method: "POST",
          body: formData
        })
        if (response) {
          if (response?.data?.status) {
            const avatar = response.data.data
            // setIsSubmitting(false)
            setUserData({ ...userData, avatar })
          } else {
            swal("Oops!", response.data.message, "error")
          }
        } else {
          swal("Oops!", "Something went wrong with your image.", "error")
        }
      } catch (error) {
        console.error({ error })
      }
  }

  return (
    <Card>
      <CardBody>
        <Row>
          <Col xl='6' lg='12' className='d-flex flex-column justify-content-between border-container-lg'>
            <div className='user-avatar-section'>
              <div className='d-flex justify-content-start'>
              {renderStudentImg()}
                <div className='d-flex flex-column ml-1'>
                  <div className='user-info mb-1'>
                    <h4 className='mb-0'>{studentDetails !== null ? `${studentDetails.firstName} ${studentDetails.lastName} ${studentDetails.otherName}` : 'Student Name'}</h4>
                    <CardText tag='span'>
                      Year {studentDetails?.year} {studentDetails?.group}
                    </CardText>
                  </div>
                  <div className='d-flex flex-wrap align-items-center'>
                    {/* <Button.Ripple tag={Link} to={`/student/edit/${studentDetails.id}`} disabled color='primary'>
                      Edit
                    </Button.Ripple> */}
                    {userRole === 'manager' || userRole === 'busary' ? <Button.Ripple className='text-center' color='primary' onClick={() => setFormModal(!formModal)}>
                      Edit Student
                    </Button.Ripple> : ''}
                    <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-centered modal-lg'>
                      <ModalHeader toggle={() => setFormModal(!formModal)}>Edit Admin</ModalHeader>
                      <AvForm onSubmit={onSubmit}>
                        <ModalBody>
                          <Row>
                            <Col xl='6' lg='12'> 
                              <FormGroup>
                                <Label for='image'>Student Image</Label>
                                <CustomInput type='file' id='image' name='image' accept='image/*' onChange={e => uploadImage(e)} required  />
                              </FormGroup>
                            </Col>
                            <Col xl='6' lg='12'>
                              <FormGroup>
                                <Label for='firstName'>First Name</Label>
                                <AvInput 
                                  type='text' 
                                  name='firstName' 
                                  id='firstName' 
                                  placeholder='First Name' 
                                  value={studentDetails.firstName}
                                  onChange={e => setUserData({...userData, firstName: e.target.value})}
                                  required 
                                />
                              </FormGroup>
                            </Col>
                            <Col xl='6' lg='12'>
                              <FormGroup>
                                <Label for='lastName'>Last Name</Label>
                                <AvInput 
                                  type='text' 
                                  name='lastName' 
                                  id='lastName' 
                                  placeholder='Last Name' 
                                  value={studentDetails.lastName}
                                  onChange={e => setUserData({...userData, lastName: e.target.value})}
                                  required 
                                />
                              </FormGroup>
                            </Col>
                            <Col xl='6' lg='12'>
                              <FormGroup>
                                <Label for='otherName'>Other Name</Label>
                                <AvInput 
                                  type='text' 
                                  name='otherName' 
                                  id='otherName' 
                                  placeholder='Other Name' 
                                  value={studentDetails.otherName}
                                  onChange={e => setUserData({...userData, otherName: e.target.value})}
                                />
                              </FormGroup>
                            </Col>
                            <Col xl='6' lg='12'>
                              <FormGroup>
                                <Label for='type'>Type</Label>
                                <AvInput
                                  type='select'
                                  id='type'
                                  name='type'
                                  value={studentDetails.type}
                                  onChange={e => setUserData({ ...userData, type: e.target.value })}
                                  required
                                >
                                  <option value={studentDetails.type}>{studentDetails.type}</option>
                                  <option value='boarding'>Boarding</option>
                                  <option value='day'>Day</option>
                                </AvInput>
                              </FormGroup>
                            </Col>
                            <Col xl='6' lg='12'>
                              <FormGroup>
                                <Label for='class'>Class</Label>
                                <AvInput
                                  type='select'
                                  id='class'
                                  name='class'
                                  value={studentDetails.class}
                                  onChange={e => setUserData({ ...userData, class: e.target.value })}
                                  required
                                >
                                  <option value={studentDetails.class}>{studentDetails.class}</option>
                                  <option value='junior'>Junior</option>
                                  <option value='senior'>Senior</option>
                                </AvInput>
                              </FormGroup>
                            </Col>
                            <Col xl='6' lg='12'>
                              <FormGroup>
                                <Label for='year'>Year</Label>
                                <AvInput
                                  type='select'
                                  id='year'
                                  name='year'
                                  value={studentDetails.year}
                                  onChange={e => setUserData({ ...userData, year: e.target.value })}
                                  required
                                >
                                  <option value={studentDetails.year}>{studentDetails.year}</option>
                                  <option value='7'>7</option>
                                  <option value='8'>8</option>
                                  <option value='9'>9</option>
                                  <option value='10'>10</option>
                                  <option value='11'>11</option>
                                  <option value='12'>12</option>
                                </AvInput>
                              </FormGroup>
                            </Col>
                            <Col xl='6' lg='12'>
                              <FormGroup>
                                <Label for='group'>Group</Label>
                                <AvInput
                                  type='select'
                                  id='group'
                                  name='group'
                                  value={studentDetails.group}
                                  onChange={e => setUserData({ ...userData, group: e.target.value })}
                                  required
                                >
                                  <option value={studentDetails.group}>{studentDetails.group}</option>
                                  <option value='A'>A</option>
                                  <option value='W'>W</option>
                                  <option value='R'>R</option>
                                </AvInput>
                              </FormGroup>
                            </Col>
                            <Col xl='6' lg='12'>
                              <FormGroup>
                                <Label for='status'>User Status</Label>
                                <AvInput
                                  type='select'
                                  id='status'
                                  name='status'
                                  value={studentDetails.status}
                                  onChange={e => setUserData({ ...userData, status: e.target.value })}
                                  required
                                >
                                  <option value={studentDetails.status}>{studentDetails.status}</option>
                                  <option value='active'>Active</option>
                                  <option value='inactive'>Inactive</option>
                                </AvInput>
                              </FormGroup>
                            </Col>
                          </Row>
                        </ModalBody>
                        <ModalFooter>
                          <Button.Ripple color='primary' type='submit'>
                            <span className='ml-50'>Save Changes</span>
                          </Button.Ripple>
                        </ModalFooter>
                      </AvForm>

                    </Modal>
                    {userRole === 'manager' || userRole === 'busary' ? <Button.Ripple className='ml-1' color='danger' outline onClick={() => handleDelete(studentDetails.id)}>
                      Delete
                    </Button.Ripple> : ''}
                    {/* <Button.Ripple className='ml-1' color='danger' outline onClick={() => handleDelete(studentDetails.id)}>
                      Delete
                    </Button.Ripple> */}
                  </div>
                </div>
              </div>
            </div>
            <div className='d-flex align-items-center user-total-numbers'>
              <div className='d-flex align-items-center mr-2'>
                <div className='color-box bg-light-primary'>
                  <Pocket className='text-primary' />
                </div>
                <div className='ml-1'>
                  <h5 className='mb-0'>{studentDetails.wallet.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}</h5>
                  <small>Pocket Money</small>
                </div>
              </div>
              <div className='d-flex align-items-center'>
                <div className='color-box bg-light-success'>
                  <Pocket className='text-success' />
                </div>
                <div className='ml-1'>
                  <h5 className='mb-0'>{getTotalSpent(studentDetails.transactions).toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}</h5>
                  <small>Spent So Far</small>
                </div>
              </div>
            </div>
            
          </Col>
          <Col xl='6' lg='12' className='mt-2 mt-xl-0'>
            <div className='user-info-wrapper'>
                <div className='d-flex flex-wrap align-items-center mt-0'>
                  <div className='user-info-title'>
                    <Award className='mr-1' size={14} />
                    <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                      Class
                </CardText>
                  </div>
                  <CardText className='mb-0'>Year {studentDetails?.year} {studentDetails?.group}</CardText>
                </div>
                <div className='d-flex flex-wrap align-items-center mt-1'>
                  <div className='user-info-title'>
                    <Hexagon className='mr-1' size={14} />
                    <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                      Student Type
                </CardText>
                  </div>
                  <CardText className='text-capitalize mb-0'>{studentDetails?.type}</CardText>
                </div>
                <div className='d-flex flex-wrap align-items-center mt-1'>
                  <div className='user-info-title'>
                    <Star className='mr-1' size={14} />
                    <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                      Status
                    </CardText>
                  </div>
                  <CardText className='text-capitalize mb-0'>{studentDetails?.status}</CardText>
                </div>
                <div className='d-flex flex-wrap align-items-center mt-1'>
                  <div className='user-info-title'>
                    <UserPlus className='mr-1' size={14} />
                    <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                      Enrolled
                    </CardText>
                  </div>
                  <CardText className='text-capitalize mb-0'>{moment(studentDetails?.createdAt).format('LL')}</CardText>
                </div>
            </div>
          </Col>
        </Row>
        {/* {userDetails.user_details.tracking_id !== null ? */}
        {/* <Row>
          <Col>
            <div className='user-info-wrapper'>
              <div className="mt-2">
                <div className='user-info-title'>
                  <CardTitle> Tracking  Details: </CardTitle>
                </div>
                <div className='d-flex flex-wrap align-items-center mt-0'>
                  <div className='user-info-title'>
                    <User className='mr-1' size={14} />
                    <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                      Full Name
                </CardText>
                  </div>
                  <CardText className='mb-0'>{trackDetails.data.user?.names}</CardText>
                </div>
                <div className='d-flex flex-wrap align-items-center mt-1'>
                  <div className='user-info-title'>
                    <Flag className='mr-1' size={14} />
                    <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                      Email
                </CardText>
                  </div>
                  <CardText className='mb-0'>{trackDetails.data.user?.email}</CardText>
                </div>
                <div className='d-flex flex-wrap align-items-center mt-1'>
                  <div className='user-info-title'>
                    <Phone className='mr-1' size={14} />
                    <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                      Username
                </CardText>
                  </div>
                  <CardText className='mb-0'>{trackDetails.data.user?.username}</CardText>
                </div>
                <div className='d-flex flex-wrap align-items-center mt-1'>
                  <div className='user-info-title'>
                    <Phone className='mr-1' size={14} />
                    <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                      Phone
                </CardText>
                  </div>
                  <CardText className='mb-0'>{trackDetails.data.user?.phone}</CardText>
                </div>
              </div>
            </div>
          </Col>
        </Row> */}
        {/* : ""} */}
      </CardBody>
    </Card>
  )
}

export default UserInfoCard
