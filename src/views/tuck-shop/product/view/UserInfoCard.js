// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Card, CardBody, CardText, Row, Col, Button, Badge } from 'reactstrap'
import moment from 'moment'

import {useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Hexagon, Star, UserPlus, Calendar, Check, DollarSign, User, Box } from 'react-feather'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { deleteProduct, getAllData } from '../store/action'

const MySwal = withReactContent(Swal)


const UserInfoCard = ({ selectedProduct }) => {

  const renderImg = () => {
    if (selectedProduct !== null && selectedProduct.image) {
      return <img src={selectedProduct.image} alt='user-avatar' className='img-fluid rounded' height='104' width='104' />
    } else {
      const stateNum = Math.floor(Math.random() * 6),
        states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
        color = states[stateNum]
      return (
        <Avatar
          initials
          color={color}
          className='rounded'
          content={selectedProduct.name}
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
            const deleted = await dispatch(deleteProduct(id))
            if (deleted) {
              await dispatch(getAllData())
                MySwal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Product has been deleted.',
                    customClass: {
                      confirmButton: 'btn btn-primary'
                    }
                  })
              history.push(`/products/list`)
            }
            
          }
        })
      
  }

  return (
    <Card>
      <CardBody>
        <Row>
          <Col xl='6' lg='12' className='d-flex flex-column justify-content-between border-container-lg'>
            <div className='user-avatar-section'>
              <h3>Product Details</h3>
              <div className='d-flex justify-content-start'>
                {renderImg()}
                <div className='d-flex flex-column ml-1'>
                  <div className='user-info mt-2'>
                    <h4 className='mb-1'>{selectedProduct.name}</h4>
                    {/* <CardText tag='span'>
                      <Badge color='primary' pill>{selectedProduct.type}</Badge>
                    </CardText> */}
                  </div>
                  <div className='d-flex flex-wrap align-items-center'>
                    <Button.Ripple tag={Link} to={`/product/edit/${selectedProduct.id}`} color='primary'>
                      Edit
                    </Button.Ripple>
                    <Button.Ripple className='ml-1' color='danger' outline onClick={() => handleDelete(selectedProduct.id)}>
                      Delete
                    </Button.Ripple>
                  </div>
                </div>
              </div>
              <div className='d-flex align-items-center mr-2 mt-1'>
                {/* <div className='color-box'>
                  <span>Description: </span>
                </div> */}
                <div className='ml-0'>
                  <h6 className='mb-0'>{selectedProduct.description || ''}</h6>
                </div>
              </div>
            </div>
          </Col>
          <Col xl='6' lg='12' className='mt-2 mt-xl-0'>
          <div className='user-info-wrapper d-flex justify-content-between'>
            <div>
              <div className='d-flex flex-wrap align-items-center mt-0'>
                <div className='user-info-title'>
                  <Hexagon className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Product Type
                  </CardText>
                </div>
                <CardText className='text-capitalize mb-0'>{selectedProduct?.type}</CardText>
              </div>
              <div className='d-flex flex-wrap align-items-center mt-1'>
                <div className='user-info-title'>
                  <Star className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Category
                  </CardText>
                </div>
                <CardText className='text-capitalize mb-0'>{selectedProduct?.category}</CardText>
              </div>
              <div className='d-flex flex-wrap align-items-center mt-1'>
                <div className='user-info-title'>
                  <DollarSign className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Price
                  </CardText>
                </div>
                <CardText className='text-capitalize mb-0'>{selectedProduct?.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</CardText>
              </div>
              <div className='d-flex flex-wrap align-items-center mt-1'>
                <div className='user-info-title'>
                  <Box className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Quantity
                  </CardText>
                </div>
                <CardText className='text-capitalize mb-0'>{`${selectedProduct?.qty.toLocaleString()} ${selectedProduct?.qty > 1 ? 'units' : 'unit'}`}</CardText>
              </div>
            </div>
            <div>
              <div className='d-flex flex-wrap align-items-center mt-0'>
                <div className='user-info-title'>
                  <Check className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Status
                  </CardText>
                </div>
                <CardText className='text-capitalize mb-0'>{selectedProduct?.status}</CardText>
              </div>
              <div className='d-flex flex-wrap align-items-center mt-1'>
                <div className='user-info-title'>
                  <Calendar className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Days Available
                  </CardText>
                </div>
                <CardText className='text-capitalize mb-0'>{selectedProduct?.availability.join(', ')}</CardText>
              </div>
              <div className='d-flex flex-wrap align-items-center mt-1'>
                <div className='user-info-title'>
                  <User className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Period Available
                  </CardText>
                </div>
                <CardText className='text-capitalize mb-0'>{selectedProduct?.period.join(', ')}</CardText>
              </div>
            </div>
          </div>
            
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default UserInfoCard
