import { useState, useContext, useEffect, Fragment } from 'react'
import Avatar from '@components/avatar'
import Logo from '../../../assets/images/logo/favicon.png'
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import { useDispatch } from 'react-redux'
import { toast, Slide } from 'react-toastify'
import { handleLogin } from '@store/actions/auth'
import { AbilityContext } from '@src/utility/context/Can'
import { Link, useHistory, useParams } from 'react-router-dom'
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
      <span>You have successfully logged in as an {role} user to TuckShop. Now you can start to explore. Enjoy!</span>
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
      <span>You have successfully logged in as an {role} user to TuckShop. Kindly change your password to continue. Thank you!</span>
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
  const { code } = useParams()
  const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
  const [tagNumber, setTagNumber] = useState('')
  const [type, setType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const illustration = skin === 'dark' ? 'tuckshop-banner.png' : 'tuckshop-banner.png',
    source = require(`@src/assets/images/pages/${illustration}`).default

    useEffect(() => {
      console.log({code})
    }, [])

  const handleSubmit = async (event, errors) => {
    if (errors && !errors.length) {
      setIsSubmitting(true)
      await useJwt
        .login({ phone, password, code, tagNumber, type })
        .then(res => {
          console.log({res})
          if (res.data.status) {

            let data = {
              accessToken: res.data.token,
              refreshToken: res.data.token,
              ability: [{ action: "manage", subject: "all" }],
              avatar: "/demo/Appia-react-admin-dashboard-template/demo-1/static/media/avatar-s-11.1d46cc62.jpg",
              extras: { eCommerceCartItemsCount: 5 }
            }
            if (res.data.admin) {
              data = {...res.data.admin, ...data}
            }
            if (res.data.student) {
              data = {...res.data.student, ...data}
            }
            if (res.data.parent) {
              data = {...res.data.parent, ...data}
            }
            console.log('data', data)
            dispatch(handleLogin(data))
            ability.update(data.ability)
            toast.success(
              <ToastContentValid name={data.fullName || `${data.firstName} ${data.lastName}` || 'John Doe'} role={data.role || 'admin'} />,
              { transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
            if (data.isDefaultPassword) {
              history.push('/pages/account-settings')
            } else {
              window.location.href = getHomeRouteForLoggedInUser('admin')
            }
           
            
            // history.push(getHomeRouteForLoggedInUser('admin'))
        
          } else {
            toast.error(
              <InvalidLoginToastContent message={`${res.data.message}` || 'Invalid Login'} />,
              { transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
            setIsSubmitting(false)
          }
        })
        .catch(err => { 
          console.log(err.response); 
          toast.error(
            <InvalidLoginToastContent message={'Invalid Login'} />,
            { transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
          setIsSubmitting(false) 
        })
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
                <Label className="form-label" for="login-type">Type</Label>
                <AvInput type="select" name="login-type" id="login-type" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                </AvInput>
              </FormGroup>
              {['parent', 'admin'].includes(type) && (<FormGroup>
								<Label className="form-label" for="login-phone">
									Phone Number
								</Label>
								<AvInput
									required
									autoFocus
									type="text"
									value={phone}
									id="login-phone"
									name="login-phone"
									placeholder="07012345678"
									onChange={(e) => setPhone(e.target.value)}
								/>
							</FormGroup>)}
              {type === 'student' && (<FormGroup>
								<Label className="form-label" for="login-tag-number">
									Student ID
								</Label>
								<AvInput
									required
									autoFocus
									type="text"
									value={tagNumber}
									id="login-tag-number"
									name="login-tag-number"
									placeholder="STUDENT ID"
									onChange={(e) => setTagNumber(e.target.value)}
								/>
							</FormGroup>)}
              {type && (<FormGroup>
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
              </FormGroup>)}
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