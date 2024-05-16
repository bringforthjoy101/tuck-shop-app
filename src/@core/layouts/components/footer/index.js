// ** Icons Import
import { Heart } from 'react-feather'

const Footer = () => {
  const user = JSON.parse(localStorage.getItem('userData'))
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-left d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a href='' target='_blank' rel='noopener noreferrer'>
        {user?.businessData.name}
        </a>
        <span className='d-none d-sm-inline-block'>, All rights Reserved</span>
      </span>
      <span className='float-md-right d-none d-md-block'>
        Powered by <a href='http://tolteminternational.com'>TOLTEM INT'L LTD</a>
        <Heart size={14} /> 
      </span>
    </p>
  )
}

export default Footer
