import React, { useRef } from 'react'
import { createUseStyles } from 'react-jss'
import DeleteIcon from '@material-ui/icons/Delete'
import { bindActionCreators } from 'redux'
import { updateBuzzThreads } from 'store/posts/actions'
import { connect } from 'react-redux'
import { proxyImage } from 'services/helper'
import { isMobile } from 'web3modal'

const useStyles = createUseStyles(theme => ({
  // images container styles
  imagesContainer: {
    marginTop: 12,
  },
  singleImageWrapper: {
    width: 'fit-content',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',

    '& .deleteImageIcon': {
      position: 'absolute',
      top: 10,
      left: 10,
      padding: 5,
      borderRadius: '50%',
      background: '#ffffff',
      fontSize: '2em',
      color: '#E61C34',
      opacity: '1 !important',
      cursor: 'pointer',
      zIndex: 999,
      
      '&:hover': {
        background: '#E61C34',
        color: '#ffffff',  
      },
    },
  },
  imageGrid: {
    display: 'flex',
    margin: '0 auto',
    width: '100%',
    overflow: 'hidden',
    
    '@media (max-width: 768px)': {
      height: 200,
    },
    
    '@media (max-width: 480px)': {
      height: !isMobile ? 127 : 200,
    },
  },
  imageGridItem: {
    position: 'relative',
    height: '100%',
    width: '100%',
    '& img': {
      height: '100%',
      width: '100%',
      cursor: 'pointer',
      objectFit: 'cover',
    },

    '& .deleteImageIcon': {
      position: 'absolute',
      top: 10,
      left: 10,
      padding: 5,
      borderRadius: '50%',
      background: '#ffffff',
      fontSize: '2em',
      color: '#E61C34',
      opacity: '1 !important',
      cursor: 'pointer',
      zIndex: 999,
    },
  },
  buzzImage: {
    transformOrigin: 'top',
    objectPosition: 'center',
    objectFit: 'cover',
    width: '100%',
    animation: 'skeleton-loading 1s linear infinite alternate',
    borderRadius: '16px',
    maxHeight: 580,
  },
}))

const ImagesContainer = (props) => {
  const showBuzzTitle = props.showBuzzTitle
  const classes = useStyles({showBuzzTitle})

  const { buzzId, buzzImages=[], updateBuzzThreads, buzzThreads, viewFullImage, setVideoLimit, loading } = props

  const createThread = (count, content, images) => {
    const buzzData = {}

    if(content === 'image'){
      buzzData[count] = {id: count, content: buzzThreads[count]?.content, images: images}
      updateBuzzThreads({...buzzThreads, ...buzzData})
    } else {
      buzzData[count] = {id: count, content: content, images: images}
      updateBuzzThreads({...buzzThreads, ...buzzData})
    }
  }

  const handleUpdateBuzz = (buzzId, content) => {
    if(buzzThreads !== null){
      createThread(buzzId, content, buzzThreads[buzzId]?.images)
    }
  }

  const handleImageDeletion = (imageUrl) => {
    if(buzzThreads){
      for(let i = 0; i < buzzThreads[buzzId]?.images?.length; i++) {
        if(buzzThreads[buzzId]?.images[i] === imageUrl){
          handleUpdateBuzz(buzzId, buzzThreads[buzzId]?.content, buzzThreads[buzzId]?.images.splice(i,1))
          setVideoLimit(false)
        }
      }
    }
  }

  const buzzPhotoGridRef = useRef(null)
  const imageLoadTime = 2

  const calculateHeightWithMaxWidth = (image, maxWidth) => {
    const originalWidth = image.naturalWidth
    const originalHeight = image.naturalHeight
    const newHeight = (originalHeight / originalWidth) * maxWidth
    return newHeight
  }

  const handleImageOnLoad = (url) => {
    const image = document.querySelector(`img[src$="${url}"]`)
    
    if(buzzPhotoGridRef && image) {
      image.style.height = '0px'
      image.style.background = 'none'
      image.style.animation = 'none'
      image.style.cursor = 'pointer'

      const renderedHeight = calculateHeightWithMaxWidth(image, 510)

      const waitForImageLoad = () => {

        if(buzzImages.length === 1) {
          if(renderedHeight !== 0) {
            if(renderedHeight > 510 && !(renderedHeight === image.width)) {
              image.style.height = '510px'
              image.style.width = '383px'
              image.style.animation = 'none'
              image.style.animation = 'fadeIn 250ms ease-out forwards'
              image.style.visibility = 'visible'
  

            } else {
              image.style.height = 'auto'
              image.style.animation = 'fadeIn 250ms ease-out forwards'
              image.style.visibility = 'visible'


            }
          } else {
            setTimeout(waitForImageLoad, 100)
          }
        } else {
          image.style.height = '100%'
          // image.style.animation = 'fadeIn 250ms ease-out forwards'
          image.style.visibility = 'visible'
        }
      }

      setTimeout(waitForImageLoad, imageLoadTime*100)
    }
  }

  const handleImageError = (url) => {
    const image = document.querySelector(`img[src$="${url}"]`)
    image.src = `${window.location.origin}/noimage.svg`
    image.style.animation = 'none'

    setTimeout(() => { image.style.visibility = 'visible' }, 2000)
  }
  
  return (
    <div ref={buzzPhotoGridRef} style={{ width: '100%' }} className={`${classes.imagesContainer} buzzPhotoGrid`}>
      {buzzImages.length === 1 &&
      // one images
      <div className={`${classes.singleImageWrapper} singleImage`}>
        <img
          className={`${classes.buzzImage} singleImage`}
          src={proxyImage(buzzImages[0])}
          alt={`Buzz Attached Media`}
          onClick={() => viewFullImage(proxyImage(buzzImages[0]))}
          onLoad={() => handleImageOnLoad(proxyImage(buzzImages[0]))}
          onError={() => handleImageError(proxyImage(buzzImages[0]))}
          loading='lazy'
        />
        {!loading && <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(buzzImages[0])} />}
      </div>}
      {buzzImages.length === 2 &&
        // two images
        <div style={{ height: 248 }} className={classes.imageGrid}>
          <div style={{ marginRight: 4 }} key={buzzImages[0]} className={classes.imageGridItem}>
            <img
              style={{  }}
              className={classes.buzzImage}
              src={proxyImage(buzzImages[0])}
              alt={`Buzz Attached Media`}
              onClick={() => viewFullImage(buzzImages[[0]])}
              onLoad={() => handleImageOnLoad(buzzImages[[0]])}
              onError={() => handleImageError(buzzImages[[0]])}
              loading='lazy'
            />
            {!loading && <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(buzzImages[0])} />}
          </div>
          <div style={{ marginLeft: 4 }}  key={buzzImages[1]} className={classes.imageGridItem}>
            <img
              className={classes.buzzImage}
              src={proxyImage(buzzImages[1])}
              alt={`Buzz Attached Media`}
              onClick={() => viewFullImage(buzzImages[[1]])}
              onLoad={() => handleImageOnLoad(buzzImages[[1]])}
              onError={() => handleImageError(buzzImages[[1]])}
              loading='lazy'
            />
            {!loading && <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(buzzImages[1])} />}
          </div>
        </div>}
      {buzzImages.length === 3 &&
        // three images
        <div style={{ height: 324 }} className={classes.imageGrid}>
          <div style={{ flex: 0.5, marginRight: 4 }}  key={buzzImages[1]} className={classes.imageGridItem}>
            <img
              className={classes.buzzImage}
              src={proxyImage(buzzImages[0])}
              alt={`Buzz Attached Media`}
              onClick={() => viewFullImage(proxyImage(buzzImages[0]))}
              onLoad={() => handleImageOnLoad(proxyImage(buzzImages[0]))}
              onError={() => handleImageError(proxyImage(buzzImages[0]))}
              loading='lazy'
            />
            {!loading && <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(buzzImages[0])} />}
          </div>
          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column', marginLeft: 4 }}>
            <div style={{ height: '48%', marginBottom: 4 }}  key={buzzImages[1]} className={classes.imageGridItem}>
              <img
                className={classes.buzzImage}
                src={proxyImage(buzzImages[1])}
                alt={`Buzz Attached Media`}
                onClick={() => viewFullImage(proxyImage(buzzImages[1]))}
                onLoad={() => handleImageOnLoad(proxyImage(buzzImages[1]))}
                onError={() => handleImageError(proxyImage(buzzImages[1]))}
                loading='lazy'
              />
              {!loading && <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(buzzImages[1])} />}
            </div>
            <div style={{ height: '48%', marginTop: 4 }}  key={buzzImages[1]} className={classes.imageGridItem}>
              <img
                className={classes.buzzImage}
                src={proxyImage(buzzImages[2])}
                alt={`Buzz Attached Media`}
                onClick={() => viewFullImage(proxyImage(buzzImages[2]))}
                onLoad={() => handleImageOnLoad(proxyImage(buzzImages[2]))}
                onError={() => handleImageError(proxyImage(buzzImages[2]))}
                loading='lazy'
              />
              {!loading && <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(buzzImages[2])} />}
            </div>
          </div>
        </div>}
      {buzzImages.length >= 4 &&
        // four images
        <div style={{ height: 324 }} className={classes.imageGrid}>
          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column', marginRight: 4 }}>
            <div style={{ height: '48%', marginBottom: 4 }}  key={buzzImages[0]} className={classes.imageGridItem}>
              <img
                className={classes.buzzImage}
                src={proxyImage(buzzImages[0])}
                alt={`Buzz Attached Media`}
                onClick={() => viewFullImage(proxyImage(buzzImages[0]))}
                onLoad={() => handleImageOnLoad(proxyImage(buzzImages[0]))}
                onError={() => handleImageError(proxyImage(buzzImages[0]))}
                loading='lazy'
              />
              {!loading && <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(buzzImages[0])} />}
            </div>
            <div style={{ height: '48%', marginTop: 4 }}  key={buzzImages[1]} className={classes.imageGridItem}>
              <img
                className={classes.buzzImage}
                src={proxyImage(buzzImages[1])}
                alt={`Buzz Attached Media`}
                onClick={() => viewFullImage(proxyImage(buzzImages[1]))}
                onLoad={() => handleImageOnLoad(proxyImage(buzzImages[1]))}
                onError={() => handleImageError(proxyImage(buzzImages[1]))}
                loading='lazy'
              />
              {!loading && <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(buzzImages[1])} />}
            </div>
          </div>
          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column', marginLeft: 4 }}>
            <div style={{ height: '48%', marginBottom: 4 }}  key={buzzImages[2]} className={classes.imageGridItem}>
              <img
                className={classes.buzzImage}
                src={proxyImage(buzzImages[2])}
                alt={`Buzz Attached Media`}
                onClick={() => viewFullImage(proxyImage(buzzImages[2]))}
                onLoad={() => handleImageOnLoad(proxyImage(buzzImages[2]))}
                onError={() => handleImageError(proxyImage(buzzImages[2]))}
                loading='lazy'
              />
              {!loading && <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(buzzImages[2])} />}
            </div>
            {buzzImages.length === 4 &&
              <div style={{ height: '48%', marginTop: 4 }}  key={buzzImages[3]} className={classes.imageGridItem}>
                <img
                  className={classes.buzzImage}
                  src={proxyImage(buzzImages[3])}
                  alt={`Buzz Attached Media`}
                  onClick={() => viewFullImage(proxyImage(buzzImages[3]))}
                  onLoad={() => handleImageOnLoad(proxyImage(buzzImages[3]))}
                  onError={() => handleImageError(proxyImage(buzzImages[3]))}
                  loading='lazy'
                />
                {!loading && <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(buzzImages[3])} />}
              </div>}
          </div>
        </div>}
    </div>
  )
}

const mapStateToProps = (state) => ({
  buzzThreads: state.posts.get('buzzThreads'),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      updateBuzzThreads,
    },dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ImagesContainer)
