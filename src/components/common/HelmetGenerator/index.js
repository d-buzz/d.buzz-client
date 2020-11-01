import React, { useState, useEffect } from 'react'
import stripHtml from 'string-strip-html'
import { Helmet } from 'react-helmet'
import { checkIfImage } from 'services/api'
import removeMd from 'remove-markdown'
import markdownLinkExtractor from 'markdown-link-extractor'

const HelmetGenerator = (props) => {
  const {content, user, page = 'content'} = props
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [image, setImage] = useState()
  const url = window.location.href

  useEffect(() => {
    if(content && `${content}`.trim() !== '' && page === 'content') {
      const generateMeta = async () => {

        const stripContent = stripHtml(removeMd(content))
        let title = stripContent
        let description = stripContent
        const links = markdownLinkExtractor(content)

        if(`${title}`.length > 80) {
          title = `${title.substr(0, 80)} ...`
        }

        title = `${title} | D.Buzz`

        if(description > 120) {
          description = `${description.substr(0, 120)} ...`
        }

        description = `${description} | by ${user}`
        const avatarLink = `https://images.hive.blog/u/${user}/avatar/large`

        setTitle(title)
        setDescription(description)

        if(links.length !== 0) {
          const result = await checkIfImage(links)
          const { hasImage, imageUrl } = result
          if(hasImage) {
            setImage(`https://images.hive.blog/0x0/${imageUrl}`)
          } else {
            setImage(avatarLink)
          }
        } else {
          setImage(avatarLink)
        }
      }

      generateMeta()

    } else {
      setTitle(page)
    }
    // eslint-disable-next-line
  }, [content])

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
        {page === 'content' && (
          <React.Fragment>
            <meta property="description" content={description} />
            <meta property="image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:og:image" content={image} />
            <meta property="title" content={title} />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content="D.Buzz | Micro-blogging for HIVE" />
            <meta property="twitter:image" content="https://d.buzzd/buzz.svg" />
          </React.Fragment>
        )}
      </Helmet>
    </React.Fragment>
  )
}

export default HelmetGenerator
