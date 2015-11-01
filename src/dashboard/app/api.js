
import ajax from './ajax'
import localForage from 'localforage'

export {cachedRels}
export {getUser}

function lsKey(pid) {
  return 'familyfound-rels:' + pid
}

var _cachedRels = {}
function cachedRels(pid, api, token, done) {
  if (_cachedRels[pid]) return done(null, _cachedRels[pid])

  var key = lsKey(pid)
  localForage.getItem(key, (err, value) => {
    if (!err && value) return done(null, value)

    relationships(pid, api, token, (err, data) => {
      if (err) return done(err)
      if (data.errors && data.errors.length) {
        return done(data.errors[0])
      }
      _cachedRels[pid] = data

      localForage.setItem(key, data)

      done(null, data)
    })
  })
}

const promisify = fn => new Promise((res, rej) => fn((err, val) => err ? rej(err) : res(val)))
const asPromised = fn => (...args) => promisify(done => fn(...args, done))

export const getRecordHints = async (pid, api, token) => {
  const {data: {matches}} = await apiCallP(`/tree-data/record-matches/${pid}`, api, token, {})
  return matches
}

export const promCache = fn => {
  const cache = {}
  return (key, ...args) => {
    if (!cache[key]) {
      cache[key] = fn(key, ...args)
    }
    return cache[key]
  }
};

function getUser(api, token, done) {
  apiCall('/platform/users/current', api, token, {}, (err, data) => {
    if (err) return done(err)
    if (data.errors) return done(data.errors[0])
    if (!data.users || !data.users.length) return done(new Error('no user returned'))
    done(null, data.users[0])
  })
}

function relationships(pid, api, token, done) {
  apiCall('/platform/tree/persons-with-relationships', api, token, {
    person: pid,
    persons: '',
  }, done)
}

function apiCall(endpoint, api, token, args, done) {
  var params = Object.keys(args).map(function (name) {
    return name + '=' + encodeURIComponent(args[name])
  }).join('&');
  ajax.get(api + endpoint + '?' + params, {
    Authorization: 'Bearer ' + token,
    Accept: 'application/x-fs-v1+json,application/json',
  }, done)
}

const apiCallP = asPromised(apiCall)


