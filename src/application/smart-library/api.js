import { url } from 'src/global/api'

export const api = {
  'smartLibraryListing': url.apiUrl + '/smart-library-list',
  'smartLibraryDetails': url.apiUrl + '/smart-library/{0}',
  'smartLibrary': url.apiUrl + '/smart-library',
  'smartLibraryProduct': url.apiUrl + '/smart-library-product',
  'smartLibraryFileType': url.apiUrl + '/smart-library-file-type'
}
