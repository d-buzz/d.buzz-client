import React, { useEffect, useState } from 'react'
import Scrollspy from 'react-scrollspy'
import { HashLink } from 'react-router-hash-link'
import { createUseStyles } from 'react-jss'
import { Sticky, StickyContainer } from 'react-sticky'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container } from '@material-ui/core'
import { getLeaderboardEngagementData, getLeaderboardCuratorData, getLeaderboardAuthorData, getLeaderboardEarlyAdoptersData } from 'services/database/api'
import { getCurrentTimePart, calculateAverageRanking } from 'services/helper'
import { Link } from 'react-router-dom'

const Button = React.lazy(() => import('@material-ui/core/Button'))

const useStyles = createUseStyles(theme => ({
  wrapper: {
    paddintTop: 400,
    display: 'block',
    '& h2': {
      fontFamily: 'Segoe-Bold',
      fontSize: 18, 
    },
    '& p': {
      fontFamily: 'Segoe-Bold',
      fontSize: 14, 
    },
    '& div': {
      fontFamily: 'Segoe-Bold',
      fontSize: 14, 
    },
    '& i': {
      fontFamily: 'Segoe-Bold',
      fontSize: 14,
    },
  },
  hero: {
    paddingTop: 100,
    textAlign: 'center',
  },
  outsideWrapper: {
    paddingTop: 50,
    ...theme.font,
  },
  sideWrapper: {
    width: '100%', 
    paddingTop: 100, 
    maxHeight: 700, 
    overflow: 'auto',
    '& li': {
      listStyleType: 'none',
      paddingBottom: 5,
    },
    '& a': {
      ...theme.font,
      fontFamily: 'Segoe-Bold',
      fontSize: 14,
      textDecoration: 'none',
      paddingLeft: 10, 
    },
  },
  currentLink: {
    borderLeft: '3px solid #FF625E',
    '& a': {
      color: '#f83541 !important',
    },
  },
  innerWrapper: {
    ...theme.font,
  },
}))

const Leaderboard = () => {
  const [loading, setLoading] = useState(true)
  const [leaderBoardRefreshTime, setLeaderBoardRefreshTime] = useState(JSON.parse(localStorage.getItem('customUserData'))?.leaderboard?.LeaderBoardRefreshTime || null)
  const [leaderboardEngagementData, setLeaderboardEngagementData] = useState(JSON.parse(localStorage.getItem('customUserData'))?.leaderboard?.LeaderboardEngagementData || [])
  const [leaderboardCuratorData, setLeaderboardCuratorData] = useState(JSON.parse(localStorage.getItem('customUserData'))?.leaderboard?.LeaderboardCuratorData || [])
  const [leaderboardAuthorData, setLeaderboardAuthorData] = useState(JSON.parse(localStorage.getItem('customUserData'))?.leaderboard?.LeaderboardAuthorData || [])
  const [leaderboardEarlyAdoptersData, setLeaderboardEarlyAdoptersData] = useState(JSON.parse(localStorage.getItem('customUserData'))?.leaderboard?.LeaderboardEarlyAdoptersData || [])
  const [leaderboardOverallData, setLeaderboardOverallData] = useState(JSON.parse(localStorage.getItem('customUserData'))?.leaderboard?.LeaderboardOverallData || [])
  const customUserData = JSON.parse(localStorage.getItem('customUserData'))
  const [selectedEngagementDateType, setSelectedEngagementDateType] = useState('daily')
  const [selectedCuratorDateType, setSelectedCuratorDateType] = useState('daily')

  useEffect(() => {
    if(leaderBoardRefreshTime){
      if(leaderBoardRefreshTime !== getCurrentTimePart()){
        setLeaderBoardRefreshTime(getCurrentTimePart())
      }
    }else setLeaderBoardRefreshTime(getCurrentTimePart())
    console.log(leaderBoardRefreshTime)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await getLeaderboardEngagementData().then(res => {setLeaderboardEngagementData(res)})
      await getLeaderboardCuratorData().then(res => {setLeaderboardCuratorData(res)})
      await getLeaderboardAuthorData().then(res => {setLeaderboardAuthorData(res)})
      await getLeaderboardEarlyAdoptersData().then(res => {setLeaderboardEarlyAdoptersData(res)})
      setLoading(false)
    }
    fetchData()
    // eslint-disable-next-line
  }, [leaderBoardRefreshTime])

  useEffect(() => {
    const users = [leaderboardEarlyAdoptersData, leaderboardAuthorData, leaderboardEngagementData, leaderboardCuratorData]
    setLeaderboardOverallData(calculateAverageRanking(users))
    const data = { ...customUserData, leaderboard: { LeaderboardEngagementData: leaderboardEngagementData, LeaderboardCuratorData: leaderboardCuratorData, LeaderboardAuthorData: leaderboardAuthorData, LeaderboardEarlyAdoptersData: leaderboardEarlyAdoptersData, LeaderboardOverallData: leaderboardOverallData }}
    localStorage.setItem('customUserData', JSON.stringify({...data}))
    // eslint-disable-next-line
  }, [leaderboardEarlyAdoptersData, leaderboardAuthorData, leaderboardEngagementData, leaderboardCuratorData])

  const handleGetEngagementBy = (date_type) => () => {
    setSelectedEngagementDateType(date_type)
    const fetchData = async () => {
      setLoading(true)
      await getLeaderboardEngagementData({date_type}).then(res => {setLeaderboardEngagementData(res)})
      setLoading(false)
    }
    fetchData()
  }

  const handleGetCuratorBy = (date_type) => () => {
    setSelectedCuratorDateType(date_type)
    const fetchData = async () => {
      setLoading(true)
      await getLeaderboardCuratorData({date_type}).then(res => {setLeaderboardCuratorData(res)})
      setLoading(false)
    }
    fetchData()
  }

  // const refreshRanking = () => {
  //   setLeaderBoardRefreshTime(getCurrentTimePart())
  // }

  const classes = useStyles()
  return (
    <React.Fragment>
      {/* <button className='select modalButton' onClick={refreshRanking} >REFRESH</button> */}
      <Container maxWidth="lg" fluid>
        <div className={classes.wrapper}>
          <StickyContainer>
            <Row>
              <Col xs={6} className="d-none d-md-block">
                <Sticky>
                  {({ style }) => (
                    <div style={{...style}}>
                      <div className={classes.sideWrapper}>
                        <Scrollspy items={[
                          'section-1', 
                          'section-2', 
                          'section-3', 
                          'section-4', 
                          'section-5',
                        ]} currentClassName={classes.currentLink}>
                          <li><HashLink to="#section-1">Author Leaderboard</HashLink></li>
                          <li><HashLink to="#section-2">Engagement Leaderboard</HashLink></li>
                          <li><HashLink to="#section-3">Curator Leaderboard</HashLink></li>
                          <li><HashLink to="#section-4">Early Adopters</HashLink></li>
                          <li><HashLink to="#section-5">Total Scores</HashLink></li>
                        </Scrollspy>
                      </div>
                    </div>
                  )}
                  
                </Sticky>
              </Col>
              <Col>
                <div className={classes.innerWrapper}>
                  <section id="section-1">
                    <div className={classes.hero}>
                      <div >
                        <h3>Author Leaderboard</h3>
                      </div>
                      <hr />
                      <div >
                        {!loading && leaderboardAuthorData.length > 0 ?
                          <React.Fragment>
                            {leaderboardAuthorData.map(ranking => (
                              <Row style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                                <div>
                                  <span>#{ranking.rank}</span>
                                </div>
                                <div>
                                  <span><Link to={`/@${ranking.author}`}>{ranking.author}</Link></span>
                                </div>
                                <div>
                                  <span>{ranking.score}</span>
                                </div>
                              </Row>
                            ))}
                          </React.Fragment> :
                          <p>
                            No data to show.
                          </p>}
                      </div>
                    </div>
                  </section>
                  <section id="section-2">
                    <div className={classes.hero}>
                      <div>
                        <h3>Engagement Leaderboard</h3>
                        <div>
                          <Button onClick={handleGetEngagementBy('daily')} variant="text" size="small" color="secondary" style={{fontWeight: selectedEngagementDateType === 'daily' ? 'bold' : 'normal'}}>
                            Daily
                          </Button>
                          <Button onClick={handleGetEngagementBy('weekly')} variant="text" size="small" color="secondary" style={{fontWeight: selectedEngagementDateType === 'weekly' ? 'bold' : 'normal'}}>
                          Weekly
                          </Button>
                          <Button onClick={handleGetEngagementBy('monthly')} variant="text" size="small" color="secondary" style={{fontWeight: selectedEngagementDateType === 'monthly' ? 'bold' : 'normal'}}>
                          Monthly
                          </Button>
                        </div>
                      </div>
                      <hr />
                      <div >
                        {!loading && leaderboardEngagementData.length > 0 ?
                          <React.Fragment>
                            {leaderboardEngagementData.map(ranking => (
                              <Row style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                                <div>
                                  <span>#{ranking.rank}</span>
                                </div>
                                <div>
                                  <span><Link to={`/@${ranking.author}`}>{ranking.author}</Link></span>
                                </div>
                                <div>
                                  <span>{ranking.score}</span>
                                </div>
                              </Row>
                            ))}
                          </React.Fragment> :
                          <p>
                            No data to show.
                          </p>}
                      </div>
                    </div>
                  </section>
                  <section id="section-3">
                    <div className={classes.hero}>
                      <div>
                        <h3>Curator Leaderboard</h3>
                        <div>
                          <Button onClick={handleGetCuratorBy('daily')} variant="text" size="small" color="secondary" style={{fontWeight: selectedCuratorDateType === 'daily' ? 'bold' : 'normal'}}>
                            Daily
                          </Button>
                          <Button onClick={handleGetCuratorBy('weekly')} variant="text" size="small" color="secondary" style={{fontWeight: selectedCuratorDateType === 'weekly' ? 'bold' : 'normal'}}>
                          Weekly
                          </Button>
                          <Button onClick={handleGetCuratorBy('monthly')} variant="text" size="small" color="secondary" style={{fontWeight: selectedCuratorDateType === 'monthly' ? 'bold' : 'normal'}}>
                          Monthly
                          </Button>
                        </div>
                      </div>
                      <hr />
                      <div >
                        {!loading && leaderboardCuratorData.length > 0 ?
                          <React.Fragment>
                            {leaderboardCuratorData.map(ranking => (
                              <Row style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                                <div>
                                  <span>#{ranking.rank}</span>
                                </div>
                                <div>
                                  <span><Link to={`/@${ranking.author}`}>{ranking.author}</Link></span>
                                </div>
                                <div>
                                  <span>{ranking.score}</span>
                                </div>
                              </Row>
                            ))}
                          </React.Fragment> :
                          <p>
                            No data to show.
                          </p>}
                      </div>
                    </div>
                  </section>
                  <section id="section-4">
                    <div className={classes.hero}>
                      <div >
                        <h3>Early Adopters</h3>
                      </div>
                      <hr />
                      <div >
                        {!loading && leaderboardEarlyAdoptersData.length > 0 ?
                          <React.Fragment>
                            {leaderboardEarlyAdoptersData.map(ranking => (
                              <Row style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                                <div>
                                  <span>#{ranking.rank}</span>
                                </div>
                                <div>
                                  <span><Link to={`/@${ranking.author}`}>{ranking.author}</Link></span>
                                </div>
                                <div>
                                  <span>{ranking.score}</span>
                                </div>
                              </Row>
                            ))}
                          </React.Fragment> :
                          <p>
                            No data to show.
                          </p>}
                      </div>
                    </div>
                  </section>
                  <section id="section-5">
                    <div className={classes.hero}>
                      <div >
                        <h3>Total Scores</h3>
                      </div>
                      <hr />
                      <div style={{paddingBottom: 300}}>
                        {!loading && leaderboardOverallData.length > 0 ?
                          <React.Fragment>
                            {leaderboardOverallData.map(ranking => (
                              <Row style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                                <div>
                                  <span>#{ranking.rank}</span>
                                </div>
                                <div>
                                  <span><Link to={`/@${ranking.author}`}>{ranking.author}</Link></span>
                                </div>
                                <div>
                                  <span>{Math.ceil(ranking.averageRank * 100) / 100}</span>
                                </div>
                              </Row>
                            ))}
                          </React.Fragment> :
                          <p>
                            No data to show.
                          </p>}
                      </div>
                    </div>
                  </section>
                  
                </div>
              </Col>
            </Row>
          </StickyContainer>
        </div>
      </Container>
    </React.Fragment>
  )
}

export default Leaderboard