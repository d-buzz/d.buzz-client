import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    '& iframe': {
      animation: 'skeleton-loading 1s linear infinite alternate',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
  },
})

const FACEBOOK_APP_ID = 236880454857514

const UrlVideoEmbed = (props) => {
  const classes = useStyles()
  const { embed } = props
  const { app, id, domain } = embed[0] || { app: '', id: '', domain: '' }

  const getEmbedUrl = () => {
    if(embed[0]) {
      switch (app) {
      case 'youtube':
        return `https://www.youtube.com/embed/${id}`
      case 'vimm':
        return `https://www.vimm.tv/${id}/embed?autoplay=0`
      case 'threespeak':
        return `https://3speak.tv/embed?v=${id}`
      case 'rumble':
        return `https://rumble.com/embed/${id}`
      case 'lbry':
        return `https://lbry.tv/$/embed/${id}`
      case 'bitchute':
        return `https://www.bitchute.com/embed/${id}`
      case 'banned':
        return `https://api.banned.video/embed/${id}`
      case 'dollarvigilante':
        return `https://vigilante.tv/videos/embed/${id}`
      case 'dapplr':
        return `https://cdn.dapplr.in/file/dapplr-videos/${id}`
      case 'freeworldnews':
        return `https://api.banned.video/embed/${id}`
      case 'dbuzz-video':
        return `https://ipfs.io/ipfs/${id}`
      case 'hive-tube-embed':
        return `https://${domain}/videos/embed/${id}`
      case 'facebook':
        return `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F${id}%2F&width=500&show_text=false&appId=${FACEBOOK_APP_ID}&height=360`
      case 'tiktok':
        return `https://www.tiktok.com/embed/v2/${id}?lang=en-US`
      case 'odysy':
        return `https://odysee.com/$/embed/${id}`
      case 'apple':
        return `https://embed.music.apple.com/gb/${id}`
      case 'dtube':
        return `https://emb.d.tube/#!/${id}`
      default:
        return null
      }
    }
  }
  
  return (

    <React.Fragment>
      <div className={classes.videoWrapper} >
        <iframe
          title='Embedded Video'
          src={getEmbedUrl()}
          allowFullScreen={true}
          width="100%" 
          height="auto"
          scrolling="no" 
          frameborder="0" 
          allowfullscreen="true" 
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          loading='lazy'
        ></iframe>
      </div>
      <br />
    </React.Fragment>
  )
}

export default UrlVideoEmbed