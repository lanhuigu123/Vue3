import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getToken, removeToken } from './auth'
import { ElLoading, ElMessageBox } from 'element-plus'
import router from '@/router'
import * as TS from './defind'
const url = 'https://eladmin.vip'

const config = {
  baseURL: url as string,
  timeout: 3000 as number
}

class httpRequest {
  instance: AxiosInstance
  constructor(baseConfig: AxiosRequestConfig) {
    this.instance = axios.create(baseConfig)
    this.instance.interceptors.request.use(
      (config) => {
        ElLoading.service({ fullscreen: false, text: '加载中...' })
        config.headers['Authorization'] = getToken()
        return config
      },
      (err: AxiosError) => {
        return Promise.reject(err)
      }
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        const { data } = res
        ElLoading.service({ fullscreen: false, text: '加载中...' })
        if (data.msg.status === TS.RequestEnums.UNAUTHORIZED) {
          removeToken()
          router.replace('/login')
          return Promise.reject(data)
        }
        return data
      },
      (err) => {
        const { res } = err

        let title = ''
        let message = ''

        if (err && res) {
          message = res.statusText

          if (res.status === TS.RequestEnums.UNAUTHORIZED) {
            router.replace('/login')
          }
          switch (res.status) {
            case TS.RequestEnums.BADREQUEST:
              title = '错误请求'
              break
            case TS.RequestEnums.UNAUTHORIZED:
              title = '资源未授权'
              break
            case TS.RequestEnums.NOTFOUND:
              title = '未找到所请求的资源'
              break
            case TS.RequestEnums.ERROR:
              title = '内部服务器错误'
              break
            default:
              title = res.status.toString()
          }
          return ElMessageBox.alert(message, title, {
            confirmButtonText: 'OK',
            type: 'warning'
          })
        } else {
          return ElMessageBox.alert('未知错误,请联系管理员', '提示', {
            confirmButtonText: 'OK',
            type: 'error'
          })
        }
      }
    )
  }

  public adUrl(url: string) {
    console.log(process.env.VUE_APP_BASE_API, 'process')
    return !process.env.VUE_APP_BASE_API ? url : process.env.VUE_APP_BASE_API + url
  }

  get<T>(url: string, params?: object): Promise<TS.ResultData<T>> {
    return this.instance.get(this.adUrl(url), { params })
  }

  post<T>(url: string, params?: object): Promise<TS.ResultData<T>> {
    return this.instance.post(this.adUrl(url), params)
  }

  put<T>(url: string, params?: object): Promise<TS.ResultData<T>> {
    return this.instance.put(this.adUrl(url), params)
  }

  delete<T>(url: string, params?: object): Promise<TS.ResultData<T>> {
    return this.instance.delete(this.adUrl(url), { params })
  }
}

const http = new httpRequest(config)

export default http
