<script lang="ts">
  import SearchInput from '@/components/material/SearchInput.svelte'
  import { tipSearch as search } from '@/modules/resource/search/tip'
  import { getLocation, query, replace } from '@/plugins/routes'
  import { debounce } from '@/shared'
  import { toOnline, urlParamKeyMap, useOnlineResourceAvailable } from '@/views/Online/shared.svelte'
  import { workers } from '@/worker'
  import { onMount, untrack, type ComponentExports } from 'svelte'
  import { t } from '@/plugins/i18n'
  import { useCommands } from '@/modules/app/reactive.svelte'
  import { executeCommand, getLastUsedCommands, setLastUsedCommand } from '@/modules/app/store/action'
  import { appEvent } from '@/modules/app/store/event'

  let onlineResourceAvailable = useOnlineResourceAvailable()

  let searchInput = $state<ComponentExports<typeof SearchInput> | null>(null)
  let currentText = ''
  let isCommandMode = false

  const commands = useCommands()

  const getCommandList = async (command: string) => {
    let cmds = [...commands.val]
    const lastUsedCommands = getLastUsedCommands()
    if (lastUsedCommands.length) {
      const newCommands: AnyListen.Extension.Command[] = []
      for (let i = cmds.length - 1; i >= 0; i--) {
        const cmd = cmds[i]
        const idx = lastUsedCommands.indexOf(cmd.fullCommand)
        if (idx !== -1) {
          cmds.splice(i, 1)
          newCommands[idx] = cmd
        }
      }
      cmds = newCommands.filter((c) => c).concat(cmds)
    }
    return workers.main.searchCommand(cmds, command)
  }
  const tipSearch = debounce(async (text: string) => {
    currentText = text
    if (onlineResourceAvailable.val) {
      if (!text) {
        isCommandMode ||= false
        searchInput?.setList([])
        return
      }
    } else if (!currentText.startsWith('>')) {
      text = `> ${text}`
      currentText = text
    }

    if (currentText.startsWith('>')) {
      isCommandMode ||= true
      const command = currentText.slice(1).trim()
      void getCommandList(command).then((list) => {
        if (!currentText.startsWith('>') || currentText != text) return
        searchInput?.setList(
          list.map((item) => ({ title: item.name, desc: item.description, label: item.command, id: item.fullCommand }))
        )
      })
      return
    }

    isCommandMode &&= false
    void search(text).then((list) => {
      if (!currentText || currentText != text) return
      searchInput?.setList(list.map((item) => ({ title: item, id: item })))
    })
  }, 50)

  const handleSubmit = (text: string) => {
    if (!onlineResourceAvailable.val) return
    text = text.trim()
    if (text && isCommandMode) {
      text = text.slice(1).trim()
      searchInput?.setList([])
    }
    if (!text && getLocation().query[urlParamKeyMap.type] != 'search') {
      currentText = ''
      searchInput?.setText('')
      searchInput?.setList([])
      return
    }
    void toOnline(text)
  }

  const handleListClick = (index: number, text: string) => {
    if (isCommandMode) {
      const command = text
      void executeCommand(command).then(() => {
        setLastUsedCommand(command)
      })
      currentText = ''
      if (onlineResourceAvailable.val) {
        isCommandMode ||= false
        searchInput?.setList([])
      }
      searchInput?.setText('')
      return
    }
    void toOnline(text)
  }

  $effect(() => {
    if ($query[urlParamKeyMap.type] != 'search') return
    currentText = $query[urlParamKeyMap.query] ?? ''
    untrack(() => {
      searchInput?.setText(currentText)
      if (!currentText) searchInput?.setList([])
    })
  })

  $effect(() => {
    if (onlineResourceAvailable.val) {
      searchInput?.setList([])
      return
    }
    isCommandMode ||= true
    const command = currentText.slice(1).trim()
    void getCommandList(command).then((list) => {
      searchInput?.setList(
        list.map((item) => ({ title: item.name, desc: item.description, label: item.command, id: item.fullCommand }))
      )
    })
  })

  onMount(() => {
    return appEvent.on('executeCommand', (command) => {
      if (command != 'run') return
      searchInput?.focus()
      searchInput?.setText('> ')
      tipSearch('>')
    })
  })
</script>

<SearchInput
  --width="56%"
  --max-width="38rem"
  --min-width="15rem"
  placeholder={$t('search.placeholder')}
  bind:this={searchInput}
  oninput={(text: string) => {
    tipSearch(text.trim())
  }}
  onsubmit={handleSubmit}
  onlistclick={handleListClick}
  onhomebtnclick={onlineResourceAvailable.val
    ? () => {
        void replace('/online')
      }
    : undefined}
  onbackbtnclick={onlineResourceAvailable.val
    ? () => {
        history.back()
      }
    : undefined}
/>
