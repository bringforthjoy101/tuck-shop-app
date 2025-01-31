// ** Navigation sections imports
import apps from './apps'
import pages from './pages'
import others from './others'
import dashboards from './dashboards'
import uiElements from './ui-elements'
import formsAndTables from './forms-tables'
import chartsAndMaps from './charts-maps'
import tuckShop from '../vertical/tuck-shop'
import students from '../vertical/students'
import calendar from '../vertical/calendar'
import products from '../vertical/products'
import orders from '../vertical/orders'
import transaction from '../vertical/transaction'
import settlements from '../vertical/settlements'
import serviceFees from '../vertical/service-fees'
import admins from '../vertical/admins'

// ** Merge & Export
// export default [...dashboards, ...apps, ...uiElements, ...formsAndTables, ...pages, ...chartsAndMaps, ...others]
const userData = JSON.parse(localStorage.getItem('userData'))
export default userData?.role === 'manager' ? [...dashboards, ...tuckShop, ...students, ...calendar, ...products, ...orders, ...transaction, ...settlements, ...serviceFees, ...admins] : userData?.role === 'bursary' ? [...dashboards, ...tuckShop, ...students, ...calendar, ...transaction, ...settlements, ...serviceFees] : userData?.role === 'sales-rep' ? [...dashboards, ...tuckShop, ...students, ...calendar] : [...dashboards, ...tuckShop, ...calendar]
