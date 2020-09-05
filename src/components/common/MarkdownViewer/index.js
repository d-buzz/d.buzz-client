import React from 'react'
import { DefaultRenderer } from 'steem-content-renderer'
import markdownLinkExtractor from 'markdown-link-extractor'
import classNames from 'classnames'
import { PreviewLastLink, UrlVideoEmbed } from 'components'
import { createUseStyles } from 'react-jss'
import { TwitterTweetEmbed } from 'react-twitter-embed'

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
  isLinkSafeFn: (url) => true,
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
  },
  preview: {
    paddingBottom: 5,
    '&.react_tinylink_card_content_wrapper': {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
      },
    },
    '& a': {
      borderRadius: '10px 10px',
      border: theme.border.primary,
      boxShadow: 'none',
      backgroundColor: `${theme.background.primary} !important`,
      '& p': {
        ...theme.markdown.paragraph,
      },
      '&:hover': {
        textDecoration: 'none !important',
        ...theme.markdown.paragraph,
      },
    },
  },
  minified: {
    '& iframe': {
      height: 300,
      width: '100%',
      border: theme.border.primary,
    },
    '& img': {
      height: 300,
      width: '100%',
      objectFit: 'cover',
      marginTop: 5,
      border: theme.border.primary,
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

const prepareTwitterEmbeds = (content) => {
  let body = content

  const links = markdownLinkExtractor(content)

  links.forEach((link) => {
    try {
      link = link.replace(/&amp;/g, '&')
      const match = link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))/i)

      if(match) {
        const id = match[2]
        body = body.replace(link, `~~~~~~.^.~~~:twitter:${id}:~~~~~~.^.~~~`)
      }
    } catch(e) { }
  })
  return body
}

const prepareThreeSpeakEmbeds = (content) => {
  let body = content 

  const links = markdownLinkExtractor(content)

  links.forEach((link) => {
    try {
      link = link.replace(/&amp;/g, '&')
      const match = link.match(/(?:https?:\/\/(?:(?:3speak\.online\/watch\?v=(.*))))?/i) 
      console.log({match})

      if(match) {
        const id = match[1]
        body = body.replace(link, `~~~~~~.^.~~~:threespeak:${id}:~~~~~~.^.~~~`)
        console.log({body})
      }
    } catch(error) {
      console.log(error)
    }
  })
  return body
}


const render = (content, style, markdownClass, assetClass) => {

  if(content.includes(':twitter:')) {
    const splitTwitter = content.split(':')
    return <TwitterTweetEmbed tweetId={splitTwitter[2]} />
  } else if(content.includes(':threespeak:')) {
    const splitThreeSpeak = content.split(':')
    const url = `https://3speak.online/embed?v=${splitThreeSpeak[2]}`
    return <UrlVideoEmbed url={url} />
  } else {
    // render normally
    return <div
      style={style}
      className={classNames(markdownClass, assetClass)}
      dangerouslySetInnerHTML={{ __html: renderer.render(content) }}
    />
  }

}

const MarkdownViewer = (props) => {
  const classes = useStyles()
  const {  minifyAssets = true, onModal = false  } = props
  let { content = '' } = props
  const original = content
  // content = prepareImages(content)
  
  const links = markdownLinkExtractor(content)
  
  links.forEach((link) => {
    try {
      link = link.replace(/&amp;/g, '&')

      if(link.includes('twitter.com')) {
        content = prepareTwitterEmbeds(content)
      } else if(link.includes('3speak.online')) {
        content = prepareThreeSpeakEmbeds(content)
      }
      
    } catch(error) {
      console.log(error)
    }
  })

  let assetClass = classes.minified
  let style = {}

  if(!minifyAssets) {
    assetClass = classes.full
  }

  if(onModal) {
    style = { width: 520 }
  }
  
  let splitContent = content.split(`~~~~~~.^.~~~`)
  console.log({splitContent})

  splitContent = splitContent.filter((item) => item !== '')


  return (
    <React.Fragment>
      {splitContent.map((item) => (
        render(item, style, classes.markdown, assetClass)
      ))}
      <PreviewLastLink className={classes.preview} content={original} />
    </React.Fragment>
  )
}

export default MarkdownViewer
