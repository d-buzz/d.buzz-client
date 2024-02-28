import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Feeds, Landing } from 'components'
import EventsModal from 'components/modals/EventsModal'

const Home = (props) => {
  const { user } = props
  const { is_authenticated } = user
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
      {is_authenticated && !eventsModalStatus && eventsModal && eventsModalActivated && <EventsModal show={!eventsModalStatus} onHide={handleOnEventsModalHide}/>}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.get('user'),
})

export default connect(mapStateToProps)(Home)
