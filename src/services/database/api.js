import axios from "axios"
import getUserAccount from "./getUserAccount"

export const initilizeUserInDatabase = async(username) => {

  const defaultSettings = {theme: 'light', videoEmbedsStatus: 'enabled', linkPreviewsStatus: 'enabled', showImagesStatus: 'enabled', showNSFWPosts: 'disabled' }

  const user = {username: username, userData: [{username: getUserAccount(), settings: {...defaultSettings}}]}
  const res = await axios.post(`${process.env.REACT_APP_DATABASE_API}/post`, { ...user }, { headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY } })

  // set local variables
  localStorage.setItem('customUserData', JSON.stringify({username: getUserAccount(), settings: {...defaultSettings}}))

  return res.data
}

const headers = {'Content-Type': 'application/json','Cache-Control' : 'no-cache'}

export const getUserCustomData = async(username) => {
  const res = await axios.get(`${process.env.REACT_APP_DATABASE_API}/get`, { params: { username: username }, headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY, ...headers } })

  // console.log('just ran the user request');

  return res.data
}

export const updateUserCustomData = async(userData) => {
  const res = await axios.post(`${process.env.REACT_APP_DATABASE_API}/post`, { ...userData }, { headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY } })

  return res.data
}

export const getLeaderboardEngagementData = async(params) => {
  const res = await axios.get(`${process.env.REACT_APP_DATABASE_API}/get/getLeaderboardEngagement`, { params, headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY, ...headers } })
  return res.data
}

export const getLeaderboardCuratorData = async(params) => {
  const res = await axios.get(`${process.env.REACT_APP_DATABASE_API}/get/getLeaderboardCurator`, { params, headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY, ...headers } })
  return res.data
}

export const getLeaderboardAuthorData = async(params) => {
  const res = await axios.get(`${process.env.REACT_APP_DATABASE_API}/get/getLeaderboardAuthor`, { params, headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY, ...headers } })
  return res.data
}

export const getLeaderboardEarlyAdoptersData = async(params) => {
  const res = await axios.get(`${process.env.REACT_APP_DATABASE_API}/get/getLeaderboardEarlyAdopters`, { params, headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY, ...headers } })
  return res.data
}