import React from 'react'
import { DefaultRenderer } from 'steem-content-renderer'
import markdownLinkExtractor from 'markdown-link-extractor'
import classNames from 'classnames'
import { UrlVideoEmbed, LinkPreview } from 'components'
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

const prepareTwitterEmbeds = (content) => {
  let body = content

  const links = markdownLinkExtractor(content)

  links.forEach((link) => {
    try {
      link = link.replace(/&amp;/g, '&')
      let match = ''
      let id = ''

      if(link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))/i)) {
        match = link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))/i)
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
      } else {
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


const render = (content, markdownClass, assetClass, scrollIndex, recomputeRowIndex) => {

  if(content.includes(':twitter:')) {
    const splitTwitter = content.split(':')
    return <TwitterTweetEmbed tweetId={splitTwitter[2]} onLoad={() => recomputeRowIndex(scrollIndex)} />
  } else if(content.includes(':threespeak:')) {
    const splitThreeSpeak = content.split(':')
    const url = `https://3speak.co/embed?v=${splitThreeSpeak[2]}`
    return <UrlVideoEmbed url={url} />
  } else {
    // render normally
    return <div
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

  const links = markdownLinkExtractor(content)

  links.forEach((link) => {
    try {
      link = link.replace(/&amp;/g, '&')

      if(link.includes('twitter.com')) {
        content = prepareTwitterEmbeds(content)
      } else if(link.includes('3speak.co') || link.includes('3speak.online')) {
        content = prepareThreeSpeakEmbeds(content)
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
