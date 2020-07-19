import React from 'react'
import { ReactTinyLink } from 'react-tiny-link'
import markdownLinkExtractor from 'markdown-link-extractor'

const PreviewLastLink = ({ className, content }) => {

  const links  = markdownLinkExtractor(content)
  let isValidUrl = false
  let url = ''

  if(links.length !== 0) {
    for(let index = links.length; index > 0 ; index--) {
      const link = links[index-1]
      if(!link.includes('images.hive.blog')
          && !link.includes('youtu.be')
          && !link.includes('files.peakd')
          && !link.includes('youtube.com/watch?v=')
          && !link.includes('app.dapplr.in')
          && !link.match(/\.(jpeg|jpg|gif|png|pdf|JPG)$/)) {
        url = link
        isValidUrl = true
        break;
      }
    }
  }

  return (
    <React.Fragment>
      {
        isValidUrl ? (
          <div className={className}>
            <ReactTinyLink
              proxyUrl="http://167.71.204.127:8080"
              width="95%"
              borderRadius="50px 50px"
              cardSize="small"
              showGraphic={true}
              maxLine={2}
              minLine={1}
              url={url}
            />
          </div>
        ) : ''
      }
    </React.Fragment>
  )
}

export default PreviewLastLink
