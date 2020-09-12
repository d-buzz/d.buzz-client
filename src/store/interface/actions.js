export const OPEN_REPLY_MODAL = 'OPEN_REPLY_MODAL'
export const CLOSE_REPLY_MODAL = 'CLOSE_REPLY_MODAL'

export const openReplyModal = (author, permlink, content, treeHistory, replyRef = 'list') => ({
  type: OPEN_REPLY_MODAL,
  payload: { open:true, author, permlink, content, treeHistory, replyRef },
})

export const closeReplyModal = () => ({
  type: CLOSE_REPLY_MODAL,
  payload: { open: false },
})

export const BROADCAST_NOTIFICATION = 'BROADCAST_NOTIFICATION'

export const broadcastNotification = (severity, message) => ({
  type: BROADCAST_NOTIFICATION,
  payload: { open: true, severity, message },
})
