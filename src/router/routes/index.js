// ** Routes Imports
import AppRoutes from './Apps'
import AppiaRoutes from './Appia'
import InvoiceAppRoutes from './InvoiceApp'
import FormRoutes from './Forms'
import PagesRoutes from './Pages'
import TablesRoutes from './Tables'
import ChartMapsRoutes from './ChartsMaps'
import DashboardRoutes from './Dashboards'
import UiElementRoutes from './UiElements'
import ExtensionsRoutes from './Extensions'
import PageLayoutsRoutes from './PageLayouts'
import TuckShopRoutes from './TuckShop'

// ** Document title
const TemplateTitle = '%s - Tuck Shop App'

// ** Default Route
const DefaultRoute = '/dashboard/analytics'

// ** Merge Routes
const Routes = [
  ...DashboardRoutes,
  ...AppiaRoutes,
  ...InvoiceAppRoutes,
  ...TuckShopRoutes,
  ...AppRoutes,
  ...PagesRoutes,
  ...UiElementRoutes,
  ...ExtensionsRoutes,
  ...PageLayoutsRoutes,
  ...FormRoutes,
  ...TablesRoutes,
  ...ChartMapsRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
