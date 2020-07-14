import React from 'react'
import { DefaultRenderer } from "steem-content-renderer"
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
      color: '#d32f2f',
    }
  }
})


const MarkdownViewer = (props) => {
  const classes = useStyles()
  const { content } = props  
  const safeHtmlStr = renderer.render(content)

  return (
    <React.Fragment>
      <div
        className={classes.markdown}
        dangerouslySetInnerHTML={{ __html: safeHtmlStr || '' }} 
      />
    </React.Fragment>
  )
}

export default MarkdownViewer