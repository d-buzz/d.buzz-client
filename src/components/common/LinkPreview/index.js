import React, { useEffect, useState } from 'react'
import markdownLinkExtractor from 'markdown-link-extractor'
import { LinkPreviewSkeleton } from 'components'
import { getLinkMetaRequest } from 'store/posts/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createUseStyles } from 'react-jss'
import { isMobile } from 'react-device-detect'
import { setLinkConfirmationModal } from 'store/interface/actions'
import { truncateString } from 'services/helper'

const useStyles = createUseStyles(theme => ({
  wrapper: {
    backgroundColor: theme.background.primary,
    width: '100%',
    height: 125,
    border: theme.border.primary,
    borderRadius: '15px 15px',
    display: 'flex',
    marginTop: 26,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.preview.hover.color,
    },
  },
  left: {
    overflow: 'hidden',
    height: '100%',
    width: '26%',
    borderRadius: '15px 0px 0px 15px',
    borderRight: theme.border.primary,
    '& img': {
      height: 130,
      width: '100%',
      objectFit: 'cover',
      border: 'none !important',
      borderRadius: '15px 0px 0px 15px !important',
    },
  },
  right: {
    paddingLeft: 5,
    paddingRight: 5,
    height: '100%',
    width: '70%',
    wordWrap: 'break-word',
    overflow: 'hidden',
    borderRadius: '0px 15px 15px 0px',
    ...theme.font,
    '& div': {
      width: '98%',
      margin: '0 auto',
    },
    '& h6': {
      margin: 0,
      padding: 0,
    },
    '& p': {
      fontSize: 13,
      paddingBottom: 0,
      marginBottom: 0,
    },
    '& label': {
      margin: 0,
      fontSize: 12,
      color: '#d32f2f !important',
    },
  },
}))

const LinkPreview = (props) => {
  const { getLinkMetaRequest, content, scrollIndex = -1, recomputeRowIndex, setLinkConfirmationModal } = props
  const [loading, setLoading] = useState(true)
  const [noShow, setNoShow] = useState(false)
  const [meta, setMeta] = useState()
  const classes = useStyles()

  const links  = markdownLinkExtractor(content)
  let isValidUrl = false
  let url = ''

  if(links.length !== 0) {
    for(let index = links.length; index > 0 ; index--) {
      const link = links[index-1] || ''
      if(!link.includes('d.buzz') 
          && !link.includes('images.hive.blog')
          && !link.includes('youtu.be')
          && !link.includes('files.peakd')
          && !link.includes('youtube.com')
          && !link.includes('3speak.co/watch?v')
          && !link.includes('3speak.online/watch?v')
          && !link.includes('app.dapplr.in')
          && !link.includes('pbs.twimg.com')
          && !link.includes('ipfs.io')
          && !link.includes('3speak.co')
          && !link.includes('3speak.tv')
          && !link.includes('vimm.tv/c')
          && !link.includes('www.vimm.tv/view')
          && !link.includes('rumble.com/embed')
          && !link.includes('lbry.tv')
          && !link.includes('open.lbry.com')
          && !link.includes('www.bitchute.com')
          && !link.includes('https://facebook.com')
          && !link.includes('www.facebook.com')
          && !link.includes('facebook.com')
          && !link.includes('banned.video')
          && !link.includes('vigilante.tv')
          && !link.includes('dapplr.in')
          && !link.includes('freeworldnews.tv')
          && !link.includes('d.tube')
          && link.match( /^[https][http]/)
          && !link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))/i)
          && !link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*)?=(.*))))/i)
          && !link.match(/(?:https?:\/\/(?:(?:3speak\.online\/watch\?v=(.*))))/i)
          && !link.match(/(?:https?:\/\/(?:(?:3speak\.co\/watch\?v=(.*))))/i)
          && !link.match(/(?:https?:\/\/(?:(?:3speak\.tv\/watch\?v=(.*))))/i)
          && !link.match(/(?:https?:\/\/(?:(?:www\.vimm\.tv\/(.*?)\/embed)))/i)
          && !link.match(/(?:https?:\/\/(?:(?:www\.vimm\.tv\/(.*?))))/i)
          && !link.match(/^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/)
          && !link.match(/((http:\/\/(.*\.tiktok\.com\/.*|tiktok\.com\/.*))|(https:\/\/(.*\.tiktok\.com\/.*|tiktok\.com\/.*)))/i)
          && !link.match(/(?:https?:\/\/(?:www\.)?(?:(?:odysee\.com)))/i)
          && !link.match(/(?:https?:\/\/(?:(?:music\.apple\.com\/(.*?))))/i)
          && !link.match(/(?:https?:\/\/(?:(?:embed\.music\.apple\.com\/(.*?))))/i)
          && !link.match(/\.(jpeg|jpg|gif|png|pdf|JPG)$/)
          && !link.match(/(http|https?:\/\/)?(www\.)?([\w_-]+)(\.)([a-zA-Z]+)(\/w\/)([0-9A-Za-z]{22})([a-z?=0-9]*)/i)
          && JSON.parse(localStorage.getItem('customUserData'))?.settings?.linkPreviewsStatus !== 'disabled') {
        url = link
        isValidUrl = true
        break
      }
    }
  }

  const onClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setLinkConfirmationModal(url)
  }

  useEffect(() => {
    let isSubscribed = true

    if(isValidUrl) {
      setLoading(true)
      getLinkMetaRequest(url)
        .then((data) => {
          if(isSubscribed) {
            if(!data.hasOwnProperty('title')) {
              setNoShow(true)
            }
            setMeta(data)
            setLoading(false)
          }
        })
    }

    return () => isSubscribed = false
  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(noShow) {
      recomputeRowIndex(scrollIndex)
    }
    // eslint-disable-next-line
  }, [noShow])

  const getTitle = () => {
    let title = meta.title

    let maxLength = 60

    if(isMobile) {
      maxLength = 35
    }

    if(`${title}`.length > maxLength) {
      title = `${title.substring(0, maxLength)}...`
    }

    if(title=== null || title === '') {
      setNoShow(true)
    }

    return title
  }

  const getDescription = () => {
    let description = meta.description

    let maxLength = 75

    if(isMobile) {
      maxLength = 45
    }

    if(`${description}`.length > maxLength) {
      description = `${description.substring(0, maxLength)}...`
    }

    return description
  }

  const getSource = () => {
    return meta.source
  }

  const getImage = () => {
    let image = meta.image

    if(!`${image}`.includes('https') || !`${image}`.includes('http') || image === '') {
      image = `${window.location.origin}/noimage.svg`
    }

    if(image.match(/^\//g)) {
      const parser = document.createElement('a')
      image = `${parser.origin}${meta.image}`
    }

    return image
  }

  return (
    <React.Fragment>
      {isValidUrl && !loading && !noShow ? (
        <div className={classes.wrapper} onClick={onClick}>
          <div className={classes.left}>
            <img alt="preview-img" src={getImage()} loading='lazy'/>
          </div>
          <div className={classes.right}>
            <div>
              <label>{truncateString(getSource(), 20)}</label>
              <h6>{getTitle()}</h6>
              <p>{getDescription()}</p>
            </div>
          </div>
        </div>
      ) : ''}
      {isValidUrl && loading && !noShow && (<LinkPreviewSkeleton />)}
    </React.Fragment>
  )
}


const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getLinkMetaRequest,
    setLinkConfirmationModal,
  }, dispatch),
})

export default connect(null, mapDispatchToProps)(LinkPreview)
