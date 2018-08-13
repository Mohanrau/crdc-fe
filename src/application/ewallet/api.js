import { url } from '../../global/api'

export const api = {
  'walletAdjustmentList': url.apiUrl + '/ewallet/adjustment',
  'loadWalletAdjustment': url.apiUrl + '/ewallet/adjustment/details',
  'createWalletAdjustment': url.apiUrl + '/ewallet/adjustment/create',
  'giroPaymentHistory': url.apiUrl + '/ewallet/bank-payment-history',
  'giroPaymentDetail': url.apiUrl + '/ewallet/bank-payment',
  'giroPaymentGenerate': url.apiUrl + '/ewallet/generate-bank-payment',
  'giroRejectedPaymentList': url.apiUrl + '/ewallet/rejected-payment',
  'giroRejectedPaymentUploadExcel': url.apiUrl + '/ewallet/upload-rejected-payment-file',
  'giroRejectedPaymentSubmit': url.apiUrl + '/ewallet/submit-rejected-payment-records',
  'submitGiroRejectedLevelOne': url.apiUrl + '/ewallet/rejected-payment-level-one',
  'submitGiroRejectedLevelTwo': url.apiUrl + '/ewallet/rejected-payment-level-two'
}
