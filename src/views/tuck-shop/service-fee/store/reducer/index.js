// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedCharge: null
}

const charges = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_CHARGES_DATA':
      return { ...state, allData: action.data }
    case 'GET_FILTERED_CHARGES_DATA':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_CHARGE':
      return { ...state, selectedCharge: action.selectedCharge }
    default:
      return { ...state }
  }
}
export default charges
