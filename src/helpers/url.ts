import { isDate, isObject } from './util'
/**
 * 處理請求 URL 參數
 * 1. 為數組 ex: foo:['bar', 'baz'] -> ?foo[]=bar&foo[]=baz
 * 2. 為物件 ex: foo:{bar:'baz'} -> ?foo=%7B%22bar%22:%22baz%22%7D (encode後結果)
 * 3. 為Date ex: date:new Date() -> ?date=2020-12-02T10:55:39.030Z (date.toIOSString())
 * 4. 特殊字符支持 ex: foo: '@:$, []' -> ?foo=@:$,+[] (空格轉換成+)
 * 5. 空值忽略 null or undefined 則不顯示參數
 * 6. 丟棄url中的hash
 * 7. 保留url中的參數
 */

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []

  Object.keys(params).forEach(key => {
    let val = params[key]

    if (val === null || val === undefined) {
      return
    }
    let values: string[]
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  let serializedParams: string = parts.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
