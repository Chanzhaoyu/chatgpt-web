interface SendResponseOptions<T = any> {
  type: 'Success' | 'Fail'
  message?: string
  data?: T
}

export function sendResponse<T>(options: SendResponseOptions<T>) {
  if (options.type === 'Success') {
    return Promise.resolve({
      message: options.message ?? null,
      data: options.data ?? null,
      status: options.type,
    })
  }

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    message: options.message ?? 'Failed',
    data: options.data ?? null,
    status: options.type,
  })
}

export function parseKeys(keys: string) {
  return keys
    ? keys
      .split(/\s*[,\n]\s*/)
    : []
}

/**
 * 由数组和负载均衡策略生成一个负载均衡函数
 * @note 该函数将数组参数捕获为闭包，更改数组不会影响该函数生成的函数的表现；如果需要实时更新数组，需要重新调用该函数
 * @param arr 任意类型的数组
 * @param strategy 负载均衡策略，可选值：random, polling, 默认为 polling
 * @returns 一个无参数的函数，每次调用返回数组中的一个元素
 */
export function loadBalancer<T>(arr: T[], strategy = 'polling') {
  if (arr.length === 1)
    return () => arr[0]

  switch (strategy.toLowerCase()) {
    case 'random':
      return () => arr[Math.floor(Math.random() * arr.length)]
    case 'polling':
      return (i => () => arr[i++ % arr.length])(Math.floor(Math.random() * arr.length))
  }
}

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))
