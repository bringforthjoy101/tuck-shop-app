// ** React Imports
import { Link } from 'react-router-dom'

// ** Third Party Components
import { Card, CardBody, Button } from 'reactstrap'
import UpdateStatus from './UpdateStatus'
import { swal, apiRequest } from '@utils'
import { useDispatch } from 'react-redux'
import { getOrder } from '../store/action'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const PreviewActions = ({ id, data }) => {
	const dispatch = useDispatch()

	const completePayment = async (saleId) => {
		const response = await apiRequest({ url: `/sales/complete/${saleId}`, method: 'GET' }, dispatch)
		if (response) {
			if (response.data.message) {
				swal('Great job!', response.data.message, 'success')
				dispatch(getOrder(id))
			} else {
				swal('Oops!', response.data.message, 'error')
			}
		} else {
			swal('Oops!', 'Something went wrong with your network.', 'error')
		}
	}

	const handleCancelOrder = async () => {

		MySwal.fire({
			title: 'Are you sure?',
			text: "Do you want to cancel this order?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, cancel it!',
			customClass: {
			  confirmButton: 'btn btn-primary',
			  cancelButton: 'btn btn-outline-danger ml-1'
			},
			buttonsStyling: false
		  }).then(async function (result) {
			if (result.value) {
				const response = await apiRequest({ url: `/cancel-order/${id}`, method: 'GET' }, dispatch)
			if (response && response?.data?.status) {
				dispatch(getOrder(id))
				// await store.dispatch(getAllData())
				  MySwal.fire({
					  icon: 'success',
					  title: 'Cancelled!',
					  text: 'Order has been cancelled.',
					  customClass: {
						confirmButton: 'btn btn-primary'
					  }
				  })
				} else {
					MySwal.fire('Oops!', response.data?.message || 'Something went wrong while cancelling the order.', 'error')
				}
			}
		  })
	}

	return (
		<Card className="invoice-action-wrapper">
			<CardBody>
				{/* <Button.Ripple color='primary' block className='mb-75' onClick={() => setSendSidebarOpen(true)}>
          Send Invoice
        </Button.Ripple> */}

				{/* <Button.Ripple color="secondary" tag={Link} to={`/sales/print/${id}`} block outline className="mb-75">
					Print
				</Button.Ripple> */}
				<Button.Ripple color="danger" block outline className="mb-75" onClick={handleCancelOrder} disabled={data?.status === "cancelled"}>
					Cancel Order
				</Button.Ripple>
				{/* <UpdateStatus /> */}
				{/* <Button.Ripple tag={Link} to={`/apps/invoice/edit/${id}`} color='secondary' block outline className='mb-75'>
          Edit
        </Button.Ripple>
        <Button.Ripple color='success' block onClick={() => setAddPaymentOpen(true)}>
          Add Payment
        </Button.Ripple> */}
			</CardBody>
		</Card>
	)
}

export default PreviewActions
