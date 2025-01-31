// ** React Imports
import { Link, useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// ** Third Party Components
import classnames from 'classnames'
import { X, Heart, Star } from 'react-feather'
import Select from 'react-select'
import { Card, CardBody, CardText, Button, Badge, FormGroup, Label, Spinner, InputGroup, InputGroupAddon, Input, InputGroupText } from 'reactstrap'
import { AvForm, AvInput } from 'availity-reactstrap-validation-safe'
import { swal, apiRequest, selectThemeColors } from '@utils'

// ** Custom Components
import NumberInput from '@components/number-input'
import { getAllData } from '../../../student/store/action'
import { deleteAllCartItem } from '../../store/actions'

const Cart = (props) => {
	// ** Props
	const { products, stepper, deleteCartItem, dispatch, addToWishlist, deleteWishlistItem, getCartItems } = props

	const history = useHistory()

	const userData = JSON.parse(localStorage.getItem('userData'))

	// ** Function to convert Date
	const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
		if (!value) return value
		return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
	}

	// ** Funciton Function to toggle wishlist item
	const handleWishlistClick = (id, val) => {
		if (val) {
			dispatch(deleteWishlistItem(id))
		} else {
			dispatch(addToWishlist(id))
		}
		dispatch(getCartItems())
	}

	// ** Render cart items
	const renderCart = () => {
		return products.map((item) => {
			return (
				<Card key={item.name} className="ecommerce-card">
					<div className="item-img">
						<Link to={`#`}>
							<img className="img-fluid" src={`https://picsum.photos/62/62?random=${item.id}`} alt={item.name} />
						</Link>
					</div>
					<CardBody>
						<div className="item-name">
							<h6 className="mb-0">
								<Link to={`#`}>{item.name}</Link>
							</h6>
							<span className='item-company'>
								{/* By */}
								{/* <a className='ml-25' href='/' onClick={e => e.preventDefault()}> */}
								{item.description}
								{/* </a> */}
							</span>
							<span className='item-company'>
								{/* By */}
								{/* <a className='ml-25' href='/' onClick={e => e.preventDefault()}> */}
								{item.availability.join(', ')}
								{/* </a> */}
							</span>
							{/* <div className="item-rating">
								<ul className="unstyled-list list-inline">
									{new Array(5).fill().map((listItem, index) => {
										return (
											<li key={index} className="ratings-list-item mr-25">
												<Star
													className={classnames({
														'filled-star': index + 1 <= item.rating,
														'unfilled-star': index + 1 > item.rating,
													})}
												/>
											</li>
										)
									})}
								</ul>
							</div> */}
						</div>
						{/* <span className='text-success mb-1'>In Stock</span> */}
						<div className="item-quantity">
							<span className="quantity-title mr-50">Qty</span>
							<NumberInput value={item.qty} min={1} dispatch={dispatch} productId={item.id} size="sm" style={{ width: '7rem', height: '2.15rem' }} />
						</div>
						{/* <div className='delivery-date text-muted'>Delivery by, {formatDate(item.shippingDate)}</div>
            <span className='text-success'>
              {item.discountPercentage}% off {item.offers} offers Available
            </span> */}
					</CardBody>
					<div className="item-options text-center">
						<div className="item-wrapper">
							<div className="item-cost">
								<h4 className="item-price">₦{(item.price * item.qty).toLocaleString()}</h4>
								{item.hasFreeShipping ? (
									<CardText className="shipping">
										<Badge color="light-success" pill>
											Free Shipping
										</Badge>
									</CardText>
								) : null}
							</div>
						</div>
						<Button className="mt-1 remove-wishlist" color="light" onClick={() => dispatch(deleteCartItem(item.id))}>
							<X size={14} className="mr-25" />
							<span>Remove</span>
						</Button>
						{/* <Button
              className='btn-cart'
              color='primary'
              onClick={() => handleWishlistClick(item.id, item.isInWishlist)}
            >
              <Heart
                size={14}
                className={classnames('mr-25', {
                  'fill-current': item.isInWishlist
                })}
              />
              <span className='text-truncate'>Wishlist</span>
            </Button> */}
					</div>
				</Card>
			)
		})
	}

	const amount = products.reduce((n, { amount }) => n + amount, 0)
	const [selectedOption, setSelectedOption] = useState('')
	const [orderData, setOrderData] = useState({
		amount,
		orderedProducts: products.map(product => ({
			id: product.id,
			quantity: product.qty
		})),
		studentId: null
	})

	const [packagedOrderData, setPackagedOrderData] = useState({
		name: '',
		description: '',
		category: '',
		studentId: null,
		productIds: products.map(product => product.id)
	})

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isGeneralOrder, setIsGeneralOrder] = useState(false)
	const classObject = {
		7: 'JSS 1',
		8: 'JSS 2',
		9: 'JSS 3',
		10: 'SSS 1',
		11: 'SSS 2',
		12: 'SSS 3',
		0: 'Graduated'
	}

	const store = useSelector((state) => state.students)

	// ** Get data on mount
	useEffect(() => {
		if (store.allData.length === 0) {
			dispatch(getAllData())
		}
		if (userData?.type !== 'admin') {
			setIsGeneralOrder(true)
		}
		// if (selectedOption) {
		// 	setOrderData(prev => ({ ...prev, studentId: selectedOption.value }))
		// 	setPackagedOrderData(prev => ({ ...prev, studentId: selectedOption.value }))
		// }

		if (userData?.type === 'student') {
			const student = store.allData?.find(student => student.id === userData?.id)
			setSelectedOption({ value: student?.id, label: `${student?.firstName} ${student?.lastName} (₦${student?.wallet.toLocaleString()})` })
			setPackagedOrderData(prev => ({ ...prev, studentId: student?.id }))
			
		}
	}, [dispatch])

	const renderStudents = (students) => {
		// console.log(students)
		
		return students
			.filter((student) => student.status === 'active')
			.map((student) => {
				return { value: student.id, label: `${student.firstName} ${student.lastName} | ${classObject[student.year]} ${student.group} | ${student.wallet.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}` }
			})
	}

	// Handle category selection
	const handleCategoryChange = (option) => {
		setPackagedOrderData(prev => ({ ...prev, category: option.value }))
	}

	const handleStudentChange = (option) => {
		// setSelectedOption(option)
		setPackagedOrderData(prev => ({ ...prev, studentId: option.value }))
	}


	// ** Function to handle form submit
	const onSubmit = async (event, errors) => {
		event.preventDefault()
		console.log({ errors })
		setIsSubmitting(true)
		const submitData = isGeneralOrder ? packagedOrderData : orderData
			console.log({ submitData })
			// Check if all required fields have values
			const requiredFields = isGeneralOrder ? ['name', 'description', 'category', 'studentId', 'productIds'] : ['amount', 'products', 'studentId']
			const hasEmptyFields = requiredFields.some(field => {
				const value = submitData[field]
				return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
			})
			console.log({ hasEmptyFields })
		if ((errors && errors.length) || hasEmptyFields) {
			setIsSubmitting(false)
			swal('Error', 'Please fill in all required fields', 'error')
			return
		}
		if (errors && !errors.length) {
			setIsSubmitting(true)
			const prepData = isGeneralOrder ? {...submitData, productIds: products.map(product => product.id)} : { ...submitData, products: products.map(product => ({ id: product.id, quantity: product.qty })) }
			
			const body = JSON.stringify(prepData)
			try {
				const response = await apiRequest({ url: isGeneralOrder ? '/packages/create' : '/orders/create', method: 'POST', body }, dispatch)
				console.log({ response })
				if (response.data.status) {
					setIsSubmitting(false)
					swal('Great job!', response.data.message, 'success')
					dispatch(deleteAllCartItem())
					setOrderData({
						amount,
						products,
						studentId: selectedOption?.value,
					})
					history.push(`/apps/ecommerce/shop`)
				} else {
					setIsSubmitting(false)
					swal('Oops!', response.data.message, 'error')
					// dispatch(deleteAllCartItem())
					// setOrderData({
					// 	amount,
					// 	products,
					// 	studentId: selectedOption?.value,
					// })
					// history.push(`/apps/ecommerce/shop`)
				}
			} catch (error) {
				setIsSubmitting(false)
				console.error({ error })
			}
		}
	}

	return (
		<div className="list-view product-checkout">
			<div className="checkout-items">{products.length ? renderCart() : <h4>Your cart is empty</h4>}</div>
			<div className="checkout-options">
				<Card>
					<CardBody>
						<AvForm onSubmit={onSubmit}>
							{userData?.type === 'admin' && <FormGroup className='mb-2'>
								<div className='d-flex align-items-center'>
									<div className='custom-control custom-checkbox'>
										<Input
											type='checkbox'
											className='custom-control-input'
											id='packagedOrder'
											checked={isGeneralOrder}
											onChange={e => setIsGeneralOrder(e.target.checked)}
										/>
										<Label className='custom-control-label' for='packagedOrder'>
											This is a packaged order
										</Label>
									</div>
								</div>
							</FormGroup>}

							{isGeneralOrder && (
								<div className='packaged-order-section mb-1'>
									<FormGroup>
										<Label for="name">Package Name</Label>
										<AvInput
											type="text"
											id="name"
											name="name"
											value={packagedOrderData.name}
											onChange={e => setPackagedOrderData({...packagedOrderData, name: e.target.value})}
											required
										/>
									</FormGroup>
									<FormGroup>
										<Label for="description">Description</Label>
										<AvInput
											type="textarea"
											id="description"
											name="description"
											value={packagedOrderData.description}
											onChange={e => setPackagedOrderData({...packagedOrderData, description: e.target.value})}
											required
										/>
									</FormGroup>
									<FormGroup>
										<Label for="category">Category</Label>
										<Select
											theme={selectThemeColors}
											className="react-select"
											classNamePrefix="select"
											options={[
												{ value: 'morning', label: 'Morning' }, 
												{ value: 'evening', label: 'Evening' }
											]}
											isClearable={false}
											value={packagedOrderData.category ? { 
												value: packagedOrderData.category, 
												label: packagedOrderData.category.charAt(0).toUpperCase() + packagedOrderData.category.slice(1) 
											} : null}
											onChange={handleCategoryChange}
											required
										/>
									</FormGroup>
								</div>
							)}

							<FormGroup>
								<Label for="studentId">Student</Label>
								<Select
									theme={selectThemeColors}
									className="react-select"
									classNamePrefix="select"
									value={selectedOption}
									options={renderStudents(store.allData)}
									isClearable={false}
									onChange={setSelectedOption}
									required
									disabled={userData?.type === 'student'}
								/>
							</FormGroup>

							<hr />
							<div className="price-details">
								<ul className="list-unstyled">
									<li className="price-detail">
										<div className="detail-title detail-total">Total</div>
										<div className="detail-amt font-weight-bolder">₦{amount.toLocaleString()}</div>
									</li>
								</ul>
								<Button.Ripple
									color="primary"
									classnames="btn-next place-order"
									block
									type="submit"
									disabled={isSubmitting}
								>
									{isSubmitting && <Spinner color="white" size="sm" />}
									{isGeneralOrder ? 'Create Package' : 'Place Order'}
								</Button.Ripple>
							</div>
						</AvForm>
					</CardBody>
				</Card>
			</div>
		</div>
	)
}

export default Cart
