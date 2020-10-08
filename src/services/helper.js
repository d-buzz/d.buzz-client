import { useState, useEffect } from 'react'

export const anchorTop = () => {
  window.scrollTo(0, 0)
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

    if(is_paidout) {
      payout = parseFloat(`${pending_payout_value}`.replace('HBD'))
    } else {
      payout = parseFloat(`${total_payout_value}`.replace('HBD')) + parseFloat(`${curator_payout_value}`.replace('HBD'))
    }
  } else {
    payout = parseFloat(`${total_payout_value}`.replace('HBD')) + parseFloat(`${curator_payout_value}`.replace('HBD')) + parseFloat(`${pending_payout_value}`.replace('HBD'))
  }

  console.log({ payout })

  payout = payout.toFixed(2)

  if(payout === 0) {
    payout = '0.00'
  }

  console.log({ payout })

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
