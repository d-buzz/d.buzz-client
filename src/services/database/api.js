import axios from "axios"
import getUserAccount from "./getUserAccount"

export const initilizeUserInDatabase = async(username) => {

  const defaultSettings = {theme: 'light', videoEmbedsStatus: 'enabled', linkPreviewsStatus: 'enabled', showImagesStatus: 'enabled' }

  const user = {username: username, userData: [{username: getUserAccount(), settings: {...defaultSettings}}]}
  const res = await axios.post(`${process.env.REACT_APP_DATABASE_API}/post`, { ...user }, { headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY } })

  // set local variables
  localStorage.setItem('customUserData', JSON.stringify({username: getUserAccount(), settings: {...defaultSettings}}))

  return res.data
}

export const getUserCustomData = async(username) => {
  const res = await axios.get(`${process.env.REACT_APP_DATABASE_API}/get`, { params: { username: username }, headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY } })

  return res.data
}

export const updateUserCustomData = async(userData) => {
  const res = await axios.post(`${process.env.REACT_APP_DATABASE_API}/post`, { ...userData }, { headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY } })

  return res.data
}