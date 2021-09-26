// ** Navigation sections imports
import admins from './admins'
import students from './students'
import tuckShop from './tuck-shop'
import dashboards from './dashboards'
import products from './products.js'
import orders from './orders'
import transaction from './transaction'

const userData = JSON.parse(localStorage.getItem('userData'))

// ** Merge & Export
export default userData?.role === 'manager' ? [...dashboards, ...tuckShop, ...admins, ...students, ...products, ...orders, ...transaction] : userData?.role === 'busary' ? [...dashboards, ...tuckShop, ...students, ...transaction] : [...tuckShop, ...students]