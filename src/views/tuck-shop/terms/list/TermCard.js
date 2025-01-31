// @packages
import { Card, CardBody, CardTitle, CardText, Badge } from 'reactstrap'
import { Calendar } from 'react-feather'
import '@styles/base/pages/term-card.scss' // This will be created next
import moment from 'moment'

const TermCard = ({ term, onClick, isCurrentTerm }) => {
  return (
    <Card className='term-card shadow-none' onClick={onClick}>
      <CardBody>
        <div className='d-flex justify-content-between align-items-start'>
          <CardTitle tag='h5'>{term.name}</CardTitle>
          {isCurrentTerm && (
            <Badge color='success' pill>
              Current Term
            </Badge>
          )}
        </div>
        <CardText>
          {term.description?.length > 100 ? `${term.description.substring(0, 100)}...` : term.description}
        </CardText>
        <div className='term-meta'>
          <small className='text-muted d-flex align-items-center'>
            <Calendar size={14} />
            <span>Start: {moment(term.startDate).format('LL')}</span>
          </small>
          <small className='text-muted d-flex align-items-center'>
            <Calendar size={14} />
            <span>End: {moment(term.endDate).format('LL')}</span>
          </small>
        </div>
      </CardBody>
    </Card>
  )
}

export default TermCard 