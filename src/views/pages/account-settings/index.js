import { Fragment, useState, useEffect } from 'react'
import Tabs from './Tabs'
import axios from 'axios'
import Breadcrumbs from '@components/breadcrumbs'
import PasswordTabContent from './PasswordTabContent'
import ResetPassword from './ResetPassword'
import { Row, Col, TabContent, TabPane, Card, CardBody, Alert } from 'reactstrap'
import { isUserLoggedIn } from '@utils'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('1'),
    [data, setData] = useState(null)

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  const [userData, setUserData] = useState(null)
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])

  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle='Account Settings' breadCrumbParent='Pages' breadCrumbActive='Account Settings' />
        {userData?.isDefaultPassword && (
          <Alert color='warning'>
            <h4 className='alert-heading'>Password Change Required</h4>
            <div className='alert-body'>
              For security purposes, you are required to change your default password before continuing to use the system.
            </div>
          </Alert>
        )}
        <Row>
          <Col className='mb-2 mb-md-0' md='3'>
            <Tabs activeTab={activeTab} toggleTab={toggleTab} />
          </Col>
          <Col md='9'>
            <Card>
              <CardBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId='1'>
                    <PasswordTabContent />
                  </TabPane>
                  <TabPane tabId='2'>
                    <ResetPassword />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
    </Fragment>
  )
}

export default AccountSettings
