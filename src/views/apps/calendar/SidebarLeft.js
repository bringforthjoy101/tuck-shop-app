// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Custom Components
import classnames from 'classnames'
import { CardBody, Button, CustomInput } from 'reactstrap'

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

  // ** Function to handle Add Event Click
  const handleAddEventClick = () => {
    toggleSidebar(false)
    handleAddEventSidebar()
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
          return {
            title,
            color,
            startTime,
            endTime,
            products
          }
        }
      })
    })
  }, [])

  return (
    <Fragment>
      <div className='sidebar-wrapper'>
        <CardBody className='card-body d-flex justify-content-center my-sm-0 mb-3'>
          <Button color='primary' block onClick={handleAddEventClick}>
            <span className='align-middle'>Add Event</span>
          </Button>
        </CardBody>
        <CardBody>
          <h5 className='section-label mb-1'>
            <span className='align-middle'>Filter</span>
          </h5>
          <CustomInput
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
          </div>
          <div className='mt-4'>
            <h5 className='section-label mb-1'>
              <span className='align-middle'>Drag these</span>
            </h5>
            <div className='calendar-events-filter'>
              {draggableEvents.map(event => (
                <div
                  key={event.label}
                  className={`external-event fc-event ${event.className}`}
                  data-title={event.label}
                  data-color={event.color}
                  data-start-time={event.startTime}
                  data-end-time={event.endTime}
                  data-products={JSON.stringify(event.products)}
                  style={{
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    cursor: 'grab',
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
    </Fragment>
  )
}

export default SidebarLeft
