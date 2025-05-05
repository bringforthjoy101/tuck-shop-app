// ** React Imports
import { Fragment, useState, useEffect, useMemo } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { toast } from 'react-toastify'
import Flatpickr from 'react-flatpickr'
import { X, Check, Trash, Plus } from 'react-feather'
import Select, { components } from 'react-select'
import { AvForm, AvField } from 'availity-reactstrap-validation-safe'
import { selectThemeColors, isObjEmpty, apiRequest } from '@utils'
import { 
  Button, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  FormGroup, 
  Label, 
  CustomInput, 
  Input,
  Row,
  Col,
  Card,
  CardBody,
  Spinner
} from 'reactstrap'

// ** Styles Imports
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'

// Day options for the select
const dayOptions = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' }
]

// Time slot options
const timeSlotOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'evening', label: 'Evening' }
]

// ** Toast Component
const ToastComponent = ({ title, icon, color }) => (
  <Fragment>
    <div className='toastify-header pb-0'>
      <div className='title-wrapper'>
        <Avatar size='sm' color={color} icon={icon} />
        <h6 className='toast-title'>{title}</h6>
      </div>
    </div>
  </Fragment>
)

const AddEventSidebar = props => {
  // ** Props
  const {
    store,
    dispatch,
    open,
    handleAddEventSidebar,
    calendarApi,
    refetchEvents,
    addEvent,
    selectEvent,
    updateEvent,
    removeEvent
  } = props

  // ** Vars
  const selectedEvent = store.selectedEvent

  // ** States
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentPackages, setStudentPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [allDay, setAllDay] = useState(true)
  const [startPicker, setStartPicker] = useState(new Date(selectedEvent.start))
  const [endPicker, setEndPicker] = useState(new Date(selectedEvent.start))
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [products, setProducts] = useState([])
  const [availableProducts, setAvailableProducts] = useState([])
  const [selectedProductIds, setSelectedProductIds] = useState(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update date when calendar date is clicked
  useEffect(() => {
    if (selectedEvent.start) {
      const newDate = new Date(selectedEvent.start)
      setStartPicker(newDate)
      setEndPicker(newDate)
      
      // Reset product selection when date changes
      setProducts([])
      setSelectedProductIds(new Set())
      setSelectedTimeSlot(null)
    }
  }, [selectedEvent.start])

  // Get the day of the week from the selected date
  const selectedDay = useMemo(() => {
    if (!startPicker) return null
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const day = daysOfWeek[new Date(startPicker).getDay()]
    console.log('Selected Day from clicked date:', day)
    return day
  }, [startPicker])

  const classObject = {
    7: 'JSS 1',
    8: 'JSS 2',
    9: 'JSS 3',
    10: 'SSS 1',
    11: 'SSS 2',
    12: 'SSS 3',
    0: 'Graduated'
  }

  // ** Get available products for a specific repeater row
  const getAvailableProductsForRow = (currentProduct) => {
    // If no products are available yet, return empty array
    if (!availableProducts.length) return []

    // If this is the current product in the row, always include it
    if (currentProduct) {
      const otherProducts = availableProducts.filter(product => {
        // Include the current product and other available products
        const isCurrentProduct = product.value === currentProduct.value
        const isAvailableForDay = product.availability?.includes(selectedDay)
        const isAvailableForPeriod = !selectedTimeSlot || product.period?.includes(selectedTimeSlot.value)
        const isNotSelected = !selectedProductIds.has(product.value) || isCurrentProduct

        return (isCurrentProduct || (isAvailableForDay && isAvailableForPeriod && isNotSelected))
      })
      return otherProducts
    }

    // For empty selection, show all available products that match criteria
    return availableProducts.filter(product => {
      const isAvailableForDay = product.availability?.includes(selectedDay)
      const isAvailableForPeriod = !selectedTimeSlot || product.period?.includes(selectedTimeSlot.value)
      const isNotSelected = !selectedProductIds.has(product.value)

      return isAvailableForDay && isAvailableForPeriod && isNotSelected
    })
  }

  // ** Fetch students and products on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiRequest({
          url: '/students',
          method: 'GET'
        })
        const formattedStudents = response.data.data.map(student => ({
          value: student.id,
          label: `${student.firstName} ${student.lastName} | ${classObject[student.year]} ${student.group} | ${student.wallet.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}`
        }))
        setStudents(formattedStudents)
      } catch (error) {
        console.error('Error fetching students:', error)
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await apiRequest({
          url: '/products',
          method: 'GET'
        })
        const formattedProducts = response.data.data.map(product => ({
          value: product.id,
          label: `${product.name} | ${product.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}`,
          price: product.price,
          name: product.name,
          availability: product.availability || [],
          period: product.period || []
        }))
        setAvailableProducts(formattedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchStudents()
    fetchProducts()
  }, [])

  // ** Handle student selection
  const handleStudentChange = async (selectedOption) => {
    setSelectedStudent(selectedOption)
    console.log({selectedOption})
    if (selectedOption) {
      try {
        const response = await apiRequest({
          url: `/orders/student/${selectedOption.value}`,
          method: 'GET'
        })
        const packages = response.data.data?.packages || []
        const formattedPackages = packages.map(pkg => ({
          value: pkg.id,
          label: pkg.name,
          products: pkg.products,
          category: pkg.category
        }))
        setStudentPackages(formattedPackages)
      } catch (error) {
        console.error('Error fetching student packages:', error)
      }
    } else {
      setStudentPackages([])
      setSelectedPackage(null)
    }
  }

  // ** Reset Input Values on Close
  const handleResetInputValues = () => {
    dispatch(selectEvent({}))
    setSelectedStudent(null)
    setSelectedPackage(null)
    setAllDay(true)
    setStartPicker(new Date(selectedEvent.start))
    setEndPicker(new Date(selectedEvent.start))
    setSelectedTimeSlot(null)
    setProducts([])
    setSelectedProductIds(new Set())
  }

  // ** Handle time slot selection
  const handleTimeSlotChange = (selected) => {
    setSelectedTimeSlot(selected)
    // Clear products if they're not available for the new time slot
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(item => {
        if (!item.product) return item
        const product = availableProducts.find(p => p.value === item.product.value)
        if (!product?.period?.includes(selected?.value)) {
          // Remove from selected IDs if product is no longer available
          setSelectedProductIds(prev => {
            const newSet = new Set(prev)
            newSet.delete(item.product.value)
            return newSet
          })
          return { ...item, product: null }
        }
        return item
      })
      return updatedProducts
    })
  }

  // ** Handle adding a new product row
  const handleAddProduct = () => {
    if (!selectedTimeSlot) {
      toast.error(
        <ToastComponent title='Please select a time slot first' color='danger' icon={<X />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
      return
    }

    // Check if we've reached the limit of 2 products
    if (products.length >= 2) {
      toast.error(
        <ToastComponent title='Maximum of 2 products allowed' color='danger' icon={<X />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
      return
    }

    setProducts([...products, { product: null, quantity: 1 }])
  }

  // ** Handle removing a product row
  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products]
    // Remove the product ID from selected set
    if (updatedProducts[index].product) {
      const newSelectedIds = new Set(selectedProductIds)
      newSelectedIds.delete(updatedProducts[index].product.value)
      setSelectedProductIds(newSelectedIds)
    }
    updatedProducts.splice(index, 1)
    setProducts(updatedProducts)
  }

  // ** Handle product selection
  const handleProductChange = (index, selectedProduct) => {
    const updatedProducts = [...products]
    // Remove old product ID from selected set if it exists
    if (updatedProducts[index].product) {
      const newSelectedIds = new Set(selectedProductIds)
      newSelectedIds.delete(updatedProducts[index].product.value)
      setSelectedProductIds(newSelectedIds)
    }
    // Add new product ID to selected set
    if (selectedProduct) {
      setSelectedProductIds(new Set([...selectedProductIds, selectedProduct.value]))
    }
    updatedProducts[index].product = selectedProduct
    setProducts(updatedProducts)
  }

  // ** Handle quantity change
  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...products]
    updatedProducts[index].quantity = quantity
    setProducts(updatedProducts)
  }

  // ** Calculate total price
  const calculateTotalPrice = () => {
    return products.reduce((total, item) => {
      if (item.product) {
        return total + (item.product.price * (item.quantity || 1))
      }
      return total
    }, 0)
  }

  // ** Adds New Event
  const handleAddEvent = async () => {
    if (!selectedStudent || !selectedTimeSlot || products.length === 0) {
      toast.error(
        <ToastComponent title='Please fill in all required fields' color='danger' icon={<X />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
      return
    }

    // Validate products
    const invalidProducts = products.some(p => !p.product || p.quantity < 1)
    if (invalidProducts) {
      toast.error(
        <ToastComponent title='Please fill in all product details correctly' color='danger' icon={<X />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
      return
    }

    setIsSubmitting(true)
    try {
      const formattedProducts = products.map(p => ({
        id: p.product.value,
        name: p.product.name,
        quantity: p.quantity,
        price: p.product.price
      }))

      const obj = [
        {
          title: `${selectedTimeSlot.label} Order`,
          start: new Date(new Date(selectedEvent.start).setDate(new Date(selectedEvent.start).getDate() + 1)),
          end: new Date(endPicker),
          allDay,
          display: 'block',
          extendedProps: {
            category: selectedTimeSlot.value,
            products: formattedProducts,
            studentId: selectedStudent.value,
            dayOfWeek: selectedDay
          }
        }
      ]
      
      await dispatch(addEvent(obj))
      await refetchEvents()
      
      toast.success(
        <ToastComponent title='Event added successfully' color='success' icon={<Check />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
      
      handleAddEventSidebar()
    } catch (error) {
      console.error('Error adding event:', error)
      toast.error(
        <ToastComponent title='Error adding event' color='danger' icon={<X />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ** Close BTN
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleAddEventSidebar} />

  return (
    <Modal
      isOpen={open}
      toggle={handleAddEventSidebar}
      className='sidebar-lg'
      contentClassName='p-0'
      onClosed={handleResetInputValues}
      modalClassName='modal-slide-in event-sidebar'
    >
      <ModalHeader className='mb-1' toggle={handleAddEventSidebar} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Add New Order</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1 pb-sm-0 pb-3'>
        <AvForm onSubmit={(e, errors) => {
          e.preventDefault()
          if (errors && !errors.length) {
            handleAddEvent()
          }
        }}>
          <FormGroup>
            <Label for='student'>Student</Label>
            <Select
              id='student'
              name='student'
              options={students}
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              isClearable={true}
              value={selectedStudent}
              onChange={handleStudentChange}
              placeholder="Select Student..."
            />
          </FormGroup>

          <FormGroup>
            <Label for='startDate'>Date</Label>
            <Flatpickr
              required
              id='startDate'
              name='startDate'
              className='form-control'
              onChange={date => setStartPicker(date[0])}
              value={startPicker}
              options={{
                enableTime: allDay === false,
                dateFormat: 'Y-m-d H:i'
              }}
              disabled
            />
          </FormGroup>

          {/* <FormGroup>
            <Label for='package'>Package</Label>
            <Select
              id='package'
              name='package'
              options={studentPackages}
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              isClearable={true}
              value={selectedPackage}
              onChange={setSelectedPackage}
              isDisabled={!selectedStudent}
              placeholder="Select Package..."
            />
          </FormGroup> */}

          <Row>
            <Col md='12'>
              <FormGroup>
                <Label for='timeSlot'>Time Slot</Label>
                <Select
                  id='timeSlot'
                  name='timeSlot'
                  options={timeSlotOptions}
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  value={selectedTimeSlot}
                  onChange={handleTimeSlotChange}
                  placeholder="Select Time Slot..."
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label>Products</Label>
            <div className='product-repeater'>
              {products.map((item, index) => (
                <Card key={index} className='mb-1'>
                  <CardBody className='pb-1'>
                    <Row>
                      <Col md='10'>
                        <FormGroup>
                          <Label for={`product-${index}`}>Product</Label>
                          <Select
                            id={`product-${index}`}
                            value={item.product}
                            options={getAvailableProductsForRow(item.product)}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            onChange={(value) => handleProductChange(index, value)}
                            placeholder="Select Product..."
                          />
                        </FormGroup>
                      </Col>
                      <Col md='2' className='d-flex align-items-end mb-1 pl-0'>
                        <Button.Ripple 
                          color='danger' 
                          className='text-nowrap px-1' 
                          onClick={() => handleRemoveProduct(index)}
                          outline
                        >
                          <X size={14} />
                        </Button.Ripple>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              ))}
              <Button.Ripple 
                className='btn-icon mb-1' 
                color='primary'
                onClick={handleAddProduct}
                outline
                disabled={selectedProductIds.size === availableProducts.length || products.length >= 2}
              >
                <Plus size={14} />
                <span className='align-middle ml-25'>Add Product ({products.length}/2)</span>
              </Button.Ripple>
            </div>
          </FormGroup>

          {/* Total Price Display */}
          {products.length > 0 && (
            <FormGroup>
              <Card className='bg-light-primary'>
                <CardBody className='p-2'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <h6 className='mb-0'>Total Price:</h6>
                    <h5 className='mb-0 text-primary'>
                      {calculateTotalPrice().toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                    </h5>
                  </div>
                </CardBody>
              </Card>
            </FormGroup>
          )}

          <FormGroup className='d-flex'>
            <Button.Ripple 
              className='mr-1' 
              type='submit' 
              color='primary'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Fragment>
                  <Spinner size='sm' className='mr-50' />
                  <span>Adding...</span>
                </Fragment>
              ) : (
                'Add'
              )}
            </Button.Ripple>
            <Button.Ripple 
              color='secondary' 
              type='reset' 
              onClick={handleAddEventSidebar} 
              outline
              disabled={isSubmitting}
            >
              Cancel
            </Button.Ripple>
          </FormGroup>
        </AvForm>
      </ModalBody>
    </Modal>
  )
}

export default AddEventSidebar
