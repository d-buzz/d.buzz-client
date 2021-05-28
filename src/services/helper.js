import { useState, useEffect } from 'react'
import uuid from 'uuid-random'
import { encrypt, decrypt } from 'caesar-shift'
import CryptoJS  from 'crypto-js'
import sha256 from 'crypto-js/sha256'
import diff_match_patch from 'diff-match-patch'
import stripHtml from 'string-strip-html'
import textParser from 'npm-text-parser'

const dmp = new diff_match_patch()

export const anchorTop = () => {
  window.scrollTo(0, 0)
}

export const createPatch = (text1, text2) => {
  if (!text1 && text1 === '') return undefined
  const patches = dmp.patch_make(text1, text2)
  const patch = dmp.patch_toText(patches)
  return patch
}

export const getAuthorName = (profileMeta, postingMeta) => {
  const meta = JSON.parse(profileMeta)
  const posting = JSON.parse(postingMeta)

  try {
    return meta.profile.name
  } catch(e) {
    return posting.profile.name
  }
}

export const getProfileMetaData = (profile = {}) => {
  let cover = ''
  let name = ''
  let about = ''
  let website = ''
  if(
    'json_metadata' in profile
    && profile.json_metadata.includes('"profile":')
    && profile.json_metadata.includes('"cover_image":')
  ) {
    const meta = JSON.parse(profile.json_metadata)
    cover = meta.profile.cover_image
  }

  if(
    'posting_json_metadata' in profile
    && profile.posting_json_metadata.includes('"profile":')
    && profile.posting_json_metadata.includes('"cover_image":')
  ) {
    const meta = JSON.parse(profile.posting_json_metadata)
    cover = meta.profile.cover_image
  }

  if(
    'json_metadata' in profile
    && profile.json_metadata.includes('"profile":')
    && profile.json_metadata.includes('"name":')
  ) {
    const meta = JSON.parse(profile.json_metadata)
    name = meta.profile.name
  }

  if(
    'posting_json_metadata' in profile
    && profile.posting_json_metadata.includes('"profile":')
    && profile.posting_json_metadata.includes('"name":')
  ) {
    const meta = JSON.parse(profile.posting_json_metadata)
    name = meta.profile.name
  }

  if(
    'json_metadata' in profile
    && profile.json_metadata.includes('"profile":')
    && profile.json_metadata.includes('"about":')
  ) {
    const meta = JSON.parse(profile.json_metadata)
    about = meta.profile.about
  }

  if(
    'posting_json_metadata' in profile
    && profile.posting_json_metadata.includes('"profile":')
    && profile.posting_json_metadata.includes('"about":')
  ) {
    const meta = JSON.parse(profile.posting_json_metadata)
    about = meta.profile.about
  }

  if(
    'json_metadata' in profile
    && profile.json_metadata.includes('"profile":')
    && profile.json_metadata.includes('"website":')
  ) {
    const meta = JSON.parse(profile.json_metadata)
    website = meta.profile.website
  }

  if(
    'posting_json_metadata' in profile
    && profile.posting_json_metadata.includes('"website":')
  ) {
    const meta = JSON.parse(profile.posting_json_metadata)
    website = meta.profile.website
  }

  return {
    cover,
    name,
    about,
    website,
  }
}

export const calculatePayout = (data) => {

  const {
    pending_payout_value,
    total_payout_value,
    curator_payout_value,
    is_paidout = null,
  } = data

  let payout = 0

  if(is_paidout) {
    payout = parseFloat(`${pending_payout_value}`.replace('HBD'))
  } else {
    payout = parseFloat(`${total_payout_value}`.replace('HBD')) + parseFloat(`${curator_payout_value}`.replace('HBD')) + parseFloat(`${pending_payout_value}`.replace('HBD'))
  }

  payout = payout.toFixed(2)

  if(payout === 0) {
    payout = '0.00'
  }

  return payout
}

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window
  return { width, height }
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export function hasCompatibleKeychain() {
  return (
    window.hive_keychain &&
    window.hive_keychain.requestSignBuffer &&
    window.hive_keychain.requestBroadcast &&
    window.hive_keychain.requestSignedCall
  )
}

const randomizer = (min, max) => {
  return Math.random() * (max - min) + min
}

const keygen = (index) => {
  let key = 5 + index
  if(key > 28) {
    key = key - 5
  }

  key = Math.ceil(key)

  return key
}

export const readSession = (session) => {
  const { id, token } = session
  const idkey = `${id}x0`

  let sessionDec = CryptoJS.AES.decrypt(token, idkey)
  sessionDec = JSON.parse(sessionDec.toString(CryptoJS.enc.Utf8))

  const { index, uid, data } = sessionDec
  const uuid = decrypt(index, uid)
  const hash = sha256(uuid).toString()

  let dataDec = CryptoJS.AES.decrypt(data, hash)
  dataDec = JSON.parse(dataDec.toString(CryptoJS.enc.Utf8))

  return dataDec
}

export const generateSession = (obj) => {
  const date = new Date()
  const lowerlimit = randomizer(1, 12)
  const upperlimit = randomizer(13, 26)
  const index = randomizer(upperlimit, lowerlimit)

  const uid = uuid()
  const key = keygen(index)

  const caesar = encrypt(key, uid)
  const hash = sha256(uid).toString()

  const data = CryptoJS.AES.encrypt(JSON.stringify(obj), hash).toString()
  const id = Math.ceil(date.getTime())

  let token = {
    index: key,
    uid: caesar,
    data,
  }

  token = CryptoJS.AES.encrypt(JSON.stringify(token), `${id}x0`).toString()
  return { id, token }
}

export const invokeTwitterIntent = (content) => {
  const width = 500
  const height = 600
  let body = content
  if(body.length < 274) {
    body += ' #HIVE'
  }
  body = encodeURIComponent(stripHtml(body))
  window.open(`https://twitter.com/intent/tweet?text=${body}` , 'newwindow', 'width=' + width + ', height=' + height + ', top=' + ((window.innerHeight - height) / 2) + ', left=' + ((window.innerWidth - width) / 2))
}

export const sendToBerries = (author, theme) => {
  const { mode } = theme
  let color = ''
  if (mode === 'gray') {
    color = '-g'
  } else if (mode === 'night') {
    color = '-n'
  }
  window.open(`https://buymeberri.es/!dbuzz${color}/@${author}`, '_blank')
}

export const truncateBody = (body) => {
  const bodyLength = `${stripHtml(body)}`.length

  if(bodyLength > 280) {
    body = stripHtml(body)
    body = `${body}`.substr(0, 280)
    body = `${body} . . .`
  }

  return body
}


export const errorMessageComposer = (type = null, errorCode = 0) => {
  let errorMessage = 'Transaction broadcast failure for unknown reason, please contact the administrator'

  const prefixes = [
    {
      type: 'post',
      prefix: 'Post creation failed',
    },
    {
      type: 'upvote',
      prefix: 'Upvote transaction failed',
    },
    {
      type: 'reply',
      prefix: 'Reply transaction failed',
    },
    {
      type: 'mute',
      prefix: 'Mute transaction failed',
    },
    {
      type: 'unmute',
      prefix: 'Unmute transaction failed',
    },
    {
      type: 'follow_muted',
      prefix: 'Follow muted list transaction failed',
    },
    {
      type: 'unfollow_muted',
      prefix: 'Unfollow muted list transaction failed',
    },
    {
      type: 'blacklist',
      prefix: 'Blacklist transaction failed',
    },
    {
      type: 'unblacklist',
      prefix: 'Unblacklist transaction failed',
    },
    {
      type: 'follow_blacklist',
      prefix: 'Follow blacklists transaction failed',
    },
    {
      type: 'unfollow_blacklist',
      prefix: 'Unfollow blacklists transaction failed',
    },
    {
      type: 'update_profile',
      prefix: 'Update profile transaction failed',
    },
  ]

  if(type) {
    errorMessage = prefixes.find( item => item.type === type).prefix
  }

  if(errorCode === -32000) {
    errorMessage += ', you have insufficient resource credit to make this transaction, please consider retrying after recharge or after powering up hive'
  }

  if(errorCode === -32001) {
    errorMessage += ', votes evaluating for post/comment that is paid out is forbidden.'
  }

  return errorMessage
}

export const signOnHiveonboard = () => {
  const win = window.open('https://hiveonboard.com/create-account?ref=dbuzz&redirect_url=https://d.buzz/#/?status=success', '_blank')
  win.blur()
}

export const censorLinks = (content) => {
  const links = textParser.getUrls(content)
  let contentCopy = content

  links.forEach((item) => {
    contentCopy = contentCopy.replace(item, '<b>[link removed]</b>')
  })

  return contentCopy
}

export const getDefaultVotingWeight = () => {
  const voteWeight = localStorage.getItem('voteWeight')

  if(voteWeight) {
    return voteWeight
  }
  return 0
}

export const redirectToUserProfile = () => {
  if(window.location.href.includes("@") && !window.location.href.includes("#/@")){
    const account = window.location.href.split("@")
    window.location = (`/#/@${account[1].replace("#/", "")}`)
  }
}