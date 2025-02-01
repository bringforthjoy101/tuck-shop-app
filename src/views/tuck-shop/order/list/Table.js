// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Columns
import { columns } from './columns'
import moment from 'moment'

// ** Store & Actions
import { getAllData, getFilteredData, getFilteredRageData } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import { ChevronDown, Share, Printer, FileText } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import DataTable from 'react-data-table-component'
import { selectThemeColors, apiRequest } from '@utils'
import PickerRange from '../../../forms/form-elements/datepicker/PickerRange'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import {
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	UncontrolledButtonDropdown,
	DropdownMenu,
	DropdownItem,
	DropdownToggle,
	Input,
	Row,
	Col,
	Label,
	CustomInput,
	Button,
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import FormGroup from 'reactstrap/lib/FormGroup'

const TransactionTable = () => {
	// ** Store Vars
	const dispatch = useDispatch()
	const store = useSelector((state) => state.orders)

	// ** States
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	const [picker, setPicker] = useState([new Date(), new Date()])
	const [years, setYears] = useState([])
	const [groups, setGroups] = useState([])
	const [selectedYear, setSelectedYear] = useState({ value: '', label: 'Select Year' })
	const [selectedGroup, setSelectedGroup] = useState({ value: '', label: 'Select Group' })
	const classObj = {
		7: 'JSS 1',
		8: 'JSS 2',
		9: 'JSS 3',
		10: 'SSS 1',
		11: 'SSS 2',
		12: 'SSS 3',
		0: 'Graduated'
	  }

	useEffect(() => {
		dispatch(getAllData({startDate: null, endDate: null, year: null, group: null}))
		dispatch(
			getFilteredData(store.allData, {
				page: currentPage,
				perPage: rowsPerPage,
				q: searchTerm,
			})
		)

		// Fetch years and groups
		const fetchYearsAndGroups = async () => {
			const response = await apiRequest({ url: '/students/years-and-groups', method: 'GET' })
			if (response && response.data && response.data.status) {
				const { years: yearsData, groups: groupsData } = response.data.data
				setYears(yearsData.map(year => ({ value: year, label: `Year ${year} - ${classObj[year]}` })))
				setGroups(groupsData.map(group => ({ value: group, label: group })))
			}
		}
		fetchYearsAndGroups()
	}, [dispatch])

	// ** Function in get data on page change
	const handlePagination = (page) => {
		dispatch(
			getFilteredData(store.allData, {
				page: page.selected + 1,
				perPage: rowsPerPage,
				q: searchTerm,
			})
		)
		// dispatch(getFilteredRageData(store.allData, picker, { page: currentPage, perPage: rowsPerPage }))
		setCurrentPage(page.selected + 1)
	}

	// ** Function in get data on rows per page
	const handlePerPage = (e) => {
		const value = parseInt(e.currentTarget.value)
		dispatch(
			getFilteredData(store.allData, {
				page: currentPage,
				perPage: value,
				q: searchTerm,
			})
		)
		// dispatch(getFilteredRageData(store.allData, picker, { page: currentPage, perPage: rowsPerPage }))
		setRowsPerPage(value)
	}

	// ** Function in get data on search query change
	const handleFilter = (val) => {
		setSearchTerm(val)
		dispatch(
			getFilteredData(store.allData, {
				page: currentPage,
				perPage: rowsPerPage,
				q: val,
			})
		)
		// dispatch(getFilteredRageData(store.allData, picker, { page: currentPage, perPage: rowsPerPage }))
	}

	const handleRangeSearch = (date) => {
		const range = date.map((d) => new Date(d).getTime())
		setPicker(range)

		dispatch(getAllData({
			startDate: range[0],
			endDate: range[1],
			year: selectedYear.value,
			group: selectedGroup.value
		}))
		dispatch(getFilteredData(store.allData, { page: currentPage, perPage: rowsPerPage, q: searchTerm }))
	}

	const filteredData = store.allData.filter((item) => item.orderNumber.toLowerCase() || moment(item.createdAt).format('lll'))

	// ** Custom Pagination
	const CustomPagination = () => {
		const count = Math.ceil(store.allData.length / rowsPerPage)

		return (
			<ReactPaginate
				previousLabel={''}
				nextLabel={''}
				pageCount={count || 1}
				activeClassName="active"
				forcePage={currentPage !== 0 ? currentPage - 1 : 0}
				onPageChange={(page) => handlePagination(page)}
				pageClassName={'page-item'}
				nextLinkClassName={'page-link'}
				nextClassName={'page-item next'}
				previousClassName={'page-item prev'}
				previousLinkClassName={'page-link'}
				pageLinkClassName={'page-link'}
				containerClassName={'pagination react-paginate justify-content-end my-2 pr-1'}
			/>
		)
	}

	// ** Converts table to CSV
	function convertArrayOfObjectsToCSV(array) {
		let result

		const columnDelimiter = ','
		const lineDelimiter = '\n'
		const keys = Object.keys(store.allData[0])
		console.log('keyss', keys)

		result = ''
		result += keys.join(columnDelimiter)
		result += lineDelimiter

		array.forEach((item) => {
			let ctr = 0
			keys.forEach((key) => {
				if (ctr > 0) result += columnDelimiter

				result += item[key]

				ctr++
			})
			result += lineDelimiter
			console.log('esults', result)
		})

		return result
	}

	// ** Downloads CSV
	function downloadCSV(array) {
		const link = document.createElement('a')
		let csv = convertArrayOfObjectsToCSV(array)
		if (csv === null) return

		const filename = 'export.csv'

		if (!csv.match(/^data:text\/csv/i)) {
			csv = `data:text/csv;charset=utf-8,${csv}`
		}

		link.setAttribute('href', encodeURI(csv))
		link.setAttribute('download', filename)
		link.click()
	}

	// download PDF
	const downloadPDF = () => {
		const doc = new jsPDF({
			orientation: 'landscape',
		})

		doc.autoTable({
			styles: { halign: 'left' },
			columnStyles: {
				0: { cellWidth: 'auto' },
				1: { cellWidth: 'auto' },
				2: { cellWidth: 'auto' },
				3: { cellWidth: 'auto' },
				4: { cellWidth: 'auto' },
				5: { cellWidth: 'auto' },
			},
			head: [['OrderId', 'Amount', 'Products', 'Student', 'Date', 'Initiated By']],
		})
		const getProducts = (items) => {
			const arr = []
			const _items = process.env.NODE_ENV === 'production' ? JSON.parse(items) : items
			_items.forEach((item) => {
				arr.push(`${item.name} X ${item.qty}`)
			})
			const string = arr.join(', ')
			return string
		}
		store.data.map((arr) => {
			doc.autoTable({
				styles: { halign: 'left' },
				theme: 'grid',
				columnStyles: {
					0: { cellWidth: 'auto' },
					1: { cellWidth: 'auto' },
					2: { cellWidth: 'auto' },
					3: { cellWidth: 'auto' },
					4: { cellWidth: 'auto' },
					5: { cellWidth: 'auto' },
				},
				body: [
					[
						`#${arr.orderNumber}`,
						arr.amount.toLocaleString('en-US', { style: 'currency', currency: 'NGN' }),
						getProducts(arr.products),
						`${arr.student.firstName} ${arr.student.lastName}`,
						moment(arr.createdAt).format('lll'),
						`${arr.admin.firstName} ${arr.admin.lastName}`,
					],
				],
			})
		})
		const date = new Date()
		doc.save(
			`tuckshop_orders_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.pdf`
		)
	}

	// ** Table data to render
	const dataToRender = () => {
		const filters = {
			q: searchTerm,
		}

		const isFiltered = Object.keys(filters).some(function (k) {
			return filters[k].length > 0
		})

		if (store.data.length > 0) {
			return store.data
		} else if (store.data.length === 0 && isFiltered) {
			return []
		} else {
			return store.allData.slice(0, rowsPerPage)
		}
	}

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<CardTitle tag="h4">Search Filter</CardTitle>
				</CardHeader>
				<CardBody>
					<Row form className="mt-1 mb-50">
						<Col lg="3" md="6">
							<FormGroup>
								<Label for="select">Search Table:</Label>
								<Input
									id="search-invoice"
									className="ml-50 w-100"
									type="text"
									value={searchTerm}
									placeholder="Search"
									onChange={(e) => handleFilter(e.target.value)}
								/>
							</FormGroup>
						</Col>
						<Col lg="3" md="6">
							<FormGroup>
								<Label for="year">Select Year:</Label>
								<Select
									theme={selectThemeColors}
									isClearable={false}
									className="react-select"
									classNamePrefix="select"
									id="year"
									options={years}
									value={selectedYear}
									onChange={(data) => {
										setSelectedYear(data)
									}}
								/>
							</FormGroup>
						</Col>
						<Col lg="3" md="6">
							<FormGroup>
								<Label for="group">Select Group:</Label>
								<Select
									theme={selectThemeColors}
									isClearable={false}
									className="react-select"
									classNamePrefix="select"
									id="group"
									options={groups}
									value={selectedGroup}
									onChange={(data) => {
										setSelectedGroup(data)
									}}
								/>
							</FormGroup>
						</Col>
						<Col lg="3" md="6">
							<Label for="range-picker">Select Range</Label>
							<Flatpickr
								value={picker}
								id="range-picker"
								className="form-control"
								onChange={(date) => {
									setPicker(date)
								}}
								options={{
									mode: 'range',
									defaultDate: ['2020-02-01', '2020-02-15'],
								}}
							/>
						</Col>
						<Col lg="3" md="6" className="d-flex align-items-end">
							<Button.Ripple 
								color="primary" 
								className="mb-1" 
								onClick={async () => {
									// Format dates as YYYY-MM-DD and handle timezone correctly
									const startDate = picker[0] ? moment(picker[0]).format('YYYY-MM-DD') : null
									const endDate = picker[1] ? moment(picker[1]).format('YYYY-MM-DD') : null
									
									// Wait for the data to be fetched before filtering
									const result = await dispatch(getAllData({
										startDate,
										endDate,
										year: selectedYear.value,
										group: selectedGroup.value
									}))

									// Get the action result and filter the new data
									if (result?.type === 'GET_ALL_ORDERS_DATA' && result.data) {
										dispatch(
											getFilteredData(result.data, {
												page: currentPage,
												perPage: rowsPerPage,
												q: searchTerm
											})
										)
									}
								}}
							>
								Apply Filters
							</Button.Ripple>
						</Col>
					</Row>
				</CardBody>
			</Card>
			<Card>
				<Row className="mx-0 mt-3">
					<Col xl="6" sm="12" className="d-flex align-items-center pl-3">
						<div className="d-flex align-items-center w-100">
							<Label for="rows-per-page">Show</Label>
							<CustomInput
								className="form-control mx-50"
								type="select"
								id="rows-per-page"
								value={rowsPerPage}
								onChange={handlePerPage}
								style={{
									width: '10rem',
									padding: '0 0.8rem',
									backgroundPosition: 'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0',
								}}
							>
								<option value="10">10</option>
								<option value="25">25</option>
								<option value="50">50</option>
								<option value="100">100</option>
							</CustomInput>
							<Label for="rows-per-page">Entries</Label>
						</div>
					</Col>
					<Col xl="6" sm="12" className="d-flex align-items-sm-center justify-content-lg-end justify-content-center pr-lg-3 p-0 mt-lg-0 mt-1">
						<UncontrolledButtonDropdown>
							<DropdownToggle className="mr-lg-0 mr-5" color="secondary" caret outline>
								<Share size={15} />
								<span className="align-middle ml-lg-50">Download Table</span>
							</DropdownToggle>
							<DropdownMenu right>
								{/* <DropdownItem className="w-100" onClick={() => downloadCSV(store.allData)}>
									<FileText size={15} />
									<span className="align-middle ml-50">CSV</span>
								</DropdownItem> */}
								<DropdownItem className="w-100" onClick={() => downloadPDF()}>
									<FileText size={15} />
									<span className="align-middle ml-50">PDF</span>
								</DropdownItem>
								{/* <DropdownItem className="w-100" onClick={() => printOrder(filteredData)}>
									<Printer size={15} />
									<span className="align-middle ml-50">Print</span>
								</DropdownItem> */}
							</DropdownMenu>
						</UncontrolledButtonDropdown>
					</Col>
				</Row>
				<DataTable
					noHeader
					pagination
					subHeader
					responsive
					paginationServer
					columns={columns}
					sortIcon={<ChevronDown />}
					className="react-dataTable"
					paginationComponent={CustomPagination}
					data={dataToRender()}
				/>
			</Card>
		</Fragment>
	)
}

export default TransactionTable
