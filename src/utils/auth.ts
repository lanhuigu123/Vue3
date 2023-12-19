import Cookies from 'js-cookie'

const type = 'token'

function setToken(value: string) {
  return Cookies.set(type, value, { expires: 7 })
}

function getToken() {
  return Cookies.get(type)
}

function removeToken() {
  return Cookies.remove(type)
}

export { setToken, getToken, removeToken }
