export {}

declare global {
  interface Window {
    api: {
      selectImage: () => Promise<string>
      selectVideo: () => Promise<string>
      selectFile: () => Promise<string>
      selectFolder: () => Promise<string>
      getFolderByPath: (targetPath: string) => Promise<string>
      getFileNameByPath: (targetPath: string) => Promise<string>
      callService: (service: string, method: string, payload?: object) => Promise<never>
    }
  }
}
