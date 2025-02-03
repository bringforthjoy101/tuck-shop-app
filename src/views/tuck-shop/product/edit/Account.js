// ** React Imports
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Lock, Edit, Trash2 } from 'react-feather'
import { Media, Row, Col, Button, Form, Input, Label, FormGroup, Table, CustomInput, Spinner } from 'reactstrap'
import { AvForm, AvInput } from 'availity-reactstrap-validation-safe'
import { getAllData, getProduct } from '../store/action'
import { swal, apiRequest } from '@utils'

const UserAccountTab = ({ selectedProduct }) => {
	const dispatch = useDispatch()
	const history = useHistory()
	// ** States
	const [img, setImg] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [productData, setProductData] = useState({
		name: selectedProduct.name,
		description: selectedProduct.description,
		price: selectedProduct.price,
		type: selectedProduct.type,
		category: selectedProduct.category,
		availability: selectedProduct.availability,
		period: selectedProduct.period,
		// image: 'https://res.cloudinary.com/bringforthjoy/image/upload/v1621720743/INVESTA/appia_reward_image_placeholder_um7q6g.jpg'
	})

	const onSubmit = async (event, errors) => {
		event.preventDefault()
		console.log({ errors })
		if (errors && !errors.length) {
			console.log({ productData })
			setIsSubmitting(true)
			try {
				const body = JSON.stringify(productData)
				const response = await apiRequest({ url: `/products/update/${selectedProduct.id}`, method: 'POST', body }, dispatch)
				console.log({ response })
				if (response.data.status) {
					swal('Great job!', response.data.message, 'success')
					dispatch(getAllData())
					dispatch(getProduct(selectedProduct.id))
					setProductData({
						name: selectedProduct.name,
						description: selectedProduct.description,
						price: selectedProduct.price,
						type: selectedProduct.type,
						category: selectedProduct.category,
						availability: selectedProduct.availability,
						period: selectedProduct.period,
					})
					history.push(`/product/view/${selectedProduct.id}`)
				} else {
					swal('Oops!', response.data.message, 'error')
					setProductData({
						name: selectedProduct.name,
						description: selectedProduct.description,
						price: selectedProduct.price,
						type: selectedProduct.type,
						category: selectedProduct.category,
						availability: selectedProduct.availability,
						period: selectedProduct.period,
					})
				}
			} catch (error) {
				console.error({ error })
			} finally {
				setIsSubmitting(false)
			}
		}
	}

	// ** Function to change user image
	const onChange = (e) => {
		const reader = new FileReader(),
			files = e.target.files
		reader.onload = function () {
			setImg(reader.result)
		}
		reader.readAsDataURL(files[0])
	}

	// ** Update user image on mount or change
	useEffect(() => {
		if (selectedProduct !== null) {
			if (selectedProduct.image) {
				return setImg(selectedProduct.image)
			} else {
				return setImg(null)
			}
		}
	}, [selectedProduct])

	// ** Renders User
	const renderUserAvatar = () => {
		if (img === null) {
			const stateNum = Math.floor(Math.random() * 6),
				states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
				color = states[stateNum]
			return (
				<Avatar
					initials
					color={color}
					className="rounded mr-2 my-25"
					content={selectedProduct.name}
					contentStyles={{
						borderRadius: 0,
						fontSize: 'calc(36px)',
						width: '100%',
						height: '100%',
					}}
					style={{
						height: '90px',
						width: '90px',
					}}
				/>
			)
		} else {
			return <img className="user-avatar rounded mr-2 my-25 cursor-pointer" src={img} alt="user profile avatar" height="90" width="90" />
		}
	}

	return (
		<Row>
			<Col sm="12">
				<Media className="mb-2">
					{renderUserAvatar()}
					<Media className="mt-50" body>
						<h4>{selectedProduct.name} </h4>
						<div className="d-flex flex-wrap mt-1 px-0">
							{/* <Button.Ripple id='change-img' tag={Label} className='mr-75 mb-0' color='primary'>
                <span className='d-none d-sm-block'>Change</span>
                <span className='d-block d-sm-none'>
                  <Edit size={14} />
                </span>
                <input type='file' hidden id='change-img' onChange={onChange} accept='image/*' />
              </Button.Ripple>
              <Button.Ripple color='secondary' outline>
                <span className='d-none d-sm-block'>Remove</span>
                <span className='d-block d-sm-none'>
                  <Trash2 size={14} />
                </span>
              </Button.Ripple> */}
						</div>
					</Media>
				</Media>
			</Col>
			<Col sm="12">
				<AvForm onSubmit={onSubmit}>
					<Row>
						<Col md="6" sm="12">
							<FormGroup>
								<Label for="name">Product Name</Label>
								<AvInput
									name="name"
									id="name"
									placeholder="Product Name"
									value={selectedProduct.name}
									onChange={(e) => setProductData({ ...productData, name: e.target.value })}
									required
								/>
								{/* <Input type='text' id='name' placeholder='Name' defaultValue={selectedProduct.name} /> */}
							</FormGroup>
						</Col>
						<Col md="6" sm="12">
							<FormGroup>
								<Label for="price">Product Price</Label>
								<AvInput
									name="price"
									id="price"
									placeholder="Product Price"
									value={selectedProduct.price}
									onChange={(e) => setProductData({ ...productData, price: e.target.value })}
									required
								/>
								{/* <Input type='text' id='price' placeholder='Price' defaultValue={selectedProduct.price} /> */}
							</FormGroup>
						</Col>
						{/* <Col md='6' sm='12'>
              <FormGroup>
                <Label for='qty'>Product Qty</Label>
                <AvInput 
                  name='qty' 
                  id='qty' 
                  placeholder='Product Qty' 
                  value={selectedProduct.qty}
                  onChange={e => setProductData({...productData, qty: e.target.value})}
                  required 
                />
              </FormGroup>
            </Col> */}
						<Col md="6" sm="12">
							<FormGroup>
								<Label for="category">Category</Label>
								<AvInput
									type="select"
									id="category"
									name="category"
									value={selectedProduct.category}
									onChange={(e) => setProductData({ ...productData, category: e.target.value })}
									required
								>
									<option value={selectedProduct.category} className="text-cpitalize">
										{selectedProduct.category}
									</option>
									<option value="consumable">Consumable</option>
									<option value="non-consumable">Non-Consumable</option>
								</AvInput>
							</FormGroup>
						</Col>
						<Col md='6' sm='12'>
							<FormGroup>
								<Label for='type'>Type</Label>
								<AvInput 
								type='select' 
								id='type' 
								name='type' 
								value={selectedProduct.type}
								onChange={e => setProductData({...productData, type: e.target.value})}
								required
								>
								<option value={selectedProduct.type} className='text-cpitalize'>{selectedProduct.type}</option>
								<option value='drink'>Drink</option>
								<option value='food'>Food</option>
								<option value='snack'>Snack</option>
								<option value='medicine'>Medicine</option>
								<option value='other'>Other</option>
								</AvInput>
							</FormGroup>
						</Col>
						<Col md='6' sm='12'>
							<FormGroup>
								<Label for='status'>Status</Label>
								<AvInput 
								type='select' 
								id='status' 
								name='status' 
								value={selectedProduct.status}
								onChange={e => setProductData({...productData, status: e.target.value})}
								required
								>
								<option value={selectedProduct.status} className='text-cpitalize'>{selectedProduct.status}</option>
								<option value='available'>Available</option>
								<option value='unavailable'>Unavailable</option>
								</AvInput>
							</FormGroup>
						</Col>
						<Col md='6' sm='12'>
							<FormGroup>
								<Label for='availability'>Days Available</Label><br />
								<CustomInput 
									inline 
									type='checkbox' 
									id='monday' 
									label='Monday' 
									defaultChecked={selectedProduct.availability.includes('Monday')}
									onChange={e => {
										const day = 'Monday'
										if (e.target.checked) {
										setProductData({...productData, availability: [...productData.availability, day]})
										} else {
										setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
										}
									}} 
								/>
								<CustomInput 
									inline 
									type='checkbox' 
									id='tuesday' 
									label='Tuesday'
									defaultChecked={selectedProduct.availability.includes('Tuesday')}
									onChange={e => {
										const day = 'Tuesday'
										if (e.target.checked) {
										setProductData({...productData, availability: [...productData.availability, day]})
										} else {
										setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
										}
									}}  
								/>
								<CustomInput 
									inline 
									type='checkbox' 
									id='wednesday' 
									label='Wednesday'
									defaultChecked={selectedProduct.availability.includes('Wednesday')}
									onChange={e => {
										const day = 'Wednesday'
										if (e.target.checked) {
										setProductData({...productData, availability: [...productData.availability, day]})
										} else {
										setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
										}
									}}  
								/>
								<CustomInput 
									inline 
									type='checkbox' 
									id='thursday' 
									label='Thursday'
									defaultChecked={selectedProduct.availability.includes('Thursday')}
									onChange={e => {
										const day = 'Thursday'
										if (e.target.checked) {
										setProductData({...productData, availability: [...productData.availability, day]})
										} else {
										setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
										}
									}}  
								/>
								<CustomInput 
									inline 
									type='checkbox' 
									id='friday' 
									label='Friday'
									defaultChecked={selectedProduct.availability.includes('Friday')}
									onChange={e => {
										const day = 'Friday'
										if (e.target.checked) {
										setProductData({...productData, availability: [...productData.availability, day]})
										} else {
										setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
										}
									}}  
								/>
								<CustomInput 
									inline 
									type='checkbox' 
									id='saturday' 
									label='Saturday'
									defaultChecked={selectedProduct.availability.includes('Saturday')}
									onChange={e => {
										const day = 'Saturday'
										if (e.target.checked) {
										setProductData({...productData, availability: [...productData.availability, day]})
										} else {
										setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
										}
									}}  
								/>
								<CustomInput 
									inline 
									type='checkbox' 
									id='sunday' 
									label='Sunday'
									defaultChecked={selectedProduct.availability.includes('Sunday')}
									onChange={e => {
										const day = 'Sunday'
										if (e.target.checked) {
										setProductData({...productData, availability: [...productData.availability, day]})
										} else {
										setProductData({...productData, availability: productData.availability.filter(d => d !== day)})
										}
									}}  
								/>
							</FormGroup>
						</Col>
						<Col md='6' sm='12'>
							<FormGroup>
								<Label for='description'>Product Description</Label>
								<AvInput 
									type='textarea'
									name='description' 
									id='description' 
									placeholder='Product Description' 
									value={productData.description}
									onChange={e => setProductData({...productData, description: e.target.value})}
									required 
								/>
							</FormGroup>
						</Col>
						<Col md='6' sm='12'>
							<FormGroup>
								<Label for='period'>Period Available</Label><br />
								<CustomInput 
									inline 
									type='checkbox' 
									id='morning' 
									label='Morning' 
									defaultChecked={selectedProduct.period.includes('morning')}
									onChange={e => {
										const period = 'morning'
										if (e.target.checked) {
										setProductData({...productData, period: [...productData.period, period]})
										} else {
										setProductData({...productData, period: productData.period.filter(d => d !== period)})
										}
									}} 
								/>
								<CustomInput 
									inline 
									type='checkbox' 
									id='evening' 
									label='Evening'
									defaultChecked={selectedProduct.period.includes('evening')}
									onChange={e => {
										const period = 'evening'
										if (e.target.checked) {
										setProductData({...productData, period: [...productData.period, period]})
										} else {
										setProductData({...productData, period: productData.period.filter(d => d !== period)})
										}
									}}  
								/>
							</FormGroup>
						</Col>

						<Col className="d-flex flex-sm-row flex-column mt-2" sm="12">
							<Button 
								className="mb-1 mb-sm-0 mr-0 mr-sm-1" 
								type="submit" 
								color="primary"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Spinner size="sm" className="mr-50" />
										<span>Updating...</span>
									</>
								) : (
									'Update Changes'
								)}
							</Button>
							<Button color="secondary" outline>
								Reset
							</Button>
						</Col>
					</Row>
				</AvForm>
			</Col>
		</Row>
	)
}
export default UserAccountTab
