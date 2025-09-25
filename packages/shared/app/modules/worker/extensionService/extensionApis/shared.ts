export const cloneData = <T>(data: T) => {
  return data === undefined ? data : (JSON.parse(JSON.stringify(data)) as T)
}
