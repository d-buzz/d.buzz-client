const night = {
  background: {
    primary: 'rgb(21, 32, 43)',
    secondary: '#192734',
  },
  icon: {
    '& svg': {
      '& path': {
        stroke: 'white',
        fill: 'white',
      },
    },
  },
  iconButton: {
    hover: {
      '&:hover': {
        backgroundColor: 'rgb(29 56 78) !important',
      },
    },
  },
  font: {
    color: 'rgb(255, 255, 255)',
  },
  border: {
    primary: '1px solid rgb(56, 68, 77)',
    thick: '10px solid rgb(37, 51, 65)',
  },
  textArea: {
    backgroundColor: 'rgb(21, 32, 43)',
    color: 'white',
    borderBottom: '1px solid rgb(56, 68, 77)',
    '&::placeholder': {
      color: 'white',
    },
  },
  search: {
    background: {
      backgroundColor: 'rgb(37, 51, 65)',
    },
  },
  navbar: {
    icon: {
      '& svg': {
        '& path': {
          stroke: 'white',
          fill: 'white',
        },
      },
    },
  },
  preview: {
    title: {
      color: 'white',
    },
  },
  markdown: {
    paragraph: {
      color: 'rgb(255, 255, 255) !important',
    },
  },
  postList: {
    hover: {
      backgroundColor: 'rgb(25, 39, 52)',
    },
  },
  left: {
    sidebar: {
      items: {
        color: 'white',
        hover: {
          backgroundColor: '#172e3f',
        },
        icons: {
          '& svg': {
            '& path': {
              stroke: 'white',
            },
          },
        },
      },
      bottom: {
        wrapper: {
          backgroundColor: 'rgb(29, 161, 242, 0.1)',
          '&:hover': {
            backgroundColor: 'rgb(29 56 78)',
          },
        },
      },
      logout: {
        label: {
          color: 'white',
        },
        username: {
          color: 'rgb(136, 153, 166)',
        },
        icon: {
          '& svg': {
            '& path': {
              stroke: 'white !important',
              fill: 'white !important',
            },
          },
        },
      },
    },
  },
  right: {
    list: {
      background: 'rgb(25, 39, 52)',
      hover: {
        backgroundColor: 'rgb(56, 68, 77)',
      },
    },
  },
}

const light = {
  background: {
    primary: 'white',
    secondary: 'white',
  },
  icon: {
    '& svg': {
      '& path': {
        stroke: 'black',
        fill: 'black',
      },
    },
  },
  iconButton: {
    hover: { },
  },
  font: {
    color: 'black',
  },
  border: {
    primary: '1px solid #e6ecf0',
    thick: '10px solid #e6ecf0',
  },
  textArea: {
    backgroundColor: 'white',
    color: 'black',
    borderBottom: '1px solid #e6ecf0',
    '&::placeholder': {
      color: 'black',
    },
  },
  search: {
    background: {
      backgroundColor: '#e6ecf0',
    },
  },
  navbar: {
    icon: {
      '& svg': {
        '& path': {
          stroke: 'black',
          fill: 'black',
        },
      },
    },
  },
  preview: {
    title: {
      color: 'black',
    },
  },
  markdown: {
    paragraph: {
      color: 'black',
    },
  },
  postList: {
    hover: {
      backgroundColor: '#f5f8fa',
    },
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
      bottom: {
        wrapper: {
          backgroundColor: '#f5f8fa',
          '&:hover': {
            backgroundColor: '#e6ecf0',
          },
        },
      },
      logout: {
        label: {
          color: 'black',
        },
        username: {
          color: 'black',
        },
        icon: {
          '& svg': {
            '& path': {
              stroke: 'black',
              fill: 'black !important',
            },
          },
        },
      },
    },
  },
  right: {
    list: {
      background: '#f5f8fa',
      hover: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
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
