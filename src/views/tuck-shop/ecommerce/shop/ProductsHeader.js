// ** Third Party Components
import classnames from 'classnames'
import { Menu, Grid, List } from 'react-feather'
import {
  Row,
  Col,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Button,
  ButtonGroup
} from 'reactstrap'

const ProductsHeader = props => {
  // ** Props
  const { activeView, setActiveView, dispatch, getProducts, store, setSidebarOpen } = props

  // ** Sorting obj
  const sortToggleText = {
    'price-desc': 'Highest',
    'price-asc': 'Lowest',
    featured: 'Featured'
  }

  // ** Category options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'consumable', label: 'Consumable' },
    { value: 'non-consumable', label: 'Non-Consumable' },
    { value: 'other', label: 'Other' }
  ]

  // ** Type options
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'drink', label: 'Drink' },
    { value: 'food', label: 'Food' },
    { value: 'snack', label: 'Snack' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className='ecommerce-header'>
      <Row>
        <Col sm='12'>
          <div className='ecommerce-header-items'>
            <div className='result-toggler'>
              <button className='navbar-toggler shop-sidebar-toggler' onClick={() => setSidebarOpen(true)}>
                <span className='navbar-toggler-icon d-block d-lg-none'>
                  <Menu size={14} />
                </span>
              </button>
              <span className='search-results'>{store.totalProducts} Results Found</span>
            </div>
            <div className='view-options d-flex align-items-center'>
              {/* Category Filter */}
              <UncontrolledButtonDropdown className='dropdown-sort mr-1'>
                <DropdownToggle className='text-capitalize' color='primary' outline caret>
                  {store.params.category ? categoryOptions.find(cat => cat.value === store.params.category)?.label : 'All Categories'}
                </DropdownToggle>
                <DropdownMenu>
                  {categoryOptions.map(category => (
                    <DropdownItem
                      key={category.value}
                      className='w-100'
                      onClick={() => dispatch(getProducts({ ...store.params, category: category.value }))}
                    >
                      {category.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledButtonDropdown>

              {/* Type Filter */}
              <UncontrolledButtonDropdown className='dropdown-sort mr-1'>
                <DropdownToggle className='text-capitalize' color='primary' outline caret>
                  {store.params.type ? typeOptions.find(type => type.value === store.params.type)?.label : 'All Types'}
                </DropdownToggle>
                <DropdownMenu>
                  {typeOptions.map(type => (
                    <DropdownItem
                      key={type.value}
                      className='w-100'
                      onClick={() => dispatch(getProducts({ ...store.params, type: type.value }))}
                    >
                      {type.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledButtonDropdown>

              {/* Sort Dropdown */}
              <UncontrolledButtonDropdown className='dropdown-sort mr-1'>
                <DropdownToggle className='text-capitalize' color='primary' outline caret>
                  {sortToggleText[store.params.sortBy]}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    className='w-100'
                    onClick={() => dispatch(getProducts({ ...store.params, sortBy: 'featured' }))}
                  >
                    Featured
                  </DropdownItem>
                  <DropdownItem
                    className='w-100'
                    onClick={() => dispatch(getProducts({ ...store.params, sortBy: 'price-asc' }))}
                  >
                    Lowest
                  </DropdownItem>
                  <DropdownItem
                    className='w-100'
                    onClick={() => dispatch(getProducts({ ...store.params, sortBy: 'price-desc' }))}
                  >
                    Highest
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>

              {/* View Options */}
              <ButtonGroup className='btn-group-toggle'>
                <Button
                  tag='label'
                  className={classnames('btn-icon view-btn grid-view-btn', {
                    active: activeView === 'grid'
                  })}
                  color='primary'
                  outline
                  onClick={() => setActiveView('grid')}
                >
                  <Grid size={18} />
                </Button>
                <Button
                  tag='label'
                  className={classnames('btn-icon view-btn list-view-btn', {
                    active: activeView === 'list'
                  })}
                  color='primary'
                  outline
                  onClick={() => setActiveView('list')}
                >
                  <List size={18} />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ProductsHeader
