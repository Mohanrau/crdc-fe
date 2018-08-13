<template>
  <div class="general-page-holder">
    <basic-form formName="ProductSalesReport"
                formTitle="Product Sales Report Form"
                :backgroudColor="false"
                v-bind:formFieldData="productSalesReportSearchData"
                urlResetPathName=""
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm"
                :buttonOneVisibility="true"
                :buttonOneCaption="$t('bonus.yearlyIncome.button.printStatement')"
                buttonOneIcon="print"
                :buttonTwoVisibility="false"
                buttonThreeCaption="Reset"
                buttonThreeIcon="autorenew"
                :buttonThreeVisibility="false">
      <template slot="form">
        <div class="form-holder layout-padding docs-input bg-white shadow-1">
          <div class="row gutter-md">
            <div class="col-12">
              <q-field
                label-width="3"
                label="Country"
              >
                <q-select
                  color="black"
                  multiple
                  v-model="productSalesReportSearchData.country_ids"
                  :options="countriesOptions.options"
                ></q-select>
              </q-field>
            </div>
            <!--<div class="col-12">-->
              <!--<q-field-->
                <!--label-width="3"-->
                <!--:label="$t('sale.cancellation.detail.label.transactionLocation')"-->
              <!--&gt;-->
                <!--<q-select-->
                  <!--multiple-->
                  <!--v-model="productSalesReportSearchData.location_ids"-->
                  <!--:options="locationsOptionsByCountry"-->
                <!--/>-->
              <!--</q-field>-->
            <!--</div>-->
            <div class="col-12">
              <div class="row gutter-xs  justify-between">
                <div class="col-lg-6 col-xs-6">
                  <q-field
                    label-width="6"
                    label="Invoice Date From"
                    :error="$v.productSalesReportSearchData.from_date.$error"
                    error-label="Transaction date from must be before transaction date to"
                  >
                    <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                v-model="productSalesReportSearchData.from_date"
                    />
                  </q-field>
                </div>
                <div class="col-lg-6 col-xs-6">
                  <q-field
                    label-width="3"
                    label="  To"
                    :error="$v.productSalesReportSearchData.to_date.$error"
                    error-label="Transaction Date to must be later than transaction date from, and cannot be future date"
                  >
                    <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                v-model="productSalesReportSearchData.to_date"
                    />
                  </q-field>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="row gutter-xs justify-between">
                <div class="col-lg-6 col-xs-6">
                  <q-field
                    label-width="6"
                    label="CW From"
                    :error="$v.productSalesReportSearchData.cw_from.$error"
                    error-label="Submission date from must be before submission date to"
                  >
                    <q-select
                      v-model="productSalesReportSearchData.cw_from"
                      :options="commissionWeeks"
                      filter
                      clearable
                      color="black"
                    ></q-select>
                  </q-field>
                </div>
                <div class="col-lg-6 col-xs-6">
                  <q-field
                    label-width="3"
                    label="  To"
                    :error="$v.productSalesReportSearchData.cw_to.$error"
                    error-label="Submission Date to must be later than submission date from, and cannot be future date"
                  >
                    <q-select
                      v-model="productSalesReportSearchData.cw_to"
                      :options="commissionWeeks"
                      filter
                      clearable
                      color="black"
                    ></q-select>
                  </q-field>
                </div>
              </div>
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12">
              <div class="general-item q-mb-sm relative-position">
                <q-chips-input
                  @blur="clear"
                  readonly
                  placeholder="Choose ..."
                  inverted-light
                  color="white"
                  class="no-shadow custom-input-border"
                  :value="categoryTempNames"
                  :stack-label="$t('products.pwpfoc.byCategory')">
                  <q-popover fit :offset="[0, 10]" ref="catPopover">
                    <div class="category-popover pd-10">
                      <ul>
                        <li v-for="level1 in categoryTree">
                          <q-icon name="chevron_right"/>
                          <q-icon v-if="activeSelected(level1.id)"
                                  name="highlight_off"/>
                          <span :class="{'active': activeSelected(level1.id) }"
                                class="cursor-pointer"
                                @click="setCategory(level1.id, level1.name, 1)">
                                                                    {{ level1.name }}
                                                                </span>
                          <ul>
                            <li v-for="level2 in level1.children">
                              <q-icon v-if="activeSelected(level2.id)"
                                      name="highlight_off"/>
                              <span :class="{'active': activeSelected(level2.id) }"
                                    class="cursor-pointer"
                                    @click="setCategory(level2.id, level2.name, 2)">
                                                                        {{ level2.name }}
                                                                    </span>
                              <ul>
                                <li v-for="level3 in level2.children">
                                  <q-icon v-if="activeSelected(level3.id)"
                                          name="highlight_off"/>
                                  <span :class="{'active': activeSelected(level3.id) }"
                                        class="cursor-pointer"
                                        @click="setCategory(level3.id, level3.name, 3)">
                                                                                {{ level3.name }}
                                                                            </span>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </q-popover>
                </q-chips-input>
              </div>
            </div>
          </div>
        </div>
      </template>
      <q-loader :visible="isProcessingForm"></q-loader>
    </basic-form>
  </div>
</template>

<script>
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { DatesMixin,MasterDataTransformarMixin } from 'src/application/global/mixins/index'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import { openURL } from 'quasar'
  import { required, minLength } from 'vuelidate/lib/validators'

  // unFlatten categoryData to tree
  function unflatten(array, parent, tree) {
    tree = typeof tree !== 'undefined' ? tree : []
    parent = typeof parent !== 'undefined' ? parent : {id: 0}

    var children = _.filter(array, function (child) {
      return child.parent_id === parent.id
    })

    if (!_.isEmpty(children)) {
      if (parent.id === 0) {
        tree = children
      } else {
        parent['children'] = children
      }
      _.each(children, function (child) {
        unflatten(array, child)
      })
    }
    tree.sort(function (a, b) {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
    return tree
  }

  export default {
    name: "product-sales-report",
    mixins: [DatesMixin, setFormFieldErrorsMixin, MasterDataTransformarMixin],
    components: {
      genaralHeader,
      basicForm,
      qLoader
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        selectedFilters: state => state.globalCMP.selectedFilters,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        errors: state => state.globalCMP.errors.data,
        categoryData: state => state.productsCMP.productCategories.list.data
      }),
      ...mapGetters([
        'locationsOptionsByCountry'
      ])
    },
    mounted: function () {
      this.productSalesReportSearchData.country_ids = [this.selectedFilters.countryID]
      this.productSalesReportSearchData.from_date = this.getCurrentDate()
      this.productSalesReportSearchData.to_date = this.getCurrentDate()
      this.master.keys = [this.$const.masterKey.YEARLY_REPORT_TYPE]
      this.getCountriesAction()
      this.getCommissionWeeksData()
      let query1 = {
        country_id: this.selectedFilters.countryID,
        relations: ['entity.locations']
      }
      this.getCountryRelationAction(query1)
      let query = {
        for_sales: true,
        active: true,
        limit: 0
      }
      this.getProductCategoriesAction(query).then(() => {
        this.categoryTree = unflatten(this.categoryData)
      })
    },
    data: () => ({
      years: [],
      categoryTempNames: [],
      productSalesReportSearchData: {
        country_ids: [],
        location_ids: [],
        from_date: '',
        to_date: '',
        cw_from: null,
        cw_to: null,
        invoice_status: '',
        broad_categories : [],
        sub_categories : [],
        minor_categories : []
      },
      categoryTree: [],
      selectedCategoryIds: []
    }),
    validations: {
      productSalesReportSearchData: {
        from_date: {
          isInRange (val, elm) {
            if (elm && val !== '') {
              let diff = this.getDateDiff(elm.to_date, val, 'days')
              if (diff < 0) {
                return false
              }
            }
            return true
          }
        },
        to_date: {
          isInRange (val, elm) {
            if (elm) {
              let diff = this.getDateDiff(this.getCurrentDate(), val, 'days')
              if (diff >= 0) {
                return true
              } else {
                return false
              }
            }
            return false
          }
        },
        cw_from: {
          isInRange (val, elm) {
            if (elm && val !== '' && val !== null) {
              let diff = this.getDateDiff(elm.cw_to, val, 'days')
              if (diff < 0) {
                return false
              }
            }
            return true
          }
        },
        cw_to: {
          isInRange (val, elm) {
            if (elm && val !== '' && val !== null) {
              let diff = this.getDateDiff(this.getCurrentDate(), val, 'days')
              if (diff >= 0) {
                return true
              } else {
                return false
              }
            }
            return false
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getMemberSearchAction',
        'getProductSalesReportAction',
        'getCountryRelationAction',
        'getCommissionWeekSearchAction',
        'getProductCategoriesAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      getCommissionWeeksData () {
        let query = {
          filter_type: 'past',
          limit: 50,
          sort: 'date_from',
          order: 'desc'
        }
        this.getCommissionWeekSearchAction(query).then(() => {
          if (this.commissionWeeks.length > 0) {
            this.productSalesReportSearchData.cw_from = this.commissionWeeks[0].value
            this.productSalesReportSearchData.cw_to = this.commissionWeeks[0].value
          }
        })
      },
      clear() {
        if (this.productSalesReportSearchData.category_name === '') {
          this.productSalesReportSearchData.category_id = []
        }
      },
      activeSelected(id) {
        if (typeof this.selectedCategoryIds !== 'undefined') {
            return this.selectedCategoryIds.includes(id)
        }
        return false
      },
      setCategory(id, name, level) {
        if (this.selectedCategoryIds.includes(id)) {
          this.selectedCategoryIds.splice(this.selectedCategoryIds.indexOf(id), 1)
        } else {
          this.selectedCategoryIds.push(id)
        }
        let list = this.productSalesReportSearchData.broad_categories
        if (level === 2) {
          list = this.productSalesReportSearchData.sub_categories
        } else if (level === 3) {
          list = this.productSalesReportSearchData.minor_categories
        }
        if (list.includes(id)) {
          list.splice(list.indexOf(id), 1)
        } else {
          list.push(id)
        }
        this.getCategoriesNames()
      },
      getCategoriesNames() {
        if (typeof this.categoryData !== 'undefined') {
          this.categoryTempNames = []
          if (typeof this.selectedCategoryIds !== 'undefined') {
              this.selectedCategoryIds.forEach((element) => {
                let cat = this.categoryData.find(x => x.id === element)
                this.categoryTempNames.push(cat.name)
              })
          }
        }
        return this.categoryTempNames
      },
      processForm () {
        this.$v.productSalesReportSearchData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.productSalesReportSearchData.$error) {
            let query = {
              country_ids: this.productSalesReportSearchData.country_ids,
              location_ids: this.productSalesReportSearchData.location_ids,
              from_date: this.formatDate(this.productSalesReportSearchData.from_date, 'YYYY-MM-DD'),
              to_date: this.formatDate(this.productSalesReportSearchData.to_date, 'YYYY-MM-DD'),
              from_cw: this.productSalesReportSearchData.cw_from,
              to_cw: this.productSalesReportSearchData.cw_to,
              broad_categories : this.productSalesReportSearchData.broad_categories,
              sub_categories : this.productSalesReportSearchData.sub_categories,
              minor_categories : this.productSalesReportSearchData.minor_categories
            }
            this.getProductSalesReportAction(query).then((res) => {
              let pdfUrl = res
              if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '' && pdfUrl.length > 0) {
                pdfUrl.forEach((pdf) => {
                  if (pdf.download_link !== undefined && pdf.download_link !== null) {
                    openURL(pdf.download_link)
                  }
                })
              }
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          } else {
            this.setNotification({
              title: this.$t('bonus.yearlyIncome.notification.yearlyReportRequestFail.title'),
              message: this.$t('bonus.yearlyIncome.notification.yearlyReportRequestFail.message'),
              type: 'negative'
            })
            reject(this.$v.productSalesReportSearchData.$error)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
