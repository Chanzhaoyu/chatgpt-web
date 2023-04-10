import path from 'path'
import { existsSync, mkdirSync } from 'fs'
import multer from 'multer'

const BASE_FOLDER = path.resolve(__dirname, '../../uploads')
const getRandom = () => `${Date.now()}-${Math.round(Math.random() * 1e9)}`

;(() => {
  if (!existsSync(BASE_FOLDER))
    mkdirSync(BASE_FOLDER)
})()

export const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = `${BASE_FOLDER}/${getRandom()}`
    if (!existsSync(folder))
      mkdirSync(folder)

    cb(null, folder)
  },
  filename(req, file, cb) {
    const names = file.originalname.split('.')
    const ext = names.pop() ?? ''
    const uniqueSuffix = getRandom()
    cb(null, `${names.join('.')}-${uniqueSuffix}.${ext}`)
  },
})

export const handlerFullPath = (fullPath: string) => {
  const arr = fullPath.replace(/\\/g, '/').split('/')
  const filename = arr.pop()

  return {
    fullPath,
    filename,
    folder: arr.join('/'),
  }
}
