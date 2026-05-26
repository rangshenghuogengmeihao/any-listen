export interface Line {
  text: string
  time: number
  extendedLyrics: string[]
  dom_line: HTMLDivElement
}
export interface InitState {
  lines: Line[]
  text: string
  line: number
}

export const lyricState: InitState = {
  lines: [],
  text: '',
  line: 0,
}
