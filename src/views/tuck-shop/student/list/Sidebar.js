// ** Custom Components
import Sidebar from '@components/sidebar'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { swal, apiRequest, selectThemeColors } from '@utils'
import { getAllData, getFilteredData } from '../store/action'

// ** Third Party Components
import { Button, FormGroup, Label, Spinner, CustomInput } from 'reactstrap'
import { AvForm, AvInput } from 'availity-reactstrap-validation-safe'
import InputPasswordToggle from '@components/input-password-toggle'
import Select from 'react-select'

const SidebarNewUsers = ({ open, toggleSidebar }) => {
	const dispatch = useDispatch()

	const [userData, setUserData] = useState({
		firstName: '',
		lastName: '',
		otherName: '',
		tagNumber: '',
		password: '',
		type: '',
		year: '',
		group: '',
		parentId: '',
		avatar: '',
	})

	const [isSubmitting, setIsSubmitting] = useState(false)

	const uploadImage = async (event) => {
		console.log('hi')
		event?.preventDefault()
		console.log(event)
		const formData = new FormData()
		formData.append('image', event.target.files[0])
		try {
			const response = await apiRequest({
				url: '/upload-images',
				method: 'POST',
				body: formData,
			})
			if (response) {
				if (response?.data?.status) {
					const avatar = response.data.data
					// setIsSubmitting(false)
					setUserData({ ...userData, avatar })
				} else {
					swal('Oops!', response.data.message, 'error')
				}
			} else {
				swal('Oops!', 'Something went wrong with your image.', 'error')
			}
		} catch (error) {
			console.error({ error })
		}
	}
	const [parents, setParents] = useState([])
	const handleParentChange = (selectedOption) => {
		setUserData({ ...userData, parentId: selectedOption?.value || '' })
	}

	  useEffect(() => {
		const fetchParents = async () => {
		  try {
			const response = await apiRequest({
			  url: '/parents',
			  method: 'GET'
			})
			console.log({response})
			if (response?.data?.status) {
			  // Transform parent data into select options format
			  const parentOptions = response.data.data.map(parent => ({
				value: parent.id,
				label: `${parent.title}. ${parent.fullName}`
			  }))
			  setParents(parentOptions)
			}
		  } catch (error) {
			console.error('Error fetching parents:', error)
			swal('Oops!', 'Error loading parents list', 'error')
		  }
		}
		
		fetchParents()
	  }, [])

	// ** Function to handle form submit
	const onSubmit = async (event, errors) => {
		setIsSubmitting(true)
		event.preventDefault()
		console.log({ errors })
		if (errors) setIsSubmitting(false)
		if (errors && !errors.length) {
			console.log({ userData })
			setIsSubmitting(true)
			const body = JSON.stringify(userData)
			try {
				const response = await apiRequest({ url: '/students/create', method: 'POST', body }, dispatch)
				console.log({ response })
				if (response.data.status) {
					setIsSubmitting(false)
					swal('Great job!', response.data.message, 'success')
					dispatch(getAllData())
					toggleSidebar()
				} else {
					setIsSubmitting(false)
					swal('Oops!', response.data.message, 'error')
				}
			} catch (error) {
				setIsSubmitting(false)
				console.error({ error })
			}
		}
	}

	return (
		<Sidebar size="lg" open={open} title="New Student" headerClassName="mb-1" contentClassName="pt-0" toggleSidebar={toggleSidebar}>
			<AvForm onSubmit={onSubmit}>
				<FormGroup>
					<Label for="image">Student Image</Label>
					<CustomInput type="file" id="image" name="image" accept="image/*" onChange={(e) => uploadImage(e)} required />
				</FormGroup>
				<FormGroup>
					<Label for="firstName">First Name</Label>
					<AvInput
						name="firstName"
						id="firstName"
						placeholder="First Name"
						value={userData.firstName}
						onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
						required
					/>
				</FormGroup>
				<FormGroup>
					<Label for="lastName">Last Name</Label>
					<AvInput
						name="lastName"
						id="lastName"
						placeholder="Last Name"
						value={userData.lastName}
						onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
						required
					/>
				</FormGroup>
				<FormGroup>
					<Label for='otherName'>Other Name</Label>
					<AvInput 
					name='otherName' 
					id='otherName' 
					placeholder='Other Name' 
					value={userData.otherName}
					onChange={e => setUserData({...userData, otherName: e.target.value})}
					/>
				</FormGroup>
				<FormGroup>
					{/* <Label for="gender">Gender</Label> */}
					<CustomInput 
						type='radio' 
						id='gender-male' 
						name='gender' 
						inline 
						label='Male' 
						value='male'
						checked={userData.gender === 'male'} 
						onChange={(e) => setUserData({ ...userData, gender: e.target.value })} 
					/>
          			<CustomInput 
						type='radio' 
						id='gender-female' 
						name='gender' 
						inline 
						label='Female' 
						value='female'
						checked={userData.gender === 'female'}
						onChange={(e) => setUserData({ ...userData, gender: e.target.value })} 
					/>
					{/* <AvInput
						type="radio"
						id="gender"
						name="gender"
						value={userData.gender}
						onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
						required
					>
						<option value="">Select Gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</AvInput> */}
				</FormGroup>
				<FormGroup>
					<Label for="tagNumber">Tag Number</Label>
					<AvInput
						type="text"
						name="tagNumber"
						id="tagNumber"
						placeholder="Tag Number"
						value={userData.tagNumber}
						onChange={(e) => setUserData({ ...userData, tagNumber: e.target.value })}
						required
					/>
				</FormGroup>
				<FormGroup>
					<InputPasswordToggle
						tag={AvInput}
						className="input-group-merge"
						label="Password"
						htmlFor="password"
						name="password"
						value={userData.password}
						onChange={(e) => setUserData({ ...userData, password: e.target.value })}
						required
					/>
				</FormGroup>
				<FormGroup>
					<Label for="type">Student Type</Label>
					<AvInput
						type="select"
						id="type"
						name="type"
						value={userData.type}
						onChange={(e) => setUserData({ ...userData, type: e.target.value })}
						required
					>
						<option value="">Select Student Type</option>
						<option value="boarding">Boarding</option>
						<option value="day">Day</option>
					</AvInput>
				</FormGroup>
				<FormGroup>
					<Label for="role">Student Class</Label>
					<AvInput
						type="select"
						id="year"
						name="year"
						value={userData.year}
						onChange={(e) => setUserData({ ...userData, year: e.target.value })}
						required
					>
						<option value="">Select Student Class</option>
						<option value="7">JSS 1</option>
						<option value="8">JSS 2</option>
						<option value="9">JSS 3</option>
						<option value="10">SSS 1</option>
						<option value="11">SSS 2</option>
						<option value="12">SSS 3</option>
						<option value="0">Graduated</option>
					</AvInput>
				</FormGroup>
				<FormGroup>
					<Label for="group">Class Group</Label>
					<AvInput
						type="text"
						name="group"
						id="group"
						placeholder="Group"
						value={userData.group}
						onChange={(e) => setUserData({ ...userData, group: e.target.value })}
						required
					/>
				</FormGroup>
				<FormGroup>
					<Label for="parentId">Parent</Label>
					<Select
						theme={selectThemeColors}
						className="react-select"
						classNamePrefix="select"
						options={parents}
						isClearable={true}
						value={parents.find(option => option.value === userData.parentId) || null}
						onChange={handleParentChange}
						isLoading={!parents.length}
						placeholder="Select Parent"
						required
					/>
				</FormGroup>
				
				<Button type="submit" className="mr-1" color="primary" disabled={isSubmitting}>
					{isSubmitting && <Spinner color="white" size="sm" />}
					<span className="ml-50">Submit</span>
				</Button>
				<Button type="reset" color="secondary" outline onClick={toggleSidebar}>
					Cancel
				</Button>
			</AvForm>
		</Sidebar>
	)
}

export default SidebarNewUsers
