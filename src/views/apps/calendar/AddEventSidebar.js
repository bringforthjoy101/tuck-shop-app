// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { toast } from 'react-toastify'
import Flatpickr from 'react-flatpickr'
import { X, Check, Trash } from 'react-feather'
import Select, { components } from 'react-select'
import { AvForm, AvField } from 'availity-reactstrap-validation-safe'
import { selectThemeColors, isObjEmpty, apiRequest } from '@utils'
import { Button, Modal, ModalHeader, ModalBody, FormGroup, Label, CustomInput, Input } from 'reactstrap'

// ** Avatar Images
import img1 from '@src/assets/images/avatars/1-small.png'
import img2 from '@src/assets/images/avatars/3-small.png'
import img3 from '@src/assets/images/avatars/5-small.png'
import img4 from '@src/assets/images/avatars/7-small.png'
import img5 from '@src/assets/images/avatars/9-small.png'
import img6 from '@src/assets/images/avatars/11-small.png'

// ** Styles Imports
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'

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
  const [startPicker, setStartPicker] = useState(selectedEvent.start)
  const [endPicker, setEndPicker] = useState(selectedEvent.start)

  const classObject = {
    7: 'JSS 1',
    8: 'JSS 2',
    9: 'JSS 3',
    10: 'SSS 1',
    11: 'SSS 2',
    12: 'SSS 3',
    0: 'Graduated'
  }

  // ** Fetch students on component mount
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
    fetchStudents()
    console.log({selectedEvent})
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
    setStartPicker(selectedEvent.start)
    setEndPicker(selectedEvent.start)
  }

  // ** Adds New Event
  const handleAddEvent = () => {
    if (!selectedStudent || !selectedPackage) {
      toast.error(
        <ToastComponent title='Please select both student and package' color='danger' icon={<X />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
      return
    }

    const obj = [
      {
        title: `${selectedPackage.label}`,
        start: new Date(new Date(selectedEvent.start).setDate(new Date(selectedEvent.start).getDate() + 1)),
        end: new Date(endPicker),
        allDay,
        display: 'block',
        extendedProps: {
          calendar: selectedPackage.category,
          products: selectedPackage.products,
          packageId: selectedPackage.value,
          studentId: selectedStudent.value
        }
      }
    ]
    dispatch(addEvent(obj))
    refetchEvents()
    handleAddEventSidebar()
    // toast.success(
    //   <ToastComponent title='Event Added' color='success' icon={<Check />} />,
    //   {
    //     autoClose: 2000,
    //     hideProgressBar: true,
    //     closeButton: false
    //   }
    // )
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
        <h5 className='modal-title'>Add Event</h5>
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

          <FormGroup>
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
          </FormGroup>

          {/* <FormGroup>
            <Label for='endDate'>End Date</Label>
            <Flatpickr
              required
              id='endDate'
              name='endDate'
              className='form-control'
              onChange={date => setEndPicker(date[0])}
              value={endPicker}
              options={{
                enableTime: allDay === false,
                dateFormat: 'Y-m-d H:i'
              }}
              disabled
            />
          </FormGroup> */}

          {/* <FormGroup>
            <CustomInput
              type='switch'
              id='allDay'
              name='customSwitch'
              label='All Day'
              checked={allDay}
              onChange={e => setAllDay(e.target.checked)}
              inline
            />
          </FormGroup> */}

          <FormGroup className='d-flex'>
            <Button.Ripple className='mr-1' type='submit' color='primary'>
              Add
            </Button.Ripple>
            <Button.Ripple color='secondary' type='reset' onClick={handleAddEventSidebar} outline>
              Cancel
            </Button.Ripple>
          </FormGroup>
        </AvForm>
      </ModalBody>
    </Modal>
  )
}

export default AddEventSidebar
