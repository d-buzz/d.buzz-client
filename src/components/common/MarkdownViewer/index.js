import React from 'react'
import { DefaultRenderer } from 'steem-content-renderer'
import markdownLinkExtractor from 'markdown-link-extractor'
import classNames from 'classnames'
import { PreviewLastLink } from 'components'
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

const useStyles = createUseStyles({
  markdown: {
    wordBreak: 'break-word !important',
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
      boxShadow: 'none',
      color: 'black !important',
      '&:hover': {
        textDecoration: 'none !important',
        color: 'black',
      },
    },
  },
  minified: {
    '& iframe': {
      height: 300,
      width: '100%',
      border: '1px solid #ccd6dd',
    },
    '& img': {
      height: 300,
      width: '100%',
      objectFit: 'cover',
      marginTop: 5,
      border: '1px solid #ccd6dd',
    },
  },
  full: {
    '& iframe': {
      width: '100%',
      border: '1px solid #ccd6dd',
    },
    '& img': {
      width: '100%',
      marginTop: 5,
      border: '1px solid #ccd6dd',
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
})

// prepare images that are currently not supported on hive-content-renderer
// const prepareImages = (content) => {
//   let body = content

//   body = body.replace(/(!\[Uploading image)/g, '![](https://images.hive.blog/640x0/)')
//   const links = markdownLinkExtractor(content)

//   links.forEach((link) => {
//     try {
//       link = link.replace(/&amp;/g, '&')

//       if(link !== '') {

//         if((link.includes('images.hive.blog') && link.includes('.webp'))) {
//           body = body.replace(link, `![](${link})`)
//         } else if (
//           (
//             link.includes('dapplr-images')
//             || (link.includes('//') && `${link}`.substring(0, 2) === '//')
//           ) && (!link.includes('images.hive.blog') && !link.includes('facebook.com'))
//         ) {
//           body = body.replace(link, `![](https://images.hive.blog/0x0/${link})`)
//         } else if((link.includes('pbs.twimg.com') && link.includes('format=jpg'))) {
//           body = body.replace(`![](${link})`, `![](https://images.hive.blog/0x0/${link})`)
//         }
//       }
//     } catch(e) { }
//   })
//   return body
// }

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

const render = (content, style, markdownClass, assetClass) => {

  if(content.includes(':twitter:')) {
    const splitTwitter = content.split(':')
    return <TwitterTweetEmbed tweetId={splitTwitter[2]} />
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
  content = prepareTwitterEmbeds(content)

  let assetClass = classes.minified
  let style = {}

  if(!minifyAssets) {
    assetClass = classes.full
  }

  if(onModal) {
    style = { width: 520 }
  }

  let splitContent = content.split(`~~~~~~.^.~~~`)

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
