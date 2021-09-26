import { useState, useContext, Fragment } from 'react'
import Avatar from '@components/avatar'
import Logo from '../../../assets/images/logo/favicon.png'
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import { useDispatch } from 'react-redux'
import { toast, Slide } from 'react-toastify'
import { handleLogin } from '@store/actions/auth'
import { AbilityContext } from '@src/utility/context/Can'
import { Link, useHistory } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { getHomeRouteForLoggedInUser } from '@utils'
import { Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee } from 'react-feather'
import { AvForm, AvInput } from 'availity-reactstrap-validation-safe'
import {
  Alert,
  Row,
  Col,
  CardTitle,
  CardText,
  FormGroup,
  Label,
  CustomInput,
  Button,
  Spinner,
  UncontrolledTooltip
} from 'reactstrap'

import '@styles/base/pages/page-auth.scss'

const ToastContentValid = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Welcome, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>You have successfully logged in as an {role} user to Appia. Now you can start to explore. Enjoy!</span>
    </div>
  </Fragment>
)

const ToastContentNotVerified = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Welcome, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>You have successfully logged in as an {role} user to Appia. Kindly change your password to continue. Thank you!</span>
    </div>
  </Fragment>
)


const InvalidLoginToastContent = ({ message }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>{message}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Pls, reconfirm login credentials</span>
    </div>
  </Fragment>
)


const Login = props => {
  const [skin, setSkin] = useSkin()
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setEmail] = useState('adelugba.emma@gmail.com')
  const [password, setPassword] = useState('000000')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const illustration = skin === 'dark' ? 'wexford-banner-1.jpg' : 'wexford-banner-1.jpg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const handleSubmit = async (event, errors) => {
    if (errors && !errors.length) {
      setIsSubmitting(true)
      await useJwt
        .login({ email, password })
        .then(res => {
          if (res.data.success) {
            const data = {
              ...res.data.admin,
              accessToken: res.data.token,
              refreshToken: res.data.token,
              ability: [{ action: "manage", subject: "all" }],
              avatar: "/demo/Appia-react-admin-dashboard-template/demo-1/static/media/avatar-s-11.1d46cc62.jpg",
              extras: { eCommerceCartItemsCount: 5 }
            }
            console.log('data', data)
            dispatch(handleLogin(data))
            ability.update(data.ability)
            history.push(getHomeRouteForLoggedInUser('admin'))
            toast.success(
              <ToastContentValid name={`${data.firstName} ${data.lastName}` || data.fullName || data.username || 'John Doe'} role={data.role || 'admin'} />,
              { transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
          } else {
            toast.error(
              <InvalidLoginToastContent message={`${res.data.message}` || 'Invalid Login'} />,
              { transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
            setIsSubmitting(false)
          }
        })
        .catch(err => { console.log(err); setIsSubmitting(false) })
    }
  }


  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <img src={Logo} width='40' />
          <h2 className='brand-text text-primary ml-1'>TuckShop</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-1' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} width="100%"alt='Login V2' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='font-weight-bold mb-1'>
              Welcome to TuckShop 👋
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText>
            <AvForm className='auth-login-form mt-2' onSubmit={handleSubmit}>
              <FormGroup>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <AvInput
                  required
                  autoFocus
                  type='email'
                  value={email}
                  id='login-email'
                  name='login-email'
                  placeholder='john@example.com'
                  onChange={e => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <InputPasswordToggle
                  required
                  tag={AvInput}
                  value={password}
                  id='login-password'
                  name='login-password'
                  autoComplete='on'
                  className='input-group-merge'
                  onChange={e => setPassword(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <CustomInput type='checkbox' className='custom-control-Primary' id='remember-me' label='Remember Me' />
              </FormGroup>
              <Button.Ripple color='primary' block disabled={isSubmitting}>
                {isSubmitting && <Spinner color='white' size='sm' />}
                <span className='ml-50'>Sign In</span>
              </Button.Ripple>
            </AvForm>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login