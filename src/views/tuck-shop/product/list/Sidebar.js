// ** Custom Components
import Sidebar from '@components/sidebar'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { swal, apiRequest } from '@utils'
import { getAllData, getFilteredData } from '../store/action'

// ** Third Party Components
import { Button, FormGroup, Label, FormText, CustomInput } from 'reactstrap'
import { AvForm, AvInput } from 'availity-reactstrap-validation-safe'

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  const dispatch = useDispatch()

  const [productData, setProductData] = useState({
    name: '',
    qty: '',
    price: '',
    description: '',
    image: 'https://res.cloudinary.com/bringforthjoy/image/upload/v1621720743/INVESTA/appia_reward_image_placeholder_um7q6g.jpg'
  })
  const [password, setPassword] = useState('kfxHdSCqM')
  // ** Function to handle form submit
  const onSubmit = async (event, errors) => {
    // if (!errors.length) {
    //   toggleSidebar()
    // }
    event.preventDefault()
    console.log({errors})
    if (errors && !errors.length) {
      // const {first_name, last_name, email, phone, role} = productData
      // const body = JSON.stringify
      console.log({productData})
      const body = JSON.stringify(productData)
      try {
        const response = await apiRequest({url:'/products/create', method:'POST', body}, dispatch)
        console.log({response})
        if (response.data.status) {
            swal('Great job!', response.data.message, 'success')
            dispatch(getAllData())
            setProductData({
              name: '',
              qty: '',
              price: '',
              description: '',
              image: 'https://res.cloudinary.com/bringforthjoy/image/upload/v1621720743/INVESTA/appia_reward_image_placeholder_um7q6g.jpg'
            })
            toggleSidebar()
        } else {
          swal('Oops!', response.data.message, 'error')
          setProductData({
            name: '',
            qty: '',
            price: '',
            description: '',
            image: 'https://res.cloudinary.com/bringforthjoy/image/upload/v1621720743/INVESTA/appia_reward_image_placeholder_um7q6g.jpg'
          })
          toggleSidebar()
        }
      } catch (error) {
        console.error({error})
      }
    }
  }

    return (
      <Sidebar
        size='lg'
        open={open}
        title='New Product'
        headerClassName='mb-1'
        contentClassName='pt-0'
        toggleSidebar={toggleSidebar}
      >
        <AvForm onSubmit={onSubmit}>
          <FormGroup>
            <Label for='name'>Product Name</Label>
            <AvInput 
              name='name' 
              id='name' 
              placeholder='Product Name' 
              value={productData.name}
              onChange={e => setProductData({...productData, name: e.target.value})}
              required 
            />
          </FormGroup>
          <FormGroup>
            <Label for='qty'>Quantity</Label>
            <AvInput 
              name='qty' 
              id='qty' 
              placeholder='Quantity' 
              value={productData.qty}
              onChange={e => setProductData({...productData, qty: e.target.value})}
              required 
            />
          </FormGroup>
          <FormGroup>
            <Label for='price'>Product Price</Label>
            <AvInput 
              type='number' 
              name='price' 
              id='price' 
              placeholder='Product Price' 
              value={productData.price}
              onChange={e => setProductData({...productData, price: e.target.value})}
              required 
            />
            {/* <FormText color='muted'>You can use letters, numbers & periods</FormText> */}
          </FormGroup>
          <FormGroup>
            <Label for='description'>Product Description</Label>
            <AvInput 
              type='textarea'
              name='description' 
              id='description' 
              placeholder='Product Description' 
              value={productData.description}
              onChange={e => setProductData({...productData, description: e.target.value})}
              required 
            />
          </FormGroup>
          <FormGroup>
            <Label for='exampleCustomFileBrowser'>Product Image</Label>
            <CustomInput type='file' id='exampleCustomFileBrowser' name='customFile' />
          </FormGroup>
          <Button type='submit' className='mr-1' color='primary'>
            Submit
          </Button>
          <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
            Cancel
          </Button>
        </AvForm>
      </Sidebar>
    )
}


export default SidebarNewUsers
