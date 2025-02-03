// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
import CartDropdown from './CartDropdown'

// ** Third Party Components
import { Sun, Moon, Power } from 'react-feather'
import { NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'

const NavbarUser = props => {
  // ** Props
  const { skin, setSkin } = props
  const dispatch = useDispatch()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  // ** Handle Logout
  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    dispatch(handleLogout())
    setShowLogoutModal(false)
  }

  const userData = JSON.parse(localStorage.getItem('userData'))

  return (
    <>
      <ul className='nav navbar-nav align-items-center ml-auto'>
        <CartDropdown />
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <ThemeToggler />
          </NavLink>
        </NavItem>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style' onClick={handleLogoutClick}>
            <Power className='ficon' />
          </NavLink>
        </NavItem>
        <UserDropdown />
      </ul>

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
export default NavbarUser
