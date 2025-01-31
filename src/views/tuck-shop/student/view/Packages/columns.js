// ** React Imports
import moment from 'moment'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { Send, CheckCircle, Save, ArrowDownCircle, Info, PieChart } from 'react-feather'

const getItemNames = (items) => {
	const arr = []
	const _items = process.env.NODE_ENV === 'production' ? JSON.parse(items) : items
	_items.forEach((item) => {
		arr.push(item.name)
	})
	return arr.join(', ')
}

// ** Table columns
export const columns = [
	// {
	//   name: 'ID',
	//   minWidth: '180px',
	//   selector: 'id',
	//   cell: row => <span>{ `#${row.id}` }</span>
	// },
	{
		name: 'Package',
		selector: 'name',
		sortable: true,
		minWidth: '150px',
		cell: (row) => <span className="text-capitalize">{row.name}</span>,
	},
	{
		name: 'Category',
		selector: 'category',
		sortable: true,
		minWidth: '150px',
		cell: (row) => <span className="text-capitalize">{row.category}</span>,
	},
	{
		name: 'Description',
		selector: 'description',
		sortable: true,
		minWidth: '150px',
		cell: (row) => <span className="text-capitalize">{row.description}</span>,
	},
	{
		name: 'Status',
		selector: 'status',
		sortable: true,
		minWidth: '150px',
		cell: (row) => <span className="text-capitalize">{row.status}</span>,
	},
	{
		name: 'Date',
		selector: 'createdAt',
		sortable: true,
		minWidth: '200px',
		cell: (row) => moment(row.createdAt).format('lll'),
	},
	// {
	// 	name: 'Initiated By',
	// 	minWidth: '200px',
	// 	selector: 'admin',
	// 	sortable: true,
	// 	cell: (row) => (
	// 		<span className="font-weight-bold">
	// 			{row.admin?.fullName || 'N/A'}
	// 		</span>
	// 	),
	// },
]
