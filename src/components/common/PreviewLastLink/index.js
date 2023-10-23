import React from 'react'
import { ReactTinyLink } from 'react-tiny-link'
import { parseUrls } from 'services/helper'

const PreviewLastLink = ({ className, content }) => {

  const links  = parseUrls(content)
  let isValidUrl = false
  let url = ''

  if(links.length !== 0) {
    for(let index = links.length; index > 0 ; index--) {
      const link = links[index-1]
      if(!link.includes('images.hive.blog')
          && !link.includes('youtu.be')
          && !link.includes('files.peakd')
          && !link.includes('youtube.com/watch?v=')
          && !link.includes('3speak.co/watch?v')
          && !link.includes('3speak.online/watch?v')
          && !link.includes('app.dapplr.in')
          && !link.includes('pbs.twimg.com')
          && !link.includes('ipfs.io')
          && link.match( /^[https][http]/)
          && !link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*))))/i)
          && !link.match(/(?:https?:\/\/(?:(?:twitter\.com\/(.*?)\/status\/(.*)?=(.*))))/i)
          && link.match(/(?:https?:\/\/(?:(?:3speak\.co\/watch\?v=(.*))))?/i)
          && !link.match(/\.(jpeg|jpg|gif|png|pdf|JPG)$/)) {
        url = link
        isValidUrl = true
        break
      }
    }
  }

  const onClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    window.open(url)
  }

  return (
    <React.Fragment>
      {isValidUrl ? (
        <div className={className} onClick={onClick}>
          <ReactTinyLink
            proxyUrl="http://167.71.204.127:8080"
            width="100%"
            borderRadius="50px 50px"
            cardSize="small"
            showGraphic={true}
            maxLine={2}
            minLine={1}
            url={url}
          />
        </div>
      ) : ''}
    </React.Fragment>
  )
}

export default PreviewLastLink
