const night = {
  background: {
    primary: 'rgb(21, 32, 43)',
    secondary: '#192734',
  },
  left: {
    sidebar: {
      items: {
        color: 'white',
        hover: {
          backgroundColor: '#ffebee1a',
        },
        icons: {
          '& svg': {
            '& path': {
              stroke: 'white',
            },
          },
        },
      },
    },
  },
}

const light = {
  background: {
    primary: 'white',
    secondary: 'black',
  },
  left: {
    sidebar: {
      items: {
        color: 'black',
        hover: {
          backgroundColor: '#ffebee',
        },
        icons: {
          '& svg': {
            '& path': {
              stroke: 'black',
            },
          },
        },
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
