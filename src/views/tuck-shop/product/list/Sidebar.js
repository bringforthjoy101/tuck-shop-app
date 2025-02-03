// ** Custom Components
import Sidebar from '@components/sidebar'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { swal, apiRequest } from '@utils'
import { getAllData, getFilteredData } from '../store/action'

// ** Third Party Components
import { Button, FormGroup, Label, Spinner, CustomInput } from 'reactstrap'
import { AvForm, AvInput } from 'availity-reactstrap-validation-safe'

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  const dispatch = useDispatch()

  const [productData, setProductData] = useState({
    name: '',
    type: '',
    category: '',
    price: '',
    description: '',
    image: '',
    availability: ['Monday'],
    period: ['morning', 'evening']
  })
  console.log({productData})

  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ** Function to handle form submit
  const onSubmit = async (event, errors) => {
    console.log({productData})
    setIsSubmitting(true)
    event.preventDefault()
    console.log({errors})
    if (errors) setIsSubmitting(false)
    if (errors && !errors.length) {
      console.log({productData})
      setIsSubmitting(true)
      const body = JSON.stringify(productData)
      try {
        const response = await apiRequest({url:'/products/create', method:'POST', body}, dispatch)
        console.log({response})
        if (response.data.status) {
            setIsSubmitting(false)
            swal('Great job!', response.data.message, 'success')
            dispatch(getAllData())
            setProductData({
                name: '',
                type: '',
                category: '',
                price: '',
                description: '',
                image: '',
                availability: ['Monday'],
                period: ['morning', 'evening']
            })
            toggleSidebar()
        } else {
          setIsSubmitting(false)
          swal('Oops!', response.data.message, 'error')
          setProductData({
            name: '',
            type: '',
            category: '',
            price: '',
            description: '',
            image: '',
            availability: ['Monday'],
            period: ['morning', 'evening']
          })
          toggleSidebar()
        }
      } catch (error) {
        setIsSubmitting(false)
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
            <Label for='price'>Product Price</Label>
            <AvInput 
              type='number' 
              name='price' 
              id='price' 
              placeholder='Product Price' 
              value={productData.price}
              onChange={e => setProductData({...productData, price: e.target.value})}
            />
          </FormGroup>
          <FormGroup>
            <Label for='type'>Product Type</Label>
            <AvInput 
              type='select' 
              id='type' 
              name='type' 
              value={productData.type}
              onChange={e => setProductData({...productData, type: e.target.value})}
              required
            >
              <option value=''>Select Product Type</option>
              <option value='drink'>Drink</option>
              <option value='food'>Food</option>
              <option value='snack'>Snack</option>
              <option value='medicine'>Medicine</option>
              <option value='other'>Other</option>
            </AvInput>
          </FormGroup>
          <FormGroup>
            <Label for='category'>Product Category</Label>
            <AvInput 
              type='select' 
              id='category' 
              name='category' 
              value={productData.category}
              onChange={e => setProductData({...productData, category: e.target.value})}
              required
            >
              <option value=''>Select Product Category</option>
              <option value='consumable'>Consumable</option>
              <option value='non-consumable'>Non-Consumable</option>
            </AvInput>
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
            <Label for='availability'>Days Available</Label><br />
            <CustomInput 
              inline 
              type='checkbox' 
              id='monday' 
              label='Monday' 
              defaultChecked
              onChange={e => {
                const day = 'Monday'
                if (e.target.checked) {
                  setProductData({...productData, availability: [...productData.availability, day]})
                } else {
                  setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
                }
              }} 
            />
            <CustomInput 
              inline 
              type='checkbox' 
              id='tuesday' 
              label='Tuesday'
              onChange={e => {
                const day = 'Tuesday'
                if (e.target.checked) {
                  setProductData({...productData, availability: [...productData.availability, day]})
                } else {
                  setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
                }
              }}  
            />
            <CustomInput 
              inline 
              type='checkbox' 
              id='wednesday' 
              label='Wednesday'
              onChange={e => {
                const day = 'Wednesday'
                if (e.target.checked) {
                  setProductData({...productData, availability: [...productData.availability, day]})
                } else {
                  setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
                }
              }}  
            />
            <CustomInput 
              inline 
              type='checkbox' 
              id='thursday' 
              label='Thursday'
              onChange={e => {
                const day = 'Thursday'
                if (e.target.checked) {
                  setProductData({...productData, availability: [...productData.availability, day]})
                } else {
                  setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
                }
              }}  
            />
            <CustomInput 
              inline 
              type='checkbox' 
              id='friday' 
              label='Friday'
              onChange={e => {
                const day = 'Friday'
                if (e.target.checked) {
                  setProductData({...productData, availability: [...productData.availability, day]})
                } else {
                  setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
                }
              }}  
            />
            <CustomInput 
              inline 
              type='checkbox' 
              id='saturday' 
              label='Saturday'
              onChange={e => {
                const day = 'Saturday'
                if (e.target.checked) {
                  setProductData({...productData, availability: [...productData.availability, day]})
                } else {
                  setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
                }
              }}  
            />
            <CustomInput 
              inline 
              type='checkbox' 
              id='sunday' 
              label='Sunday'
              onChange={e => {
                const day = 'Sunday'
                if (e.target.checked) {
                  setProductData({...productData, availability: [...productData.availability, day]})
                } else {
                  setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
                }
              }}  
            />
          </FormGroup>
          <FormGroup>
            <Label for='period'>Period Available</Label><br />
            <CustomInput 
              inline 
              type='checkbox' 
              id='morning' 
              label='Morning' 
              defaultChecked
              onChange={e => {
                const period = 'morning'
                if (e.target.checked) {
                  setProductData({...productData, period: [...productData.period, period]})
                } else {
                  setProductData({...productData, period: productData.period.filter(d => d !== period)})
                }
              }} 
            />
            <CustomInput 
              inline 
              type='checkbox' 
              id='evening' 
              label='Evening'
              onChange={e => {
                const period = 'evening'
                if (e.target.checked) {
                  setProductData({...productData, period: [...productData.period, period]})
                } else {
                  setProductData({...productData, period: productData.period.filter(d => d !== period)})
                }
              }}  
            />
          </FormGroup>
          {/* <FormGroup>
            <Label for='exampleCustomFileBrowser'>Product Image</Label>
            <CustomInput type='file' id='exampleCustomFileBrowser' name='customFile' />
          </FormGroup> */}
          <Button type='submit' className='mr-1' color='primary' disabled={isSubmitting}>
            {isSubmitting && <Spinner color='white' size='sm' />}
            <span className='ml-50'>Submit</span>
          </Button>
          <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
            Cancel
          </Button>
        </AvForm>
      </Sidebar>
    )
}


export default SidebarNewUsers
