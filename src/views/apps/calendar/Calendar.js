// ** React Import
import { useEffect, useRef, memo, Fragment, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { toast } from 'react-toastify'
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, Table } from 'reactstrap'
import { Menu, Check, X } from 'react-feather'
import moment from 'moment'

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

const Calendar = props => {
  // ** Refs & States
  const calendarRef = useRef(null)
  const [recurrenceModal, setRecurrenceModal] = useState(false)
  const [selectedEventData, setSelectedEventData] = useState(null)
  const [orderDetailsModal, setOrderDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // ** Props
  const {
    store,
    isRtl,
    dispatch,
    calendarsColor,
    calendarApi,
    setCalendarApi,
    handleAddEventSidebar,
    blankEvent,
    toggleSidebar,
    selectEvent,
    updateEvent,
    addEvent,
    refetchEvents
  } = props

  // ** UseEffect checks for CalendarAPI Update
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi])

  const generateUniqueEventId = (index) => {
    return `${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}_${index}`
  }

  // Function to handle recurrence selection
  const handleRecurrenceSelect = (recurrenceType, baseEvent) => {
    const { title, color, startTime, endTime, dropDate, products, packageId, studentId } = baseEvent
    const events = []
    const startDate = new Date(dropDate)
    const [startHours, startMinutes] = startTime.split(':')
    const [endHours, endMinutes] = endTime.split(':')
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    // Map colors to calendar categories
    const calendarMap = {
      danger: 'Personal',
      primary: 'Business',
      warning: 'Family',
      success: 'Holiday',
      info: 'ETC'
    }

    // Function to check if a date already has this event or has reached the limit
    const canAddEventToDate = (date) => {
      const existingEvents = calendarRef.current.getApi().getEvents().filter(event => {
        const eventDate = new Date(event.start).setHours(0, 0, 0, 0)
        const checkDate = new Date(date).setHours(0, 0, 0, 0)
        return eventDate === checkDate
      })

      // Check event limit (max 2 events per day)
      if (existingEvents.length >= 2) {
        return { allowed: false, reason: 'limit' }
      }

      // Check for duplicates
      const isDuplicate = existingEvents.some(event => {
        const existingTitle = event.title.replace(/^\d{1,2}(?::\d{2})?(?:am|pm)\s/, '')
        return existingTitle === title
      })

      if (isDuplicate) {
        return { allowed: false, reason: 'duplicate' }
      }

      // Check if ALL products are available on this day
      const dayOfWeek = daysOfWeek[date.getDay()]
      const unavailableProducts = products.filter(product => 
        !product.daysAvailable.includes(dayOfWeek)
      )

      if (unavailableProducts.length > 0) {
        return { 
          allowed: false, 
          reason: 'no-products',
          unavailableProducts: unavailableProducts.map(p => p.name).join(', ')
        }
      }

      return { allowed: true, products, packageId, studentId }
    }

    // Create events based on recurrence type
    const skippedDates = []
    
    switch (recurrenceType) {
      case 'daily':
        // Create events for next 7 days
        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(startDate)
          currentDate.setDate(currentDate.getDate() + i)
          
          const check = canAddEventToDate(currentDate)
          if (!check.allowed) {
            skippedDates.push({ 
              date: currentDate, 
              reason: check.reason === 'no-products' ? 'no products available' : check.reason === 'limit' ? 'day full' : 'duplicate event' 
            })
            continue
          }

          const eventStart = new Date(currentDate)
          const eventEnd = new Date(currentDate)
          
          eventStart.setHours(parseInt(startHours), parseInt(startMinutes), 0)
          eventEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0)

          events.push({
            id: generateUniqueEventId(i),
            title,
            start: eventStart,
            end: eventEnd,
            allDay: false,
            display: 'block',
            extendedProps: {
              calendar: calendarMap[color] || 'ETC',
              recurring: 'daily',
              products: check.products,
              packageId,
              studentId
            }
          })
        }
        break

      case 'weekly':
        // Create events for next 4 weeks
        for (let i = 0; i < 4; i++) {
          const currentDate = new Date(startDate)
          currentDate.setDate(currentDate.getDate() + (i * 7))
          
          const check = canAddEventToDate(currentDate)
          if (!check.allowed) {
            skippedDates.push({ date: currentDate, reason: check.reason === 'no-products' ? 'no products available' : check.reason === 'limit' ? 'day full' : 'duplicate event' })
            continue
          }

          const eventStart = new Date(currentDate)
          const eventEnd = new Date(currentDate)
          
          eventStart.setHours(parseInt(startHours), parseInt(startMinutes), 0)
          eventEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0)

          events.push({
            id: generateUniqueEventId(i),
            title,
            start: eventStart,
            end: eventEnd,
            allDay: false,
            display: 'block',
            extendedProps: {
              calendar: calendarMap[color] || 'ETC',
              recurring: 'weekly',
              products: check.products,
              packageId,
              studentId
            }
          })
        }
        break

      case 'monthly':
        // Create events for next 3 months
        for (let i = 0; i < 3; i++) {
          const currentDate = new Date(startDate)

          const targetMonth = currentDate.getMonth() + i
          const targetYear = currentDate.getFullYear() + Math.floor(targetMonth / 12)
          const normalizedMonth = targetMonth % 12

          const lastDayOfMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate()

          const targetDay = Math.min(currentDate.getDate(), lastDayOfMonth)

          currentDate.setFullYear(targetYear)
          currentDate.setMonth(normalizedMonth)
          currentDate.setDate(targetDay)
          
          const check = canAddEventToDate(currentDate)
          if (!check.allowed) {
            skippedDates.push({ date: currentDate, reason: check.reason, unavailableProducts: check.unavailableProducts })
            continue
          }

          const eventStart = new Date(currentDate)
          const eventEnd = new Date(currentDate)
          
          eventStart.setHours(parseInt(startHours), parseInt(startMinutes), 0)
          eventEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0)

          events.push({
            id: generateUniqueEventId(i),
            title,
            start: eventStart,
            end: eventEnd,
            allDay: false,
            display: 'block',
            extendedProps: {
              calendar: calendarMap[color] || 'ETC',
              recurring: 'monthly',
              products: check.products,
              packageId,
              studentId
            }
          })
        }
        break

      default:
        // Single event (no recurrence)
        const check = canAddEventToDate(startDate)
        if (!check.allowed) {
          skippedDates.push({ date: startDate, reason: check.reason === 'no-products' ? 'no products available' : check.reason === 'limit' ? 'day full' : 'duplicate event', unavailableProducts: check.unavailableProducts })
        } else {
          const eventStart = new Date(startDate)
          const eventEnd = new Date(startDate)
          
          eventStart.setHours(parseInt(startHours), parseInt(startMinutes), 0)
          eventEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0)

          events.push({
            id: generateUniqueEventId(0),
            title,
            start: eventStart,
            end: eventEnd,
            allDay: false,
            display: 'block',
            extendedProps: {
              calendar: calendarMap[color] || 'ETC',
              products: check.products,
              packageId,
              studentId
            }
          })
        }
    }

    // Add successful events to store
    dispatch(addEvent(events))
    // events.forEach(event => {
    //   dispatch(addEvent(event))
    // })

    // Close all toasts
    toast.dismiss()

    // Show success message with warnings if any dates were skipped
    if (skippedDates.length > 0) {
      const skippedMessage = skippedDates.map(skip => {
        const date = skip.date.toLocaleDateString()
        return `${date} (${
          skip.reason === 'no-products' ? `unavailable products: ${skip.unavailableProducts}` : skip.reason === 'limit' ? 'day full' : 'duplicate event'
        })`
      }).join(', ')

      toast.warning(
        <ToastComponent 
          title={`Some dates were skipped: ${skippedMessage}`} 
          color='warning' 
          icon={<X />} 
        />, 
        {
          autoClose: 4000,
          hideProgressBar: true,
          closeButton: false
        }
      )
    }

    if (events.length > 0) {
      toast.success(
        <ToastComponent 
          title={`Event${events.length > 1 ? 's' : ''} added ${recurrenceType !== 'none' ? `(${recurrenceType})` : ''}`} 
          color='success' 
          icon={<Check />} 
        />, 
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
    }
  }

  // ** Function to handle recurrence modal
  const toggleRecurrenceModal = () => {
    setRecurrenceModal(!recurrenceModal)
    if (!recurrenceModal) {
      setSelectedEventData(null)
    }
  }
  console.log(store.events)
  // ** calendarOptions(Props)

  const snackPackageObj = {
    evening: { color: 'primary', className: 'bg-light-primary', startTime: '15:00', endTime: '15:30' },
    morning: { color: 'success', className: 'bg-light-success', startTime: '10:00', endTime: '10:30' },
    afternoon: { color: 'info', className: 'bg-light-info', startTime: '12:00', endTime: '13:00' }
  }

  // Get the academic year end date (assuming it ends in December)
  const today = new Date()
  const currentYear = today.getFullYear()
  const academicYearEnd = new Date(currentYear, 11, 31) // December 31st of current year
  
  // If we're past September, use next year's December as end date
  if (today.getMonth() >= 8) { // September is month 8 (0-based index)
    academicYearEnd.setFullYear(currentYear + 1)
  }

  const calendarOptions = {
    events: store.events.length ? store.events : [],
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    initialDate: new Date().toISOString().split('T')[0],
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,listMonth'
    },
    validRange: {
      start: new Date().toISOString().split('T')[0],
      end: academicYearEnd.toISOString().split('T')[0]
    },
    views: {
      dayGridMonth: {
        titleFormat: { month: 'long', year: 'numeric' },
        fixedWeekCount: false,
        showNonCurrentDates: false
      },
      listMonth: {
        titleFormat: { month: 'long', year: 'numeric' }
      }
    },
    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

    // Prevent selecting past dates
    selectConstraint: {
      start: new Date().toISOString().split('T')[0]
    },

    // Prevent dragging to past dates
    eventConstraint: {
      start: new Date().toISOString().split('T')[0]
    },

    /*
      Enable external event dropping
      ? Docs: https://fullcalendar.io/docs/droppable
    */
    droppable: true,

    /*
      Enable removing events
      ? Docs: https://fullcalendar.io/docs/eventRemove
    */
    removable: true,

    /*
      Handle when an external event is received
      ? Docs: https://fullcalendar.io/docs/eventReceive
    */
    eventReceive(info) {
      // Remove the automatically added event
      info.event.remove()
    },

    /*
      Handle external event drop
      ? Docs: https://fullcalendar.io/docs/drop
    */
    drop(info) {
      const eventTitle = info.draggedEl.getAttribute('data-title')
      const eventColor = info.draggedEl.getAttribute('data-color')
      const startTime = info.draggedEl.getAttribute('data-start-time')
      const endTime = info.draggedEl.getAttribute('data-end-time')
      const products = JSON.parse(info.draggedEl.getAttribute('data-products'))
      const packageId = info.draggedEl.getAttribute('data-package-id')
      const studentId = info.draggedEl.getAttribute('data-student-id')
      

      // Get the day of the week for the dropped date
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dropDay = daysOfWeek[new Date(info.date).getDay()]

      // Check if ALL products are available on this day
      const unavailableProducts = products.filter(product => 
        !product.daysAvailable.includes(dropDay)
      )

      if (unavailableProducts.length > 0) {
        const unavailableNames = unavailableProducts.map(p => p.name).join(', ')
        toast.error(
          <ToastComponent 
            title={`Cannot add ${eventTitle} - Products not available on ${dropDay}: ${unavailableNames}`}
            color='danger' 
            icon={<X />} 
          />, 
          {
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: false
          }
        )
        return
      }

      // Check if the date already has this event or has reached the limit
      const existingEvents = calendarRef.current.getApi().getEvents().filter(event => {
        const eventDate = new Date(event.start).setHours(0, 0, 0, 0)
        const dropDate = new Date(info.date).setHours(0, 0, 0, 0)
        return eventDate === dropDate
      })

      // Check event limit (max 2 events per day)
      if (existingEvents.length >= 2) {
        toast.error(
          <ToastComponent 
            title='Maximum 2 events per day allowed' 
            color='danger' 
            icon={<X />} 
          />, 
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false
          }
        )
        return
      }

      // Check for duplicates
      const isDuplicate = existingEvents.some(event => {
        const existingTitle = event.title.replace(/^\d{1,2}(?::\d{2})?(?:am|pm)\s/, '')
        return existingTitle === eventTitle
      })

      if (isDuplicate) {
        toast.error(
          <ToastComponent 
            title='This event already exists on this date' 
            color='danger' 
            icon={<X />} 
          />, 
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false
          }
        )
        return
      }

      // If validation passes, show recurrence options dialog
      setSelectedEventData({
        title: eventTitle,
        color: eventColor,
        startTime,
        endTime,
        dropDate: info.date,
        products,
        packageId,
        studentId
      })
      setRecurrenceModal(true)
    },

    // Function to handle recurrence selection
    handleRecurrenceSelect,

    // eventContent: (arg) => {
    //   const dotColor = arg.event.extendedProps.dotColor
    //   return (
    //     <>
    //       <div className="d-flex align-items-center">
    //         <div className={`bg-${dotColor} rounded-circle me-1`} style={{width: '8px', height: '8px'}}></div>
    //         <div className='text-truncate'>{arg.event.title}</div>
    //       </div>
    //     </>
    //   )
    // },

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 5,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      // const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]
      const colorName = snackPackageObj[calendarEvent._def.extendedProps.category]

      return [`bg-light-${colorName?.color || 'primary'}`]
    },

    // eventContent: (arg) => {
    //   const colorName = calendarsColor[arg.event._def.extendedProps.calendar]
    //   return (
    //     <div className="d-flex align-items-center px-2 py-1">
    //       <div className={`bg-${colorName} rounded-circle me-1`} style={{width: '8px', height: '8px'}}></div>
    //       <div className='text-truncate'>{arg.event.title}</div>
    //     </div>
    //   )
    // },

    eventClick({ event: clickedEvent }) {
      console.log({clickedEvent})
      setSelectedOrder({
        id: clickedEvent.id,
        title: clickedEvent.title,
        date: clickedEvent.start,
        amount: clickedEvent.extendedProps.amount,
        products: clickedEvent.extendedProps.products
      })
      setOrderDetailsModal(true)
    },

    customButtons: {
      sidebarToggle: {
        text: <Menu className='d-xl-none d-block' />,
        click() {
          toggleSidebar(true)
        }
      }
    },

    dateClick(info) {
      const ev = blankEvent
      ev.start = info.date
      ev.end = info.date
      dispatch(selectEvent(ev))
      handleAddEventSidebar()
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent, oldEvent, revert }) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const dropDate = new Date(droppedEvent.start)
      dropDate.setHours(0, 0, 0, 0)

      // If dropped on a past date, revert the drag
      if (dropDate < today) {
        revert()
        toast.error(
          <ToastComponent 
            title='Cannot schedule events in the past' 
            color='danger' 
            icon={<X />} 
          />, 
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false
          }
        )
        return
      }

      dispatch(updateEvent(droppedEvent))
      toast.success(
        <ToastComponent 
          title='Event Updated' 
          color='success' 
          icon={<Check />} 
        />, 
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }) {
      dispatch(updateEvent(resizedEvent))
      toast.success(<ToastComponent title='Event Updated' color='success' icon={<Check />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
    },

    ref: calendarRef,

    // Get direction from app state (store)
    direction: isRtl ? 'rtl' : 'ltr'
  }

  return (
    <Fragment>
      <Card className='shadow-none border-0 mb-0 rounded-0'>
        <CardBody className='pb-0'>
          <FullCalendar {...calendarOptions} />{' '}
        </CardBody>
      </Card>

      {/* Order Details Modal */}
      <Modal isOpen={orderDetailsModal} toggle={() => setOrderDetailsModal(!orderDetailsModal)} className='modal-dialog-centered'>
        <ModalHeader toggle={() => setOrderDetailsModal(!orderDetailsModal)}>
          Order Details
        </ModalHeader>
        <ModalBody>
          {selectedOrder && (
            <div>
              <div className='mb-2'>
                <strong>Order Name:</strong> {selectedOrder.title}
              </div>
              <div className='mb-2'>
                <strong>Date:</strong> {moment(selectedOrder.date).format('LL')}
              </div>
              <div className='mb-2'>
                <strong>Amount:</strong> {selectedOrder.amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
              </div>
              <div>
                <strong>Products:</strong>
                <Table responsive bordered className='mt-1'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder?.products?.map((product, index) => (
                      <tr key={index}>
                        <td>{product?.name}</td>
                        <td>{product?.quantity}</td>
                        <td>{product?.price?.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* Existing Recurrence Modal */}
      <Modal isOpen={recurrenceModal} toggle={toggleRecurrenceModal} className='modal-dialog-centered'>
        <ModalHeader toggle={toggleRecurrenceModal}>
          Set Event Recurrence
        </ModalHeader>
        <ModalBody>
          <div className='d-flex flex-column gap-1'>
            <Button
              color='primary'
              outline
              block
              onClick={() => {
                handleRecurrenceSelect('none', selectedEventData)
                toggleRecurrenceModal()
              }}
            >
              No Repeat
            </Button>
            <Button
              color='primary'
              outline
              block
              onClick={() => {
                handleRecurrenceSelect('daily', selectedEventData)
                toggleRecurrenceModal()
              }}
            >
              Daily (Only available days)
            </Button>
            <Button
              color='primary'
              outline
              block
              onClick={() => {
                handleRecurrenceSelect('weekly', selectedEventData)
                toggleRecurrenceModal()
              }}
            >
              Weekly
            </Button>
            <Button
              color='primary'
              outline
              block
              onClick={() => {
                handleRecurrenceSelect('monthly', selectedEventData)
                toggleRecurrenceModal()
              }}
            >
              Monthly
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default memo(Calendar)
