// ** Custom Components
import Sidebar from '@components/sidebar'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { swal, apiRequest } from '@utils'
import { getAllData, getFilteredData } from '../store/action'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Third Party Components
import { Button, FormGroup, Label, FormText, Spinner } from 'reactstrap'
import { AvForm, AvInput } from 'availity-reactstrap-validation-safe'

const SidebarNewUsers = ({ open, toggleSidebar }) => {
	const dispatch = useDispatch()

	const [userData, setUserData] = useState({
		title: '',
		fullName: '',
		password: '',
		phone: '',
		email: '',
	})

	const [isSubmitting, setIsSubmitting] = useState(false)
	// ** Function to handle form submit
	const onSubmit = async (event, errors) => {
		setIsSubmitting(true)
		event?.preventDefault()
		if (errors && !errors.length) {
			setIsSubmitting(true)
			const body = JSON.stringify(userData)
			try {
				setIsSubmitting(true)
				const response = await apiRequest({ url: '/parents/create', method: 'POST', body }, dispatch)
				if (response) {
					if (response.data.status) {
						setIsSubmitting(false)
						swal('Great job!', response.data.message, 'success')
						dispatch(getAllData())
						setUserData({
							title: '',
							fullName: '',
							password: '',
							phone: '',
							email: '',
						})
						toggleSidebar()
					} else {
						setIsSubmitting(false)
						setUserData({
							title: '',
							fullName: '',
							password: '',
							phone: '',
							email: '',
						})
						swal('Oops!', response.data.message, 'error')
					}
				} else {
					setIsSubmitting(false)
					swal('Oops!', 'Something went wrong with your network.', 'error')
				}
			} catch (error) {
				setIsSubmitting(false)
				console.error({ error })
			}
		}
	}

	useEffect(() => {
		// onSubmit()
		dispatch(getAllData())
	}, [dispatch])

	return (
		<Sidebar size="lg" open={open} title="New Parent" headerClassName="mb-1" contentClassName="pt-0" toggleSidebar={toggleSidebar}>
			<AvForm onSubmit={onSubmit}>
				<FormGroup>
					<Label for="title">Title</Label>
					<AvInput
						type="select"
						id="title"
						name="title"
						value={userData.title}
						onChange={(e) => setUserData({ ...userData, title: e.target.value })}
						required
					>
						<option value="">Select Title</option>
						<option value="Mr">Mr</option>
						<option value="Mrs">Mrs</option>
						<option value="Dr">Dr</option>
						<option value="Miss">Miss</option>
					</AvInput>
				</FormGroup>
				<FormGroup>
					<Label for="fullName">Full Name</Label>
					<AvInput
						name="fullName"
						id="fullName"
						placeholder="Full Name"
						value={userData.fullName}
						onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
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
					{/* <Label for='password'>Password</Label>
            <AvInput 
              type='password' 
              name='password' 
              id='password' 
              placeholder='Password' 
              value={userData.password}
              onChange={e => setUserData({...userData, password: e.target.value})}
              required 
            /> */}
				</FormGroup>
				<FormGroup>
					<Label for="phone">Phone</Label>
					<AvInput
						name="phone"
						id="phone"
						placeholder="08012345678"
						value={userData.phone}
						onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
						required
					/>
				</FormGroup>
				<FormGroup>
					<Label for="email">Email</Label>
					<AvInput
						type="email"
						id="email"
						name="email"
						value={userData.email}
						onChange={(e) => setUserData({ ...userData, email: e.target.value })}
						required
					/>
				</FormGroup>
				<Button type="submit" className="mr-1" color="primary" disabled={isSubmitting}>
					{isSubmitting && <Spinner color="white" size="sm" />}
					Submit
				</Button>
				<Button type="reset" color="secondary" outline onClick={toggleSidebar}>
					Cancel
				</Button>
			</AvForm>
		</Sidebar>
	)
}

export default SidebarNewUsers
