import { injectable } from 'tsyringe'
import { ExternalImageService } from './externalImageService'
import { BrowserWindow } from 'electron'

@injectable()
export class GoogleImageService implements ExternalImageService {
  async search(query: string): Promise<string[]> {
    const window = new BrowserWindow({
      show: false,
      webPreferences: {
        offscreen: true
      }
    })

    try {
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`
      await window.loadURL(url, {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      })

      // Simulate scrolling and extract images
      const results = await window.webContents.executeJavaScript(`
        (async () => {
          // Scroll down to load more images
          for(let i = 0; i < 3; i++) {
            window.scrollTo(0, document.body.scrollHeight);
            await new Promise(r => setTimeout(r, 500));
          }

          const images = Array.from(document.querySelectorAll('img'));
          const urls = images
            .map(img => img.src || img.dataset.src)
            .filter(src => src && src.startsWith('http') && !src.includes('google.com'));
          
          // Also try to find original high-res URLs in script tags if visible
          const scripts = Array.from(document.querySelectorAll('script'));
          const scriptText = scripts.map(s => s.textContent).join('\\n');
          const regex = /"([^"]+)",\\["([^"]+)",(\\d+),(\\d+)\\],\\["([^"]+)",(\\d+),(\\d+)\\]/g;
          let match;
          while ((match = regex.exec(scriptText)) !== null) {
            const highResUrl = match[5];
            if (highResUrl && highResUrl.startsWith('http') && !highResUrl.includes('google.com')) {
              urls.push(highResUrl);
            }
          }

          return [...new Set(urls)];
        })()
      `)

      return (results as string[]).slice(0, 40)
    } catch (error) {
      console.error('Google Image Search Error:', error)
      return []
    } finally {
      window.close()
    }
  }
}
