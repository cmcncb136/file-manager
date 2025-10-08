export {}

declare global {
  interface Window {
    api: {
      selectImage: () => Promise<string>
      selectFile: () => Promise<string>
      selectFolder: () => Promise<string>
      callService: (service: string, method: string, payload?: object) => Promise<never>
    }
  }
}
