import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig) {
  let { data = null, method = 'get', url } = config

  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url)
  request.send(data)
}
