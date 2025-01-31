// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Custom Components
import classnames from 'classnames'
import { CardBody, Button, CustomInput, Modal, ModalHeader, ModalBody, Table } from 'reactstrap'
import Select from 'react-select'
import axios from 'axios'
import { swal, apiRequest, selectThemeColors } from '@utils'

// ** illustration import
import illustration from '@src/assets/images/pages/calendar-illustration.png'

// ** Calendar Imports
import { Draggable } from '@fullcalendar/interaction'

// ** Filters Checkbox Array
const filters = [
  { label: 'Personal', color: 'danger', className: 'custom-control-danger mb-1' },
  { label: 'Business', color: 'primary', className: 'custom-control-primary mb-1' },
  { label: 'Family', color: 'warning', className: 'custom-control-warning mb-1' },
  { label: 'Holiday', color: 'success', className: 'custom-control-success mb-1' },
  { label: 'ETC', color: 'info', className: 'custom-control-info' }
]

const snackPackageObj = {
  evening: { color: 'primary', className: 'bg-light-primary', startTime: '15:00', endTime: '15:30' },
  morning: { color: 'success', className: 'bg-light-success', startTime: '10:00', endTime: '10:30' },
  afternoon: { color: 'info', className: 'bg-light-info', startTime: '12:00', endTime: '13:00' }
}

// ** Draggable Events
const draggableEvents = [
  { 
    label: 'Morning Snack', 
    color: 'danger', 
    className: 'bg-light-danger',
    startTime: '10:00',
    endTime: '10:30',
    products: [
      { name: 'Sandwich', id: '1', amount: '10', daysAvailable: ['Monday', 'Wednesday', 'Friday'] },
      { name: 'Juice', id: '2', amount: '5', daysAvailable: ['Monday', 'Tuesday', 'Wednesday'] }
    ]
  },
  { 
    label: 'Evening Snack', 
    color: 'primary', 
    className: 'bg-light-primary',
    startTime: '15:00',
    endTime: '15:30',
    products: [
      { name: 'Cookies', id: '3', amount: '8', daysAvailable: ['Tuesday', 'Thursday'] },
      { name: 'Milk', id: '4', amount: '4', daysAvailable: ['Monday', 'Wednesday', 'Friday'] }
    ]
  },
  { 
    label: 'Session', 
    color: 'warning', 
    className: 'bg-light-warning',
    startTime: '09:00',
    endTime: '10:00',
    products: [
      { name: 'Coffee', id: '5', amount: '12', daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
      { name: 'Donuts', id: '6', amount: '6', daysAvailable: ['Wednesday', 'Friday'] }
    ]
  },
  { 
    label: 'Break', 
    color: 'success', 
    className: 'bg-light-success',
    startTime: '12:00',
    endTime: '13:00',
    products: [
      { name: 'Pizza', id: '7', amount: '15', daysAvailable: ['Friday'] },
      { name: 'Soda', id: '8', amount: '5', daysAvailable: ['Monday', 'Wednesday', 'Friday'] }
    ]
  }
]

const SidebarLeft = props => {
  // ** Props
  const { handleAddEventSidebar, toggleSidebar, updateFilter, updateAllFilters, store, dispatch } = props

  // ** State for modal
  const [modal, setModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentOrders, setStudentOrders] = useState([])
  const [studentPackages, setStudentPackages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // ** Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true)
        const response = await apiRequest({
          url: '/students',
          method: 'GET'
        })
        const formattedStudents = response.data.data.map(student => ({
          value: student.id,
          label: `${student.firstName} ${student.lastName} (${student.tagNumber})`
        }))
        setStudents(formattedStudents)
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStudents()
  }, [])

  // ** Handle student selection
  const handleStudentChange = async (selectedOption) => {
    setSelectedStudent(selectedOption)
    if (selectedOption) {
      try {
        setIsLoading(true)
        const response = await apiRequest({
          url: `/orders/student/${selectedOption.value}`,
          method: 'GET'
        })
        setStudentOrders(response.data.data?.orders || [])
        dispatch({ type: 'UPDATE_EVENTS', data: response.data.data?.orders || [] })
        setStudentPackages(response.data.data?.packages?.map(snackPackage => ({
            label: `${snackPackage.name} - ${snackPackage.amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}`, 
            color: snackPackageObj[snackPackage.category].color, 
            className: snackPackageObj[snackPackage.category].className,
            startTime: snackPackageObj[snackPackage.category].startTime,
            endTime: snackPackageObj[snackPackage.category].endTime,
            packageId: snackPackage.id,
            studentId: selectedOption.value,
            products: snackPackage.products.map(product => ({
              name: product.name,
              id: product.id,
              amount: product.amount,
              daysAvailable: product.availability
            }))
          
        })) || [])
      } catch (error) {
        console.error('Error fetching student orders:', error)
        swal('Error', 'Error fetching student orders', 'error')
      } finally {
        setIsLoading(false)
      }
    }
  }

  // ** Function to handle Add Event Click
  const handleAddEventClick = () => {
    toggleSidebar(false)
    handleAddEventSidebar()
  }

  // ** Function to handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setModal(true)
  }

  // ** Set up draggable events
  useEffect(() => {
    const draggableElements = document.querySelectorAll('.external-event')
    draggableElements.forEach(element => {
      new Draggable(element, {
        itemSelector: '.external-event',
        eventData: (eventEl) => {
          const title = eventEl.getAttribute('data-title')
          const color = eventEl.getAttribute('data-color')
          const startTime = eventEl.getAttribute('data-start-time')
          const endTime = eventEl.getAttribute('data-end-time')
          const products = JSON.parse(eventEl.getAttribute('data-products'))
          const packageId = eventEl.getAttribute('data-package-id')
          const studentId = eventEl.getAttribute('data-student-id')
          return {
            title: `${startTime} ${title}`,
            start: new Date(), // This will be overridden on drop
            end: new Date(),   // This will be overridden on drop
            allDay: false,
            display: 'block',
            extendedProps: {
              calendar: color === 'primary' ? 'Business' : color === 'success' ? 'Holiday' : 'Personal',
              startTime,
              endTime,
              products,
              packageId,
              studentId
            }
          }
        }
      })
    })
  }, [studentPackages]) // Add studentPackages as dependency since we need to reinitialize when packages change

  return (
    <Fragment>
      <div className='sidebar-wrapper'>
        <CardBody>
          <h5 className='section-label mb-1'>
            <span className='align-middle'>Select Student</span>
          </h5>
          <Select
            className='react-select mb-3'
            classNamePrefix='select'
            options={students}
            value={selectedStudent}
            onChange={handleStudentChange}
            isLoading={isLoading}
            isClearable
            placeholder="Select a student..."
          />
          {/* <h5 className='section-label mb-1'>
            <span className='align-middle'>Filter</span>
          </h5> */}
          {/* <CustomInput
            type='checkbox'
            className='mb-1'
            label='View All'
            id='view-all'
            checked={store.selectedCalendars.length === filters.length}
            onChange={e => dispatch(updateAllFilters(e.target.checked))}
          />
          <div className='calendar-events-filter'>
            {filters.map(filter => {
              return (
                <CustomInput
                  type='checkbox'
                  key={filter.label}
                  id={filter.label}
                  label={filter.label}
                  checked={store.selectedCalendars.includes(filter.label)}
                  className={classnames({
                    [filter.className]: filter.className
                  })}
                  onChange={e => dispatch(updateFilter(filter.label))}
                />
              )
            })}
          </div> */}
          <div className='mt-4'>
            <h5 className='section-label mb-1'>
              <span className='align-middle'>Snack Packages</span>
            </h5>
            <div className='calendar-events-filter'>
              {studentPackages && studentPackages.map((event, key) => (
                <div
                  key={key}
                  className={`external-event fc-event ${event.className}`}
                  draggable="true"
                  data-title={event.label}
                  data-color={event.color}
                  data-start-time={event.startTime}
                  data-end-time={event.endTime}
                  data-package-id={event.packageId}
                  data-student-id={event.studentId}
                  data-products={JSON.stringify(event.products)}
                  onClick={() => handleEventClick(event)}
                  style={{
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    cursor: 'move',
                    color: `var(--${event.color})`,
                    borderRadius: '4px'
                  }}
                >
                  {event.label}
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </div>
      <div className='mt-auto'>
        <img className='img-fluid' src={illustration} alt='illustration' />
      </div>

      {/* Event Details Modal */}
      <Modal isOpen={modal} toggle={() => setModal(!modal)} className='modal-dialog-centered'>
        <ModalHeader toggle={() => setModal(!modal)}>
          {selectedEvent?.label} Details
        </ModalHeader>
        <ModalBody>
          <div className='mb-2'>
            <strong>Time:</strong> {selectedEvent?.startTime} - {selectedEvent?.endTime}
          </div>
          <div>
            <strong>Products:</strong>
            <Table responsive bordered className='mt-1'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Available Days</th>
                </tr>
              </thead>
              <tbody>
                {selectedEvent?.products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.amount}</td>
                    <td>{product.daysAvailable.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default SidebarLeft
