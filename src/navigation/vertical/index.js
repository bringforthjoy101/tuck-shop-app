// ** Navigation sections imports
import admins from './admins'
import students from './students'
import kitchenStaffs from './kitchen-staffs'
import tuckShop from './tuck-shop'
import dashboards from './dashboards'
import products from './products.js'
import orders from './orders'
import transaction from './transaction'
import settlements from './settlements.js'
import serviceFees from './service-fees.js'

const userData = JSON.parse(localStorage.getItem('userData'))

// ** Merge & Export
export default userData?.role === 'manager' ? [...dashboards, ...tuckShop, ...students, ...products, ...orders, ...transaction, ...settlements, ...serviceFees, ...admins] : userData?.role === 'bursary' ? [...dashboards, ...tuckShop, ...students, ...transaction, ...settlements, ...serviceFees] : userData?.role === 'sales-rep' ? [...dashboards, ...tuckShop, ...students] : [...dashboards, ...tuckShop]