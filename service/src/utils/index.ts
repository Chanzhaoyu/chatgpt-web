interface SendResponseOptions {
  type: 'success' | 'fail'
  message?: string
  data?: any
}

export function sendResponse(options: SendResponseOptions) {
  if (options.type === 'success') {
    return Promise.resolve({
      message: options.message ?? 'Success',
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
