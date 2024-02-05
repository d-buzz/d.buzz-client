import { useState, useEffect } from 'react'
import uuid from 'uuid-random'
import { encrypt, decrypt } from 'caesar-shift'
import CryptoJS  from 'crypto-js'
import sha256 from 'crypto-js/sha256'
import diff_match_patch from 'diff-match-patch'
import textParser from 'npm-text-parser'
import axios from 'axios'

const dmp = new diff_match_patch()

export const stripHtml = (content) => {
  return content.replace(/(<([^>]+)>)/gi, '')
}

export const getUrls = (text) => {
  const regexUrls = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[/w@?^=%&/~+#-(a-z)(A-Z)(0-9)])?/gm
  return text?.match(regexUrls) !== null ? text?.match(regexUrls) : []
}

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

export const calculateRepScore = (reputation) => {
  const log10 = (str) => {
    const leadingDigits = parseInt(str.substring(0, 4))
    const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001
    const n = str.length - 1
    return n + (log - parseInt(log))
  }

  const repLog10 = rep2 => {
    if (rep2 == null) return rep2
    let rep = String(rep2)
    const neg = rep.charAt(0) === '-'
    rep = neg ? rep.substring(1) : rep

    let out = log10(rep)
    if (isNaN(out)) out = 0
    out = Math.max(out - 9, 0) // @ -9, $0.50 earned is approx magnitude 1
    out = (neg ? -1 : 1) * out
    out = out * 9 + 25 // 9 points per magnitude. center at 25
    // base-line 0 to darken and < 0 to auto hide (grep rephide)
    out = parseInt(out)
    return out
  }

  return repLog10(reputation)
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
  let uuid
  if(index && uid) {
    uuid = decrypt(index, uid)
  }
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
    body += ' #HIVE #DBuzz'
  }
  body = encodeURIComponent(stripHtml(body))
  window.open(`https://twitter.com/intent/tweet?text=${body}` , 'newwindow', 'width=' + width + ', height=' + height + ', top=' + ((window.innerHeight - height) / 2) + ', left=' + ((window.innerWidth - width) / 2))
}

export const sendToBerries = (author, theme) => {
  const { mode } = theme
  let color = ''
  if (mode === 'gray') {
    color = '-n'
  } else if (mode === 'night') {
    color = '-n'
  }
  window.open(`https://buymeberri.es/!dbuzz${color}/@${author}`, '_blank')
}

export const calculateOverhead = (content) => {
  let urls = getUrls(content) || []

  const markdown = content?.match(/#+\s|[*]|\s+&nbsp;+\s|\s+$/gm) || []

  let overhead = 0

  // let overheadItems = []

  if(markdown.length>0) {
    markdown.forEach((item) => {
      // overheadItems.push(item)
      overhead += item.length
    })
  }

  if((urls.length) > 3) {
    urls = urls.slice(0, 2)
  }

  if(urls && urls.length <= 3){
    urls.forEach((item) => {
      // overheadItems.push(item)
      overhead += item.length
    })
  }

  // console.log(overheadItems)

  return overhead
}

export const truncateBody = (body) => {
  const overhead = calculateOverhead(body)
  const bodyLength = `${stripHtml(body)}`.length - overhead

  if(bodyLength > 280) {
    body = stripHtml(body)
    body = `${body}`.substr(0, 280)
    body = `${body} . . .`
  }

  return body
}


export const errorMessageComposer = (type = null, errorCode = 0, timeLeft= 0) => {
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
    {
      type: "unfollow_user",
      prefix: 'The transaction to unfollow the user has failed',
    },
  ]

  if(type && type !== 'post_limit') {
    errorMessage = prefixes.find( item => item.type === type).prefix
  }


  if(errorCode === -32000) {
    errorMessage += ', you have insufficient resource credit to make this transaction, please consider retrying after recharge or after powering up hive'
  }

  if(errorCode === -32001) {
    errorMessage += ', votes evaluating for post/comment that is paid out is forbidden.'
  }

  if (type === 'post_limit') {
    // get the time left error message
    const timeLeftMessage = getTimeLeftErrorMessage(timeLeft)
    if (timeLeftMessage) {
      errorMessage = timeLeftMessage
    }

  }

  return errorMessage
}

const getTimeLeftErrorMessage = (timeLeft) => {

  if (timeLeft < 1) {
    // Wait for 5 minutes before posting again.
    return 'Wait for 5 minutes before posting again.'
  }else if (timeLeft >= 1 && timeLeft < 2) {
    // Wait for 4 minutes before posting again.
    return 'Wait for 4 minutes before posting again.'
  }else if (timeLeft >= 2 && timeLeft < 3) {
    // Wait for 3 minutes before posting again.
    return 'Wait for 3 minutes before posting again.'
  }else if (timeLeft >= 3 && timeLeft < 4) {
    // Wait for 2 minutes before posting again.
    return 'Wait for 2 minutes before posting again.'
  }else if (timeLeft >= 4 && timeLeft < 5) {
    // Wait for 1 minute before posting again.
    return 'Wait for 1 minute before posting again.'
  }else{
    return null
  }
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
  return 1
}

const checkUrlHaveProfileRef = (urlParams) => {
  const url = urlParams.searchParams.get('ref')

  // need to enumerate the all static ref that is not related to a profile username
  if (url && url !== 'home' && url !== 'content' && url !== 'tags' && url !== 'replies' && url !== 'SearchPosts' ) {
    return url
  }
  return null
}
export const redirectOldLinks = () => {
  let link
  if(window.location.hash) {
    const regexForOldProfileLinks = /#\/@([A-Za-z0-9-]+\.?[A-Za-z0-9-]+)/gi
    const regexForOldPostLinks = /#\/@([A-Za-z0-9-]+\.?[A-Za-z0-9-]+)\/c\/[a-zA-Z0-9]+/gi

    if(regexForOldProfileLinks.test(window.location.hash) || regexForOldPostLinks.test(window.location.hash)){
      link = window.location.href.replace('/#', '').replace('/c', '')
    } else {
      link = window.location.href.replace('/#', '')
    }

  }else{
    link = window.location.href
  }

  const urlParams = new URL(link)
  const profileRef =  checkUrlHaveProfileRef(urlParams)

  if (profileRef) {
    const redirectToProfile = window.location.origin+'/@'+profileRef
    window.location = redirectToProfile
  }
}

export const getTheme =() => {
  const theme = JSON.parse(localStorage.getItem('customUserData'))?.settings?.theme
  let mode = ''

  if(theme && (theme === 'gray' || theme === 'night') ) {
    mode = theme
  } else {
    mode = 'light'
  }

  return mode
}

export const getUserTheme =() => {
  const theme = JSON.parse(localStorage.getItem('customUserData'))?.settings?.theme
  let mode = ''

  if(theme && (theme === 'gray' || theme === 'night') ) {
    mode = theme
  } else {
    mode = 'light'
  }

  return mode
}

export const convertCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export const isGifImage = (url) => {
  return url.endsWith('.gif')
}

export const isImageUrl404 = async (url) => {
  try {
    const response = await axios.head(url)
    return response.status === 404
  } catch (error) {
    return true
  }
}

export const proxyImage = (url) => {
  const enabled = false
  let imageUrl = url

  if(enabled) {
    if(!isGifImage(url)) {
      imageUrl = `https://wsrv.nl/?url=${url}&q=50`
      if(isImageUrl404(imageUrl)){
        imageUrl = url
      }
    }
  }

  return imageUrl
}

export const truncateString = (str, num) => {
  if (str.length > num) {
    return str.slice(0, num) + "..."
  } else {
    return str
  }
}

export const getImageDimensions = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url

    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = (error) => {
      reject(error)
    }
  })
}

export const parseUrls = (c) => {
  return c.match(/((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-])+))+([a-zA-Z]*[a-zA-Z]){1}?(\/+[\w.,@?^=%&:/~+!#-$-']*)*/gm) || []
}

export const getCurrentTimePart = () => (Math.floor((new Date().getHours() / 24) * 8) + 1)

export const calculateAverageRanking = (users) => {
  const userRankings = {}
  let ranking_importance = 4
  users.forEach((userList, systemIndex) => {
    if(userList.length === 10){
      userList.forEach((user, userIndex) => {
        const {rank, author} = user
        if (!userRankings[author]) {
          userRankings[author] = { totalRank: 0, count: 0 }
        }
        userRankings[author].totalRank += (((11 - rank)/55) * (100+ranking_importance))
        userRankings[author].count++
      })
    }
    ranking_importance--
  })
  const averageRankings = Object.entries(userRankings).map(([author, data]) => {
    const averageRank = data.totalRank
    return { author, averageRank }
  })
  averageRankings.sort((a, b) => b.averageRank - a.averageRank)
  let top10Users = []
  if(averageRankings.length>0){
    for(let i=0; i<10; i++){
      top10Users.push({rank: (i+1), author: Object.values(averageRankings)[i].author, averageRank: Object.values(averageRankings)[i].averageRank})
    }
  }else top10Users = []
  return top10Users
}

export const calculateAmount = (rshares, voteRShares, pendingPayout) => {
  const result = ((rshares / voteRShares) * pendingPayout) ?? 0

  return result.toFixed(3)
}

export const hiveAPIUrls = [
  "https://api.hive.blog",
  "https://rpc.ecency.com",
  "https://hive-api.3speak.tv",
  "https://rpc.ausbit.dev",
  "https://hived.privex.io",
  "https://anyx.io",
  "https://api.deathwing.me",
  "https://hived.emre.sh",
  "https://hive-api.arcange.eu",
  "https://api.openhive.network",
  "https://techcoderx.com",
  "https://hive.roelandp.nl",
  "https://api.c0ff33a.uk",
]
