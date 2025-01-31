import { useState, useEffect } from 'react'
import { isUserLoggedIn } from '@utils'
import { Button, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Input } from 'reactstrap'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { AvForm, AvInput } from 'availity-reactstrap-validation-safe'
import { getAllData, getParent, editParent } from '../store/action'
import { store } from '@store/storeConfig/store'
import Row from 'reactstrap/lib/Row'
import Col from 'reactstrap/lib/Col'

export const EditParent = ({ selectedParent }) => {
	const dispatch = useDispatch()
	const { id } = useParams()
	const [userData, setUserData] = useState({
		fullName: selectedParent.fullName,
		phone: selectedParent.phone,
		status: selectedParent.status,
	})
	const [formModal, setFormModal] = useState(false)

	const onSubmit = async (event, errors) => {
		event?.preventDefault()
		if (errors && !errors.length) {
			await dispatch(editParent(id, userData))
			dispatch(getParent(id))
			setFormModal(!formModal)
		}
	}

	return (
		<div>
			<Button.Ripple className="text-center mb-1" color="primary" outline block onClick={() => setFormModal(!formModal)}>
				Edit Parent
			</Button.Ripple>
			<Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className="modal-dialog-centered modal-lg">
				<ModalHeader toggle={() => setFormModal(!formModal)}>Edit Parent</ModalHeader>
				<AvForm onSubmit={onSubmit}>
					<ModalBody>
						<Row>
							<Col xl="6" lg="12">
								<FormGroup>
									<Label for="fullName">Full Name</Label>
									<AvInput
										type="text"
										name="fullName"
										id="fullName"
										placeholder="Full Name"
										value={selectedParent.fullName}
										onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
										required
									/>
								</FormGroup>
							</Col>
							<Col xl="6" lg="12">
								<FormGroup>
									<Label for="phone">Phone</Label>
									<AvInput
										type="number"
										name="phone"
										id="phone"
										placeholder="Phone"
										value={selectedParent.phone}
										onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
										required
									/>
								</FormGroup>
							</Col>
							<Col xl="6" lg="12">
								<FormGroup>
									<Label for="status">User Status</Label>
									<AvInput
										type="select"
										id="status"
										name="status"
										value={selectedParent.status}
										onChange={(e) => setUserData({ ...userData, status: e.target.value })}
										required
									>
										<option value={selectedParent.status}>{selectedParent.status}</option>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
									</AvInput>
								</FormGroup>
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button.Ripple color="primary" type="submit">
							<span className="ml-50">Save Changes</span>
						</Button.Ripple>
					</ModalFooter>
				</AvForm>
			</Modal>
		</div>
	)
}
export default EditParent
