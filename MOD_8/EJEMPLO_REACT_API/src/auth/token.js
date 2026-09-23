const KEY = 'demo_token'

export function setToken(value) {
  localStorage.setItem(KEY, value)
}

export function getToken() {
  return localStorage.getItem(KEY)
}

export function removeToken() {
  localStorage.removeItem(KEY)
}
