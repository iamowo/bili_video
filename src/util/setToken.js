
export function setToken(token) {
  localStorage.setItem("token", token)
}


export function getToken(token) {
  localStorage.getItem("token")
}

export function removeToken() {
  localStorage.removeItem("token")
}