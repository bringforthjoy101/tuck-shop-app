// ** React Imports
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import moment from 'moment'

// ** Store & Actions
import { getParent, getParentActivity } from '../store/action'
import { useSelector, useDispatch } from 'react-redux'
import { isUserLoggedIn } from '@utils'

// ** Reactstrap
import { Row, Col, Alert } from 'reactstrap'

// ** User View Components
import PlanCard from './PlanCard'
import ParentInfoCard from './ParentInfoCard'
import ParentTimeline from './ParentTimeline'

// ** Styles
import '@styles/react/apps/app-users.scss'

const ParentView = props => {
  // ** Vars
  const store = useSelector(state => state.parents),
    dispatch = useDispatch(),
    { id } = useParams()

  const [userData, setUserData] = useState(null)

  useEffect(() => {
     if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])
 
  // ** Get Admin on mount
  useEffect(() => {
    dispatch(getParent(id))
    // dispatch(getParentActivity(id))
  }, [dispatch])

  return store.selectedParent !== null && store.selectedParent !== undefined ? (
    <div className='app-user-view'>
      <Row>
        <Col xl='9' lg='8' md='7'>
          <ParentInfoCard selectedParent={store.selectedParent} />
        </Col>
        {userData?.role === "manager" ? <Col xl='3' lg='4' md='5'>
          <PlanCard selectedParent={store.selectedParent} />
        </Col> : ""}
      </Row>
      {userData?.role_name === "manager" ? <Row>
        <Col md='12'>
          <ParentTimeline selectedParent={store.selectedParent} data={store.parentActivities.sort((a, b) => moment(b.date).format('YYYYMMDD') - moment(a.date).format('YYYYMMDD'))} />
        </Col>
      </Row> : ""}
    </div>
  ) : ""
}
export default ParentView
