import React from 'react'
import { DefaultRenderer } from 'steem-content-renderer'
import markdownLinkExtractor from 'markdown-link-extractor'
import textParser from 'npm-text-parser'
import classNames from 'classnames'
import { UrlVideoEmbed, LinkPreview } from 'components'
import { createUseStyles } from 'react-jss'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import { TweetSkeleton } from 'components'

const renderer = new DefaultRenderer({
  baseUrl: "https://d.buzz/",
  breaks: true,
  skipSanitization: false,
  allowInsecureScriptTags: false,
  addNofollowToLinks: true,
  doNotShowImages: false,
  ipfsPrefix: "https://images.hive.blog/0x0/",
  assetsWidth: 640,
  assetsHeight: 480,
  imageProxyFn: (url) => `https://images.hive.blog/0x0/${url}`,
  usertagUrlFn: (account) => "/@" + account,
  hashtagUrlFn: (hashtag) => `/tags?q=${hashtag}`,
  isLinkSafeFn: (url) => url.match(/^\//g),
})

const useStyles = createUseStyles(theme => ({
  markdown: {
    wordBreak: 'break-word !important',
    ...theme.markdown.paragraph,
    '& a': {
      wordWrap: 'break-word',
      color: '#d32f2f !important',
    },
    '& p': {
      wordWrap: 'break-word',
      fontSize: 14,
    },
    fontSize: '14 !important',
    '& blockquote': {
      padding: '10px 12px',
      margin: '0 0 20px',
      fontSize: 13,
      borderLeft: '5px solid #eee',
    },
  },
  preview: {
    marginBottom: 10,
  },
  minified: {
    '& img': {
      height: 300,
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
}))

const urlRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/i

const prepareTwitterEmbeds = (content) => {
  let body = content
  const mainTwitterRegex = /(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))/i
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
          id = match[2]
          if(link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*)?=(.*))))/i)) {
            match = link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*)?=(.*))))/i)
            id = match[2]
            id = id.slice(0, -2)
          }
          body = body.replace(link, `~~~~~~.^.~~~:twitter:${id}:~~~~~~.^.~~~`)
        }

        if(match) {
          const id = match[2]
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

const prepareFacebookEmbeds = (content) => {
  const facebookRegex = /(?:https?:\/\/(?:(?:www\.facebook\.com\/(.*?))))/i
  const facebookRegexEmbeds = /(?<=src=").*?(?=[.?"])/i
  let body = content

  const links = textParser.getUrls(content)

  const matchData = content.match(facebookRegexEmbeds)
  
  if (matchData) {
    const input = matchData['input'].split('src=')[1].split(/[ >]/)[0]
    const url = input.replace(/['"]+/g, '')
    body = body.replace(body, `~~~~~~.^.~~~:facebook:${url}:${'embed'}:~~~~~~.^.~~~`)
  } else {
    links.forEach((link) => {
      try {
        link = link.replace(/&amp;/g, '&')
        let match = ''
        let id = ''
        let id1 = ''
        if(link.match(facebookRegex)){
          match = link.match(facebookRegex)
          const input = match['input']
          const data = input.split('/')
          id = data[3]
          id1 = data[5]
        }

        if(match){
          body = body.replace(link, `~~~~~~.^.~~~:facebook:${id}:${id1}:~~~~~~.^.~~~`)
        }
      } catch(error) { }
    })
  }
  return body
}

const render = (content, markdownClass, assetClass, scrollIndex, recomputeRowIndex) => {

  if(content.includes(':twitter:')) {
    const splitTwitter = content.split(':')
    return <TwitterTweetEmbed key={`${splitTwitter[2]}${scrollIndex}tweet`} tweetId={splitTwitter[2]} onLoad={() => recomputeRowIndex(scrollIndex)} placeholder={<TweetSkeleton />}/>
  } else if(content.includes(':threespeak:')) {
    const splitThreeSpeak = content.split(':')
    const url = `https://3speak.co/embed?v=${splitThreeSpeak[2]}`
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
  } else if (content.includes(':facebook:')) {
    const splitFacebook = content.split(':')
    const url = splitFacebook[4] ? `https:${splitFacebook[3]}` : `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F${splitFacebook[2]}%2Fvideos%2F${splitFacebook[3]}&width=500&show_text=false&height=300`
    return <UrlVideoEmbed key={`${url}${scrollIndex}facebook`} url={url} />
  } else if(content.match(urlRegex)) {
    let body = content
    const matchData = content.match(urlRegex)
    
    if (matchData) {
      const url = `${matchData['input']}`.replace("(", "%28").replace(")", "%29")
      body = body.replace(body, url)
    }
    
    return <div
      key={`${new Date().getTime()}${scrollIndex}${Math.random()}`}
      className={classNames(markdownClass, assetClass)}
      dangerouslySetInnerHTML={{ __html: renderer.render(body) }}
    />
  } else {
    // render normally
    return <div
      key={`${new Date().getTime()}${scrollIndex}${Math.random()}`}
      className={classNames(markdownClass, assetClass)}
      dangerouslySetInnerHTML={{ __html: renderer.render(content) }}
    />
  }

}

const MarkdownViewer = React.memo((props) => {
  const classes = useStyles()
  const {
    minifyAssets = true,
    scrollIndex = -1,
    recomputeRowIndex = () => {},
  } = props
  let { content = '' } = props
  const original = content
  // content = prepareImages(content)

  // const links = markdownLinkExtractor(content)
  const links = textParser.getUrls(content)

  links.forEach((link) => {
    try {
      link = link.replace(/&amp;/g, '&')

      if(link.includes('twitter.com')) {
        content = prepareTwitterEmbeds(content)
      } else if(link.includes('3speak.co') || link.includes('3speak.online')) {
        content = prepareThreeSpeakEmbeds(content)
      } else if(link.includes('www.vimm.tv')) {
        content = prepareVimmEmbeds(content)
      } else if(link.includes('rumble.com')) {
        content = prepareRumbleEmbed(content)
      } else if(link.includes('lbry.tv') || link.includes('open.lbry.com')) {
        content = prepareLbryEmbeds(content)
      } else if(link.includes('www.bitchute.com')) {
        content = prepareBitchuteEmbeds(content)
      } else if(link.includes('www.facebook.com')) {
        content = prepareFacebookEmbeds(content)
      }
    } catch(error) { }
  })

  let assetClass = classes.minified

  if(!minifyAssets) {
    assetClass = classes.full
  }


  let splitContent = content.split(`~~~~~~.^.~~~`)

  splitContent = splitContent.filter((item) => item !== '')


  return (
    <React.Fragment>
      {splitContent.map((item) => (
        render(item, classes.markdown, assetClass, scrollIndex, recomputeRowIndex)
      ))}
      <LinkPreview content={original} scrollIndex={scrollIndex} recomputeRowIndex={recomputeRowIndex} />
    </React.Fragment>
  )
})

export default MarkdownViewer
