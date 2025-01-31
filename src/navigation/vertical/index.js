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
import calendar from './calendar.js'
import parents from './parents'

const userData = JSON.parse(localStorage.getItem('userData'))

// ** Merge & Export
let navigations = []
console.log({ userType: userData?.type })
switch (userData?.type) {
    case 'admin':
        if (userData?.role === 'manager') {
            navigations = [...dashboards, ...tuckShop, ...students, ...parents, ...calendar, ...products, ...orders, ...transaction, ...settlements, ...serviceFees, ...admins]
        } else if (userData?.role === 'bursary') {
            navigations = [...dashboards, ...tuckShop, ...students, ...parents, ...calendar, ...transaction, ...settlements, ...serviceFees]
        } else if (userData?.role === 'sales-rep') {
            navigations = [...dashboards, ...tuckShop, ...calendar, ...transaction, ...orders]
        } else {
            navigations = [...dashboards, ...tuckShop, ...calendar, ...transaction, ...orders]
        }
        break;
    case 'parent':
        navigations = [...dashboards, ...tuckShop, ...students, ...calendar, ...transaction, ...orders]
        break;
    case 'student':
        navigations = [...dashboards, ...tuckShop, ...calendar, ...transaction, ...orders]
        break;
    default:
        navigations = [...dashboards, ...tuckShop, ...calendar]
        break;
}

export default navigations