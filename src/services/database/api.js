import axios from "axios"

export const initilizeUserInDatabase = async(username) => {

  const user = {username, userData: [{username, settings: {theme: JSON.parse(localStorage.getItem('theme')).mode, ...JSON.parse(localStorage.getItem('settings'))}}]}
  const res = await axios.post(`${process.env.REACT_APP_DATABASE_API}/post`, { ...user }, { headers: { auth: process.env.REACT_APP_DATABASE_AUTH_KEY } })

  // set local variables
  const customUserData = {username, settings: {theme: JSON.parse(localStorage.getItem('theme')).mode, ...JSON.parse(localStorage.getItem('settings'))}}
  localStorage.setItem('customUserData', JSON.stringify(customUserData))

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