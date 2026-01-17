export async function extractFrames(videoPath: string, count: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = `file://${videoPath}`
    video.crossOrigin = 'anonymous'
    video.preload = 'auto'

    const frames: string[] = []
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    video.onloadedmetadata = async () => {
      const duration = video.duration
      if (isNaN(duration) || duration === 0) {
        reject(new Error('Invalid video duration'))
        return
      }

      const interval = duration / (count + 1)
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      try {
        for (let i = 1; i <= count; i++) {
          const time = i * interval
          video.currentTime = time
          
          await new Promise<void>((resolveSeek) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked)
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                frames.push(canvas.toDataURL('image/jpeg', 0.8))
              }
              resolveSeek()
            }
            video.addEventListener('seeked', onSeeked)
          })
        }
        resolve(frames)
      } catch (err) {
        reject(err)
      } finally {
        video.src = ''
        video.load()
      }
    }

    video.onerror = (err) => {
      reject(new Error(`Video load error: ${err}`))
    }
  })
}
