import React, { useEffect } from 'react'
import markdownLinkExtractor from 'markdown-link-extractor'
import textParser from 'npm-text-parser'
import classNames from 'classnames'
import ReactSoundCloud from 'react-soundcloud-embedded'
import { UrlVideoEmbed, LinkPreview } from 'components'
import { createUseStyles } from 'react-jss'
import TwitterEmbed from '../TwitterEmbed'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import VideoPreview from '../VideoPreview'


const FACEBOOK_APP_ID = 236880454857514

const useStyles = createUseStyles(theme => ({
  inputArea: {
    width: '100%',
    height: '85%',
    padding: '15px 0',
    fontSize: '14 !important',
    outlineWidth: 0,
    border: 'none',
    resize: 'none',
    // whiteSpace: 'pre-wrap',

    wordBreak: 'break-word !important',
    ...theme.markdown.paragraph,
    '& a': {
      wordWrap: 'break-word',
      color: '#d32f2f !important',
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
  },
  preview: {
    marginBottom: 10,
  },
  minified: {
    '& img': {
      height: '300px !important',
      width: '100%',
      objectFit: 'cover',
      marginTop: 5,
      border: theme.border.primary,
    },
    '& iframe': {
      height: 300,
      width: '100%',
      border: theme.border.primary,
    },
    '@media (max-width: 768px)': {
      '& img': {
        height: '190px !important',
      },
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
    '& img': {
      width: '100%',
      marginTop: 5,
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
    height: 0,
    marginBottom: 10,
    '& iframe': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
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
    border: '1px solid rgba(230, 28, 52, 0.2)',
    margin: '5px 2px',
    padding: '1px 5px',
    paddingBottom: 2,
    background: 'rgba(255, 235, 238, 0.8)',
    borderRadius: 5,
    transition: 'opacity 250ms',
    
    '& a': {
      textDecoration: 'none',
    },

    '&:hover': {
      opacity: 0.8,
    },
  },
}))

const prepareYoutubeEmbeds = (content) => {
  const youtubeRegex = /(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+/i

  let body = content
  
  const links = textParser.getUrls(content)
  
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
		    const data = link.split('?v=')
        match = link.match(youtubeRegex)
        if (data[1]) {
          id = data[1]
        }
      }
  
      if(match){
        body = body.replace(link, `~~~~~~.^.~~~:youtube:${id}:~~~~~~.^.~~~`)
      }
    } catch(error) { }
  })
  return body
}

const prepareTwitterEmbeds = (content) => {
  let body = content
  const mainTwitterRegex = /(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))/i
  const mobileTwitterRegex = /(?:https?:\/\/(?:(?:mobile\.twitter\.com\/(.*?)\/status\/(.*))))/i
  const htmlReplacement = /<blockquote[^>]*?><p[^>]*?>(.*?)<\/p>.*?mdash; (.*)<a href="(https:\/\/twitter\.com\/.*?(.*?\/status\/(.*?))\?.*?)">(.*?)<\/a><\/blockquote>/i

  const links = textParser.getUrls(content)

  const matchData = content.match(htmlReplacement)
  if(matchData) {
    const id = matchData[5]
    let title = body
    title = title.replace(htmlReplacement, '')
    body = body.replace(body, `~~~~~~.^.~~~:twitter:${id}:~~~~~~.^.~~~`)
    body = `${title} ${body}`
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
        }
      } catch(e) { }
    })
  }


  return body
}

const prepareVimmEmbeds = (content) => {
  const vimmRegex = /(?:https?:\/\/(?:(?:www\.vimm\.tv\/(.*?))))/i
  const vimmRegexEmbed = /(?:https?:\/\/(?:(?:www\.vimm\.tv\/(.*?)\/embed)))/i
  let body = content

  const links = textParser.getUrls(content)

  links.forEach((link) => {
    link = link.replace(/&amp;/g, '&')
    let match = ''
    let id = ''

    try {
      if(link.match(vimmRegex) && !link.includes('/view')){
        const data = link.split('/')
        match = link.match(vimmRegex)
        id = data[3]
        if(link.match(vimmRegexEmbed)){
          match = link.match(vimmRegexEmbed)
          id = match[1]
        }
      }

      if(match){
        body = body.replace(link, `~~~~~~.^.~~~:vimm:${id}:~~~~~~.^.~~~`)
      }
    } catch(error) { }
  })
  return body
}

const prepareThreeSpeakEmbeds = (content) => {
  let body = content

  const links = markdownLinkExtractor(content)

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
      }
    } catch(error) { }
  })
  return body
}

const prepareRumbleEmbed = (content) => {
  const rumbleRegex = /(?:https?:\/\/(?:(?:rumble\.com\/(.*?))))/i
  const rumbleRegexEmbed = /(?:https?:\/\/(?:(?:rumble\.com\/embed\/(.*?))))/i
  let body = content

  const links = textParser.getUrls(content)

  links.forEach((link) => {
    link = link.replace(/&amp;/g, '&')
    let match = ''
    let id = ''

    try {
      if(link.match(rumbleRegex)){
        const data = link.split('/')
        match = link.match(rumbleRegex)
        id = data[4]
        if(link.match(rumbleRegexEmbed)){
          match = link.match(rumbleRegexEmbed)
          const input = match['input']
          const data = input.split('/')
          id = data[4]
        }
      }
      if (!id) {
        id = ''
      }

      if(match){
        body = body.replace(link, `~~~~~~.^.~~~:rumble:${id}:~~~~~~.^.~~~`)
      }
    } catch(error) { }
  })
  return body
}


const prepareLbryEmbeds = (content) => {
  const lbryRegex = /(?:https?:\/\/(?:(?:lbry\.tv)))/i
  const lbry1Regex = /(?:https?:\/\/(?:(?:open\.lbry\.com)))/i
  const lbryRegexEmbed = /(?:https?:\/\/(?:(?:lbry\.tv\/.*?\/embed\/(.*?))))/i
  let body = content

  const links = markdownLinkExtractor(content)

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
      }
    } catch(error) { }
  })
  return body
}

const prepareOdyseeEmbeds = (content) => {
  const odyseeRegex = /(?:https?:\/\/(?:(?:odysee\.com\/@(.*?)\/(.*))))/i
  let body = content

  const links = markdownLinkExtractor(content)

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
        }
      }

      if(match){
        body = body.replace(link, `~~~~~~.^.~~~^odysy^${id}^~~~~~~.^.~~~`)
      }
    } catch(error) { }
  })
  return body
}

const prepareBitchuteEmbeds = (content) => {
  const bitchuteRegex = /(?:https?:\/\/(?:(?:www\.bitchute\.com\/(.*?))))/i
  const bitchuteRegexEmbed = /(?:https?:\/\/(?:(?:www\.bitchute\.com\/embed\/(.*?))))/i
  let body = content

  const links = textParser.getUrls(content)

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
      }
    } catch(error) { }
  })
  return body
}

const prepareBannedEmbeds = (content) => {
  const bannedRegex = /(?:https?:\/\/(?:(?:banned\.video\/watch\?id=(.*))))/i
  
  let body = content
  
  const links = textParser.getUrls(content)
  
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
      }
    } catch(error) { }
  })
  return body
}

const prepareDollarVigilanteEmbeds = (content) => {
  const dollarVigilanteRegex = /(?:https?:\/\/(?:(?:(www\.)?dollarvigilante\.tv\/videos\/watch\/(.*))))/i
  
  let body = content
  
  const links = textParser.getUrls(content)
  
  links.forEach((link) => {
    try {
      link = link.replace(/&amp;/g, '&')
		  let match = ''
		  let id = ''
  
		  if(link.match(dollarVigilanteRegex)){
		    const data = link.split('/')
        match = link.match(dollarVigilanteRegex)
        if (data[5]) {
          id = data[5]
        }
      }
  
      if(match){
        body = body.replace(link, `~~~~~~.^.~~~:dollarvigilante:${id}:~~~~~~.^.~~~`)
      }
    } catch(error) { }
  })
  return body
}

const prepareDapplrEmbeds = (content) => {
  const dapplrRegex = /(?:https?:\/\/(?:(?:(www\.)?cdn\.dapplr\.in\/file\/dapplr-videos\/(.*)\/(.*))))/i
  
  let body = content
  
  const links = textParser.getUrls(content)
  
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
      }
    } catch(error) { }
  })
  return body
}

const prepareFreeWorldNewsEmbeds = (content) => {
  const freeWorldNewsRegex = /(?:https?:\/\/(?:(?:freeworldnews\.tv\/watch\?id=(.*))))/i
  
  let body = content
  
  const links = textParser.getUrls(content)
  
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
      }
    } catch(error) { }
  })
  return body
}

const prepareSoundCloudEmbeds = (content) => {
  const soundcloudRegex = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/
  let body = content

  const links = textParser.getUrls(content)

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
      }
    } catch(error) { }
  })
  return body
}

const prepareFacebookEmbeds = (content) => {
  const facebookRegex = /^http(?:s?):\/\/(?:www\.|web\.|m\.)?facebook\.com\/(?:video\.php\?v=\d+|.*?\/videos\/\d+)|([A-z0-9]+)\/videos(?:\/[0-9A-z].+)?\/(\d+)(?:.+)?$/gm

  let body = content

  const links = textParser.getUrls(content)

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
      }
    } catch(error) { }
  })
  return body
}

const prepareTiktokEmbeds = (content) => {
  const tiktokRegex = /((http:\/\/(.*\.tiktok\.com\/.*|tiktok\.com\/.*))|(https:\/\/(.*\.tiktok\.com\/.*|tiktok\.com\/.*)))/g
  const tiktokIdRegex = /[0-9]+/

  let body = content
  const links = textParser.getUrls(content)

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
      }
    } catch(error) { }
  })
  return body
}

const prepareAppleEmbeds = (content) => {
  const appleRegex = /(?:https?:\/\/(?:(?:music\.apple\.com\/(.*?))))/i
  const appleRegexEmbed = /(?:https?:\/\/(?:(?:embed\.music\.apple\.com\/(.*?))))/i
  let body = content

  const links = textParser.getUrls(content)

  links.forEach((link) => {
    link = link.replace(/&amp;/g, '&')

    const match = link.match(appleRegex) || link.match(appleRegexEmbed)

    if(match){
      const data = link.split('/')
      const id = `${data[4]}/${data[5]}/${data[6]}`
      body = body.replace(link, `~~~~~~.^.~~~:apple:${id}:~~~~~~.^.~~~`)
    }
  })
  return body
}

const prepareDTubeEmbeds = (content) => {
  const dtubeRegex = /^https:\/\/(emb\.)?d\.tube\/(.*)/
  let body = content

  const links = textParser.getUrls(content)

  links.forEach((link) => {
    link = link.replace(/&amp;/g, '&')

    const match = link.match(dtubeRegex)

    if (match) {
      const data = link.split('/')
      const id = `${data[4]}/${data[5]}`
      body = body.replace(link, `~~~~~~.^.~~~:dtube:${id}:~~~~~~.^.~~~`)
    }
  })
  return body
}

const prepareDBuzzVideos = (content) => {
  const oldDbuzzVideos = /https:\/\/ipfs\.io\/ipfs\/(.*\?dbuzz_video)/i
  const dbuzzVideos = /https:\/\/ipfs\.io\/ipfs\/.*\?dbuzz_video=https:\/\/ipfs\.io\/ipfs\/([a-zA-Z0-9]+)/i
  let body = content

  const links = textParser.getUrls(content)

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
    }
  })
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

const render = (content, markdownClass, assetClass, scrollIndex, recomputeRowIndex, classes) => {  

  if(content.includes(':youtube:')) {
    const splitYoutube = content.split(':')
    const url = `https://www.youtube.com/embed/${splitYoutube[2]}`
    return <UrlVideoEmbed key={`${url}${scrollIndex}3speak`} url={url} />
  } else if(content.includes(':twitter:')) {
    const splitTwitter = content.split(':')
    return <TwitterEmbed key={`${splitTwitter[2]}${scrollIndex}tweet`} tweetId={splitTwitter[2]} />
  } else if(content.includes(':threespeak:')) {
    const splitThreeSpeak = content.split(':')
    const url = `https://3speak.tv/embed?v=${splitThreeSpeak[2]}`
    return <UrlVideoEmbed key={`${url}${scrollIndex}3speak`} url={url} />
  } else if(content.includes(':vimm:')){
    const splitVimm = content.split(':')
    const url = `https://www.vimm.tv/${splitVimm[2]}/embed?autoplay=0`
    return <UrlVideoEmbed key={`${url}${scrollIndex}vimm`} url={url} />
  } else if(content.includes(':rumble:')) {
    const splitRumble = content.split(':')
    if (splitRumble[2] ) {
      const url = `https://rumble.com/embed/${splitRumble[2]}`
      return <UrlVideoEmbed key={`${content}${scrollIndex}rumble`} url={url} />
    }
  } else if(content.includes(':lbry:')){
    const splitLbry = content.split(':')
    const url = `https://lbry.tv/$/embed/${splitLbry[2]}`
    return <UrlVideoEmbed key={`${url}${scrollIndex}lbry`} url={url} />
  } else if(content.includes(':bitchute:')) {
    const splitBitchute = content.split(':')
    const url = `https://www.bitchute.com/embed/${splitBitchute[2]}`
    return <UrlVideoEmbed key={`${url}${scrollIndex}bitchute`} url={url} />
  } else if(content.includes(':banned:')) {
    const splitBanned = content.split(':')
    const url = `https://api.banned.video/embed/${splitBanned[2]}`
    return <UrlVideoEmbed key={`${url}${scrollIndex}banned`} url={url} />  
  } else if(content.includes(':dollarvigilante:')) {
    const splitDollarvigilante = content.split(':')
    const url = `https://dollarvigilante.tv/videos/embed/${splitDollarvigilante[2]}`
    return <UrlVideoEmbed key={`${url}${scrollIndex}dollarvigilante`} url={url} />  
  } else if(content.includes(':dapplr:')) {
    const splitDapplr = content.split(':')
    const url = `https://cdn.dapplr.in/file/dapplr-videos/${splitDapplr[2]}`
    return <UrlVideoEmbed key={`${url}${scrollIndex}dapplr`} url={url} />  
  } else if(content.includes(':freeworldnews:')) {
    const splitFreeWorldNews = content.split(':')
    const url = `https://api.banned.video/embed/${splitFreeWorldNews[2]}`
    return <UrlVideoEmbed key={`${url}${scrollIndex}freeworldnews`} url={url} /> 
  } else if(content.includes(':soundcloud:')) {
    const splitSoundcloud = content.split(':')
    const url = `https://soundcloud.com/${splitSoundcloud[2]}`
    return <ReactSoundCloud url={url} />
  } else if(content.includes(':dbuzz-video:')) {
    const url = content.split(':')[2]
    return <a href={`https://ipfs.io/ipfs/${url}`}><VideoPreview key={`${url}${scrollIndex}dbuzz-video`} url={`https://ipfs.io/ipfs/${url}`}/></a>
  } else if (content.includes(':facebook:')) {
    try {
      const splitFacebook = content.split(':')

      return (
        <React.Fragment>
          <div className={classes.facebookResponsive}>
            <iframe 
              title={`facebook-${splitFacebook[2]}`}
              src={`https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F${splitFacebook[2]}%2F&width=500&show_text=false&appId=${FACEBOOK_APP_ID}&height=360`}
              width="100%" 
              height="auto"
              scrolling="no" 
              frameborder="0" 
              allowfullscreen="true" 
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" 
            >
            </iframe>
          </div>
        </React.Fragment>
      )
    } catch(error) {
      console.log({ error })
    }
  } else if (content.includes(':tiktok:')) {
    const splitTiktok = content.split(':')
    if (splitTiktok[2]) {
      const url = `https://www.tiktok.com/embed/v2/${splitTiktok[2]}?lang=en-US`

      return (
        <React.Fragment>
          <div className={classes.tiktokWrapper}>
            <iframe
              title='Embedded Video'
              src={url}
              allowFullScreen={true}
              frameBorder='0'
              height='250'
              width='100%'
            ></iframe>
          </div>
        </React.Fragment>
      )
    }
  } else if (content.includes('^odysy^')) {
    const splitOdysy = content.split('^')
    const url = `https://odysee.com/$/embed/${splitOdysy[2]}`
    return <UrlVideoEmbed key={`${url}${scrollIndex}odysy`} url={url} />
  } else if(content.includes(':apple:')) {
    const splitApple = content.split(':')
    const url = `https://embed.music.apple.com/gb/${splitApple[2]}`
    // return <UrlVideoEmbed key={`${url}${scrollIndex}apple`} url={url} />
    return (
      <React.Fragment>
        <div className={classes.videoWrapper} >
          <iframe
            title='Apple Music'
            src={url}
            allowFullScreen={true}
            frameBorder='0'
            height='300'
            width='100%'
          ></iframe>
        </div>
      </React.Fragment>
    )
  } else if (content.includes(':dtube:')) {
    const splitDTube = content.split(':')
    const url = `https://emb.d.tube/#!/${splitDTube[2]}`
    return <UrlVideoEmbed key={`${url}${scrollIndex}dtube`} url={url} />
  } else {
    // render normally

    const checkForMarkdownDefaults = (n) => {
      return !n.startsWith('[') && !n.startsWith('(')
    }

    const checkForImage = (n) => {
      return !n.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i) && !n.match(/ipfs\.io\/ipfs\/[a-zA-Z0-9]+/gi)
    }

    const checkForValidURL = (n) => {
      return !n.startsWith('@')
      && !n.startsWith('#')
      && checkForMarkdownDefaults(n)
    }

    const checkForValidUserName = (n) => {
      return !n.startsWith('/@')
    }

    const checkForValidHashTag = (n) => {
      return !n.startsWith('/#')
    }

    const checkForValidCryptoTicker = (n) => {
      return !n.startsWith('/$')
    }

    const checkForValidImage = (n) => {
      return checkForMarkdownDefaults(n) && !n.includes('?dbuzz_video')
    }

    // render content (supported for all browsers)
    content = content
    // render all urls
      .replace(/(\[\S+)|(\(\S+)|(@\S+)|(#\S+)|((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-])+))+([a-zA-Z]*[a-zA-Z]){1}?(\/+[\w.,@?^=%&:/~+#-$-]*)*/gi, n => checkForImage(n) && checkForValidURL(n) ? `<a href='${n.startsWith('http') ? n : `https://${n}`}'>${n}</a>` : n)
    // render usernames
      .replace(/(\/@\S+)|@([A-Za-z0-9-]+\.?[A-Za-z0-9-]+)/gi, n => checkForValidUserName(n) ? `<b class=${classes.usernameStyle}><a href=${window.location.origin}/${n.toLowerCase()}>${n}</a></b>` : n)
      // render hashtags 
      .replace(/(\/#\S+)|#([\w\d!@%^&*+=._-]+)/gi, n => checkForValidHashTag(n) ? `<b><a href='${window.location.origin}/tags?q=${n.replace('#', '')}'>${n}</a></b>` : n)
    // render crypto tickers
      .replace(/(\/\$\S+)|\$([A-Za-z-]+)/gi, n => checkForValidCryptoTicker(n) && getCoinTicker(n.replace('$', '').toLowerCase()) ? `<b title=${getCoinTicker(n.replace('$', '').toLowerCase()).name}><a href=https://www.coingecko.com/en/coins/${getCoinTicker(n.replace('$', '').toLowerCase()).id}/usd#panel>${n}</a></b>` : n)
    // render web images links
      .replace(/(\[\S+)|(\(\S+)|(https?:\/\/.*\.(?:png|jpg|gif|jpeg|bmp))/gi, n => checkForValidImage(n) && JSON.parse(localStorage.getItem('customUserData'))?.settings?.showImagesStatus !== 'disabled' ? `![](${n})` : n)
    // render IPFS images
      .replace(/(\[\S+)|(\(\S+)|(?:https?:\/\/(?:ipfs\.io\/ipfs\/[a-zA-Z0-9=+-?]+))/gi, n => checkForValidImage(n) && JSON.parse(localStorage.getItem('customUserData'))?.settings?.showImagesStatus !== 'disabled' ? `![](${n})` : n)
      // hide watch video on dbuzz
      .replace(/\[WATCH THIS VIDEO ON DBUZZ]\(.+\)/gi, '')

    return <ReactMarkdown
      key={`${new Date().getTime()}${scrollIndex}${Math.random()}`}
      skipHtml={true}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      children={content}
      className={classNames(markdownClass, assetClass, classes.inputArea)}
    />
  }

}

const Renderer = React.memo((props) => {
  const classes = useStyles()
  const {
    minifyAssets = true,
    scrollIndex = -1,
    recomputeRowIndex = () => {},
    loader = true,
  } = props
  let { content = '' } = props
  const original = content

  const extracted = markdownLinkExtractor(content)

  extracted.forEach((item) => {
    const link = item.replace(/\(/g, '%28').replace(/\)/g, '%29')
    content = content.replace(item, link)
  })

  const links = textParser.getUrls(content)

  const loadImages = () => {
    const imagesRegex = /(?:(?:https:\/\/ipfs\.io\/ipfs\/[a-zA-Z0-9]+)|(?:https?:\/\/([\w_-]+(?:(?:\.[\w_-])+))+([a-zA-Z]*[a-zA-Z]){1}?(\/+[\w.,@?^=%&:/~+#-]*)*\.(?:png|jpg|gif|jpeg|bmp)))/gi
    if(content.match(imagesRegex)){
      content.match(imagesRegex).forEach(image => {
        const imageClass = image
        const imageEl = document.querySelector(`img[src$="${imageClass}"]`)
        if(imageEl && loader){
          imageEl.style.height = '300px'
          imageEl.style.opacity = '0.5'
          imageEl.onload = () => {
            imageEl.style.background = 'none'
            imageEl.style.animation = 'none'
            imageEl.style.opacity = '1'
            imageEl.style.height = 'inherit'
          }
          imageEl.onerror = () => {
            imageEl.src = `${window.location.origin}/noimage.jpg`
            imageEl.style.animation = 'none'
            imageEl.style.opacity = '1'
          }
        } else {
          if(imageEl) {
            imageEl.style.background = 'none'
            imageEl.style.animation = 'none'
            imageEl.style.opacity = '1'
            imageEl.style.height = 'inherit'
            imageEl.style.border = 'none'
            imageEl.style.pointerEvents = 'none'
          }
        }
      })
    }
  }

  useEffect(() => {
    loadImages()
    // eslint-disable-next-line
  }, [content])

  if(JSON.parse(localStorage.getItem('customUserData'))?.settings?.videoEmbedsStatus !== 'disabled') {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        link = link.replace(/\(/g, '%28').replace(/\)/g, '%29')
        if(link.includes('youtube.com') ||link.includes('youtu.be')) {
          content = prepareYoutubeEmbeds(content)
        } else if(link.includes('twitter.com')) {
          content = prepareTwitterEmbeds(content)
        } else if(link.includes('3speak.co') || link.includes('3speak.online') || link.includes('3speak.tv')) {
          content = prepareThreeSpeakEmbeds(content)
        } else if(link.includes('www.vimm.tv')) {
          content = prepareVimmEmbeds(content)
        } else if(link.includes('rumble.com')) {
          content = prepareRumbleEmbed(content)
        } else if(link.includes('lbry.tv') || link.includes('open.lbry.com')) {
          content = prepareLbryEmbeds(content)
        } else if(link.includes('www.bitchute.com')) {
          content = prepareBitchuteEmbeds(content)
        } else if(link.includes('banned.video')) {
          content = prepareBannedEmbeds(content)
        } else if(link.includes('dollarvigilante.tv')) {
          content = prepareDollarVigilanteEmbeds(content)
        } else if(link.includes('dapplr.in')) {
          content = prepareDapplrEmbeds(content)
        } else if(link.includes('freeworldnews.tv')) {
          content = prepareFreeWorldNewsEmbeds(content)
        } else if(link.includes('soundcloud.com')) {
          content = prepareSoundCloudEmbeds(content)
        } else if(link.includes('facebook.com')) {
          content = prepareFacebookEmbeds(content)
        } else if(link.includes('tiktok.com')) {
          content = prepareTiktokEmbeds(content)
        } else if(link.includes('odysee.com')) {
          content = prepareOdyseeEmbeds(content)
        } else if(link.includes('music.apple.com')) {
          content = prepareAppleEmbeds(content)
        } else if (link.includes('d.tube')) {
          content = prepareDTubeEmbeds(content)
        } else if (link.includes('dbuzz_video')) {
          content = prepareDBuzzVideos(content)
        }
      } catch(error) { }
    })
  }

  let assetClass = classes.minified

  if(!minifyAssets) {
    assetClass = classes.full
  }


  let splitContent = content.split(`~~~~~~.^.~~~`)

  splitContent = splitContent.filter((item) => item !== '')

  return (
    <React.Fragment>
      {splitContent.map((item) => (
        render(item, classes.markdown, assetClass, scrollIndex, recomputeRowIndex, classes)
      ))}
      <LinkPreview content={original} scrollIndex={scrollIndex} recomputeRowIndex={recomputeRowIndex} />
    </React.Fragment>
  )
})

export default Renderer