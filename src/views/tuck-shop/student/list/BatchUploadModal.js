// ** React Imports
import { useState } from 'react'
import Papa from 'papaparse'

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
  Alert
} from 'reactstrap'

const BatchUploadModal = ({ isOpen, toggle }) => {
  const [csvData, setCsvData] = useState([])
  const [headers, setHeaders] = useState([])
  const [error, setError] = useState('')

  const downloadTemplate = () => {
    // Define the template headers and a sample row
    const templateData = {
      firstName: 'John',
      lastName: 'Doe',
      otherName: 'Doe',
      tagNumber: '1234567890',
      gender: 'male',
      type: 'student',
      year: '7',
      group: 'A',
      parentTitle: 'Mr',
      parentFullName: 'John Doe',
      parentPhone: '08012345678',
      parentEmail: 'john.doe@example.com',
    }

    // Convert to CSV
    const csv = Papa.unparse([templateData])

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'student_upload_template.csv')
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

  const handleUpload = () => {
    // TODO: Implement the actual upload logic here
    console.log('Uploading data:', csvData)
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} className='modal-dialog-centered modal-lg'>
      <ModalHeader toggle={toggle}>Batch Upload Students</ModalHeader>
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
            >
              Download Sample Template
            </Button.Ripple>
          </div>
          <Input
            type='file'
            id='csvFile'
            accept='.csv'
            onChange={handleFileUpload}
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
        <Button color='secondary' onClick={toggle}>
          Cancel
        </Button>
        <Button 
          color='primary' 
          onClick={handleUpload} 
          disabled={csvData.length === 0}
        >
          Upload
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default BatchUploadModal 