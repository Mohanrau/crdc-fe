export default {
  tableDataSales: (state) => {
    return state.salesList
  },
  listSalesInvoices: (state) => {
    return state.salesInvoiceSearchList
  },
  tableDataSalesCancellation: (state) => {
    return state.salesCancellationList
  },
  tableDataProductExchange: (state) => {
    return state.productExchangeList
  },
  tableDataAeonList: (state) => {
    return state.aeonPaymentList
  },
  tableDataEPPList: (state) => {
    return state.eppPaymentList
  },
  listProductAndKittingSearchList: (state) => {
    return {
      list: {
        // data: state.salesProductSearchList.data.products.data.concat(state.salesProductSearchList.data.kitting.data)
      }
    }
  },
  eppMotoApprovalResponseData: (state) => {
    return state.eppMotoApprovalResponse.data
  },
  eppMotoRejectionResponseData: (state) => {
    return state.eppMotoRejectionResponse.data
  }
}
