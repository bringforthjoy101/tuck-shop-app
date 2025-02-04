// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Columns
import { columns } from './columns'
import Sidebar from './Sidebar'
import BatchUploadModal from './BatchUploadModal'

// ** Store & Actions
import { getAllData, getFilteredData } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import { ChevronDown, Share, Printer, FileText } from 'react-feather'
import DataTable from 'react-data-table-component'
import { selectThemeColors, isUserLoggedIn } from '@utils'
import { Card, CardHeader, CardTitle, CardBody, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle, Input, Row, Col, Label, CustomInput, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import FormGroup from 'reactstrap/lib/FormGroup'


const ProductTable = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.products)

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentCategory, setCurrentCategory] = useState({ value: '', label: 'Select Category', number: 0 })
  const [currentType, setCurrentType] = useState({ value: '', label: 'Select Type', number: 0 })
  const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Select Status', number: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [batchModalOpen, setBatchModalOpen] = useState(false)

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleBatchModal = () => setBatchModalOpen(!batchModalOpen)

  useEffect(() => {
    dispatch(getAllData())
    dispatch(
      getFilteredData(store.allData, {
        page: currentPage,
        perPage: rowsPerPage,
        category: currentCategory.value,
        type: currentType.value,
        status: currentStatus.value,
        q: searchTerm
      })
    )
  }, [dispatch])

  const categoryOptions = [
    { value: '', label: 'Select Category', number: 0 },
    { value: 'consumable', label: 'Consumable', number: 1 },
    { value: 'non-consumable', label: 'Non-Consumable', number: 2 },
  ]

  const typeOptions = [
    { value: '', label: 'Select Type', number: 0 },
    { value: 'drink', label: 'Drink', number: 1 },
    { value: 'food', label: 'Food', number: 2 },
    { value: 'snack', label: 'Snack', number: 3 },
    { value: 'medicine', label: 'Medicine', number: 4 },
    { value: 'other', label: 'Other', number: 5 },
  ]

  const statusOptions = [
    { value: '', label: 'Select Status', number: 0 },
    { value: 'available', label: 'Available', number: 1 },
    { value: 'unavailable', label: 'Unavailable', number: 2 },
  ]

  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch(
      getFilteredData(store.allData, {
        page: page.selected + 1,
        perPage: rowsPerPage,
        category: currentCategory.value,
        type: currentType.value,
        status: currentStatus.value,
        q: searchTerm
      })
    )
    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getFilteredData(store.allData, {
        page: currentPage,
        perPage: value,
        category: currentCategory.value,
        type: currentType.value,
        status: currentStatus.value,
        q: searchTerm
      })
    )
    setRowsPerPage(value)
  }

  // ** Function in get data on search query change
  const handleFilter = val => {
    setSearchTerm(val)
    dispatch(
      getFilteredData(store.allData, {
        page: currentPage,
        perPage: rowsPerPage,
        category: currentCategory.value,
        type: currentType.value,
        status: currentStatus.value,
        q: val
      })
    )
  }

  const filteredData = store.allData.filter( 
    item => (item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(filteredData.length / rowsPerPage)

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
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
    let keys = Object.keys(store.allData[0])
    console.log("keyss", keys)
    const keysToRemove = ['id', 'image', 'status', 'updatedAt', 'createdAt', 'adminId', 'businessId']
		keys = keys.filter((key) => !keysToRemove.includes(key))

    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach(item => {
      let ctr = 0
      keys.forEach(key => {
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
      orientation: "portrait",
    })

    const tableData = store.allData.map((arr, index) => [
      index + 1,
      arr.name,
      arr.description,
      arr.price.toLocaleString('en-US', { style: 'currency', currency: 'NGN' }),
      arr.qty.toLocaleString(),
      arr.unit,
      arr.category
    ]);

    doc.autoTable({
      styles: { halign: 'left' },
      head: [['SN', 'Name', 'Description', 'Price', 'Qty', 'Unit', 'Category']],
      body: tableData,
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' }
      }
    });

    // doc.autoTable({
    //     styles: { halign: 'left'},
    //     head: [['Name', 'Description', 'Price', 'Qty', 'Unit', 'Category']]
    // })
    // store.allData.map(arr => {
    //   doc.autoTable({
    //     styles: { halign: 'left' },
    //     columnStyles: {
    //       0: {cellWidth: 'auto'},
    //       1: {cellWidth: 'auto'},
    //       2: {cellWidth: 'auto'},
    //       3: {cellWidth: 'auto'},
    //       4: {cellWidth: 'auto'},
    //       5: {cellWidth: 'auto'}
    //     },
    //     body: [[arr.name, arr.description, arr.price, arr.qty, arr.unit, arr.category]]
    //   })
    // })

    doc.save("products_export.pdf")
  }

  const [userData, setUserData] = useState(null)
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      category: currentCategory.value,
      type: currentType.value,
      status: currentStatus.value,
      q: searchTerm
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

  const handleBatchUploadSuccess = () => {
    dispatch(getAllData())
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Search Filter</CardTitle>
        </CardHeader>
        <CardBody>
          <Row  form className='mt-1 mb-50'>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='search-table'>Search Table:</Label>
                <Input
                id='search-table'
                className='ml-50 w-100'
                type='text'
                value={searchTerm}
                placeholder='Search'
                onChange={e => handleFilter(e.target.value)}
              />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='select'>Select Category:</Label>
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  id='select'
                  options={categoryOptions}
                  value={currentCategory}
                  onChange={data => {
                    setCurrentCategory(data)
                    console.log('ddada', data)
                    dispatch(
                      getFilteredData(store.allData, {
                        page: currentPage,
                        perPage: rowsPerPage,
                        category: data.value,
                        q: searchTerm
                      })
                    )
                  }}
                />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='select'>Select Type:</Label>
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  id='select'
                  options={typeOptions}
                  value={currentType}
                  onChange={data => {
                    setCurrentType(data)
                    console.log('ddada', data)
                    dispatch(
                      getFilteredData(store.allData, {
                        page: currentPage,
                        perPage: rowsPerPage,
                        type: data.value,
                        q: searchTerm
                      })
                    )
                  }}
                />
              </FormGroup>
            </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='select'>Select Status:</Label>
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  id='select'
                  options={statusOptions}
                  value={currentStatus}
                  onChange={data => {
                    setCurrentStatus(data)
                    console.log('ddada', data)
                    dispatch(
                      getFilteredData(store.allData, {
                        page: currentPage,
                        perPage: rowsPerPage,
                        status: data.value,
                        q: searchTerm
                      })
                    )
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
      <Row className='mx-0 mt-3'>
        <Col sm='12' lg='4' className='d-flex align-items-center'>
          <div className='d-flex align-items-center'>
            <Label for='rows-per-page'>Show</Label>
            <CustomInput
              className='form-control mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{
                width: '5rem',
                padding: '0 0.8rem',
                backgroundPosition: 'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0'
              }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </CustomInput>
            <Label for='rows-per-page'>Entries</Label>
          </div>
        </Col>
        <Col sm='12' lg='4' className='d-flex align-items-center justify-content-center'>
          <UncontrolledButtonDropdown>
            <DropdownToggle color='secondary' caret outline>
              <Share size={15} />
              <span className='align-middle ml-50'>Download Table</span>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem className='w-100' onClick={() => downloadCSV(store.allData)}>
                <FileText size={15} />
                <span className='align-middle ml-50'>CSV</span>
              </DropdownItem>
              <DropdownItem className='w-100' onClick={() => downloadPDF()}>
                <FileText size={15} />
                <span className='align-middle ml-50'>PDF</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </Col>
        <Col sm='12' lg='4' className='d-flex align-items-center justify-content-lg-end justify-content-start mt-sm-0 mt-1'>
          {userData?.role === 'manager' && (
            <>
              <Button.Ripple className='mr-1' color='primary' onClick={toggleBatchModal}>
                Batch Upload
              </Button.Ripple>
              <Button.Ripple color='primary' onClick={toggleSidebar}>
                Add New Product
              </Button.Ripple>
            </>
          )}
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
          className='react-dataTable'
          paginationComponent={CustomPagination}
          data={dataToRender()}
        />
      </Card>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <BatchUploadModal isOpen={batchModalOpen} toggle={toggleBatchModal} onSuccess={handleBatchUploadSuccess} />
    </Fragment>
  )
}

export default ProductTable
