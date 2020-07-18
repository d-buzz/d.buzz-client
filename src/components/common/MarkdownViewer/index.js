import React from 'react'
import DefaultRenderer from "hive-content-renderer"
import markdownLinkExtractor from 'markdown-link-extractor'
import { PreviewLastLink } from 'components'
import { createUseStyles } from 'react-jss'

const renderer = new DefaultRenderer({
  baseUrl: "https://d.buzz/",
  breaks: true,
  skipSanitization: false,
  allowInsecureScriptTags: false,
  addNofollowToLinks: true,
  doNotShowImages: false,
  ipfsPrefix: "",
  assetsWidth: 640,
  assetsHeight: 480,
  imageProxyFn: (url) => url,
  usertagUrlFn: (account) => "/@" + account,
  hashtagUrlFn: (hashtag) => "/trending/" + hashtag,
  isLinkSafeFn: (url) => true,
})

const useStyles = createUseStyles({
  markdown: {
    '& iframe': {
      height: 300,
      width: '95%',
    },
    '& img': {
      height: 300,
      width: '95%',
      objectFit: 'cover',
      marginTop: 5,
      border: '1px solid #ccd6dd',
    },
    '& a': {
      wordWrap: 'break-word',
      color: '#d32f2f !important',
    },
    '& p': {
      fontSize: 15,
    }
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
      '&:hover': {
        textDecoration: 'none !important',
      },
    }
  },
})

// prepare images that are currently not supported on hive-content-renderer
const prepareImages = (content) => {
  let body = content
  const links = markdownLinkExtractor(content)

  links.forEach((link) => {
    if((link.includes('images.hive.blog') && link.includes('.webp'))) {
      body = body.replace(link, `![](${link})`)
    } else if (link.includes('dapplr-images') && !link.includes('images.hive.blog')) {
      body = body.replace(link, `![](https://images.hive.blog/0x0/${link})`)
    }
  })

  return body
}

const MarkdownViewer = (props) => {
  const classes = useStyles()
  let { content = '' } = props
  const original = content
  content = prepareImages(content)
  content = renderer.render(content)

  return (
    <React.Fragment>
      <div
        className={classes.markdown}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
      <PreviewLastLink className={classes.preview} content={original} />
    </React.Fragment>
  )
}

export default MarkdownViewer