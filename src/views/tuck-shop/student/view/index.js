// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

// ** Store & Actions
import { getUser, getUserAllTransactions, getStudentDetails, trackUser } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'

// ** Reactstrap
import { Row, Col, Alert, Card, Nav, NavItem, NavLink, Spinner } from 'reactstrap'

// ** User View Components
import PlanCard from './PlanCard'
import UserInfoCard from './UserInfoCard'
import AllTransactionList from './AllTransactions'
import AllOrders from './AllOrders'
import Books from './Books'
import { isUserLoggedIn } from '@utils'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UserView = (props) => {
	// ** Vars
	const store = useSelector((state) => state.students),
		dispatch = useDispatch(),
		{ id } = useParams()

	const [userData, setUserData] = useState(null)

	const [activeTransaction, setActiveTransaction] = useState('transactions')

	// ** Get user on mount
	useEffect(() => {
		dispatch({
			type: 'GET_STUDENT_DETAILS',
			studentDetails: null,
		})
		dispatch(getStudentDetails(id))
		// dispatch(getUserAllTransactions(id))
	}, [dispatch, id])

	useEffect(() => {
		if (isUserLoggedIn() !== null) {
			setUserData(JSON.parse(localStorage.getItem('userData')))
		}
	}, [])

	return store.studentDetails !== null && store.studentDetails !== undefined ? (
		<div className="app-user-view">
			<Row>
				<Col xl="9" lg="8" md="7">
					<UserInfoCard studentDetails={store.studentDetails} userRole={userData?.role} />
				</Col>
				{userData?.role === 'manager' || userData?.role === 'bursary' ? (
					<Col xl="3" lg="4" md="5">
						<PlanCard studentDetails={store.studentDetails} />
					</Col>
				) : (
					<Spinner color="primary" className="reload-spinner" />
				)}
			</Row>
			{userData?.role === 'manager' || userData?.role === 'bursary' ? (
				<div>
					<Card className="mb-3 d-flex justify-content-around">
						<Row className="d-sm-block d-lg-flex justify-content-center">
							<Nav pills className="nav-pill-primary my-2">
								<NavItem>
									<NavLink onClick={() => setActiveTransaction('transactions')} active={activeTransaction === 'transactions'}>
										Transactions
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink onClick={() => setActiveTransaction('orders')} active={activeTransaction === 'orders'}>
										Orders
									</NavLink>
								</NavItem>
								{/* <NavItem>
									<NavLink onClick={() => setActiveTransaction('books')} active={activeTransaction === 'books'}>
										Books
									</NavLink>
								</NavItem> */}
							</Nav>
						</Row>
					</Card>
					<Row>
						{activeTransaction === 'transactions' ? (
							<Col sm="12">
								<AllTransactionList />
							</Col>
						) : activeTransaction === 'orders' ? (
							<Col sm="12">
								<AllOrders />
							</Col>
						) : activeTransaction === 'books' ? (
							<Col sm="12">
								<Books />
							</Col>
						) : (
							''
						)}
					</Row>
				</div>
			) : (
				''
			)}
		</div>
	) : (
		''
	)
}
export default UserView
