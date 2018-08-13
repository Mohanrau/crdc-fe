/**
 *
 * @type {{appStorageUrl: *, apiUrl: *, ctxPath: string}}
 */
let protocol = process.env.HTTPS === 'enable' ? 'https:' : 'http:'
export const url = {
  appStorageUrl: protocol + process.env.APP_STORAGE_URL,
  apiUrl: protocol + process.env.BACKEND_URL,
  ctxPath: '/dist'
}
