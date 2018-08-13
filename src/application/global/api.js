import { url } from '../../global/api'
export const api = {
  'appPath': url.appUrl,
  'userTypes': url.apiUrl + '/user/types',
  'countries': url.apiUrl + '/countries-list',
  'categories': url.apiUrl + '/product-categories-list',
  'fileUploadSetting': url.apiUrl + '/file-upload-setting',
  'fileUploadProcess': url.apiUrl + '/file-upload-process',
  'mastersKey': url.apiUrl + '/master/keys',
  'languages': url.apiUrl + '/languages-list',
  'dynamicContent': url.apiUrl + '/country-dynamic-content/types',
  'countryRelation': url.apiUrl + '/country/relation',
  'states': url.apiUrl + '/states/',
  'cities': url.apiUrl + '/cities/',
  'searchMember': url.apiUrl + '/member-list',
  'commissionWeek': url.apiUrl + '/cw-schedules-list',
  'userDetails': url.apiUrl + '/user',
  'workflowUpdate': url.apiUrl + '/workflow-tracking-step-update',
  'giroType': url.apiUrl + '/setting/giro-types',
  'inventoryProcurementAccessToken': url.apiUrl + '/get-oauth-token',
  'stockLocations': url.apiUrl + '/stock-locations',
  'getLocationTypes': url.apiUrl + '/locations-types-list'
}
