import { url } from 'src/global/api'

export const api = {
  'productSearch': url.apiUrl + '/products-search',
  'productLessById': url.apiUrl + '/product-details',
  'campaignLocationListing': url.apiUrl + '/country/relation',
  'teamBonusRanksList': url.apiUrl + '/team-bonus-ranks-list',
  'enrollmentRanksList': url.apiUrl + '/enrollment-ranks-list',
  'campaignListing': url.apiUrl + '/campaign-list',
  'campaign': url.apiUrl + '/campaign',
  'esacVoucherTypeListing': url.apiUrl + '/esac-voucher-type-list',
  'esacVoucherType': url.apiUrl + '/esac-voucher-type',
  'esacVoucherSubTypeListing': url.apiUrl + '/esac-voucher-sub-type-list',
  'esacVoucherSubType': url.apiUrl + '/esac-voucher-sub-type',
  'esacPromotionListing': url.apiUrl + '/esac-promotion-list',
  'esacPromotion': url.apiUrl + '/esac-promotion',
  'esacVoucherListing': url.apiUrl + '/esac-voucher-list',
  'esacVoucher': url.apiUrl + '/esac-voucher',
  'esacRedemptionListing': url.apiUrl + '/sales-list'
}
