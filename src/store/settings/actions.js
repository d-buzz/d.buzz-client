export const SET_THEME_REQUEST = 'SET_THEME_REQUEST'
export const SET_THEME_SUCCESS = 'SET_THEME_SUCCESS'
export const SET_THEME_FAILURE = 'SET_THEME_FAILURE'

export const setThemeRequest = (mode) => ({
  type: SET_THEME_REQUEST,
  payload: { mode },
  meta: {
    thunk: true,
  },
})

export const setThemeSuccess = (response, meta) => ({
  type: SET_THEME_SUCCESS,
  payload: response,
  meta,
})

export const setThemeFailure = (error, meta) => ({
  type: SET_THEME_FAILURE,
  payload: error,
  meta,
})

export const GET_SAVED_THEME_REQUEST = 'GET_SAVED_THEME_REQUEST'
export const GET_SAVED_THEME_SUCCESS = 'GET_SAVED_THEME_SUCCESS'
export const GET_SAVED_THEME_FAILURE = 'GET_SAVED_THEME_FAILURE'

export const getSavedThemeRequest = () => ({
  type: GET_SAVED_THEME_REQUEST,
  meta: {
    thunk: true,
  },
})

export const getSavedThemeSuccess = (response, meta) => ({
  type: GET_SAVED_THEME_SUCCESS,
  payload: response,
  meta,
})

export const getSavedThemeFailure = (error, meta) => ({
  type: GET_SAVED_THEME_FAILURE,
  payload: error,
  meta,
})

export const GENERATE_STYLES = 'GENERATE_STYLES'

export const generateStyles = (theme) => ({
  type: GENERATE_STYLES,
  payload: theme,
})

export const GET_BEST_RPC_NODE = 'GET_BEST_RPC_NODE'

export const SET_RPC_NODE = 'SET_RPC_NODE'

export const getBestRpcNode = () => ({
  type: GET_BEST_RPC_NODE,
  meta: {
    thunk: true,
  },
})

export const setRpcNode = (response, meta) => ({
  type: SET_RPC_NODE,
  payload: response,
  meta,
})

export const CHECK_VERSION_REQUEST = 'CHECK_VERSION_REQUEST'
export const CHECK_VERSION_SUCCESS = 'CHECK_VERSION_SUCCESS'

export const checkVersionRequest = () => ({
  type: CHECK_VERSION_REQUEST,
  meta: {
    thunk: true,
  },
})


export const checkVersionSuccess = (response, meta) => ({
  type: CHECK_VERSION_SUCCESS,
  payload: response,
  meta,
})

export const GET_CENSOR_TYPES_REQUEST = 'GET_CENSOR_TYPES_REQUEST'
export const GET_CENSOR_TYPES_SUCCESS = 'GET_CENSOR_TYPES_SUCCESS'

export const getCensorTypesRequest = () => ({
  type: GET_CENSOR_TYPES_REQUEST,
  meta: {
    thunk: true,
  },
})

export const getCensorTypesSuccess = (response, meta) => ({
  type: GET_CENSOR_TYPES_SUCCESS,
  payload: response,
  meta,
})
