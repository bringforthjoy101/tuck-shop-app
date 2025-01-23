// ** React Import
import { useEffect, useRef, memo, Fragment } from 'react'

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
import { Card, CardBody, Button } from 'reactstrap'
import { Menu, Check, X } from 'react-feather'

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
  // ** Refs
  const calendarRef = useRef(null)

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

  // Function to handle recurrence selection
  const handleRecurrenceSelect = (recurrenceType, baseEvent) => {
    const { title, color, startTime, endTime, dropDate, products } = baseEvent
    const events = []
    const startDate = new Date(dropDate)
    const [startHours, startMinutes] = startTime.split(':')
    const [endHours, endMinutes] = endTime.split(':')
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    // Format time for title
    const hour = parseInt(startHours)
    const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    const ampm = hour >= 12 ? 'pm' : 'am'
    const formattedTitle = startMinutes === '00' ? `${formattedHour}${ampm} ${title}` : `${formattedHour}:${startMinutes}${ampm} ${title}`

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

      return { allowed: true, products }
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
            id: new Date().getTime() + i,
            title: formattedTitle,
            start: eventStart,
            end: eventEnd,
            allDay: false,
            display: 'block',
            extendedProps: {
              calendar: calendarMap[color] || 'ETC',
              recurring: 'daily',
              products: check.products
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
            skippedDates.push({ date: currentDate, reason: check.reason })
            continue
          }

          const eventStart = new Date(currentDate)
          const eventEnd = new Date(currentDate)
          
          eventStart.setHours(parseInt(startHours), parseInt(startMinutes), 0)
          eventEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0)

          events.push({
            id: new Date().getTime() + i,
            title,
            start: eventStart,
            end: eventEnd,
            allDay: false,
            display: 'block',
            extendedProps: {
              calendar: calendarMap[color] || 'ETC',
              recurring: 'weekly'
            }
          })
        }
        break

      case 'monthly':
        // Create events for next 3 months
        for (let i = 0; i < 3; i++) {
          const currentDate = new Date(startDate)
          currentDate.setMonth(currentDate.getMonth() + i)
          
          const check = canAddEventToDate(currentDate)
          if (!check.allowed) {
            skippedDates.push({ date: currentDate, reason: check.reason })
            continue
          }

          const eventStart = new Date(currentDate)
          const eventEnd = new Date(currentDate)
          
          eventStart.setHours(parseInt(startHours), parseInt(startMinutes), 0)
          eventEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0)

          events.push({
            id: new Date().getTime() + i,
            title,
            start: eventStart,
            end: eventEnd,
            allDay: false,
            display: 'block',
            extendedProps: {
              calendar: calendarMap[color] || 'ETC',
              recurring: 'monthly'
            }
          })
        }
        break

      default:
        // Single event (no recurrence)
        const check = canAddEventToDate(startDate)
        if (!check.allowed) {
          skippedDates.push({ date: startDate, reason: check.reason })
        } else {
          const eventStart = new Date(startDate)
          const eventEnd = new Date(startDate)
          
          eventStart.setHours(parseInt(startHours), parseInt(startMinutes), 0)
          eventEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0)

          events.push({
            id: new Date().getTime(),
            title,
            start: eventStart,
            end: eventEnd,
            allDay: false,
            display: 'block',
            extendedProps: {
              calendar: calendarMap[color] || 'ETC'
            }
          })
        }
    }

    // Add successful events to store
    events.forEach(event => {
      dispatch(addEvent(event))
    })

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

  // ** calendarOptions(Props)
  const calendarOptions = {
    events: store.events.length ? store.events : [],
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,listMonth'
    },
    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

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
      const recurrenceOptions = [
        { value: 'none', label: 'No Repeat' },
        { value: 'daily', label: 'Daily (Only available days)' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
      ]

      // Create base event
      const baseEvent = {
        title: eventTitle,
        color: eventColor,
        startTime,
        endTime,
        dropDate: info.date,
        products // Pass all products since we've verified they're all available
      }

      // Create modal for recurrence selection
      const modalContent = (
        <div className='p-2'>
          <h5>Set Event Recurrence</h5>
          <div className='d-flex flex-column gap-1 mt-2'>
            {recurrenceOptions.map(option => (
              <Button
                key={option.value}
                color='primary'
                outline
                block
                onClick={() => handleRecurrenceSelect(option.value, baseEvent)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )

      // Show modal
      toast.info(
        modalContent,
        {
          autoClose: false,
          closeButton: true,
          draggable: false,
          closeOnClick: false
        }
      )
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
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [`bg-light-${colorName}`]
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
      dispatch(selectEvent(clickedEvent))
      handleAddEventSidebar()

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)

      // eslint-disable-next-line no-use-before-define
      // isAddNewEventSidebarActive.value = true
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
    eventDrop({ event: droppedEvent }) {
      dispatch(updateEvent(droppedEvent))
      toast.success(<ToastComponent title='Event Updated' color='success' icon={<Check />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false
      })
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
    <Card className='shadow-none border-0 mb-0 rounded-0'>
      <CardBody className='pb-0'>
        <FullCalendar {...calendarOptions} />{' '}
      </CardBody>
    </Card>
  )
}

export default memo(Calendar)
