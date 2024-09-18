import { paginateArray, sortCompare, apiRequest, swal } from '@utils'
import moment from 'moment'

export const apiUrl = process.env.REACT_APP_API_ENDPOINT

// ** Get all User Data
export const getAllData = () => {
  return async dispatch => {
    const response = await apiRequest({url:'/charges', method:'GET'}, dispatch)
    if (response && response.data.data && response.data.status) {
        await dispatch({
          type: 'GET_ALL_CHARGES_DATA',
          data: response.data.data
        })
    } else {
      console.log(response)
      swal('Oops!', 'Something went wrong.', 'error')
    }
  }
}

// All Users Filtered Data
export const getFilteredData = (fees, params) => {
  return async dispatch => {
    const { q = '', perPage = 100,  page = 1 } = params
    console.log({fees})
    /* eslint-disable  */
    const queryLowered = q?.toLowerCase()
    const filteredData = fees?.filter(
      fee => 
        (fee?.transactionId?.toLowerCase()?.includes(queryLowered) || moment(fee?.createdAt).format('lll')?.toLowerCase()?.includes(queryLowered) || fee?.student?.firstName?.toLowerCase()?.includes(queryLowered))
      )
  
    /* eslint-enable  */

    dispatch({
      type: 'GET_FILTERED_CHARGES_DATA',
      data: paginateArray(filteredData, perPage, page),
      totalPages: filteredData?.length,
      params
    })
  }
}