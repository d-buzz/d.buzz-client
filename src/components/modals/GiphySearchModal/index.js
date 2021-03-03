
import React from "react"
import { createUseStyles } from 'react-jss'
import ReactGiphySearchbox from 'react-giphy-searchbox'
import config from "config"
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import { IconButton } from "@material-ui/core"
import { CloseIcon } from 'components/elements'

const useStyles = createUseStyles(theme => ({
  modal: {
    width: 545,
    height: 530,
    '& div.modal-content': {
      backgroundColor: theme.background.primary,
      width: 545,
      height: 530,
      borderRadius: '20px 20px !important',
      border: '1px solid white',
      '& div.right-content': {
        width: '98% !important',
      },
    },
    '@media (max-width: 900px)': {
      width: '97% !important',
      '& div.modal-content': {
        margin: '0 auto',
        width: '97% !important',
      },
    },
  },
  actionWrapper: {
    width: '100%',
  },
  
  giphySearch : {
    display: "flex",
    flexFlow: "column wrap",
    alignItems: "center",
  },
  break: {
    backgroundColor: theme.border.background,
  },
  modalBody: {
    margin: '0 auto',
  },
  searchGifWrapper : {
    width: "510px !important",
    "& div" : {
      backgroundColor: theme.background.primary,
    },
    '@media (max-width: 900px)': {
      width: '455px !important',
    },
    '@media (max-width: 500px)': {
      width: '425px !important',
    },
    '@media (max-width: 455px)': {
      width: '345px !important',
    },
    '@media (max-width: 375px)': {
      width: '310px !important',
    },
  },
  searchGifFormClassName : {
    '& input' : {
      backgroundColor: theme.background.primary,
      color: theme.font.color,
      borderRadius: "1.5rem",
      fontFamily: 'Segoe-Bold',
      ...theme.font,
      fontSize: 15,
      padding: "10px",
      width: "100%",
      outline: "none",
    },
  },
}))
  

const GiphySearchModal = (props) => {
  const { show, onHide, handleAppendContent } = props
  const classes = useStyles()

  const handleSelectGif = (item) => {
    if(item && item.id){
      const gifLink = `https://media.giphy.com/media/${item.id}/giphy.gif`
      handleAppendContent(gifLink)
      onHide()
    }
  }

  return (
    <React.Fragment>
      <Modal dialogClassName={classes.modal} show={show} onHide={onHide}>
        <ModalBody className={classes.modalBody}>
          <div className={classes.actionWrapper}>
            <IconButton style={{ marginTop: -5 }} onClick={onHide}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.giphySearch}>
            <ReactGiphySearchbox
              wrapperClassName={classes.searchGifWrapper}
              searchFormClassName={classes.searchGifFormClassName}
              apiKey={config.GIPHY_API_KEY} 
              onSelect={handleSelectGif}
              gifListHeight="370px"
              imageBackgroundColor="#15202B"
              masonryConfig={[
                { columns: 4, imageWidth: 120, gutter: 4 },
                { mq: '700px', columns: 4, imageWidth: 120, gutter: 4 },
              ]}
            />
          </div>
        </ModalBody>
      </Modal>
     
    </React.Fragment>
  )
}
export default GiphySearchModal
