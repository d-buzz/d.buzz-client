import classNames from 'classnames'
import React from 'react'
import { createUseStyles } from 'react-jss'
import sanitizeHtml from 'sanitize-html'

const useStyles = createUseStyles(theme => ({
  rendererWrapper: {
    whiteSpace: 'pre-line',
    overflowWrap: 'break-word',
    lineHeight: 1,
  },
  textNode: {
    margin: '0 !important',
    lineHeight: 2.5,
    fontSize: '14px !important',
  },
}))

const createReactElement = (node, skipTags) => {
  if (node.nodeType === Node.TEXT_NODE) {
    const textWithLimitedLineBreaks = node.textContent.replace(/(\r\n|\r|\n){3,}/g, '\n\n')
    return textWithLimitedLineBreaks
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const tagName = node.tagName.toLowerCase();
    if (skipTags.includes(tagName)) {
      return null
    }

  const isSelfClosing = ['br', 'img', 'input', 'hr', 'meta', 'link'].includes(tagName)
  const attributes = Array.from(node.attributes).reduce((acc, attr) => {
    const propName = attr.name === 'class' ? 'className' : attr.name
    acc[propName] = attr.value
    return acc
  }, {})

  const children = isSelfClosing
    ? []
    : Array.from(node.childNodes).map(childNode => createReactElement(childNode, skipTags))

    return React.createElement(tagName, attributes, ...children)
  }

  return null
}

const BuzzRenderer = ({ content, skipTags = [], className }) => {
  const classes = useStyles()
  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['span']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      span: ['class', 'id'],
    },
  });
  const parser = new DOMParser()
  const document = parser.parseFromString(sanitizedContent.trim(), 'text/html')
  const body = document.body

  const elements = Array.from(body.childNodes)
    .map(childNode => createReactElement(childNode, skipTags, classes))
    .filter(el => el)

  return <span className={classNames(className, classes.rendererWrapper)}>{elements}</span>
}

export default BuzzRenderer