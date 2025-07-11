import { mount, tick, unmount } from 'svelte'

export const showFileSelectModal: AnyListen.IPC.ServerIPC['showOpenDialog'] = async (options) => {
  const App = (await import('./App.svelte')).default

  return new Promise<AnyListen.OpenDialogResult>((resolve, reject) => {
    const app = mount(App, {
      target: document.getElementById('root')!,
      props: {
        onafterleave() {
          void unmount(app, { outro: true })
        },
        onsubmit(result: AnyListen.OpenDialogResult) {
          resolve(result)
        },
      },
    })
    void tick().then(() => {
      app.show(options)
    })
  })
}
