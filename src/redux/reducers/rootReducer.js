// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
import chat from '@src/views/apps/chat/store/reducer'
import todo from '@src/views/apps/todo/store/reducer'
import users from '@src/views/apps/user/store/reducer'
import appiaUsers from '@src/views/appia/user/store/reducer'
import appiaAdmins from '@src/views/appia/admin/store/reducer'
import appiaFunds from '@src/views/appia/funds/store/reducer'
import appiaWithdrawals from '@src/views/appia/withdrawal/store/reducer'
import appiaContacts from '@src/views/appia/contacts/store/reducer'
import appiaFeedbacks from '@src/views/appia/feedbacks/store/reducer'
import appiaSubscribers from '@src/views/appia/subscribers/store/reducer'
import appiaDataPlans from '@src/views/appia/dataPlans/store/reducer'
import appiaAllRewards from '@src/views/appia/allRewardItems/store/reducer/index'
import appiaDeletedRewards from '@src/views/appia/allRewardItems/store/reducer/history'
import appiaClaimedRewards from '@src/views/appia/claimedRewards/store/reducer'
import appiaSettings from '@src/views/appia/settings/store/reducer'
import appiaEscrow from '@src/views/appia/escrow/store/reducer'
import appiaTransfers from '@src/views/appia/transfers/store/reducer'

import students from '@src/views/tuck-shop/student/store/reducer'
import admins from '@src/views/tuck-shop/admin/store/reducer'
import products from '@src/views/tuck-shop/product/store/reducer'
import orders from '@src/views/tuck-shop/order/store/reducer'
import transactions from '@src/views/tuck-shop/transaction/store/reducer'

import email from '@src/views/apps/email/store/reducer'
// import invoice from '@src/views/apps/invoice/store/reducer'
import invoice from '@src/views/invoiceApp/store/reducer'
import calendar from '@src/views/apps/calendar/store/reducer'
import ecommerce from '@src/views/apps/ecommerce/store/reducer'
import dataTables from '@src/views/tables/data-tables/store/reducer'

const rootReducer = combineReducers({
  auth,
  todo,
  chat,
  email,
  users,
  students,
  admins,
  products,
  transactions,
  orders,
  appiaFunds,
  appiaWithdrawals,
  appiaContacts,
  appiaFeedbacks,
  appiaSubscribers,
  appiaDataPlans,
  appiaAllRewards,
  appiaDeletedRewards,
  appiaClaimedRewards,
  appiaSettings,
  appiaEscrow,
  appiaTransfers,
  navbar,
  layout,
  invoice,
  calendar,
  ecommerce,
  dataTables
})

export default rootReducer
