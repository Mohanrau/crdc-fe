<template>
  <div class="general-page-holder">
    <basic-form formName="StockistConsignmentStockReport"
                formTitle="Stockist Consignment Stock Report Form"
                :backgroudColor="false"
                v-bind:formFieldData="reportData"
                urlResetPathName=""
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm"
                :buttonOneVisibility="true"
                :buttonOneCaption="$t('stockist.consignmentStockReport.button.generateReport')"
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
                :label="$t('stockist.consignmentStockReport.label.country')"
              >
                <q-select
                  clearable
                  color="black"
                  v-model="reportData.country_id"
                  :options="countriesOptions.options"
                ></q-select>
              </q-field>
            </div>
            <div class="col-12">
              <q-field
                label-width="3"
                :label="$t('stockist.consignmentStockReport.label.stockist')"
              >
                <q-input v-model.lazy="reportData.stockist_search">
                  <q-autocomplete @search="(terms, done) => search(terms, done, 'filterTerms')"
                                  @selected="(item) => selected(item, 'stockistNumber')"/>
                </q-input>
                <q-chip square small v-if="reportData.stockist_info !== ''">
                  <div class="stockist-info">
                    <div class="stockist-info-label">{{reportData.stockist_info}}</div>
                    <div class="stockist-info-button">
                    <q-btn icon="cancel" size="xs" @click="removeStockistInfo" dense text-color="grey" round />
                    </div>
                  </div>
                </q-chip>
              </q-field>
            </div>
          </div>
        </div>
        <q-loader :visible="isProcessingForm"></q-loader>
      </template>
    </basic-form>
  </div>
</template>

<script>
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import { openURL } from 'quasar'
  import { required } from 'vuelidate/lib/validators'

  export default {
    name: "stockist-consignment-stock-report",
    mixins: [setFormFieldErrorsMixin],
    components: {
      genaralHeader,
      basicForm,
      qLoader
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        selectedFilters: state => state.globalCMP.selectedFilters,
        stockistSearchData: state => state.stockistCMP.stockistSearchData,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        errors: state => state.globalCMP.errors.data
      }),
      ...mapGetters([
        'locationsOptionsByCountry'
      ])
    },
    mounted: function () {
      this.reportData.country_id = this.selectedFilters.countryID
      this.getCountriesAction()
    },
    data: () => ({
      reportData: {
        country_id: null,
        stockist_search: '',
        stockist_id: null,
        stockist_info: ''
      }
    }),
    validations: {
      reportData: {
        country_id: {
          required
        },
        stockist_id: {
          required
        }
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getStockistSearchAction',
        'getStockistConsignmentStockReport'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      removeStockistInfo () {
        this.reportData.stockist_id = null
        this.reportData.stockist_info = ''
        this.reportData.stockist_search = ''
      },
      search (terms, done, field) {
        if (field === 'filterTerms' && this.reportData.country_id !== null) {
          let query = {
            search_text: this.reportData.stockist_search,
            country_id: this.reportData.country_id,
            limit: 10
          }
          this.getStockistSearchAction(query).then(res => {
            done(this.stockistSearchData.list)
          })
        } else {
          done(null)
        }
      },
      selected (item, field) {
        this[field] = item.sublabel
        if (field === 'stockistNumber') {
          this.reportData.stockist_id = item.stockist_id
          this.reportData.stockist_info = item.label
        }
      },
      processForm () {
        this.$v.reportData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.reportData.$error) {
            this.setIsProcessingForm(true)
            let query = {
              country_id: this.reportData.country_id,
              stockist_id: this.reportData.stockist_id
            }
            this.getStockistConsignmentStockReport(query).then((res) => {
              let pdfUrl = res
              if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '' && pdfUrl.length > 0) {
                pdfUrl.forEach((pdf) => {
                  if (pdf.download_link !== undefined && pdf.download_link !== null) {
                    openURL(pdf.download_link)
                  }
                })
              }
              this.setIsProcessingForm(false)
              resolve(res)
            }).catch(error => {
              this.setNotification({
                title: this.$t('stockist.consignmentStockReport.notification.title'),
                message: this.$t('stockist.consignmentStockReport.notification.nodata'),
                type: 'negative'
              })
              this.setIsProcessingForm(false)
              reject(error)
            })
          } else {
            this.setNotification({
              title: this.$t('stockist.consignmentStockReport.notification.title'),
              message: this.$t('stockist.consignmentStockReport.notification.message'),
              type: 'negative'
            })
            reject(this.$v.reportData.$error)
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
    .stockist-info
        display flex;

    .stockist-info-label
        display flex;
        padding-top 4px;
        padding-right 10px;

    .stockist-info-button
        display flex;
</style>
