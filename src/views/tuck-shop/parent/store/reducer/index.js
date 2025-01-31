// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedParent: null,
  adminActivities: []
}

const parents = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_PARENT_DATA':
      return { ...state, allData: action.data }
    case 'GET_FILTERED_PARENT_DATA':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_PARENT':
      return { ...state, selectedParent: action.selectedParent }
    case 'GET_ALL_PARENT_ACTIVITY':
      return {...state, parentActivities: action.data}
    default:
      return { ...state }
  }
}
export default parents
