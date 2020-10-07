import React, { useState, useEffect } from 'react'
import stripHtml from 'string-strip-html'
import { Helmet } from 'react-helmet'
import { checkIfImage } from 'services/api'
import removeMd from 'remove-markdown'
import markdownLinkExtractor from 'markdown-link-extractor'

const HelmetGenerator = (props) => {
  const { content, user } = props
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [isLoaded, setIsLoaded] = useState(false)
  const [image, setImage] = useState()

  useEffect(() => {
    if(content && `${content}`.trim() !== '') {

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

    }
    // eslint-disable-next-line
  }, [content])

  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:og:image" content={image} />
      </Helmet>
    </React.Fragment>
  )
}

export default HelmetGenerator
