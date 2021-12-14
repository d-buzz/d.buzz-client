const getUserAccount = () => {
  let account

  if(localStorage.getItem('accounts')) {
    account = JSON.parse(localStorage.getItem('accounts'))[0]
  } else {
    account = 'Logged out'
  }

  return account
}

export default getUserAccount