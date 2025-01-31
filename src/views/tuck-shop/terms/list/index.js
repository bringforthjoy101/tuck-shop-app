// @packages
import { useState, useEffect } from 'react'
import { Card, CardBody, Button, Row, Col } from 'reactstrap'
import { Plus } from 'react-feather'
import ReactPaginate from 'react-paginate'

// @components
import TermCard from './TermCard'
import AddTermModal from './AddTermModal'
import ViewTermModal from './ViewTermModal'

// @services
import { apiRequest } from '@utils'

const TermsList = () => {
  // States
  const [terms, setTerms] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [currentTerm, setCurrentTerm] = useState(null)

  // Fetch current term
  const fetchCurrentTerm = async () => {
    try {
      const response = await apiRequest({
        url: '/get-current-term',
        method: 'GET'
      })
      setCurrentTerm(response.data.data)
    } catch (error) {
      console.error('Error fetching current term:', error)
    }
  }

  // Fetch terms
  const fetchTerms = async (page) => {
    setIsLoading(true)
    try {
      const response = await apiRequest({url: '/terms', method: 'GET', params: {page}})
      setTerms(response.data.data)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching terms:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTerms(currentPage)
    fetchCurrentTerm()
  }, [currentPage])

  // Handlers
  const handlePageChange = (page) => {
    setCurrentPage(page.selected + 1)
  }

  const toggleAddModal = () => setShowAddModal(!showAddModal)

  const handleTermClick = (term) => {
    setSelectedTerm(term)
    setShowViewModal(true)
  }

  const handleAddSuccess = () => {
    toggleAddModal()
    fetchTerms(currentPage)
  }

  const handleCurrentTermUpdate = () => {
    fetchCurrentTerm()
    fetchTerms(currentPage)
  }

  return (
    <div className='terms-list'>
      <Card>
        <CardBody>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <h4 className='mb-0'>Terms</h4>
            <Button.Ripple color='primary' onClick={toggleAddModal}>
              <Plus size={14} className='mr-1' />
              <span>Add New Term</span>
            </Button.Ripple>
          </div>

          {isLoading ? (
            <div className='text-center'>Loading...</div>
          ) : (
            <>
              <Row className='match-height'>
                {terms.map((term) => (
                  <Col key={term.id} lg={4} md={6} sm={12}>
                    <TermCard 
                      term={term} 
                      onClick={() => handleTermClick(term)}
                      isCurrentTerm={currentTerm?.id === term.id}
                    />
                  </Col>
                ))}
              </Row>

              <ReactPaginate
                pageCount={totalPages}
                nextLabel={''}
                breakLabel={'...'}
                activeClassName={'active'}
                pageClassName={'page-item'}
                previousLabel={''}
                nextLinkClassName={'page-link'}
                nextClassName={'page-item next'}
                previousClassName={'page-item prev'}
                previousLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName={'pagination react-paginate justify-content-end mt-2'}
                forcePage={currentPage - 1}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardBody>
      </Card>

      <AddTermModal
        isOpen={showAddModal}
        toggle={toggleAddModal}
        onSuccess={handleAddSuccess}
      />

      <ViewTermModal
        isOpen={showViewModal}
        toggle={() => setShowViewModal(!showViewModal)}
        term={selectedTerm}
        isCurrentTerm={currentTerm?.id === selectedTerm?.id}
        onCurrentTermUpdate={handleCurrentTermUpdate}
      />
    </div>
  )
}

export default TermsList 