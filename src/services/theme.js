const night = {
  primaryBackground: 'rgb(21, 32, 43)',
  leftSidebarItemsColor: 'white',
  leftSideBarIcons: {
    '& svg': {
      '& path': {
        stroke: 'white',
      },
    },
  },
}

const light = {
  primaryBackground: 'white',
  leftSidebarItemsColor: 'black',
  leftSideBarIcons: {
    '& svg': {
      '& path': {
        stroke: 'black',
      },
    },
  },
}

export const getTheme = (mode) => {
  if(mode === 'night') {
    return night
  } else {
    return light
  }
}
