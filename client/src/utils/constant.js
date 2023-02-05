// const URI = 'http://127.0.0.1:8080/api/'
const BASE_URI = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080'
const URI = `${BASE_URI}/api/`

export { URI, BASE_URI }
