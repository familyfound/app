
import ActionCreators from '../flux/action-creators'

import config from "../../config"
import {getUser} from './app/api'

export default class UserActions extends ActionCreators {
  constructor() {
    super()

    this.addAsyncAction('login')
    this.addAsyncAction('gotUser')
  }

  login() {
    /*
    chrome.cookies.get({
      url: 'https://familysearch.org/',
      name: 'fssessionid',
    }, (cookie) => {
      if (!cookie) return this.emit('logout')
      this.emit('login', cookie.value)
    })
    */
  }

  check(token) {
    getUser(config.apiBase, token, (err, user) => {
      if (err) {
        return this.emit('logout')
      }
    })
  }

  fetch(token) {
    getUser(config.apiBase, token, (err, user) => {
      if (err) {
        return this.emit('logout')
      }

      user.token = token
      this.emit('gotUser', user)
    })
  }
}

