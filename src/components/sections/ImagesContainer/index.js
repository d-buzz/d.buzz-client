import React from 'react'
import { createUseStyles } from 'react-jss'
import DeleteIcon from '@material-ui/icons/Delete'
import { bindActionCreators } from 'redux'
import { updateBuzzThreads } from 'store/posts/actions'
import { connect } from 'react-redux'

const useStyles = createUseStyles(theme => ({
  // images container styles
  imagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '15px 0',
    height: '185px',
    padding: 10,
    background: theme.context.view.backgroundColor,
    border: `2px solid ${theme.context.view.backgroundColor}`,
    borderRadius: 8,
    overflow: 'hidden',
    width: props => props.showBuzzTitle ? 'calc(100% - 58px)' : '100%',
    float: 'right',
    transition: 'all 250ms',

    '& .images': {
      display: 'flex',
      width: '100%',
      height: '100%',
      gap: '15px',
      overflowY: 'hidden',
      overflowX: 'scroll',

      '&::-webkit-scrollbar': {
        height: '5px !important',
      },
  
      '&::-webkit-scrollbar-thumb': {
        background: 'lightgray !important',
      },
    },
    
    '& .media': {
      position: 'relative',
      transition: 'all 250ms',
      cursor: 'pointer',

      '&:hover': {
        transform: 'scale(0.95)',
        opacity: '0.8 !important',

        '& .deleteImageIcon': {
          display: 'block',
        },
      },

      '& .deleteImageIcon': {
        display: 'none',
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        borderRadius: '50%',
        background: '#ffffff',
        fontSize: '2em',
        color: '#E61C34',
        opacity: '1 !important',

        '&:hover': {
          background: '#E61C34',
          color: '#ffffff',  
        },
      },

      '& img': {
        height: '150px !important',
        width: '150px !important',
        objectFit: 'cover',
        borderRadius: '8px',
        opacity: '1 !important',
      },
      '& video': {
        height: '150px !important',
        width: '150px !important',
        objectFit: 'cover',
        borderRadius: '8px',
        opacity: '1 !important',
      },
    },
  },
}))

const ImagesContainer = (props) => {
  const showBuzzTitle = props.showBuzzTitle
  const classes = useStyles({showBuzzTitle})

  const { buzzId, buzzImages, updateBuzzThreads, buzzThreads, viewFullImage, setVideoLimit} = props

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

  
  return (
    <div className={classes.imagesContainer}>
      <span className='images'>
        {buzzImages.map(image => ( 
          !image.endsWith('?dbuzz_video') ?
            <div className="media">
              <img key={image} src={image} alt={image} style={{animation: 'zoomIn 250ms'}} onClick={() => viewFullImage(image)} />
              <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(image)} />
            </div> :
            <div className="media">
              <video key={image} src={image} style={{animation: 'zoomIn 250ms'}} onClick={() => viewFullImage(image)} />
              <DeleteIcon className='deleteImageIcon' onClick={() => handleImageDeletion(image)} />
            </div>))}
      </span>
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
