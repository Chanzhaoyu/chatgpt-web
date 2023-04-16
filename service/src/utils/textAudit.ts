import fetch from 'node-fetch'

export interface TextAuditServiceOptions {
  apiKey: string
  apiSecret: string
  label: string
}

export interface TextAuditService {
  audit(text: string): Promise<boolean>
}

/**
 * https://ai.baidu.com/ai-doc/ANTIPORN/Vk3h6xaga
 */
export class BaiduTextAuditService implements TextAuditService {
  private accessToken: string
  private expiredTime: number

  constructor(private options: TextAuditServiceOptions) { }

  async audit(text: string): Promise<boolean> {
    if (!await this.refreshAccessToken())
      return
    const url = `https://aip.baidubce.com/rest/2.0/solution/v1/text_censor/v2/user_defined?access_token=${this.accessToken}`
    let headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      'Accept': 'application/json'
    }
    const response = await fetch(url, { headers, method: 'POST', body: `text=${encodeURIComponent(text)}` })
    const data = await response.json() as { conclusionType: number; data: any }

    if (data.error_msg)
      throw new Error(data.error_msg)

    // 审核结果类型，可取值1、2、3、4，分别代表1：合规，2：不合规，3：疑似，4：审核失败
    if (data.conclusionType === 1)
      return true

    // https://ai.baidu.com/ai-doc/ANTIPORN/Nk3h6xbb2#%E7%BB%86%E5%88%86%E6%A0%87%E7%AD%BE%E5%AF%B9%E7%85%A7%E8%A1%A8

    // 3 仅政治
    const safe = data.data.filter(d => d.subType === 3).length <= 0
    if (!safe || !this.options.label)
      return safe
    const str = JSON.stringify(data)
    for (const l of this.options.label.split(',')) {
      if (str.indexOf(l))
        return false
    }
    return true
  }

  async refreshAccessToken() {
    if (!this.options.apiKey || !this.options.apiSecret)
      throw new Error('未配置 | Not configured.')

    try {
      if (this.accessToken && Math.floor(new Date().getTime() / 1000) <= this.expiredTime)
        return true

      const url = `https://aip.baidubce.com/oauth/2.0/token?client_id=${this.options.apiKey}&client_secret=${this.options.apiSecret}&grant_type=client_credentials`
      let headers: {
        'Content-Type': 'application/json'
        'Accept': 'application/json'
      }
      const response = await fetch(url, { headers })
      const data = (await response.json()) as { access_token: string; expires_in: number }

      this.accessToken = data.access_token
      this.expiredTime = Math.floor(new Date().getTime() / 1000) + (+data.expires_in)
      return true
    }
    catch (error) {
      global.console.error(`百度审核${error}`)
    }
    return false
  }
}

export type TextAuditServiceProvider = 'baidu' //  | 'ali'

export type TextAuditServices = {
  [key in TextAuditServiceProvider]: new (
    options: TextAuditServiceOptions,
  ) => TextAuditService;
}

export const textAuditServices: TextAuditServices = {
  baidu: BaiduTextAuditService,
}
