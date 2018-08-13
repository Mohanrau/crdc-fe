import { url } from '../../global/api'

export const api = {
  'members': url.apiUrl + '/member-list',
  'memberTabs': url.apiUrl + '/member/tabs',
  'memberPlacementTree': url.apiUrl + '/member-placement-tree',
  'memberDetail': url.apiUrl + '/member-details',
  'memberPasswordReset': url.apiUrl + '/password/email',
  'memberDetails': url.apiUrl + '/member-details',
  'member': url.apiUrl + '/member',
  'memberPlacementOuterTree': url.apiUrl + '/member-placement-tree-outer',
  'memberTree': url.apiUrl + '/member-tree',
  'memberRankUpdate': url.apiUrl + '/member-ranks',
  'memberRankList': url.apiUrl + '/member-ranks-list',
  'memberHighestRank': url.apiUrl + '/team-bonus-ranks-list',
  'memberEnrollmentRank': url.apiUrl + '/enrollment-ranks-list',
  'memberMigrationList': url.apiUrl + '/member-migrate-list',
  'memberMigrationUpdate': url.apiUrl + '/member-migrate',
  'memberStatusList': url.apiUrl + '/member-status-list',
  'memberStatusUpdate': url.apiUrl + '/member-status',
  'memberWalletTransactions': url.apiUrl + '/ewallet/transactions'
}
