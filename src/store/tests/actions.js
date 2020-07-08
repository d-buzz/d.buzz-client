export const TEST_REQUEST = 'TEST_REQUEST'
export const TEST_SUCCESS = 'TEST_SUCCESS'

export const testRequest = () => ({
  type: TEST_REQUEST,
  payload: {},
  meta: {
    thunk: true,
  }
})

export const testSuccess = (response, meta) => ({
  type: TEST_SUCCESS,
  payload: response,
  meta,
})