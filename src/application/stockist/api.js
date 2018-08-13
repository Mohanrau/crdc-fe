import { url } from '../../global/api'

export const api = {
  'stockistListing': url.apiUrl + '/stockist-list',
  'stockistCreateUpdate': url.apiUrl + '/stockist',
  'loadExistingStockist': url.apiUrl + '/stockist-details',
  'loadStockistOrderReturnListing': url.apiUrl + '/consignment-order-return-list',
  'stockistConsignmentOrderReturn': url.apiUrl + '/consignment-order-return',
  'loadExistingConsignmentOrderReturn': url.apiUrl + '/consignment-order-return-details',
  'stockistConsignmentDeposit': url.apiUrl + '/consignment-deposit',
  'stockistConsignmentRefund': url.apiUrl + '/consignment-refund',
  'loadStockistDepositSettings': url.apiUrl + '/consignment-deposit-refund-validate',
  'stockistDepositReturnListing': url.apiUrl + '/consignment-deposit-refund-list',
  'loadExistingStockistDepositRefund': url.apiUrl + '/consignment-deposit-refund-details',
  'loadStockistDailyTransactionList': url.apiUrl + '/stockist-daily-invoice-transaction-list',
  'batchReleaseStockistInvoice': url.apiUrl + '/batch-release-stockist-daily-invoice-transaction',
  'downloadConsignmentOrderReturnNote': url.apiUrl + '/consignment/downloadpdf',
  'stockistReturnProductSearch': url.apiUrl + '/consignment-return-product-validate',
  'stockistEligibleReturnCheck': url.apiUrl + '/consignment-return-validate',
  'stockistARSummary': url.apiUrl + '/stockist-outstanding-summary',
  'stockistPaymentVerificationList': url.apiUrl + '/stockist-daily-sale-payment-verification-list',
  'stockistPaymentVerificationUpdate': url.apiUrl + '/stockist-daily-sale-payment-verification-update',
  'dailyCollectionReport': url.apiUrl + '/daily-collection-report',
  'consignmentDepositRefundNote': url.apiUrl + '/download-consignment-deposit-receipt',
  'stockistConsignmentStockReport': url.apiUrl + '/stockist-consignment-stock-report'
}
