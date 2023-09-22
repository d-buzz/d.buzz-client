import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Feeds, Landing } from 'components'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import { setWhatsNewModalStatus } from 'store/interface/actions'
import WhatsNewModal from 'components/modals/WhatsNewModal'
import EventsModal from 'components/modals/EventsModal'

const Home = (props) => {
  const { user } = props
  const { is_authenticated } = user
  const { search } = useLocation()
  const params = queryString.parse(search)
  const [open, setOpen] = useState(true)
  const updatesModalStatus = localStorage.getItem('updatesModal')
  const eventsModalStatus = localStorage.getItem('eventsModal')
  const [eventsModal, setEventsModal] = useState(true)
  const eventsModalActivated = false
  
  const handleOnEventsModalHide = () => {
    localStorage.setItem('eventsModal', 'visited')
    setEventsModal(false)
  }

  return (
    <div>
      {is_authenticated && <Feeds />}
      {!is_authenticated && <Landing />}
      {/* {is_authenticated && !updatesModalStatus && <WhatsNewModal show={open} onHide={handleOnWhatsNewModalHide}/>} */}
      {is_authenticated && !eventsModalStatus && eventsModal && eventsModalActivated && <EventsModal show={!eventsModalStatus} onHide={handleOnEventsModalHide}/>}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(Home)
