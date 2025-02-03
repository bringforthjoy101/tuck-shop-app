// ** React Imports
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'
import Logo from '../../../../assets/images/avatars/avatar-blank.png'

// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { Settings, Power } from 'react-feather'


const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()

  // ** State
  const [userData, setUserData] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])

  // ** Handle Logout
  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    dispatch(handleLogout())
    setShowLogoutModal(false)
  }

  return (
    <>
      <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
        <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
          <div className='user-nav d-sm-flex d-none'>
            <span className='user-name font-weight-bold text-capitalize'>{userData?.fullName || `${userData?.firstName} ${userData?.lastName}` || 'Admin'}</span>
            <span className='user-status text-capitalize'>{(userData && userData.role) || userData?.type.toUpperCase() || 'Admin'}</span>
          </div>
          <Avatar img={Logo} imgHeight='40' imgWidth='40' status='online' />
        </DropdownToggle>
        <DropdownMenu right>
          {/* <DropdownItem divider /> */}
          <DropdownItem tag={Link} to='/pages/account-settings'>
            <Settings size={14} className='mr-75' />
            <span className='align-middle'>Settings</span>
          </DropdownItem>
          <DropdownItem tag={Link} to={'#'} onClick={handleLogoutClick}>
            <Power size={14} className='mr-75' />
            <span className='align-middle'>Logout</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutModal} toggle={() => setShowLogoutModal(!showLogoutModal)}>
        <ModalHeader toggle={() => setShowLogoutModal(!showLogoutModal)}>Confirm Logout</ModalHeader>
        <ModalBody>
          Are you sure you want to logout?
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button color='danger' tag={Link} to={`/auth/login/${userData?.businessData.businessCode}`} onClick={confirmLogout}>
            <Power className='ficon' size={16} /> Logout
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default UserDropdown
