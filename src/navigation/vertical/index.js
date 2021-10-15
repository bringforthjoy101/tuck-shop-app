// ** Navigation sections imports
import admins from './admins'
import students from './students'
import kitchenStaffs from './kitchen-staffs'
import tuckShop from './tuck-shop'
import dashboards from './dashboards'
import products from './products.js'
import orders from './orders'
import transaction from './transaction'

const userData = JSON.parse(localStorage.getItem('userData'))

// ** Merge & Export
export default userData?.role === 'manager' ? [...dashboards, ...tuckShop, ...admins, ...students, ...kitchenStaffs, ...products, ...orders, ...transaction] : userData?.role === 'busary' ? [...dashboards, ...tuckShop, ...students, ...transaction] : userData?.role === 'sales rep' ? [...dashboards, ...tuckShop, ...students] : [...dashboards, ...tuckShop, ...kitchenStaffs]