import React, { useRef } from 'react'
import { isMobile } from 'react-device-detect'
import { createUseStyles } from 'react-jss'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setViewImageModal } from 'store/interface/actions'
import { proxyImage } from 'services/helper'

const useStyles = createUseStyles(theme => ({
  buzzPhotoGridWrapper: {
    marginTop: 12,
  },
  singleImageWrapper: {
    width: 'fit-content',
    display: 'flex',
    overflow: 'hidden',
    borderRadius: '15px',
    border: theme.border.primary,
  },
  imageGrid: {
    display: 'flex',
    margin: '0 auto',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '15px',
    border: theme.border.primary,

    '&:hover': {
      backgroundColor: 'rgba(176, 9, 9, 0.1) !important',
    },

    '@media (max-width: 768px)': {
      height: 200,
    },

    '@media (max-width: 480px)': {
      height: !isMobile ? 127 : 200,
    }
  },
  imageGridItem: {
    height: '100%',
    width: '100%',
    '& img': {
      height: '100%',
      width: '100%',
      cursor: 'pointer',
      objectFit: 'cover',
    },
  },
  buzzImage: {
    transformOrigin: 'top',
    height: 0,
    objectPosition: 'center',
    objectFit: 'cover',
    width: '100%',
    // visibility: 'hidden',
    animation: 'skeleton-loading 1s linear infinite alternate',
  },
  moreImages: {
    display: 'grid',
    placeItems: 'center',
    height: '100%',
    width: '100%',
    fontSize: '2rem',
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
}))


const BuzzPhotoGrid = ({
  images=[],
  minifyAssets,
  onImageLoad = () => {},
  setViewImageModal = () => {},
}) => {
  const classes = useStyles({ images })
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

      // re-render postList
      if(onImageLoad) {
        onImageLoad()
      }

      const renderedHeight = calculateHeightWithMaxWidth(image, buzzPhotoGridRef.current.clientWidth)

      const waitForImageLoad = () => {

        if(images.length === 1) {
          if(renderedHeight !== 0) {
            if(renderedHeight > 510 && !(renderedHeight === image.width) && minifyAssets) {
              image.style.height = '510px'
              image.style.width = '383px'
              image.style.animation = 'none'
              image.style.animation = 'fadeIn 250ms ease-out forwards'
              image.style.visibility = 'visible'
  
              // re-render postList
              if(onImageLoad) {
                onImageLoad()
              }
            } else {
              image.style.height = 'auto'
              image.style.animation = 'fadeIn 250ms ease-out forwards'
              image.style.visibility = 'visible'

              // re-render postList
              if(onImageLoad) {
                onImageLoad()
              }
            }
          } else {
            setTimeout(waitForImageLoad, 100)
          }
        } else {
          image.style.height = '100%'
          // image.style.animation = 'fadeIn 250ms ease-out forwards'
          image.style.visibility = 'visible'

          // re-render postList
          if(onImageLoad) {
            onImageLoad()
          }
        }
      }

      setTimeout(waitForImageLoad, imageLoadTime*100)
    }
  }

  const handleImageError = (url) => {
    const image = document.querySelector(`img[src$="${url}"]`)
    image.src = `${window.location.origin}/noimage.svg`
    image.style.animation = 'none'
    if(onImageLoad) {
      onImageLoad()
    }
    setTimeout(() => { image.style.visibility = 'visible' }, 2000)
  }

  return (
    <div ref={buzzPhotoGridRef} style={{ width: '100%' }} className={`${classes.buzzPhotoGridWrapper} buzzPhotoGrid`}>
      {images.length === 1 &&
      // one images
      <div className={`${classes.singleImageWrapper} singleImage`}>
        <img
          className={`${classes.buzzImage} singleImage`}
          src={proxyImage(images[0])}
          alt={`Buzz Attached Media`}
          onClick={() => setViewImageModal({ selectedImage: images[0], images })}
          onLoad={() => handleImageOnLoad(proxyImage(images[0]))}
          onError={() => handleImageError(proxyImage(images[0]))}
          loading='lazy'
        />
      </div>}
      {images.length === 2 &&
        // two images
        <div style={{ height: 248 }} className={classes.imageGrid}>
          <div style={{ marginRight: 1 }} key={images[0]} className={classes.imageGridItem}>
            <img
              className={classes.buzzImage}
              src={proxyImage(images[0])}
              alt={`Buzz Attached Media`}
              onClick={() => setViewImageModal({ selectedImage: images[0], images })}
              onLoad={() => handleImageOnLoad(images[[0]])}
              onError={() => handleImageError(images[[0]])}
              loading='lazy'
            />
          </div>
          <div style={{ marginLeft: 1 }}  key={images[1]} className={classes.imageGridItem}>
            <img
              className={classes.buzzImage}
              src={proxyImage(images[1])}
              alt={`Buzz Attached Media`}
              onClick={() => setViewImageModal({ selectedImage: images[1], images })}
              onLoad={() => handleImageOnLoad(images[[1]])}
              onError={() => handleImageError(images[[1]])}
              loading='lazy'
            />
          </div>
        </div>}
      {images.length === 3 &&
        // three images
        <div style={{ height: 324 }} className={classes.imageGrid}>
          <div style={{ flex: 0.5, marginRight: 2 }}  key={images[0]} className={classes.imageGridItem}>
            <img
              className={classes.buzzImage}
              src={proxyImage(images[0])}
              alt={`Buzz Attached Media`}
              onClick={() => setViewImageModal({ selectedImage: images[0], images })}
              onLoad={() => handleImageOnLoad(proxyImage(images[0]))}
              onError={() => handleImageError(proxyImage(images[0]))}
              loading='lazy'
            />
          </div>
          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '50%', marginBottom: 1 }}  key={images[1]} className={classes.imageGridItem}>
              <img
                className={classes.buzzImage}
                src={proxyImage(images[1])}
                alt={`Buzz Attached Media`}
                onClick={() => setViewImageModal({ selectedImage: images[1], images })}
                onLoad={() => handleImageOnLoad(proxyImage(images[1]))}
                onError={() => handleImageError(proxyImage(images[1]))}
                loading='lazy'
              />
            </div>
            <div style={{ height: '50%', marginTop: 1 }}  key={images[2]} className={classes.imageGridItem}>
              <img
                className={classes.buzzImage}
                src={proxyImage(images[2])}
                alt={`Buzz Attached Media`}
                onClick={() => setViewImageModal({ selectedImage: images[2], images })}
                onLoad={() => handleImageOnLoad(proxyImage(images[2]))}
                onError={() => handleImageError(proxyImage(images[2]))}
                loading='lazy'
              />
            </div>
          </div>
        </div>}
      {images.length >= 4 &&
        // four images
        <div style={{ height: 324 }} className={classes.imageGrid}>
          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column', marginRight: 1 }}>
            <div style={{ height: '50%', marginBottom: 1 }}  key={images[0]} className={classes.imageGridItem}>
              <img
                className={classes.buzzImage}
                src={proxyImage(images[0])}
                alt={`Buzz Attached Media`}
                onClick={() => setViewImageModal({ selectedImage: images[0], images })}
                onLoad={() => handleImageOnLoad(proxyImage(images[0]))}
                onError={() => handleImageError(proxyImage(images[0]))}
                loading='lazy'
              />
            </div>
            <div style={{ height: '50%', marginTop: 1 }}  key={images[1]} className={classes.imageGridItem}>
              <img
                className={classes.buzzImage}
                src={proxyImage(images[1])}
                alt={`Buzz Attached Media`}
                onClick={() => setViewImageModal({ selectedImage: images[1], images })}
                onLoad={() => handleImageOnLoad(proxyImage(images[1]))}
                onError={() => handleImageError(proxyImage(images[1]))}
                loading='lazy'
              />
            </div>
          </div>
          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
            <div style={{ height: '50%', marginBottom: 1 }}  key={images[2]} className={classes.imageGridItem}>
              <img
                className={classes.buzzImage}
                src={proxyImage(images[2])}
                alt={`Buzz Attached Media`}
                onClick={() => setViewImageModal({ selectedImage: images[2], images })}
                onLoad={() => handleImageOnLoad(proxyImage(images[2]))}
                onError={() => handleImageError(proxyImage(images[2]))}
                loading='lazy'
              />
            </div>
            {images.length === 4 ?
              <div style={{ height: '50%', marginTop: 1 }}  key={images[3]} className={classes.imageGridItem}>
                <img
                  className={classes.buzzImage}
                  src={proxyImage(images[3])}
                  alt={`Buzz Attached Media`}
                  onClick={() => setViewImageModal({ selectedImage: images[3], images })}
                  onLoad={() => handleImageOnLoad(proxyImage(images[3]))}
                  onError={() => handleImageError(proxyImage(images[3]))}
                  loading='lazy'
                />
              </div> :
              <div style={{ height: '50%', marginTop: 1, backgroundImage: `url(${proxyImage(images[3])})`, backgroundSize: 'cover', backgroundPosition: 'center' }}  key={images[3]} className={classes.imageGridItem}>
                <div className={classes.moreImages}>
                  +{images.length - 4}
                </div>
              </div>
            }
          </div>
        </div>}
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      setViewImageModal,
    },dispatch),
})

export default connect(null, mapDispatchToProps)(BuzzPhotoGrid)