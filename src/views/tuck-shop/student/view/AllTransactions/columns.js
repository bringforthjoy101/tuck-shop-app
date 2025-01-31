// ** React Imports
import moment from 'moment'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import {
  Send,
  CheckCircle,
  Save,
  ArrowDownCircle,
  Info,
  PieChart
} from 'react-feather'

const statusObj = {
  pending: 'light-warning',
  success: 'light-success',
  failed: 'light-danger'
}

const transactionTypeObj = {
  credit: 'light-success',
  debit: 'light-danger'
}

// ** Table columns
export const columns = [
  {
    name: 'Transaction ID',
    width: '200px',
    selector: 'transactionId',
    cell: row => <span>{ `#${row.transactionId}` }</span>
  },
  {
    name: 'Type',
    selector: 'type',
    sortable: true,
    width: '80px',
    cell: row => (
      <Badge className='text-capitalize' color={transactionTypeObj[row.type]} pill>
        {row.type}
      </Badge>
    )
  },
  {
    name: 'Amount',
    selector: 'amount',
    sortable: true,
    width: '150px',
    cell: row => <span>{(row.amount || 0).toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}</span>
  },
  {
    name: 'Balance',
    selector: 'balance',
    sortable: true,
    width: '150px',
    cell: row => {
      return row.postBalance !== 0 ? (
        <span>{(row.postBalance || 0).toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}</span>
      ) : (
        <Badge color='light-danger' pill>
          Empty
        </Badge>
      )
    }
  },
  {
    name: 'Narration',
    selector: 'narration', 
    sortable: true,
    width: '250px',
    cell: row => <span style={{maxWidth: '50ch', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{row.narration}</span>
  },
  // {
  //   name: 'Status',
  //   selector: 'status',
  //   sortable: true,
  //   minWidth: '80px',
  //   cell: row => (
  //     <Badge className='text-capitalize' color={statusObj[row.status]} pill>
  //       {row.status}
  //     </Badge>
  //   )
  // },
  {
    name: 'Date',
    selector: 'createdAt',
    sortable: true,
    width: '150px',
    cell: row => moment(row.createdAt).format('lll')
  },
  {
    name: 'Initiated By',
    width: '200px',
    selector: 'admin',
    sortable: true,
    cell: row => <span className='font-weight-bold'>{row.admin?.fullName || 'Self'}</span>
  }
]