import { paginateArray, sortCompare, apiRequest, swal } from '@utils'
import moment from 'moment'

export const apiUrl = process.env.REACT_APP_API_ENDPOINT

// ** Get all User Data
export const getAllData = ({startDate, endDate, year, group}) => {
	return async dispatch => {
		const url = '/transactions'
		const queryParams = new URLSearchParams()
		
		if (startDate) queryParams.append('startDate', new Date(startDate).toISOString())
		if (endDate) queryParams.append('endDate', new Date(endDate).toISOString())
		if (year) queryParams.append('year', year)
		if (group) queryParams.append('group', group)
		
		const queryString = queryParams.toString()
		const finalUrl = `${url}${queryString ? `?${queryString}` : ''}`
		
		const response = await apiRequest({url: finalUrl, method:'GET', params: {startDate, endDate, year, group}}, dispatch)
		console.log(response)
		if (response && response.data.data && response.data.status) {
			const action = {
				type: 'GET_ALL_TRANSACTIONS_DATA',
				data: response.data.data
			}
			await dispatch(action)
			return action
		} else {
			console.log(response)
			swal('Oops!', 'Something went wrong.', 'error')
			return null
		}
	}
}

// All Users Filtered Data
export const getFilteredData = (transactions, params) => {
  return async dispatch => {
    const { q = '', perPage = 100,  page = 1 } = params

    /* eslint-disable  */
    const queryLowered = q?.toLowerCase()
    const filteredData = transactions?.filter(
      transaction => 
        (transaction?.transactionId?.toLowerCase()?.includes(queryLowered) || moment(transaction?.createdAt).format('lll')?.toLowerCase()?.includes(queryLowered) || transaction?.student?.firstName?.toLowerCase()?.includes(queryLowered))
      )
  
    /* eslint-enable  */

    dispatch({
      type: 'GET_FILTERED_TRANSACTION_DATA',
      data: paginateArray(filteredData, perPage, page),
      totalPages: filteredData.length,
      params
    })
  }
}

//  Get User
export const getTransaction = (trans_id) => {
  return async dispatch => {
    const response = await apiRequest({url:`/admin/users/transaction/${trans_id}`, method:'GET'}, dispatch)
    if (response && response.data.data && response.data.success) {
        await dispatch({
          type: 'GET_TRANSACTION',
          selectedTransaction: response.data.data
        })
    } else {
      console.log(response)
      swal('Oops!', 'Something went wrong.', 'error')
    }
  }
}

