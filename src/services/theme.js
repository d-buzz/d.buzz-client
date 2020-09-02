const night = {
  primaryBackground: 'rgb(21, 32, 43)',
}

const light = {
  primaryBackground: 'white',
}

export const getTheme = (mode) => {
  if(mode === 'night') {
    return night
  } else {
    return light
  }
}
