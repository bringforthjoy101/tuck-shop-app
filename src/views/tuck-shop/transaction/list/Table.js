// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Columns
import { columns } from './columns'

// ** Store & Actions
import { getAllData, getFilteredData } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import { ChevronDown, Share, Printer, FileText, File } from 'react-feather'
import DataTable from 'react-data-table-component'
import { selectThemeColors, apiRequest } from '@utils'
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
	FormGroup
} from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'

const TransactionTable = () => {
	// ** Store Vars
	const dispatch = useDispatch()
	const store = useSelector((state) => state.transactions)

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
	}

	const filteredData = store.allData.filter(
		(item) => item.transactionId?.toLowerCase() || item.student.firstName?.toLowerCase() || moment(item.createdAt).format('lll')?.toLowerCase()
	)

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

		keys.splice(keys.indexOf('id'), 1)
		keys.splice(keys.indexOf('updatedAt'), 1)
		keys.splice(keys.indexOf('adminId'), 1)
		keys.splice(keys.indexOf('studentId'), 1)
		keys.splice(keys.indexOf('businessId'), 1)
		keys.splice(keys.indexOf('settlementId'), 1)

		result = ''
		result += keys.join(columnDelimiter)
		result += lineDelimiter

		array.forEach((item) => {
			let ctr = 0
			keys.forEach((key) => {
				if (ctr > 0) result += columnDelimiter
				if (['transactionId', 'type', 'narration', 'amount', 'preBalance', 'postBalance', 'admin', 'student', 'status', 'createdAt'].includes(key)) {
					if (key === 'student') {
						result += `${item.student.firstName} ${item.student.lastName}`
					} else if (key === 'admin') {
						result += item.admin ? item.admin.fullName : 'N/A'
					} else if (key === 'createdAt') {
						result += moment(item[key]).format('YYYY-MM-DDTHH:mm:ss')
					} else {
						result += item[key]
					}
				}

				ctr++
			})
			result += lineDelimiter
		})

		return result
	}

	// ** Downloads CSV
	function downloadCSV(array) {
		const link = document.createElement('a')
		let csv = convertArrayOfObjectsToCSV(array)
		if (csv === null) return

		const date = new Date()
		const filename = `tuckshop_transactions_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`

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
			orientation: 'landscape'
		})

		// Define common column styles to be used in both header and body
		const commonColumnStyles = {
			0: { cellWidth: 30, halign: 'left' },   // Transaction Id - longer numbers
			1: { cellWidth: 30, halign: 'left' },   // Student - names can be long
			2: { cellWidth: 25, halign: 'right' },  // Amount - currency values
			3: { cellWidth: 15, halign: 'center' }, // Type - short text (credit/debit)
			4: { cellWidth: 28, halign: 'right' },  // Post Balance - currency values
			5: { cellWidth: 28, halign: 'right' },  // Pre Balance - currency values
			6: { cellWidth: 65, halign: 'left' },   // Narration - longest content
			7: { cellWidth: 28, halign: 'left' },   // Date - consistent length
			8: { cellWidth: 20, halign: 'left' }    // Initiated By - mostly "Self"
		}

		// Common styles for both header and body
		const commonStyles = {
			fontSize: 7.5,
			cellPadding: 2,
			lineWidth: 0.1,
			minCellWidth: 15,
			overflow: 'linebreak',
			cellWidth: 'auto'
		}

		// First table with headers
		doc.autoTable({
			head: [['Transaction Id', 'Student', 'Amount', 'Type', 'Post Balance', 'Pre Balance', 'Narration', 'Date', 'Initiated By']],
			styles: commonStyles,
			headStyles: {
				...commonStyles,
				fillColor: [51, 122, 183],
				fontStyle: 'bold',
				textColor: [255, 255, 255],
				halign: 'center',
				valign: 'middle',
				fontSize: 8
			},
			columnStyles: commonColumnStyles,
			margin: { top: 10, right: 5, left: 5, bottom: 10 },
			tableWidth: 'auto'
		})

		// Data rows
		store.allData.map((arr) => {
			doc.autoTable({
				body: [
					[
						arr.transactionId,
						`${arr.student.firstName} ${arr.student.lastName}`,
						arr.amount.toLocaleString('en-US', { style: 'currency', currency: 'NGN' }),
						arr.type,
						arr.postBalance.toLocaleString('en-US', { style: 'currency', currency: 'NGN' }),
						arr.preBalance.toLocaleString('en-US', { style: 'currency', currency: 'NGN' }),
						arr.narration,
						moment(arr.createdAt).format('lll'),
						arr.admin ? arr.admin.fullName : 'Self'
					]
				],
				styles: commonStyles,
				columnStyles: commonColumnStyles,
				startY: doc.lastAutoTable.finalY + 0.5,
				margin: { top: 10, right: 5, left: 5, bottom: 10 },
				tableWidth: 'auto'
			})
		})

		const date = new Date()
		doc.save(
			`tuckshop_transactions_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.pdf`
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
									if (result?.type === 'GET_ALL_TRANSACTIONS_DATA' && result.data) {
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
								<DropdownItem className="w-100" onClick={() => downloadCSV(store.allData)}>
									<FileText size={15} />
									<span className="align-middle ml-50">CSV</span>
								</DropdownItem>
								<DropdownItem className="w-100" onClick={() => downloadPDF()}>
									<File size={15} />
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
