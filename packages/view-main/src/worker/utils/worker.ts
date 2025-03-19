import { createMsg2call } from 'message2call'

export const exposeWorker = (obj: any) => {
  const message2call = createMsg2call<{ inited: () => void }>({
    funcsObj: obj,
    isSendErrorStack: true,
    timeout: 0,
    sendMessage(data) {
      postMessage(data)
    },
  })
  onmessage = (event) => {
    message2call.message(event.data)
  }

  return message2call
}
