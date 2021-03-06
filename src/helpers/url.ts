import { isDate, isObject, isURLSearchParams } from './util'
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

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  const markIndex = url.indexOf('#')
  if (markIndex !== -1) {
    url = url.slice(0, markIndex)
  }

  if (!params) {
    return url
  }
  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
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
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
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

interface URLOrigin {
  protocol: string
  host: string
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
