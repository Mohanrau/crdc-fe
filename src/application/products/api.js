import { url } from '../../global/api'

export const api = {
  'products': url.apiUrl + '/products-list',
  'productSearch': url.apiUrl + '/products-search',
  'productSave': url.apiUrl + '/product-details',
  'productById': url.apiUrl + '/product-details',
  'productImagesById': url.apiUrl + '/product-images',
  'productStoragePath': url.appStorageUrl,
  'kitting': url.apiUrl + '/kitting-list',
  'productRemoveImageById': url.apiUrl + '/product-image-delete',
  'productLessById': url.apiUrl + '/product-details',
  'productKittingById': url.apiUrl + '/kitting-details',
  'productKittingSave': url.apiUrl + '/kitting',
  'productGroupingList': url.apiUrl + '/dummy-list',
  'createProductGrouping': url.apiUrl + '/dummy',
  'getProductGroupingDetail': url.apiUrl + '/dummy-details',
  'productCategories': url.apiUrl + '/product-categories-list',
  'pwpFoc': url.apiUrl + '/promotion-free-item-list',
  'PwpFocSave': url.apiUrl + '/promotion-free-item',
  'kittingSearch': url.apiUrl + '/kitting-list',
  'pwpFocById': url.apiUrl + '/promotion-free-item-details'
}
