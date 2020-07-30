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

export const getProfileMetaData = (profile) => {
  let cover = ''
  let name = ''
  let about = ''
  let website = ''

  if(
    'json_metadata' in profile
    && profile.json_metadata.includes('"cover_image":')
  ) {
    const meta = JSON.parse(profile.json_metadata)
    cover = meta.profile.cover_image
  }

  if(
    'posting_metadata' in profile
    && profile.posting_metadata.includes('"cover_image":')
  ) {
    const meta = JSON.parse(profile.posting_metadata)
    cover = meta.profile.cover_image
  }

  if(
    'json_metadata' in profile
    && profile.json_metadata.includes('"name":')
  ) {
    const meta = JSON.parse(profile.json_metadata)
    name = meta.profile.name
  }

  if(
    'posting_metadata' in profile
    && profile.posting_metadata.includes('"name":')
  ) {
    const meta = JSON.parse(profile.posting_metadata)
    name = meta.profile.name
  }

  if(
    'json_metadata' in profile
    && profile.json_metadata.includes('"about":')
  ) {
    const meta = JSON.parse(profile.json_metadata)
    about = meta.profile.about
  }

  if(
    'posting_metadata' in profile
    && profile.posting_metadata.includes('"about":')
  ) {
    const meta = JSON.parse(profile.posting_metadata)
    about = meta.profile.about
  }

  if(
    'json_metadata' in profile
    && profile.json_metadata.includes('"website":')
  ) {
    const meta = JSON.parse(profile.json_metadata)
    website = meta.profile.website
  }

  if(
    'posting_metadata' in profile
    && profile.posting_metadata.includes('"website":')
  ) {
    const meta = JSON.parse(profile.posting_metadata)
    website = meta.profile.website
  }

  return {
    cover,
    name,
    about,
    website,
  }
}
