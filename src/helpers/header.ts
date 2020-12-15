import { Method } from '../types'
import { deepMerge, isObject } from './util'

/**
 * 當用戶data當作JSON傳入時, 自動添加Content-Type
 */
export function processHeaders(header: any, data: any): any {
  if (isObject(data)) {
    normalizeHeaderName(header, 'Content-Type')
    if (header && !header['Content-Type']) {
      header['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return header
}

function normalizeHeaderName(header: any, normalizeName: string): any {
  if (!header) {
    return
  }

  Object.keys(header).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      header[normalizeName] = header[name]
      delete header[name]
    }
  })
}

/**
 * 將response header 從字符串改成物件格式
 */
export function parseHeader(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }

    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })

  return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
