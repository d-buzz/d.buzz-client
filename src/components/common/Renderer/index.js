import React, { useEffect } from 'react'
import classNames from 'classnames'
import ReactSoundCloud from 'react-soundcloud-embedded'
import { UrlVideoEmbed, LinkPreview } from 'components'
import { createUseStyles } from 'react-jss'
import TwitterEmbed from '../TwitterEmbed'
import VideoPreview from '../VideoPreview'
import { bindActionCreators } from 'redux'
import { setViewImageModal, setLinkConfirmationModal } from 'store/interface/actions'
import { connect } from 'react-redux'
import { truncateString } from 'services/helper'
import { isMobile } from 'react-device-detect'
import BuzzRenderer from '../BuzzRenderer'
import BuzzPhotoGrid from '../BuzzPhotoGrid'

const useStyles = createUseStyles(theme => ({
  inputArea: {
    marginTop: ({ minifyAssets }) => minifyAssets ? 0 : 12,
    fontSize: ({ minifyAssets }) => minifyAssets ? 15 : 17,
    lineHeight: '20px',
    width: '100%',
    height: '85%',
    outlineWidth: 0,
    border: 'none',
    resize: 'none',

    wordBreak: 'break-word !important',
    ...theme.markdown.paragraph,
    '& a': {
      wordWrap: 'break-word',
      color: '#FF0000 !important',
      fontWeight: 'normal',
    },
    '& p': {
      width: '100%',
      wordWrap: 'break-word',
      fontSize: 14,
    },
    '& blockquote': {
      padding: '10px 12px',
      margin: '0 0 20px',
      fontSize: 13,
      borderLeft: '5px solid #eee',
    },

    '&:disabled': {
      background: '#ffffff',
      color: '#000000',
    },

    '& img': {
      width: '100%',
      animation: 'skeleton-loading 1s linear infinite alternate',
    },

    '& br': {
      marginTop: 2,
      marginBottom: 2,
    },
  },
  preview: {
    marginBottom: 10,
  },
  minified: {
    '& iframe': {
      height: 300,
      width: '100%',
      border: theme.border.primary,
    },
    '@media (max-width: 768px)': {
      '& iframe': {
        height: '190px !important',
      },
    },
  },
  full: {
    '& iframe': {
      width: '100%',
      border: theme.border.primary,
    },
  },
  modalAssets: {
    '& iframe': {
      height: 288,
      width: 550,
      border: '1px solid #ccd6dd',
    },
    '& img': {
      height: 288,
      width: 550,
      objectFit: 'cover',
      marginTop: 5,
      border: '1px solid #ccd6dd',
    },
  },
  facebookResponsive: {
    overflow: 'hidden',
    paddingBottom: '56.25%',
    position: 'relative',
    height:0,
    marginBottom: 10,
    '& iframe': {
      left: 0,
      top: 0,
      height: '100%',
      width: '100%',
      position: 'absolute',
      border: 'none', 
      overflow: 'hidden',
    },
  },
  tiktokWrapper: {
    position: 'relative',
    paddingBottom: '140%',
    width: 323,
    height: 720.22,
    marginBottom: 10,
    '& iframe': {
      animation: 'skeleton-loading 1s linear infinite alternate',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 323,
      height: 720.22,
    },
  },
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    marginBottom: 10,
    height: 0,
    '& iframe': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
  },
  usernameStyle: {
    margin: '5px 2px',
    padding: '0 5px',
    background: 'rgba(255, 235, 238, 0.8)',
    borderRadius: 25,
    transition: 'opacity 250ms',
    cursor: 'pointer',
    
    '& a': {
      textDecoration: 'none',
    },

    '&:hover': {
      opacity: 0.8,
    },
  },
}))

const parseUrls = (c) => {
  return c.match(/((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-])+))+([a-zA-Z]*[a-zA-Z]){1}?(\/+[\w.,@?^=%&:/~+!#-$-']*)*/gm) || []
}

const prepareYoutubeEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const youtubeRegex = /(https?:\/\/)?((www\.)?(m\.)?youtube\.com|youtu\.?be)\/.+/i
  
  let body = content
  
  const links = parseUrls(content)

  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        let match = ''
        let id = ''
  
        if(link.match(youtubeRegex) && link.includes('.be')){
          const data = link.split('.be/')
          match = link.match(youtubeRegex)
          if (data[1]) {
            id = data[1]
          }
        }
        else if(link.match(youtubeRegex) && link.includes('watch')){
          const data = link.split(/\?v=|&/)
          match = link.match(youtubeRegex)
          if (data[1]) {
            id = data[1]
          }
        }else if (link.match(youtubeRegex) && link.includes('live')){
          const data = link.split('live/')
          match = link.match(youtubeRegex)
          if (data[1]) {
            id = data[1].replace(/\?feature=share/, '')
          }
        }
        else if(link.match(youtubeRegex) && link.includes('shorts')){
          const data = link.split('shorts/')
          match = link.match(youtubeRegex)
          if (data[1]) {
            id = data[1].replace(/\?feature=share/, '')
          }
        }
        
        if(match){
          // clean first or remove all first the additional params in the id
          if (id.match(/&t=.*/)) {
            id = id.replace(/&t=.*/, "")
          }
          body = body.replace(link, `~~~~~~.^.~~~:youtube:${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'youtube', id })
        }
      } catch(error) { }
    })
    
    if(body.match(/~~~~~~\.\^\.~~~:youtube:[a-z-A-Z0-9_]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:youtube:[a-z-A-Z0-9_]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }

  return body
}

const prepareTwitterEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  let body = content
  const mainTwitterRegex = /(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))/i
  const mobileTwitterRegex = /(?:https?:\/\/(?:(?:mobile\.twitter\.com\/(.*?)\/status\/(.*))))/i
  const htmlReplacement = /<blockquote[^>]*?><p[^>]*?>(.*?)<\/p>.*?mdash; (.*)<a href="(https:\/\/twitter\.com\/.*?(.*?\/status\/(.*?))\?.*?)">(.*?)<\/a><\/blockquote>/i

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-twitter-embed-container:') && videoEmbeds.length===0 && soundEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    const matchData = content.match(htmlReplacement)
    if(matchData) {
      const id = matchData[5]
      let title = body
      title = title.replace(htmlReplacement, '')
      body = body.replace(body, `~~~~~~.^.~~~:twitter:${id}:~~~~~~.^.~~~`)
      body = `${title} ${body}`
      twitterEmbeds.push({ app: 'twitter', id })
    } else {
      links.forEach((link) => {
        try {
          link = link.replace(/&amp;/g, '&')
          let match = ''
          let id = ''
  
          if(link.match(mainTwitterRegex)) {
            match = link.match(mainTwitterRegex)
            id = `${match[1]}&${match[2]}`
            if(link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*)?=(.*))))/i)) {
              match = link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*)?=(.*))))/i)
              id = `${match[1]}&${match[2]}`
              id = id.slice(0, -2)
            }
            body = body.replace(link, `~~~~~~.^.~~~:twitter:${id}:~~~~~~.^.~~~`)
          }
          else if(link.match(mobileTwitterRegex)) {
            match = link.match(mobileTwitterRegex)
            id = `${match[1]}&${match[2]}`
            if(link.match(/(?:https?:\/\/(?:(?:mobile\.twitter\.com\/(.*?)\/status\/(.*)?=(.*))))/i)) {
              match = link.match(/(?:https?:\/\/(?:(?:mobile\.twitter\.com\/(.*?)\/status\/(.*)?=(.*))))/i)
              id = `${match[1]}&${match[2]}`
              id = id.slice(0, -2)
            }
            body = body.replace(link, `~~~~~~.^.~~~:twitter:${id}:~~~~~~.^.~~~`)
          }
  
          if(match) {
            const id = `${match[1]}&${match[2]}`
            body = body.replace(link, `~~~~~~.^.~~~:twitter:${id}:~~~~~~.^.~~~`)
            twitterEmbeds.push({ app: 'twitter', id })
          }
        } catch(e) { }
      })
    }

    if(body.match(/~~~~~~\.\^\.~~~:twitter:[a-zA-Z0-9?&-=_.]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:twitter:[a-zA-Z0-9?&-=_.]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-twitter-embed-container:~~~~~~.^.~~~`
    }
  }
  
  return body
}

const prepareVimmEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const vimmUserRegex = /(?:(https?:\/\/)?(?:(?:(www\.)?[vV]imm\.tv\/([A-Za-z0-9-]+))))/i
  const vimmRegex = /(?:(https?:\/\/)?(?:(?:(www\.)?[vV]imm\.tv\/c\/(.*?))))/i
  const vimmRegexEmbed = /(?:https?:\/\/(?:(?:www\.[vV]imm\.tv\/\/embed)))/i
  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')
      let match = ''
      let id = ''
  
      const data = link.split('/')
  
      try {
        if(link.match(vimmRegex) && !link.includes('/view')){
          match = link.match(vimmRegex)
          id = link.includes('http') ? data[4] : data[2]
        }
        else if(link.match(vimmRegexEmbed)){
          match = link.match(vimmRegexEmbed)
          id = match[1]
        }
        else if(link.match(vimmUserRegex)){
          match = link.match(vimmUserRegex)
          id = match[3]
        }
  
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:vimm:${id.toLowerCase()}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'vimm', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:vimm:[A-Za-z0-9-=?]+\.?[A-Za-z0-9-]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:vimm:[A-Za-z0-9-=?]+\.?[A-Za-z0-9-]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }

  return body
}

const prepareThreeSpeakEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        let match = ''
        if(link.includes('3speak.online/watch?v')) {
          match = link.match(/(?:https?:\/\/(?:(?:3speak\.online\/watch\?v=(.*))))?/i)
        } else if(link.includes('3speak.co/watch?v')){
          match = link.match(/(?:https?:\/\/(?:(?:3speak\.co\/watch\?v=(.*))))?/i)
        } else if(link.includes('3speak.tv/watch?v')) {
          match = link.match(/(?:https?:\/\/(?:(?:3speak\.tv\/watch\?v=(.*))))?/i)
        }
  
        if(match) {
          const id = match[1]
          body = body.replace(link, `~~~~~~.^.~~~:threespeak:${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'threespeak', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:threespeak:[A-Za-z0-9-]+\.?[A-Za-z0-9-.]+\/[a-zA-Z&_=-]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:threespeak:[A-Za-z0-9-.]+\.?[A-Za-z0-9-]+\/[a-zA-Z&_=-]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareRumbleEmbed = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const rumbleRegexEmbed = /(?:(?:https?:\/\/)?(?:www\.)?(?:(?:rumble\.com\/[a-zA-Z1-9-.]+)))/i
  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')
      let match = ''
      let id = ''
  
      try {
        if(link.match(rumbleRegexEmbed)) {
          match = link.match(rumbleRegexEmbed)
          const input = match['input']
          const data = input.split('/')
          id = data[4]
        }
  
        if (!id) {
          id = ''
        }
  
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:rumble:${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'rumble', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:rumble:[a-z0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:rumble:[a-z0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}


const prepareLbryEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const lbryRegex = /(?:https?:\/\/(?:(?:lbry\.tv)))/i
  const lbry1Regex = /(?:https?:\/\/(?:(?:open\.lbry\.com)))/i
  const lbryRegexEmbed = /(?:https?:\/\/(?:(?:lbry\.tv\/.*?\/embed\/(.*?))))/i
  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        let match = ''
        let id = ''
  
        if(link.match(lbryRegex) || link.match(lbry1Regex)){
          const data = link.split('/')
          match = link.match(lbryRegex) ? link.match(lbryRegex) : link.match(lbry1Regex)
          if (data[4]) {
            const data1 = data[4].split(':')
            id = data1[0]
          }
  
          if(link.match(lbryRegexEmbed)){
            match = link.split('/')
            id = match[5]
          }
        }
  
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:lbry:${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'lbry', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:lbry:[a-zA-Z0-9-.]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:lbry:[a-zA-Z0-9-.]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareOdyseeEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const odyseeRegex = /(?:(?:https?:\/\/)?(?:www\.)?(?:(?:odysee\.com\/@(.*?)\/(.*))))/i
  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        let match = ''
        let id = ''
  
        if(link.match(odyseeRegex)){
          const data = link.split('/')
          match = link.match(odyseeRegex)
          if (data[4]) {
            const data1 = data[4].split(':')[0]
            if(data[4].includes('?')){
              id = data[4]
            } else {
              id = data1
            }
          } else if (data[3]) {
            const data1 = data[3].split(':')[0]
            if(data[3].includes('?')){
              id = data[3]
            } else {
              id = data1
            }
          } else if (data[2]) {
            const data1 = data[2].split(':')[0]
            if(data[2].includes('?')){
              id = data[2]
            } else {
              id = data1
            }
          }
        }
  
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~^odysy^${id}^~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'odysy', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~\^odysy\^[a-zA-Z0-9-.]+\^~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~\^odysy\^[a-zA-Z0-9-.]+\^~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareBitchuteEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const bitchuteRegex = /(?:https?:\/\/(?:(?:www\.bitchute\.com\/(.*?))))/i
  const bitchuteRegexEmbed = /(?:https?:\/\/(?:(?:www\.bitchute\.com\/embed\/(.*?))))/i
  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')
      let match = ''
      let id = ''
  
      try {
        if(link.match(bitchuteRegex)){
          const data = link.split('/')
          match = link.match(bitchuteRegex)
          id = data[4]
          if(link.match(bitchuteRegexEmbed)){
            match = link.match(bitchuteRegexEmbed)
            const input = match['input']
            const data = input.split('/')
            id = data[4]
          }
        }
  
        if (!id) {
          id = ''
        }
  
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:bitchute:${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'bitchute', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:bitchute:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:bitchute:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareBannedEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const bannedRegex = /(?:https?:\/\/(?:(?:banned\.video\/watch\?id=(.*))))/i
  
  let body = content
  
  const links = parseUrls(content)
  
  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        let match = ''
        let id = ''
    
        if(link.match(bannedRegex)){
          const data = link.split('?id=')
          match = link.match(bannedRegex)
          if (data[1]) {
            id = data[1]
          }
        }
    
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:banned:${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'banned', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:banned:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:banned:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareDollarVigilanteEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const dollarVigilanteRegex = /(?:https?:\/\/(?:(?:(www\.)?vigilante\.tv\/w\/(.*))))/i
  
  let body = content
  
  const links = parseUrls(content)
  
  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        let match = ''
        let id = ''
    
        if(link.match(dollarVigilanteRegex)){
          const data = link.split('/')
          match = link.match(dollarVigilanteRegex)
          if (data[4]) {
            id = data[4]
          }
        }
    
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:dollarvigilante:${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'dollarvigilante', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:dollarvigilante:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:dollarvigilante:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareDapplrEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const dapplrRegex = /(?:https?:\/\/(?:(?:(www\.)?cdn\.dapplr\.in\/file\/dapplr-videos\/(.*)\/(.*))))/i
  
  let body = content
  
  const links = parseUrls(content)
  
  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        let match = ''
        let username = ''
        let id = ''
    
        if(link.match(dapplrRegex)){
          const data = link.split('/')
          match = link.match(dapplrRegex)
          if (data[5] && data[6]) {
            username = data[5]
            id = data[6]
          }
        }
    
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:dapplr:${username}/${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'dapplr', id: `${username}/${id}` })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:dapplr:[a-z-A-Z0-9]+\/[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:dapplr:[a-z-A-Z0-9]+\/[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareFreeWorldNewsEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const freeWorldNewsRegex = /(?:https?:\/\/(?:(?:freeworldnews\.tv\/watch\?id=(.*))))/i
  
  let body = content
  
  const links = parseUrls(content)
  
  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        let match = ''
        let id = ''
    
        if(link.match(freeWorldNewsRegex)){
          const data = link.split('?id=')
          match = link.match(freeWorldNewsRegex)
          if (data[1]) {
            id = data[1]
          }
        }
    
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:freeworldnews:${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'freeworldnews', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:freeworldnews:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:freeworldnews:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareSoundCloudEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const soundcloudRegex = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/
  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-sound-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && videoEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')
      let match = ''
      let id = ''
  
      try {
        if(link.match(soundcloudRegex)){
          const data = link.split('/')
          match = link.match(soundcloudRegex)
          id = `${data[3]}/${data[4]}`
        }
  
        if (!id) {
          id = ''
        }
  
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:soundcloud:${id}:~~~~~~.^.~~~`)
          soundEmbeds.push({ app: 'soundcloud', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:soundcloud:[a-zA-Z0-9&?=/_-]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:soundcloud:[a-zA-Z0-9&?=/_-]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-sound-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareFacebookEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const facebookRegex = /^http(?:s?):\/\/(?:www\.|web\.|m\.)?facebook\.com\/(?:video\.php\?v=\d+|.*?\/videos\/\d+)|([A-z0-9]+)\/videos(?:\/[0-9A-z].+)?\/(\d+)(?:.+)?$/gm

  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')
      let match = ''
      let id = ''
  
      try {
        if(link.match(facebookRegex)){
          const data = link.split('/')
          match = link.match(facebookRegex)
          
          id = data[data.length-1]
          
        }
  
        if (!id) {
          id = ''
        }
  
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:facebook:${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'facebook', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:facebook:[0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:facebook:[0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareTiktokEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const tiktokRegex = /((http:\/\/(.*\.tiktok\.com\/.*|tiktok\.com\/.*))|(https:\/\/(.*\.tiktok\.com\/.*|tiktok\.com\/.*)))/g
  const tiktokIdRegex = /[0-9]+/

  let body = content
  const links = parseUrls(content)

  if(!body.includes(':dbuzz-tiktok-embed-container:') && !body.includes(':dbuzz-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')
      let match = ''
      let id = ''
  
      try {
        if(link.match(tiktokRegex)){
          const url = new URL(link)
          const data = url.pathname.split('/')
          match = link.match(tiktokRegex)
          
          id = data.reduce((a, v) => v.match(tiktokIdRegex) ? v : a)
        }
  
        if (!id) {
          id = ''
        }
  
        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:tiktok:${id}:~~~~~~.^.~~~`)
          videoEmbeds.push({ app: 'tiktok', id })
        }
      } catch(error) { }
    })

    if(body.match(/~~~~~~\.\^\.~~~:tiktok:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:tiktok:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-tiktok-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareAppleEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const appleRegex = /(?:https?:\/\/(?:(?:music\.apple\.com\/(.*?))))/i
  const appleRegexEmbed = /(?:https?:\/\/(?:(?:embed\.music\.apple\.com\/(.*?))))/i
  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')
  
      const match = link.match(appleRegex) || link.match(appleRegexEmbed)
  
      if(match){
        const data = link.split('/')
        const id = `${data[4]}/${data[5]}/${data[6]}`
        body = body.replace(link, `~~~~~~.^.~~~:apple:${id}:~~~~~~.^.~~~`)
        videoEmbeds.push({ app: 'apple', id })
      }
    })

    if(body.match(/~~~~~~\.\^\.~~~:apple:(.*?):~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:apple:(.*?):~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareDTubeEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const dtubeEmbedRegex = /^(?:(https?:\/\/)?(?:www\.)?(emb\.)?d\.tube\/v\/.*\/[a-zA-Z0-9-]+)/gi
  const dtubeVideoRegex = /^(?:(https?:\/\/)?(?:www\.)?(d\.tube)\/#!\/v\/.*\/[a-zA-Z0-9-]+)/gi
  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')
      const matchEmbed = link.match(dtubeEmbedRegex)
      const matchVideo = link.match(dtubeVideoRegex)
  
      if (matchEmbed) {
        const data = link.split('/')
        const id = link.includes('http') ? `${data[4]}/${data[5]}` : `${data[2]}/${data[3]}`
        body = body.replace(link, `~~~~~~.^.~~~:dtube:${id}:~~~~~~.^.~~~`)
        videoEmbeds.push({ app: 'dtube', id })

      } else if (matchVideo) {
        const data = link.split('/')
        const id = link.includes('http') ? `${data[5]}/${data[6]}` : `${data[3]}/${data[4]}`
        body = body.replace(link, `~~~~~~.^.~~~:dtube:${id}:~~~~~~.^.~~~`)
        videoEmbeds.push({ app: 'dtube', id })
      }
    })

    if(body.match(/~~~~~~\.\^\.~~~:dtube:[a-z-A-Z0-9]+\/[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:dtube:[a-z-A-Z0-9]+\/[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareDBuzzVideos = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const oldDbuzzVideos = /https:\/\/ipfs\.io\/ipfs\/(.*\?dbuzz_video)/i
  const dbuzzVideos = /https:\/\/ipfs\.io\/ipfs\/.*\?dbuzz_video=https:\/\/ipfs\.io\/ipfs\/([a-zA-Z0-9]+)/i
  let body = content

  const links = parseUrls(content)

  if(!body.includes(':dbuzz-videos-container:') && videoEmbeds.length===0 && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && contentImages===0) {
    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')

      let match

      if(link.match(oldDbuzzVideos) && link.match(dbuzzVideos)) {
        match = link.match(dbuzzVideos)[1]
      } else if(link.match(oldDbuzzVideos) && !link.match(dbuzzVideos)) {
        match = link.match(oldDbuzzVideos)[1].replace('?dbuzz_video', '')
      }

      if (match) {
        const id = match
        body = body.replace(link, `~~~~~~.^.~~~:dbuzz-video:${id}:~~~~~~.^.~~~`)
        buzzVideos.push(id)
      }
    })

    if(body.match(/~~~~~~\.\^\.~~~:dbuzz-video:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~:dbuzz-video:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-videos-container:~~~~~~.^.~~~`
    }
  }
  return body
}

const prepareHiveTubeVideoEmbeds = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const hiveTubeEmebedsRegex = /(http|https?:\/\/)?(www\.)?([\w_-]+)(\.)([a-zA-Z]+)(\/w\/)([0-9A-Za-z]{22})([a-z?=0-9]*)/i

  let body = content

  const links = parseUrls(content).filter(link => link.match(hiveTubeEmebedsRegex))
  
  if(!body.includes(':dbuzz-embed-container:') && !body.includes(':dbuzz-tiktok-embed-container:') && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzImages.length===0 && buzzVideos.length===0 && contentImages===0) {

    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')
  
      const matchedLink = link.match(hiveTubeEmebedsRegex).filter((match) => match !== undefined)

      let match
      let domain
  
      if(link.includes('http') && link.includes('www')) {
        domain = `${matchedLink[3]}${matchedLink[4]}${matchedLink[5]}`
      } else if (link.includes('https') && !link.includes('www')) {
        domain = `${matchedLink[2]}${matchedLink[3]}${matchedLink[4]}`
      } else if (link.includes('www') && !link.includes('http')) {
        domain = `${matchedLink[2]}${matchedLink[3]}${matchedLink[4]}`
      } else {
        domain = `${matchedLink[1]}${matchedLink[2]}${matchedLink[3]}`
      }
   
      if(matchedLink) {
        match = link.match(/(\/w\/)([0-9A-Za-z]{22})([a-z?=0-9]*)/i)[2]
      }
  
      if (match) {
        const id = match
        body = body.replace(link, `~~~~~~.^.~~~${domain}:hive-tube-embed:${id}:~~~~~~.^.~~~`)
        videoEmbeds.push({ app: 'hive-tube-embed', domain, id })
      }
    })
    
    if(body.match(/~~~~~~\.\^\.~~~([\w_-]+)(\.)([a-zA-Z]+):hive-tube-embed:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi)) {
      body = body.replace(/~~~~~~\.\^\.~~~([\w_-]+)(\.)([a-zA-Z]+):hive-tube-embed:[a-z-A-Z0-9]+:~~~~~~\.\^\.~~~/gi, '')
      body = `${body} \n ~~~~~~.^.~~~:dbuzz-embed-container:~~~~~~.^.~~~`
    }
  }
  
  return body
}

const prepareBuzzImages = (
  content,
  buzzImages,
  buzzVideos,
  videoEmbeds,
  soundEmbeds,
  twitterEmbeds,
  contentImages,
) => {
  const dbuzzImageRegex = /!\[(?:[^\]]*?)\]\((.+?)\)|(https:\/\/(storageapi\.fleek\.co)?(media\.d\.buzz)?\/[a-z-]+\/dbuzz-images\/(dbuzz-image-[0-9]+\.(?:png|jpg|gif|jpeg|webp|bmp)))|(https?:\/\/[a-zA-Z0-9=+-?_]+\.(?:png|jpg|gif|jpeg|webp|bmp|HEIC))|(?:https?:\/\/(?:ipfs\.io\/ipfs\/[a-zA-Z0-9=+-?]+))/gi

  let body = content
  
  const links = parseUrls(content)
  
  if(!body.includes('~~~~~~.^.~~~:dbuzz-images-container:~~~~~~.^.~~~') && videoEmbeds.length===0 && soundEmbeds.length===0 && twitterEmbeds.length===0 && buzzVideos.length===0 && contentImages===0) {
    links.forEach((link) => {
      link = link.replace(/&amp;/g, '&')
      const matchedLink = link.match(dbuzzImageRegex)
  
      if(matchedLink !== null) {
        if(!buzzImages.includes(matchedLink[0])) {
          body = body.replace(link, `~~~~~~.^.~~~:dbuzz-image-item:~~~~~~.^.~~~`)
          buzzImages.push(matchedLink[0])
        }
      }
    })
    
    body = body.replace(/~~~~~~\.\^\.~~~:dbuzz-image-item:~~~~~~\.\^\.~~~/g, '')
    body = `${body} \n ~~~~~~.^.~~~:dbuzz-images-container:~~~~~~.^.~~~`
  }
  
  return body
}

const getCoinTicker = (coin) => {
  const data = require('../../../files/coinGeckoData.json')

  for(var i=0; i<=data.length; i++){
    if(data[i]?.symbol === coin){
      return {id: data[i]?.id, name: data[i]?.name}
    }
  }
}

const render = (content, markdownClass, assetClass, minifyAssets, scrollIndex, recomputeRowIndex, classes, videoEmbeds, soundEmbeds, twitterEmbeds, buzzImages, buzzVideos, onImageLoad) => {  

  if (content.includes(':dbuzz-images-container:')) {
    return <BuzzPhotoGrid content={content} images={buzzImages} minifyAssets={minifyAssets} recomputeRowIndex={recomputeRowIndex} onImageLoad={onImageLoad} />
  } if(content.includes(':dbuzz-videos-container:')) {
    return <a href={`https://ipfs.io/ipfs/${buzzVideos[0]?.id}`}><VideoPreview key={`${buzzVideos[0]?.id}${scrollIndex}dbuzz-video`} url={`https://ipfs.io/ipfs/${buzzVideos[0]?.id}`}/></a>
  } else if (content.includes(':dbuzz-embed-container:')) {
    return <UrlVideoEmbed key={`${videoEmbeds[0]?.id}${scrollIndex}url-embed`} embed={videoEmbeds} />
  } else if (content.includes(':dbuzz-sound-embed-container:')) {
    return <ReactSoundCloud url={`https://soundcloud.com/${soundEmbeds.filter(embed => embed.app === 'soundcloud')[0]?.id}`} />
  } else if (content.includes(':dbuzz-twitter-embed-container:')) {
    return <TwitterEmbed key={`${twitterEmbeds[0]?.id}${scrollIndex}tweet`} tweet={twitterEmbeds} onIframeLoad={onImageLoad} />
  } else if (content.includes(':dbuzz-tiktok-embed-container:')) {
    return (
      <React.Fragment>
        <div className={classes.tiktokWrapper}>
          <iframe
            title='Embedded TikTok Video'
            src={`https://www.tiktok.com/embed/v2/${videoEmbeds.filter(embed => embed.app === 'tiktok')[0]?.id}?lang=en-US`}
            allowFullScreen={true}
            frameBorder='0'
            loading='lazy'
          ></iframe>
        </div>
      </React.Fragment>
    )
  } else {
    // render normally

    // youtube
    const youtubeRegex = /(https?:\/\/)?((www\.)?(m\.)?youtube\.com|youtu\.?be)\/.+/gi
    // twitter
    const twitterRegex = /(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))|(?:https?:\/\/(?:(?:mobile\.twitter\.com\/(.*?)\/status\/(.*))))|(<blockquote[^>]*?><p[^>]*?>(.*?)<\/p>.*?mdash; (.*)<a href="(https:\/\/twitter\.com\/.*?(.*?\/status\/(.*?))\?.*?)">(.*?)<\/a><\/blockquote>)/gi
    // vimm
    const vimmRegex = /https?:\/\/(?:www\.)?vimm\.tv\/(?:c\/)?[\w-]+(?:\/embed(?:\?autoplay=\d)?)?/gi
    // threespeak
    const threeSpeakRegex =/(?:https?:\/\/(?:3speak\.online\/watch\?v=(.*)|3speak\.co\/watch\?v=(.*)|3speak\.tv\/watch\?v=(.*)))/gi
    // rumble
    const rumbleRegex = /(?:(?:https?:\/\/)?(?:www\.)?(?:(?:rumble\.com\/embed\/[a-zA-Z1-9-./?=-]+)))/gi
    // odysee
    const odyseeAndLbryRegex = /(?:(?:https?:\/\/)?(?:www\.)?(?:(?:odysee\.com|lbry\.tv)\/@(.*?)[^ ]\/([a-zA-Z0-9~!@#$%^&*()_+=.:-]*)))/gi
    // bitchute
    const bitchuteRegex = /(?:https?:\/\/(?:www\.bitchute\.com\/(?:video\/)?(?:embed\/)?([a-zA-Z0-9/]*)))/gi
    // banned
    const bannedRegex = /(?:https?:\/\/(?:(?:banned\.video\/watch\?id=(.*))))/gi
    // dollarvigilante
    const dollarVigilanteRegex = /(?:https?:\/\/(?:(?:(www\.)?vigilante\.tv\/w\/([a-zA-Z0-9/]*))))/gi
    // dapplr
    const dapplrRegex = /(?:https?:\/\/(?:(?:(www\.)?cdn\.dapplr\.in\/file\/dapplr-videos\/(.*)\/(.*))))/i
    // freeworldnews
    const freeWorldNewsRegex = /(?:https?:\/\/(?:(?:freeworldnews\.tv\/watch\?id=(.*))))/gi
    // dbuzzvideos
    const dbuzzVideosRegex = /https:\/\/ipfs\.io\/ipfs\/(.*\?dbuzz_video=)|https:\/\/ipfs\.io\/ipfs\/.*\?dbuzz_video=https:\/\/ipfs\.io\/ipfs\/([a-zA-Z0-9]+)/gi
    // hivetube
    const hiveTubeRegex = /(http|https?:\/\/)?(www\.)?([\w_-]+)(\.)([a-zA-Z]+)(\/w\/)([0-9A-Za-z]{22})([a-z?=0-9]*)/gi
    // dtube
    const dtubeRegex = /^(?:(https?:\/\/)?(?:www\.)?(emb\.)?d\.tube\/v\/.*\/[a-zA-Z0-9-]+)|(?:(https?:\/\/)?(?:www\.)?(d\.tube)\/#!\/v\/.*\/[a-zA-Z0-9-]+)/gi
    // facebook
    const facebookRegex = /^http(?:s?):\/\/(?:www\.|web\.|m\.)?facebook\.com\/(?:video\.php\?v=\d+|.*?\/videos\/\d+)|([A-z0-9]+)\/videos(?:\/[0-9A-z].+)?\/(\d+)(?:.+)?$/gi
    // apple
    const appleRegex = /(?:https?:\/\/(?:music\.apple\.com\/(.*))|(?:embed\.music\.apple\.com\/(.*)))/gi

    // tiktok
    const tiktokRegex = /((http:\/\/(.*\.tiktok\.com\/.*|tiktok\.com\/.*))|(https:\/\/(.*\.tiktok\.com\/.*|tiktok\.com\/.*)))/gi
    
    // soundcloud
    const soundCloudRegex = /https?:\/\/(soundcloud\.com|snd\.sc)\/([a-zA-Z0-9&?=/_-]+)/gi

    // buzz images
    const dbuzzImageRegex = /!\[(?:[^\]]*?)\]\((.+?)\)|(https:\/\/(storageapi\.fleek\.co)?(media\.d\.buzz)?\/[a-z-]+\/dbuzz-images\/(dbuzz-image-[0-9]+\.(?:png|jpg|gif|jpeg|webp|bmp)))|(https?:\/\/[a-zA-Z0-9=+-?_]+\.(?:png|jpg|gif|jpeg|webp|bmp|HEIC))|(?:https?:\/\/(?:ipfs\.io\/ipfs\/[a-zA-Z0-9=+-?]+))/gi

    // render the non-embed urls
    // youtube
    content = content.replace(youtubeRegex, '')
    // twitter
    content = content.replace(twitterRegex, '')
    // vimm
    content = content.replace(vimmRegex, '')
    // threespeak
    content = content.replace(threeSpeakRegex, '')
    // rumble
    content = content.replace(rumbleRegex, '')
    // odysee
    content = content.replace(odyseeAndLbryRegex, '')
    // bitchute
    content = content.replace(bitchuteRegex, '')
    // banned
    content = content.replace(bannedRegex, '')
    // dollarvigilante
    content = content.replace(dollarVigilanteRegex, '')
    // dapplr
    content = content.replace(dapplrRegex, '')
    // freeworldnews
    content = content.replace(freeWorldNewsRegex, '')
    // dbuzzvideos
    content = content.replace(dbuzzVideosRegex, '')
    // hivetube
    content = content.replace(hiveTubeRegex, '')
    // dtube
    content = content.replace(dtubeRegex, '')
    // facebook
    content = content.replace(facebookRegex, '')
    // apple
    content = content.replace(appleRegex, '')

    //tiktok
    content = content.replace(tiktokRegex, '')
    
    // soundcloud
    content = content.replace(soundCloudRegex, '')

    // buzz images
    content = content.replace(dbuzzImageRegex, '')


    const checkForMarkdownDefaults = (n) => {
      return !n.startsWith('[') && !n.startsWith('(')
    }

    const checkForImage = (n) => {
      return !n.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i) && !n.match(/ipfs\.io\/ipfs\/[a-zA-Z0-9]+/gi)
    }

    const checkForValidURL = (n) => {
      return !n.startsWith('@')
      && !n.startsWith('#')
      && !n.startsWith('"')
      && checkForMarkdownDefaults(n)
    }

    const checkForValidUserName = (n) => {
      return n.startsWith('@')
    }

    const checkForValidHashTag = (n) => {
      return n.startsWith('#')
    }

    const checkForValidCryptoTicker = (n) => {
      return n.startsWith('$')
    }

    const replaceLastCharacterIfCommaOrPeriod = (n) => {
      // Check if the inputString is not empty and the last character is a comma or period
      if (n.length > 0 && /[,.]$/.test(n)) {
        // Replace the last character with an empty string
        n = n.slice(0, -1)
      }
      return n
    }
    // to get the last character of a string then append it after creating the link
    const getLastCharacterToAppend = (n) => {
      var lastCharacter = ""
      if (n.length > 0 && /[,]$/.test(n)) {
        lastCharacter = ","
      }

      if (n.length > 0 && /[.]$/.test(n)) {
        lastCharacter = "."
      }
      return lastCharacter
    }

    // // render content (supported for all browsers)
    content = content
    // // render all urls
      .replace(/("\S+)|(\[\S+)|(\(\S+)|(@\S+)|(#\S+)|((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-])+))+([a-zA-Z]*[a-zA-Z]){1}?([\w.,@?^=%&:/~+#!-$-]+)?(\/+[\w.,@?^=%&:/~+#!-$-]*)*/gi, n => {
        // need to get the full url without getting the last character if it is comma or period
        const cleanUrlName = replaceLastCharacterIfCommaOrPeriod(n)

        // need to get the last character of the full url if it is comma or period in order to re-append it without including it in the link
        const lastCharacter = getLastCharacterToAppend(n)

        return checkForImage(cleanUrlName) && checkForValidURL(cleanUrlName) ? `<span class="hyperlink" id="${cleanUrlName}">${truncateString(cleanUrlName, 25)}</span>${lastCharacter}` : cleanUrlName
      })
      // // render markdown links  
      .replace(/\[.*?\]\((.+?)\)/gi, (_m, n) => `<span class="hyperlink" id="${n}">${truncateString(n, 25)}</span>`)
      // // render usernames
      .replace(/([a-zA-Z0-9/-]@\S+)|@([A-Za-z0-9-]+\.?[A-Za-z0-9-]+)/gi, n => checkForValidUserName(n) ? `<b><a href=${window.location.origin}/${n.toLowerCase()}>${n}</a></b>` : n)
      //   // render hashtags 
      .replace(/([a-zA-Z0-9/-]#\S+)|#([A-Za-z\d-]+)/gi, n => checkForValidHashTag(n) ? `<b><a href='${window.location.origin}/tags?q=${n.replace('#', '').toLowerCase()}'>${n}</a></b>` : n)
      // // render crypto tickers
      .replace(/([a-zA-Z0-9/-]\$\S+)|\$([A-Za-z-]+)/gi, n => checkForValidCryptoTicker(n) && getCoinTicker(n.replace('$', '').toLowerCase()) ? `<b title=${getCoinTicker(n.replace('$', '').toLowerCase()).name}><a href=https://www.coingecko.com/en/coins/${getCoinTicker(n.replace('$', '').toLowerCase()).id}/usd#panel>${n}</a></b>` : n)
      // // render markdown images
      .replace(/(!\[[^\]]*?\])\(\)/gi, '')
      // hide watch video on dbuzz
      .replace(/\[WATCH THIS VIDEO ON DBUZZ]\(.+\)/gi, '')

    return <BuzzRenderer
      key={`${new Date().getTime()}${scrollIndex}${Math.random()}`}
      content={content}
      className={classNames(markdownClass, assetClass, classes.inputArea)}
      skipTags={['br']}
    />
  }

}

const Renderer = React.memo((props) => {
  const {
    minifyAssets = true,
    scrollIndex = -1,
    recomputeRowIndex = () => {},
    setLinkConfirmationModal,
    onImageLoad,
    // when the buzz is being drafted
    contentImages=0,
  } = props
  const classes = useStyles({ minifyAssets })
  let { content = '' } = props
  const original = content

  const extracted = parseUrls(content)

  extracted.forEach((item) => {
    const link = item?.replace(/\(/g, '%28').replace(/\)/g, '%29')
    content = content?.replace(item, link)
  })

  const links = parseUrls(content)

  const prepareHyperlinks = () => {
    const hyperlinks = document.querySelectorAll(`.hyperlink`)
    hyperlinks.forEach((hyperlink) => {
      hyperlink.addEventListener('click', function (e) {
        e.preventDefault()
        const url = hyperlink.id
        setLinkConfirmationModal(url)
      })
      if(isMobile) {
        hyperlink.addEventListener('touchstart', function (e) {
          e.preventDefault()
          const url = hyperlink.id
          setLinkConfirmationModal(url)
        })
      }
    })
  }

  useEffect(() => {
    prepareHyperlinks()
    // eslint-disable-next-line
  }, [links])
  
  const buzzImages = []
  const buzzVideos = []
  const videoEmbeds = []
  const soundEmbeds = []
  const twitterEmbeds = []
  
  if(JSON.parse(localStorage.getItem('customUserData'))?.settings?.videoEmbedsStatus !== 'disabled') {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        link = link.replace(/\(/g, '%28').replace(/\)/g, '%29')
        
        const hiveTubePattern = /(http|https?:\/\/)?(www\.)?([\w_-]+)(\.)([a-zA-Z]+)(\/w\/)([0-9A-Za-z]{22})([a-z?=0-9]*)/
        const buzzImagesPattern = /!\[(?:[^\]]*?)\]\((.+?)\)|(https:\/\/(storageapi\.fleek\.co)?(media\.d\.buzz)?\/[a-z-]+\/dbuzz-images\/(dbuzz-image-[0-9]+\.(?:png|jpg|gif|jpeg|webp|bmp)))|(https?:\/\/[a-zA-Z0-9=+-?_]+\.(?:png|jpg|gif|jpeg|webp|bmp|HEIC))|(?:https?:\/\/(?:ipfs\.io\/ipfs\/[a-zA-Z0-9=+-?]+))/gi

        if(link.includes('youtube.com') ||link.includes('youtu.be')) {
          content = prepareYoutubeEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('twitter.com')) {
          content = prepareTwitterEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('3speak.co') || link.includes('3speak.online') || link.includes('3speak.tv')) {
          content = prepareThreeSpeakEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('vimm.tv') || link.includes('Vimm.tv')) {
          content = prepareVimmEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('rumble.com')) {
          content = prepareRumbleEmbed(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('lbry.tv') || link.includes('open.lbry.com')) {
          content = prepareLbryEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('bitchute.com')) {
          content = prepareBitchuteEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('banned.video')) {
          content = prepareBannedEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('vigilante.tv')) {
          content = prepareDollarVigilanteEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('dapplr.in')) {
          content = prepareDapplrEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('freeworldnews.tv')) {
          content = prepareFreeWorldNewsEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('soundcloud.com')) {
          content = prepareSoundCloudEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('facebook.com')) {
          content = prepareFacebookEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('tiktok.com')) {
          content = prepareTiktokEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('odysee.com')) {
          content = prepareOdyseeEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(link.includes('music.apple.com')) {
          content = prepareAppleEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if (link.includes('d.tube')) {
          content = prepareDTubeEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if (link.includes('dbuzz_video')) {
          content = prepareDBuzzVideos(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(hiveTubePattern.test(link)) {
          content = prepareHiveTubeVideoEmbeds(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        } else if(buzzImagesPattern.test(link)) {
          content = prepareBuzzImages(content, buzzImages, buzzVideos, videoEmbeds, soundEmbeds, twitterEmbeds, contentImages)
        }
      } catch(error) { }
    })
  }

  const assetClass = classes.full

  let splitContent = content.split(`~~~~~~.^.~~~`)

  splitContent = splitContent.filter((item) => item !== '')

  return (
    <React.Fragment>
      {splitContent.map((item) => (
        render(item, classes.markdown, assetClass, minifyAssets, scrollIndex, recomputeRowIndex, classes, videoEmbeds, soundEmbeds, twitterEmbeds, buzzImages, buzzVideos, onImageLoad)
      ))}
      <LinkPreview content={original} scrollIndex={scrollIndex} recomputeRowIndex={recomputeRowIndex} />
    </React.Fragment>
  )
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      setViewImageModal,
      setLinkConfirmationModal,
    },dispatch),
})

export default connect(null, mapDispatchToProps)(Renderer)
