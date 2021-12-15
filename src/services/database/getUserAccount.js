const getUserAccount = () => {
  let account

  if(localStorage.getItem('active')) {
    account = localStorage.getItem('active')
  } else {
    account = 'Logged out'
  }

  return account
}

export default getUserAccount