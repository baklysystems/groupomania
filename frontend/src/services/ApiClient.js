import router from '../router/index'

class ApiClient {
  constructor () {
    this.baseUrl = 'http://localhost:3000/'
  }

  headers (options = {}) {
    const contentType = options.isFormData
      ? {}
      : {
          'Content-Type': 'application/json',
        }

    return {
      ...contentType,
      Authorization: 'Bearer ' + localStorage.getItem('userToken')
    }
  }

  get (path) {
    return fetch(this.baseUrl + path, {
      headers: this.headers({'Access-Control-Allow-Origin': '*'})
    })
      .then(response => {
        if (response.status === 401) {
          localStorage.clear()
          router.push({ name: 'Login' })
        }
        return response.json()
      })
      .catch(() => alert("Unable to retrieve data from the API!"))
  }

  post (path, body, options = {'Access-Control-Allow-Origin': '*'}) {
    return fetch(this.baseUrl + path, {
      method: 'POST',
      body: options.isFormData ? body : JSON.stringify(body),
      headers: this.headers(options)
    }).then(response => this.handleResponse(response))
  }

  delete (path) {
    return fetch(this.baseUrl + path, {
      method: 'DELETE',
      headers: this.headers()
    }).then(response => this.handleResponse(response))
  }

  put (path, body, options = {}) {
    return fetch(this.baseUrl + path, {
      method: 'PUT',
      body: options.isFormData ? body : JSON.stringify(body),
      headers: this.headers(options)
    }).then(response => this.handleResponse(response))
  }

  async handleResponse (response) {
    if (!response.status.toString().match(/20[01]/)) throw await response.json()
    return response.json()
  }
}

export const apiClient = new ApiClient()
