import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { setViewImageModal } from 'store/interface/actions'
import ViewImageModal from 'components/modals/ViewImageModal'

const useStyles = createUseStyles(theme => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: 2,
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      cursor: 'pointer', // Add cursor pointer to indicate clickable
    },
  },
}))

const AccountMedia = (props) => {
  const { items = [], author, viewImageModal, setViewImageModal } = props
  const classes = useStyles()

  // State to store the extracted image links
  const [imageLinks, setImageLinks] = useState([])

  // Function to extract image links from items
  const extractImageLinks = () => {
    const links = []
    items.forEach(item => {
      const regex = /!\[(?:[^\]]*?)\]\((.+?)\)|(https:\/\/(storageapi\.fleek\.co)?(media\.d\.buzz)?\/[a-z-]+\/dbuzz-images\/(dbuzz-image-[0-9]+\.(?:png|jpg|gif|jpeg|webp|bmp)))|(https?:\/\/[a-zA-Z0-9=+-?_]+\.(?:png|jpg|gif|jpeg|webp|bmp|HEIC))|(?:https?:\/\/(?:ipfs\.io\/ipfs\/[a-zA-Z0-9=+-?]+))/gi
      const matches = item.body.match(regex)
      if (matches) {
        links.push(...matches)
      }
    })

    setImageLinks(links)
  }

  useEffect(() => {
    extractImageLinks()
    // eslint-disable-next-line
  }, [items])


  const handleImageClick = (imageSrc) => {
    setViewImageModal({
      selectedImage: imageSrc,
      images: imageLinks, // Optionally pass all images for a gallery view or navigation
    })
  }

  return (
    <React.Fragment>
      <div className={classes.grid}>
        {(
          imageLinks.map((link, index) => (
            <img src={link} alt={`Media by ${author}`} key={index} onClick={() => handleImageClick(link)} />
          ))
        )}
      </div>
      {imageLinks.length === 0 && <center><h6>No media from @{author}</h6></center>}
      <ViewImageModal
        show={!!viewImageModal?.selectedImage} // Convert the selectedImage to a boolean to control visibility
        value={viewImageModal}
        onHide={() => setViewImageModal({selectedImage: '', images: []})}
      />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  items: state.profile.get('posts'),
  user: state.auth.get('user'),
  viewImageModal: state.interfaces.get('viewImageModal'),

})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setViewImageModal,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(AccountMedia)
