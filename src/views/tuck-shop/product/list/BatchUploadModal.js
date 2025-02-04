// ** React Imports
import { useState } from 'react'
import Papa from 'papaparse'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

// ** Reactstrap Imports
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  Table,
  Alert,
  Spinner
} from 'reactstrap'

// ** Utils
import { apiRequest, swal } from '@utils'

const BatchUploadModal = ({ isOpen, toggle, onSuccess }) => {
  const [csvData, setCsvData] = useState([])
  const [headers, setHeaders] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const downloadTemplate = () => {
    // Define the template headers and a sample row
    const templateData = {
      name: 'Sample Product',
      description: 'Product description here',
      price: '1000',
      category: 'consumable',
      type: 'food',
    }

    // Convert to CSV
    const csv = Papa.unparse([templateData])

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'product_upload_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setError('')

    if (file) {
      if (file.type !== 'text/csv') {
        setError('Please upload a valid CSV file')
        return
      }

      Papa.parse(file, {
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            // When header: true, headers will be the keys of the first object
            const headers = results.data.length > 0 ? Object.keys(results.data[0]) : []
            setHeaders(headers)
            setCsvData(results.data)
          }
        },
        header: true,
        skipEmptyLines: true
      })
    }
  }

  const handleUpload = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await apiRequest({
        url: '/products/create-multiple',
        method: 'POST',
        body: { products: csvData }
      })

      if (response && response.data.status) {
        if (response.data.data.errors.length) {
            response.data.data.errors.forEach(error => {
              toast.error(error.errorMsg)
            })
            setError('Something went wrong while uploading products')
        } else {
          swal('Success', 'Products uploaded successfully', 'success')
          toggle() // Close modal
          if (onSuccess) onSuccess() // Refresh data if needed
        }
      } else {
        setError(response?.data?.message || 'Something went wrong while uploading products')
      }
    } catch (err) {
      console.error('Error uploading products:', err)
      setError('Failed to upload products. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setCsvData([])
      setHeaders([])
      setError('')
      toggle()
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={handleClose} className='modal-dialog-centered modal-lg'>
      <ModalHeader toggle={handleClose}>Batch Upload Products</ModalHeader>
      <ModalBody>
        <div className='mb-2'>
          <div className='d-flex justify-content-between align-items-center mb-1'>
            <Label className='form-label mb-0' for='csvFile'>
              Upload CSV File
            </Label>
            <Button.Ripple 
              color='flat-info' 
              size='sm'
              onClick={downloadTemplate}
              disabled={isLoading}
            >
              Download Sample Template
            </Button.Ripple>
          </div>
          <Input
            type='file'
            id='csvFile'
            accept='.csv'
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <Alert color='danger' className='mb-2'>
            {error}
          </Alert>
        )}

        {csvData.length > 0 && (
          <div className='mt-2'>
            <h6>Preview:</h6>
            <div className='table-responsive'>
              <Table bordered striped>
                <thead>
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {headers.map((header, cellIndex) => (
                        <td key={cellIndex}>{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
              {csvData.length > 10 && (
                <div className='text-muted text-center mt-1'>
                  Showing first 10 rows of {csvData.length} total rows
                </div>
              )}
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          color='primary' 
          onClick={handleUpload} 
          disabled={csvData.length === 0 || isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size='sm' className='mr-1' />
              Uploading...
            </>
          ) : 'Upload'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default BatchUploadModal 