import axios from 'axios'
import { apiRequest, swal } from '@utils'
import { toast } from 'react-toastify'

// ** Fetch Events
export const fetchEvents = ({studentId}) => {
  return dispatch => {
    // console.log(calendars)
    apiRequest({ url: `/orders/student/${studentId}`, method: 'GET' }, dispatch).then(response => {
      console.log(response.data.data)
      if (response.data.data) {
        const events = response.data.data.orders?.map(event => ({
          id: event?.id,
          url: '',
          title: event?.package?.name,
          start: new Date(event?.orderDate),
          end: new Date(event?.orderDate),
          allDay: true,
          extendedProps: { calendar: 'Personal', amount: event?.amount, products: event?.products, category: event?.category }
        })) || []
        dispatch({
          type: 'FETCH_EVENTS',
          events
        })
      }
    })
    // axios.get('/apps/calendar/events', { calendars }).then(response => {
    //   console.log({ response })
    //   dispatch({
    //     type: 'FETCH_EVENTS',
    //     events: response.data
    //   })
    // })
  }
}

// ** Add Event
export const addEvent = events => {
  return (dispatch, getState) => {
    console.log({events})
    const orderedPackages = events.map(event => ({
      packageId: event.extendedProps.packageId,
      studentId: event.extendedProps.studentId,
      orderDate: new Date(event.start).toISOString().split('T')[0]
    }))
    const body = JSON.stringify({orderedPackages})

    apiRequest({ url: '/orders/package-create', method: 'POST', body }, dispatch).then((response) => {
      
      if (response.data.status) {
        swal('Great job!', response.data.message, 'success')
        dispatch({
          type: 'ADD_EVENT'
        })
        dispatch(fetchEvents({studentId: events[0].extendedProps.studentId}))
        
      } else {
        swal('Oops!', response.data.message || 'Something went wrong! Please try again.', 'error')
      }
    })
    // axios.post('/apps/calendar/add-event', { event }).then(() => {
    //   dispatch({
    //     type: 'ADD_EVENT'
    //   })
    //   dispatch(fetchEvents(getState().calendar.selectedCalendars))
    // })
  }
}

// ** Update Event
export const updateEvent = event => {
  return dispatch => {
    axios.post('/apps/calendar/update-event', { event }).then(() => {
      dispatch({
        type: 'UPDATE_EVENT'
      })
    })
  }
}

// ** Filter Events
export const updateFilter = filter => {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_FILTERS',
      filter
    })
    dispatch(fetchEvents(getState().calendar.selectedCalendars))
  }
}

// ** Add/Remove All Filters
export const updateAllFilters = value => {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_ALL_FILTERS',
      value
    })
    dispatch(fetchEvents(getState().calendar.selectedCalendars))
  }
}

// ** remove Event
export const removeEvent = id => {
  return dispatch => {
    axios.delete('/apps/calendar/remove-event', { id }).then(() => {
      dispatch({
        type: 'REMOVE_EVENT',
        id
      })
    })
  }
}

// ** Select Event (get event data on click)
export const selectEvent = event => {
  return dispatch => {
    dispatch({
      type: 'SELECT_EVENT',
      event
    })
  }
}
