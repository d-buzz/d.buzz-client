import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import removeMd from 'remove-markdown'
import { parseUrls, stripHtml } from 'services/helper'

const HelmetGenerator = (props) => {
  const {content, user, page = 'content'} = props
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const url = window.location.href

  useEffect(() => {
    if(content && `${content}`.trim() !== '' && page === 'content') {
      const generateMeta = async () => {

        const stripContent = stripHtml(removeMd(content))
        let title = stripContent
        let description = stripContent

        if(`${title}`.length > 80) {
          title = `${title.substr(0, 80)} ...`
        }

        title = `${title} | D.Buzz`

        if(description > 120) {
          description = `${description.substr(0, 120)} ...`
        }

        description = `${description} | by ${user}`

        setTitle(title)
        setDescription(description)

        window.prerenderReady = true
      }

      generateMeta()

    } else {
      setTitle(page)
      window.prerenderReady = true
    }
    // eslint-disable-next-line
  }, [content])

  return (
    <React.Fragment>
      {page === 'content' && (
        <Helmet>
          <title>{title}</title>
          <meta property="description" content={description} />
          <meta property="image" content="https://d.buzz/dbuzz.svg" />
          <meta property="image:width" content="1200" />
          <meta property="image:height" content="628" />
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content="https://d.buzz/dbuzz.svg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="628" />
          <meta property="title" content={title} />
          <meta property="twitter:url" content={url} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
          <meta property="twitter:image" content="https://d.buzz/dbuzz.svg" />
          <meta property="twitter:image:width" content="1200" />
          <meta property="twitter:image:height" content="628" />
        </Helmet>
      )}
      {page !== 'content' && (
        <Helmet>
          <title>{title}</title>
          <meta property="og:url" content={url} />
          <meta property="og:title" content={title} />
          <meta property="title" content={title} />
          <meta property="twitter:title" content={title} />
        </Helmet>
      )}
    </React.Fragment>
  )
}

export default HelmetGenerator
