import { injectable } from 'tsyringe'
import { app, shell } from 'electron'
import * as fs from 'node:fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'node:path'
import * as os from 'node:os'

@injectable()
export class FileService {
  appDataPath = app.getPath('userData')
  platform = os.platform()

  async copyFileToAppFolder(sourcePath: string, copyPath: string): Promise<string> {
    const fileExtension = this.getFileExtension(sourcePath) //확장자 구하기
    const copyFileName = uuidv4() + fileExtension //파일 이름 생성
    const savedPath = path.join(this.appDataPath, copyPath) //system를 기준으로하는 path

    fs.mkdirSync(savedPath, { recursive: true })

    await fs.promises.copyFile(sourcePath, path.join(savedPath, copyFileName))
    console.log(`Copied to ${savedPath}`)

    return path.join(copyPath, copyFileName)
  }

  private getFileExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase()
  }

  async generateFileLinkToAppFolder(sourcePath: string, generatePath: string): Promise<string> {
    const savedPath = path.join(this.appDataPath, generatePath) //system를 기준으로하는 path
    await fs.promises.mkdir(savedPath, { recursive: true }) // 폴더 없으면 생성

    let copyFileName = uuidv4() //파일 이름 생성

    if (this.platform === 'win32') {
      copyFileName += '.lnk'
      const rst = shell.writeShortcutLink(path.join(savedPath, copyFileName), 'create', {
        target: sourcePath
      })
      if (!rst) {
        console.error(`Copied fail ${copyFileName} to ${sourcePath}`)
        throw new Error('window link generate fail')
      }
    } else {
      try {
        await fs.promises.symlink(sourcePath, path.join(savedPath, copyFileName))
      } catch (err) {
        console.error(`Copied fail ${copyFileName} to ${sourcePath} err : ${err}`)
        throw new Error('symlink generate fail')
      }
    }

    return path.join(generatePath, copyFileName)
  }
}
