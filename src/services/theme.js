const night = {
  background: {
    primary: 'rgb(21, 32, 43)',
    secondary: '#192734',
  },
  notification: {
    backgroundColor: '#1a2936 !important',
  },
  messageColor: {
    color: 'lightGreen !important',
  },
  unread: {
    backgroundColor: '#1c2841',
    '& label': {
      color: 'white',
    },
    '&:hover': {
      backgroundColor: '#233251 !important',
      '& label': {
        color: '#f83541 !important',
      },
    },
  },
  context: {
    view: {
      backgroundColor: 'rgb(25, 39, 52)',
      color: 'rgb(255, 255, 255)',
    },
  },
  nav: {
    background: 'rgb(25, 39, 52)',
  },
  dialog: {
    user: {
      boxShadow: 'rgba(136, 153, 166, 0.2) 0px 0px 15px, rgba(136, 153, 166, 0.15) 0px 0px 3px 1px !important',
      color: 'rgb(255 255 255 / 88%) !important',
      '& a': {
        color: 'rgb(255, 255, 255)',
      },
    },
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
    background: 'rgb(56, 68, 77)',
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
    hover: {
      color: 'rgb(22 45 64 / 63%)',
    },
  },
  markdown: {
    paragraph: {
      color: 'rgb(255 255 255 / 88%) !important',
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
            paddingTop: -10,
            '& path': {
              stroke: 'white',
            },
          },
        },
      },
      bottom: {
        wrapper: {
          backgroundColor: 'rgb(29, 161, 242, 0.1) !important',
          '&:hover': {
            backgroundColor: 'rgb(29 56 78)',
          },
        },
        wrapperMinify: {
          '& svg': {
            '& path': {
              stroke: 'white',
              fill: 'white',
            },
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
        backgroundColor: 'rgb(56 68 77 / 31%)',
      },
    },
  },
  skeleton: {
    color: '#172e3f',
    highlight: 'rgb(56 68 77 / 31%)',
  },
}

const light = {
  background: {
    primary: 'white',
    secondary: 'white',
  },
  notification: { },
  messageColor: {
    color: 'green !important',
  },
  unread: {
    backgroundColor: '#ffe2dd',
    '& label': {
      color: 'black',
    },
    '&:hover': {
      backgroundColor: '#f83541 !important',
      '& label': {
        color: 'white !important',
      },
    },
  },
  context: {
    view: {
      backgroundColor: '#f5f8fa',
      color: 'black',
    },
  },
  nav: {
    background: 'white',
  },
  dialog: {
    user: {
      color: 'black !important',
      '& a': {
        color: 'black',
      },
    },
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
    background: 'black',
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
    hover: {
      color: '#e6ecf0',
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
          backgroundColor: '#f5f8fa !important',
          '&:hover': {
            backgroundColor: '#e6ecf0 !important',
          },
        },
        wrapperMinify: {
          '& svg': {
            '& path': {
              stroke: 'black',
              fill: 'black',
            },
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
  skeleton: { },
}

const gray = {
  background: {
    primary: '#202225',
    secondary: '#192734',
  },
  notification: {
    backgroundColor: '#272b2d !important',
  },
  messageColor: {
    color: 'lightGreen !important',
  },
  unread: {
    backgroundColor: '#2a3439',
    '& label': {
      color: 'white',
    },
    '&:hover': {
      backgroundColor: '#354147 !important',
      '& label': {
        color: '#f83541 !important',
      },
    },
  },
  context: {
    view: {
      backgroundColor: '#282a2d',
      color: 'rgb(255, 255, 255)',
    },
  },
  nav: {
    background: '#282a2d',
  },
  dialog: {
    user: {
      boxShadow: 'rgba(136, 153, 166, 0.2) 0px 0px 15px, rgba(136, 153, 166, 0.15) 0px 0px 3px 1px !important',
      color: 'rgb(255 255 255 / 88%) !important',
      '& a': {
        color: 'rgb(255, 255, 255)',
      },
    },
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
        backgroundColor: '#36393fed !important',
      },
    },
  },
  font: {
    color: 'rgb(255, 255, 255)',
  },
  border: {
    primary: '1px solid #2f3136',
    thick: '10px solid #2f3136',
    background: 'rgb(56, 68, 77)',
  },
  textArea: {
    backgroundColor: '#202225',
    color: 'white',
    borderBottom: '1px solid rgb(56, 68, 77)',
    '&::placeholder': {
      color: 'white',
    },
  },
  search: {
    background: {
      backgroundColor: '#202225',
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
    hover: {
      color: '#282a2d',
    },
  },
  markdown: {
    paragraph: {
      color: 'rgb(255 255 255 / 88%) !important',
    },
  },
  postList: {
    hover: {
      backgroundColor: '#393c436b',
    },
  },
  left: {
    sidebar: {
      items: {
        color: 'white',
        hover: {
          backgroundColor: '#36393f80',
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
          backgroundColor: '#36393f80 !important',
          '&:hover': {
            backgroundColor: '#36393fed !important',
          },
        },
        wrapperMinify: {
          '& svg': {
            '& path': {
              stroke: 'white',
              fill: 'white',
            },
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
      background: '#282a2d',
      hover: {
        backgroundColor: '#36393fed',
      },
    },
  },
  skeleton: {
    color: '#2f3136',
    highlight: '#36393fed',
  },
}

export const getTheme = (mode) => {
  if(mode === 'night') {
    return night
  } else if(mode === 'gray') {
    return gray
  } else {
    return light
  }
}
