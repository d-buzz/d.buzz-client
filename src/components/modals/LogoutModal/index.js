import React, { useEffect, useState } from 'react'
 import Modal from 'react-bootstrap/Modal'
 import ModalBody from 'react-bootstrap/ModalBody'
 import { createUseStyles } from 'react-jss'
 import { authenticateUserRequest } from 'store/auth/actions'
 import { connect } from 'react-redux'
 import { bindActionCreators } from 'redux'
 import CircularBrandIcon from 'components/elements/Icons/CircularBrandIcon'
 import { ContainedButton } from 'components/elements'
 import { signoutUserRequest } from 'store/auth/actions'
 import { generateStyles } from 'store/settings/actions'
 import { useHistory } from 'react-router-dom'
 import { getTheme } from 'services/theme'

 const useStyles = createUseStyles(theme => ({
   label: {
     fontFamily: 'Segoe-Bold',
     ...theme.font,
   },
   loginSignupLabel: {
     display: 'flex',
     fontSize: '1.8em',
     fontWeight: 800,
     justifyContent: 'center',
     margin: '15px 0',
     ...theme.font,
   },
   modal: {
     '& div.modal-content': {
       borderRadius: '15px 15px !important',
       border: 'none',
       maxWidth: 400,
       minWidth: 100,
       margin: '0 auto',
       backgroundColor: theme.background.primary,
     },
     '& input.form-control': {
       borderRadius: '50px 50px',
       fontSize: 14,
       ...theme.search.background,
       ...theme.font,
     },
     '& label': {
       fontSize: 14,
       ...theme.font,
     },
   },
 }))

 const FormSpacer = () => {
   return (
     <div style={{ height: 15, width: '100%' }}></div>
   )
 }

 const LogoutModal = (props) => {

   const {
     show,
     onHide,
     signoutUserRequest,
     authenticateUserRequest,
     fromIntentBuzz,
     buzzIntentCallback = () => { },
   } = props

   const [showLogoutModal, setShowLogoutModal] = useState(false)
   const history = useHistory()

   const handleClickLogout = () => {
     signoutUserRequest()
     generateStyles(getTheme('light'))
     history.push('/')
   }

   const handleClickHideLogoutModal = () => {
     onHide(false)
   }

   const classes = useStyles()
   const [useCeramic, setUseCeramic] = useState(false)
   /* eslint-disable */
   let [hasExpiredDelay, setHasExpiredDelay] = useState(60)

   const handleClickLoginSignup = () => {
     setLoading(true)
     setHasAuthenticationError(false)
     authenticateUserRequest(username.replace(/[@!#$%^&*()+=/\\~`,;:"'_\s]/gi, ''), password, useKeychain, useHAS, useCeramic)
       .then(({ is_authenticated }) => {

         if (useHAS) {
           const hasExpiredDelayInterval = setInterval(() => {
             // console.log('this', hasExpiredDelay)
             hasExpiredDelay -= 1
             setHasExpiredDelay(hasExpiredDelay)

             setLoading(false)
             const rawQR = localStorage.getItem('hasQRcode')
             setQRCode(rawQR)

             if (hasExpiredDelay === 0) {
               // console.log('sample hit')
               clearInterval(hasExpiredDelayInterval)
               setHasExpiredDelay(60)
               localStorage.removeItem('hasQRcode')
               handleClickBack()
             }
           }, 1000)  

         } else if (!useHAS) {
           if (!is_authenticated) {
             setHasAuthenticationError(true)
             setLoading(false)
           } else {
             if (fromIntentBuzz && buzzIntentCallback) {
               buzzIntentCallback()
               setLoading(false)
             }
             onHide()
           }
         }

         if(useCeramic) {
           setUseCeramic(false)
           setHasAuthenticationError(false)
         }
       })
   }

   useEffect(() => {
     if(useCeramic) {
       handleClickLoginSignup()
     }
   }, [useCeramic])

   return (
     <React.Fragment>
       {!showLogoutModal && (
         <Modal className={classes.modal} show={show} onHide={onHide}>
           <ModalBody>
               <React.Fragment>
                 <div style={{ width: '98%', margin: '0 auto', top: 10 }}>
                   <center>
                     <CircularBrandIcon />
                     <span className={classes.loginSignupLabel}>Log out of DBuzz?</span>
                   </center>
                 </div>
                 <React.Fragment>
                   <div style={{ marginLeft: 10, textAlign: 'left'}}>
                     <React.Fragment>
                       <FormSpacer />
                       <center><h6 className={classes.label}>You can always log back in at any time.</h6>
                         <br />
                         <br />
                         <ContainedButton 
                           style={{ width: '100%' }}
                           onClick={handleClickLogout} fontSize={15} label="Log out"
                         >
                           Log out
                         </ContainedButton>
                         <br />
                         <ContainedButton
                           style={{ width: '100%' }}
                           onClick={handleClickHideLogoutModal} transparent={true} fontSize={15} label="Cancel"
                         >
                           Cancel
                         </ContainedButton>
                       </center>
                       <br />
                     </React.Fragment>
                   </div>
                   <br />
                 </React.Fragment>
               <FormSpacer />
             </React.Fragment>
           </ModalBody>
         </Modal>
       )}
     </React.Fragment>
   )
 }

 const mapStateToProps = (state) => ({
   accounts: state.auth.get('accounts'),
   user: state.auth.get('user'),
 })

 const mapDispatchToProps = (dispatch) => ({
   ...bindActionCreators({
     authenticateUserRequest,
     signoutUserRequest,
   }, dispatch),
 })

 export default connect(mapStateToProps, mapDispatchToProps)(LogoutModal)