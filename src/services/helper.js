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
