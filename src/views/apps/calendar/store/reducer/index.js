
// ** Initial State
const initialState = {
  events: [],
  selectedEvent: {},
  selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC'],
  studentWalletBalance: 0
}

const calenderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_EVENTS':
      return { ...state, events: action.events }
    case 'ADD_EVENT':
      return { ...state }
    case 'REMOVE_EVENT':
      return { ...state, events: state.events.filter(event => Number(event.id) !== Number(action.id)) }
    case 'UPDATE_EVENT':
      return { ...state }
    case 'UPDATE_EVENTS':
      console.log(action.data)
      return { 
          ...state, 
          events: action.data.length ? action.data.map(event => ({
              id: event?.id,
              url: '',
              title: event?.package?.name,
              start: new Date(event?.orderDate),
              end: new Date(event?.orderDate),
              allDay: true,
              extendedProps: { calendar: 'Personal', amount: event?.amount, products: event?.products, category: event?.category, studentId: event?.studentId }
            })) : []
      }
    case 'UPDATE_FILTERS':
      // ** Updates Filters based on action filter
      const filterIndex = state.selectedCalendars.findIndex(i => i === action.filter)
      if (state.selectedCalendars.includes(action.filter)) {
        state.selectedCalendars.splice(filterIndex, 1)
      } else {
        state.selectedCalendars.push(action.filter)
      }
      if (state.selectedCalendars.length === 0) {
        state.events.length = 0
      }
      return { ...state }
    case 'UPDATE_ALL_FILTERS':
      // ** Updates All Filters based on action value
      const value = action.value
      let selected = []
      if (value === true) {
        selected = ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
      } else {
        selected = []
      }
      return { ...state, selectedCalendars: selected }
    case 'SELECT_EVENT':
      return { ...state, selectedEvent: action.event }
    case 'UPDATE_WALLET_BALANCE':
      return { ...state, studentWalletBalance: action.data }
    default:
      return state
  }
}

export default calenderReducer
