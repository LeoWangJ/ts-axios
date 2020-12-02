import { isObject } from './util'

/**
 * 支援xhr.send() 方法處理請求參數為 Object 時的情況
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
 */
export function transformRequest(data: any): any {
  if (isObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
