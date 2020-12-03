import { isObject } from './util'

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
