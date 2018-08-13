<template>
  <div class="general-page-holder relative-position">
    <basic-form formName="SalesForm"
                :formTitle="$t('sales.newSales.title')"
                :backgroudColor="false"
                v-bind:formFieldData="enrollmentData"
                urlResetPathName="Sales Order Cancellation List"
                formAction="salesOrderAction"
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm">
      <template slot="form">
        <div class="form-holder">
          <div class="row">
            <div class="col-lg-12">
              <div class="row justify-end">
                <!--right top panel-->
                <div class="col-xl-7 col-lg-7">
                  <q-card color="white" class="full-height">
                    <q-card-main class="text-black">
                      <div class="row md-gutter">
                        <div class="col-lg-6 personal-data-holder relative-position">
                          <!--default enrollment info, not dependant on member info-->
                          <q-list no-border >
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Country of Registration</q-item-tile>
                                <q-item-tile sublabel >
                                  <q-field>
                                    <q-select
                                      clearable
                                      color="black"
                                      disable
                                      v-model="enrollmentData.memberData.details.country_id"
                                      :options="countriesOptions.options"
                                      @input="registrationCountrySelected"
                                    />
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                            <q-item-main>
                              <q-item-tile label>Trans. Date</q-item-tile>
                              <q-item-tile sublabel >
                                {{ formatDate(enrollmentData.transaction_date) }}
                              </q-item-tile>
                            </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                            <q-item-main>
                              <q-item-tile label>Trans Location<span class="text-red">*</span></q-item-tile>
                              <q-item-tile sublabel >
                                <q-field
                                  :error="$v.enrollmentData.salesData.location_id.$error"
                                  error-label='Please insert transaction location'>
                                  <q-select
                                    v-model="enrollmentData.salesData.location_id"
                                    :options="locationsOptionsByCountry"
                                  />
                                </q-field>
                              </q-item-tile>
                            </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                            <q-item-main>
                              <q-item-tile label>Stock Location<span class="text-red">*</span></q-item-tile>
                              <q-item-tile sublabel >
                                <q-field
                                  :error="$v.enrollmentData.salesData.stock_location_id.$error"
                                  error-label='Please insert stock location'>
                                  <q-select
                                    v-model="enrollmentData.salesData.stock_location_id"
                                    :options="stockLocationsOptionsByCountry"
                                  />
                                </q-field>
                              </q-item-tile>
                            </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                            <q-item-main>
                              <q-item-tile label>CW</q-item-tile>
                              <q-item-tile sublabel >{{enrollmentData.memberData.details.cw}}</q-item-tile>
                            </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                            <q-item-main>
                              <q-item-tile label>Remarks</q-item-tile>
                              <q-item-tile sublabel >
                                <q-field
                                >
                                  <q-input
                                    v-model="enrollmentData.remarks"
                                    type="textarea"
                                    :max-height="50"
                                    :min-rows="2"
                                  />
                                </q-field></q-item-tile>
                            </q-item-main>
                            </q-item>
                          </q-list>
                          <q-loader :visible="isProcessingSection"></q-loader>
                        </div>
                        <!--for member rank upgrade only-->
                        <div class="col-lg-6 order-data-holder" v-if="hasExistingMemberInfo">
                          <q-list no-border >
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Member ID</q-item-tile>
                                <q-item-tile sublabel>{{enrollmentData.memberData.details.country.code + '-'+ enrollmentData.memberData.details.member_id}}</q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Full Name as per IC</q-item-tile>
                                <q-item-tile sublabel>
                                  {{enrollmentData.memberData.details.name}}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Nationality</q-item-tile>
                                <q-item-tile sublabel>
                                <q-select
                                  color="black"
                                  disable
                                  v-model="enrollmentData.memberData.details.nationality_id"
                                  :options="countriesOptions.options"
                                />
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Expiry Date</q-item-tile>
                                <q-item-tile sublabel>
                                {{enrollmentData.memberData.details.expiry_date}}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Upgraded Rank</q-item-tile>
                                <q-item-tile sublabel>
                                  insert upgraded rank here
                                  <!--fetched from BE later as products are added-->
                                </q-item-tile>
                              </q-item-main>
                           </q-item>
                          </q-list>
                        </div>
                        <!--for new and re-enroll-->
                        <div class="col-lg-6 order-data-holder" v-else>
                          <q-list no-border >
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Full name as per IC<span class="text-red">*</span></q-item-tile>
                                <q-item-tile sublabel>
                                  <q-field
                                    :error="$v.enrollmentData.memberData.details.name.$error"
                                    error-label="Please enter member name"
                                  >
                                    <q-input
                                      :disable="lockEnrollmentData"
                                      v-model="enrollmentData.memberData.details.name"
                                    />
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Translated Name</q-item-tile>
                                <q-item-tile sublabel>
                                  <q-field
                                  >
                                    <q-input
                                      v-model="enrollmentData.memberData.details.translated_name"
                                    />
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Nationality</q-item-tile>
                                <q-item-tile sublabel>
                                  <q-field
                                    :error="$v.enrollmentData.memberData.details.nationality_id.$error"
                                    error-label="Please select member nationality"
                                  >
                                    <q-select
                                      clearable
                                      color="black"
                                      v-model="enrollmentData.memberData.details.nationality_id"
                                      :options="countriesOptions.options"
                                    />
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item multiline>
                              <q-item-main>
                                <q-item-tile label>IC/Passport No<span class="text-red">*</span></q-item-tile>
                                <q-item-tile sublabel>
                                  <q-field
                                    :error="$v.enrollmentData.memberData.details.ic_pass_type_id.$error || $v.enrollmentData.memberData.details.ic_passport_number.$error"
                                    error-label="Please insert IC/Passport details"
                                  >
                                    <div class="row gutter-xs">
                                      <div class="col-lg-4 col-md-12 col-xs-12">
                                        <q-select
                                          v-model="enrollmentData.memberData.details.ic_pass_type_id"
                                          :options="masterDataOptionsCreator('ic_passport_type')"
                                        ></q-select>
                                      </div>
                                      <div class="col-lg-8 col-md-12 col-xs-12">
                                        <q-input
                                          type="text"
                                          v-model="enrollmentData.memberData.details.ic_passport_number"
                                        />
                                      </div>
                                    </div>
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Date of Birth<span class="text-red">*</span></q-item-tile>
                                <q-item-tile sublabel>
                                  <q-field
                                    :error="$v.enrollmentData.memberData.details.date_of_birth.$error"
                                    error-label="Please enter member date of birth"
                                  >
                                    <q-datetime
                                      align="left"
                                      monday-first
                                      format="DD-MM-YYYY"
                                      v-model="enrollmentData.memberData.details.date_of_birth"
                                     />
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>TIN No. Taiwan</q-item-tile>
                                <q-item-tile sublabel>
                                  <q-field
                                  >
                                    <q-input
                                      v-model="enrollmentData.memberData.details.tin_no_philippines"
                                    />
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>TIN No. Philippines</q-item-tile>
                                <q-item-tile sublabel>
                                  <q-field
                                  >
                                    <q-input
                                      v-model="enrollmentData.memberData.details.tin_no_philippines"
                                    />
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                          </q-list>
                        </div>
                      </div>
                    </q-card-main>
                  </q-card>
                </div>
                <div class="col-lg-5">
                  <q-card color="white" class="full-height no-padding">
                    <q-card-main class="text-black no-padding full-height">
                      <div class="row full-height">
                        <div class="col-5">
                          <div class="row no-margin content-stretch full-height">
                            <div class="col-12 pd-10">
                              <span class="text-grey-5">Total CV</span>
                              <p class="q-display-2 pd-10">{{ enrollmentData.salesData.cvs.total_cv }}</p>
                            </div>
                            <div class="col-12 gutter-xs">
                              <q-list sparse no-border class="full-height">
                                <q-item-separator />
                                <q-item tag="label">
                                  <q-item-main>
                                    <q-item-tile label class="text-grey-4">
                                      BA Diamond (480CV)
                                    </q-item-tile>
                                  </q-item-main>
                                </q-item>
                                <q-item-separator />
                                <q-item tag="label"  class="bg-teal">
                                  <q-item-main>
                                    <q-item-tile label class="text-grey-4">
                                      BA Platinum (300CV)
                                    </q-item-tile>
                                  </q-item-main>
                                </q-item>
                                <q-item-separator />
                                <q-item tag="label">
                                  <q-item-main>
                                    <q-item-tile label class="text-grey-4">
                                      BA Gold (120CV)
                                    </q-item-tile>
                                  </q-item-main>
                                </q-item>
                                <q-item-separator />
                                <q-item tag="label">
                                  <q-item-main>
                                    <q-item-tile label class="text-grey-4">
                                      BA Silver (60CV)
                                    </q-item-tile>
                                  </q-item-main>
                                </q-item>
                                <q-item-separator />
                                <q-item tag="label">
                                  <q-item-main>
                                    <q-item-tile label class="text-grey-4">
                                      Premier Member (30CV)
                                    </q-item-tile>
                                  </q-item-main>
                                </q-item>
                              </q-list>
                            </div>
                          </div>
                        </div>
                        <div class="verticle-line"></div>
                        <div class="col-6">
                          <q-list no-border dense class="full-width">
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Total NMP (NET)
                                </q-item-tile>
                                <q-item-tile sublabel>
                                  <q-input hide-underline
                                           type="number"
                                           :decimals="2"
                                           align="right"
                                           readonly
                                           :prefix="currencyLabelByCountry"
                                           v-model="enrollmentData.salesData.order_fees.total_nmp"/>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Admin Fee</q-item-tile>
                                <q-item-tile sublabel>
                                  <q-input type="number" :decimals="2" color="grey-7"
                                           @input="reCalculateCart('admin_fees')"
                                           inverted
                                           align="right"
                                           :prefix="currencyLabelByCountry"
                                           v-model="enrollmentData.salesData.order_fees.admin_fee"/>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Delivery Fee</q-item-tile>
                                <q-item-tile sublabel>
                                  <q-input type="number" :decimals="2" color="grey-7"
                                           @input="reCalculateCart('delivery_fees')"
                                           inverted
                                           align="right"
                                           :prefix="currencyLabelByCountry"
                                           v-model="enrollmentData.salesData.order_fees.delivery_fee"/>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Other Fee</q-item-tile>
                                <q-item-tile sublabel>
                                  <q-input type="number" :decimals="2" color="grey-8"
                                           inverted
                                           align="right"
                                           @input="reCalculateCart('other_fees')"
                                           :prefix="currencyLabelByCountry"
                                           v-model="enrollmentData.salesData.order_fees.other_fee"/>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Tax Amount</q-item-tile>
                                <q-item-tile sublabel>
                                  <q-input hide-underline type="number" :decimals="2"
                                           readonly
                                           align="right"
                                           :prefix="currencyLabelByCountry"
                                           v-model="enrollmentData.salesData.order_fees.tax_amount"/>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label
                                             :color="enrollmentData.salesData.invoice_id && enrollmentData.salesData.invoice !== null ? 'positive' : 'negative'">
                                  Total GMP (incl. Tax)
                                </q-item-tile>
                                <q-item-tile sublabel>
                                  <q-input hide-underline type="number" :decimals="2"
                                           :color="enrollmentData.salesData.invoice_id && enrollmentData.salesData.invoice !== null ? 'positive' : 'negative'"
                                           readonly
                                           inverted
                                           align="right"
                                           :prefix="currencyLabelByCountry"
                                           v-model="enrollmentData.salesData.order_fees.total_gmp"/>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>Rounding Adj. Amount</q-item-tile>
                                <q-item-tile sublabel class="mr-10">
                                  <q-input hide-underline type="number" :decimals="2"
                                           readonly
                                           align="right"
                                           :prefix="currencyLabelByCountry"
                                           v-model="enrollmentData.salesData.order_fees.rounding_adjustment"/>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                          </q-list>
                        </div>
                      </div>
                    </q-card-main>
                  </q-card>
                </div>
              </div>
            </div>
            <div class="col-lg-12 bg-white shadow-1 relative-position mt-20">
              <div class="col-lg-12">
                <q-card class="full-width" color="white">
                  <q-card-main
                    class="text-black"
                  >
                    <div class="form-tabs mt-20 text-black">
                      <q-tabs
                        inverted
                        two-lines color="grey-7"
                        align="left"
                        v-model="currentTab"
                      >
                        <q-tab
                          default name="items"
                          slot="title"
                          :label="$t('sale.exchange.detail.tab.header.label.items')"/>
                        <q-tab
                          name="information"
                          slot="title"
                          :label="$t('members.information.label')"/>
                        <q-tab
                          name="addresses"
                          slot="title"
                          :label="$t('members.addresses.label')"/>
                        <q-tab
                          name="image"
                          slot="title"
                          :label="$t('members.icPassportPhoto.label')"/>
                        <q-tab
                          name="placement"
                          slot="title"
                          label="Placement"/>
                        <q-tab
                          name="shipping"
                          slot="title"
                          :label="$t('sale.exchange.detail.tab.header.label.shipping')"/>
                        <q-tab
                          name="payments"
                          slot="title"
                          :label="$t('sale.exchange.detail.tab.header.label.payments')"/>
                        <!-- Tab Content -->
                        <q-tab-pane
                          name="items"
                          class="no-border bg-white sales-items full-height full-width align-content-start">
                          <!-- Items Content-->
                          <items-tab v-bind:salesData="enrollmentData.salesData"
                                     @reCalculateCart="reCalculateCart"
                                     v-bind:memberDetails="memberDetails"
                                     :lockSalesOrder="lockEnrollmentData"
                                     :validations="$v.enrollmentData.salesData"
                                     :addToCart="addToCart"></items-tab>
                          <!-- Items Content End -->
                        </q-tab-pane>
                        <q-tab-pane name="information" class="no-border">
                          <!-- Information Content-->
                          <div class="pd-10">
                            <member-information-tab :validation="$v.enrollmentData.memberData" v-bind:memberData="enrollmentData.memberData"></member-information-tab>
                          </div>
                          <!-- Information Content End -->
                        </q-tab-pane>
                        <q-tab-pane name="addresses" class="no-border">
                          <!-- Addresses Content-->
                          <div class="pd-10">
                            <member-addresses-tab v-bind:memberData="enrollmentData.memberData" ></member-addresses-tab>
                          </div>
                          <!-- Addresses Content End -->
                        </q-tab-pane>
                        <q-tab-pane name="image" class="no-border">
                          <!-- Image Content-->
                          <div class="pd-10">
                            <member-id-images-tab v-bind:memberData="enrollmentData.memberData"></member-id-images-tab>
                          </div>
                          <!-- Image Content End -->
                        </q-tab-pane>
                        <q-tab-pane name="placement" class="no-border bg-white sales-items shadow-1">
                          <!-- Placement Content-->
                          <placement-tab
                            :memberData="enrollmentData.memberData"
                          >
                            <!--@changeCurrentTab="changeCurrentTab"-->
                          </placement-tab>
                          <!-- Placement Content End -->
                        </q-tab-pane>
                        <q-tab-pane name="shipping" class="no-border bg-white sales-items shadow-1">
                          <!-- Shipping Content-->
                          <shipping-tab v-bind:salesData="enrollmentData.salesData"
                                        v-bind:memberData="enrollmentData.memberData"
                                        :lockProductExchange="lockEnrollmentData"
                                        :validations="$v.enrollmentData"></shipping-tab>
                          <!-- Shipping Content End -->
                        </q-tab-pane>
                        <q-tab-pane name="payments" class="no-border bg-white sales-items shadow-1">
                          <!-- Payments Content-->
                          <payment-tab :paymentData="enrollmentData.salesData"
                                       :processForm="processForm"
                                       :initSetupArea="initSetupArea"
                                       :lock="lockEnrollmentData"
                                       :totalPayableAmount="enrollmentData.salesData.order_fees.total_gmp"
                                       :popupDialog="{title: 'Attention !', message: 'Confirm proceed to payment section ? (Note: Item change not allowed after proceeding to payment section)', disableLock: true}"
                                       :tabChanger="{emiter: 'changeCurrentTab', to: 'items'}"
                          >
                            <!--@changeCurrentTab="changeCurrentTab"-->
                          </payment-tab>
                          <!-- Payments Content End -->
                        </q-tab-pane>
                      </q-tabs>
                    </div>
                  </q-card-main>
                </q-card>
              </div>
            </div>
          </div>
        </div>
          <layout-modal
            refs="enrollmentInitiationModal"
            urlResetPathName=""
            title="Member Enrollment"
            :shadow="false"
            :noBackdropDismiss="true"
            :noEscDismiss="true"
            classes="transparent text-black"
            footerButtonOne="Confirm"
          >
            <template slot="modal-data" slot-scope="props">
              <member-enrollment-initiation-form
                :initiateEnrollment="initiateEnrollment"
                :enrollmentData="enrollmentData"
                :registrationCountrySelected="registrationCountrySelected"
              ></member-enrollment-initiation-form>
            </template>
        </layout-modal>
        <!--<pre>{{$v}}</pre>-->
        <!--<pre>{{enrollmentData.memberData}}</pre>-->
      </template>
    </basic-form>
    <q-loader :visible="isProcessing"></q-loader>
  </div>
</template>

<script>
  import Vue from 'vue'
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import layoutModal from 'src/application/global/components/common/modal/layoutModal'
  import { MemberInformationTab, MemberAddressesTab, MemberIdImagesTab, PaymentTab, ItemsTab } from 'src/application/global/components/common/shared-tabs/index'
  import { DatesMixin, MasterDataTransformarMixin, GeneralsMixin, SetFormFieldErrorsMixin } from 'src/application/global/mixins/index'
  import memberEnrollmentInitiationForm from 'src/application/sales/components/forms/memberEnrollmentInitiationForm'
  import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'
  import { required, alphaNum, minLength, numeric, maxValue, between } from 'vuelidate/lib/validators'
  import { ShippingTab, PlacementTab } from 'src/application/sales/components/enrollment-sales-tabs/index'

  export default {
    name: 'enrollment',
    mixins: [MasterDataTransformarMixin, DatesMixin, GeneralsMixin, SetFormFieldErrorsMixin],
    components: {
      generalHeader,
      basicForm,
      qLoader,
      errorsModal,
      layoutModal,
      memberEnrollmentInitiationForm,
      ItemsTab,
      PaymentTab,
      MemberInformationTab,
      MemberAddressesTab,
      MemberIdImagesTab,
      ShippingTab,
      PlacementTab
    },
    mounted () {
      this.master.keys = [
        'ic_passport_type',
        'sale_cancellation_reason'
      ]
      this.getCountriesAction()
      this.enrollmentData.memberData.details.country_id = this.selectedFilters.countryID
      this.registrationCountrySelected()
      let query = {
        filter_type: 'current'
      }
      this.getCommissionWeekSearchAction(query).then((res) => {
        let returnResponse = res
        if (returnResponse.data !== undefined && returnResponse.data !== null && returnResponse.data.length > 0) {
          let cw = returnResponse.data[0]
          this.enrollmentData.memberData.details.cw_id = cw.id
          this.enrollmentData.memberData.details.cw = cw.cw_name
        }
      })
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        isProcessing: state => state.globalCMP.isProcessing,
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        memberDetails: state => state.membersCMP.memberData.data,
        selectedFilters: state => state.globalCMP.selectedFilters,
        commissionWeeksOptions: state => state.globalCMP.commissionWeeks.list,
        errors: state => state.globalCMP.errors.data
      }),
      ...mapGetters([
        'locationsOptionsByCountry',
        'currencyLabelByCountry',
        'stockLocationsOptionsByCountry'
      ])
    },
    data: () => ({
      hasExistingMemberInfo: false,
      currentTab: '',
      isMemberReEnroll: true,
      lockEnrollmentData: false,
      isTaiwanEnrollment: false,
      isPendingApprovalPaymentType: false,
      enrollmentData: {
        enrollment_type: 'new',
        enrollment_rank: 'ba',
        payment_mode: 'others',
        member_id: '',
        member_name: '',
        transaction_date: new Date(),
        transaction_location: '',
        stock_location: '',
        remarks: '',
        memberData: {
          details: {
            country_id: '',
            name: '',
            translated_name: '',
            nationality_id: '',
            ic_pass_type_id: '',
            ic_passport_number: '',
            date_of_birth: '',
            cw: '',
            cw_name: '',
            tin_no_taiwan: '',
            tin_no_philippines: '',
            user: {
              email: ''
            },
            placement: {
              same_as_sponsor: false,
              ibo : '',
              leg: '',
              name: ''
            },
            sponsor: {
              user_id: '',
              member: {
                name: '',
                user: {
                  old_member_id: ''
                }
              }
            }
          },
          information: {
            language_id: '',
            gender_id: '',
            salutation_id: '',
            ethnic_group_id: '',
            religion_id: '',
            martial_status_id: '',
            spouse: {
              spouse_elken_member: '',
              spouse_ibo_id: '',
              ic_pass_type_id: '',
              ic_pass_type_number: '',
              spouse_name: '',
            },
            education_id: '',
            occupation_id: '',
            industry_id: '',
            salary_range_id: '',
            annual_revenue_id: ''
          },
          contact_info: {
            mobile_1_country_code_id: '',
            mobile_1_num: '',
            mobile_2_country_code_id: '',
            mobile_2_num: '',
            tel_office_1_country_code_id: '',
            tel_office_1_num: '',
            tel_office_2_country_code_id: '',
            tel_office_2_num: '',
            fax_country_code_id: '',
            fax_num: '',
            replicator_website: '',
            country_of_residence_id: ''
          },
          verification: [],
          address: {
            user_id: '',
            id: null,
            recipient_name: '',
            recipient_mobile_country_code_id: '',
            recipient_mobile_phone_number: '',
            recipient_selected_shipping_index: 0,
            address_data: [
              {
                title: Vue.prototype.$t('members.addressPermanent.label'),
                fields: []
              },
              {
                title: Vue.prototype.$t('members.addressCorrespondence.label'),
                fields: []
              },
              {
                title: Vue.prototype.$t('members.addressShipping1.label'),
                fields: []
              },
              {
                title: Vue.prototype.$t('members.addressShipping2.label'),
                fields: []
              }
            ]
          }
        },
        salesData: {
          country_id: '',
          function_type: 'promo',
          sponsor_member_id: '',
          downline_member_id: '',
          location_id: '',
          stock_location_id: '',
          cw_id: '',
          remarks: '',
          cvs: {
            total_cv: 0,
            total_qualified_cv: 0
          },
          order_fees: {
            total_nmp: 0.00,
            admin_fee: 0.00,
            delivery_fee: 0.00,
            other_fee: 0.00,
            tax_amount: 0.00,
            total_gmp: 0.00,
            rounding_adjustment: 0.00
          },
          products: [],
          kittings: [],
          promotion: [],
          selected: {
            promotions: [],
            shipping: {
              sale_delivery_method: '',
              recipient_name: '',
              recipient_mobile_country_code_id: '',
              recipient_mobile_phone_number: '',
              recipient_addresses: [],
              recipient_selected_shipping_index: ''
            },
            payments: {
              paid: [],
              unpaid: []
            },
            additional_requirements: {
              sizes: [],
              addresses: [],
              evoucher: []
            }
          }
        }
      }
    }),
    validations () {
      let def = {
        enrollmentData: {
          memberData: {
            details: {
              name: {
                required
              },
              nationality_id: {
                required
              },
              ic_pass_type_id: {
                required
              },
              ic_passport_number: {
                required
              },
              date_of_birth: {
                age_validation (val, elm) {
                  // check age validation
                  let timeStamp = Date.now()
                  let currentYear = this.formatDate(timeStamp, 'YYYY')
                  let diff = this.getDateDiff(currentYear, this.formatDate(val, 'YYYY'), 'years')
                  if (diff >= 18 && !isNaN(diff)) {
                    return true
                  }
                  return false
                }
              }
            },
            information: {
              language_id: {
                check (val, elm ) {
                  return (val !== '' && val !== null) || this.isPendingApprovalPaymentType
                }
              },
              gender_id: {
                check (val, elm ) {
                  return (val !== '' && val !== null) || this.isPendingApprovalPaymentType
                }
              },
              spouse: {
                spouse_ibo_id: {
                  check1 (val, elm) {
                    if (elm.spouse_elken_member === 1) {
                      if (val === '' || val === null) {
                        return false || this.isPendingApprovalPaymentType
                      }
                    }
                    return true
                  }
                },
                ic_pass_type_number: {
                  check2 (val, elm) {
                    if (elm.spouse_elken_member === 1) {
                      if (val === '' || val === null) {
                        return false || this.isPendingApprovalPaymentType
                      }
                    }
                    return true
                  }
                },
                ic_pass_type_id: {
                  check3 (val, elm) {
                    if (elm.spouse_elken_member === 1) {
                      if (val === '' || val === null) {
                        return false || this.isPendingApprovalPaymentType
                      }
                    }
                    return true
                  }
                },
                spouse_name: {
                  check4 (val, elm) {
                    if (elm.spouse_elken_member === 1) {
                      if (val === '' || val === null) {
                        return false || this.isPendingApprovalPaymentType
                      }
                    }
                    return true
                  }
                }
              }
            },
            contact_info: {
              mobile_1_country_code_id: {
                check (val, elm ) {
                  return (val !== '' && val !== null) || this.isPendingApprovalPaymentType
                }
              },
              mobile_1_num: {
                check (val, elm ) {
                  return (val !== '' && val !== null) || this.isPendingApprovalPaymentType
                },
                numeric
              }
            },
            banking: {}
          },
          salesData: {
            location_id: {
              required
            },
            stock_location_id: {
              required
            },
            cw_id: {
              required
            },
            products: {
              $each: {
                quantity: {
                  required,
                  numeric
                }
              },
              count(value, elm) {
                if (value.length <= 0) {
                  if (elm.kittings.length > 0) {
                    return true
                  } else {
                    return false
                  }
                } else {
                  return true
                }
              }
            },
            kittings: {
              $each: {
                quantity: {
                  required,
                  alphaNum
                }
              },
              count(value, elm) {
                if (value.length <= 0) {
                  if (elm.products.length > 0) {
                    return true
                  } else {
                    return false
                  }
                } else {
                  return true
                }
              }
            },
            selected: {
              shipping: {}
            }
          }
        }
      }
      let methodID = this.enrollmentData.salesData.selected.shipping !== null ? this.enrollmentData.salesData.selected.shipping.sale_delivery_method : 0
      if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === methodID) {
        def.enrollmentData.salesData.selected.shipping = {
          sale_delivery_method: {
            required
          },
          recipient_name: {
            required
          },
          recipient_mobile_country_code_id: {
            required
          },
          recipient_mobile_phone_number: {
            required
          },
          recipient_addresses: {
            required,
            minLength: minLength(0)
          }
        }
      } else {
        def.enrollmentData.salesData.selected.shipping = {
          sale_delivery_method: {
            required
          }
        }
      }
      return def
    },
    methods: {
      ...mapActions([
        'getMemberByUserIdAction',
        'getMastersWithKey',
        'getCommissionWeekSearchAction',
        'getCountryRelationAction',
        'getCountriesAction',
        'getMemberByUserIdAction',
        'getEnrollmentTypeByCountryAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM'
      }),
      initSetupArea () {},
      initiateEnrollment () {
        console.log(this.enrollmentData.payment_mode)
        if (this.enrollmentData.payment_mode = 'epp') {
          this.isPendingApprovalPaymentType = true
        }
        if (this.enrollmentData.enrollment_type === 'upgrade' || this.enrollmentData.enrollment_type === 're_enroll') {
          if (this.enrollmentData.member_id !== '' && this.enrollmentData.member_id !== null) {
            let query = {
              user_id: this.enrollmentData.member_id
            }
            this.getMemberByUserIdAction(query).then((res) => {
              let memberData = res
              if (this.objectNullCheck(memberData) && this.objectNullCheck(memberData.member_data)) {
                this.enrollmentData.memberData = memberData.member_data
                this.registrationCountrySelected()
                if (this.enrollmentData.enrollment_type === 'upgrade') {
                  this.hasExistingMemberInfo = true
                } else {
                  this.isMemberReEnroll = true
                }
              }
            })
          } else {
            // redirect to sales listing page
          }
        }
      },
      objectNullCheck (object) {
        return object !== undefined && object !== null
      },
      processForm () {
        this.$v.$reset()
        this.$v.$touch()
        return new Promise( (resolve, reject) => {
          reject(true)
        })
      },
      registrationCountrySelected () {
        let query1 = {
          country_id: this.enrollmentData.memberData.details.country_id,
          relations: ['entity.locations', 'currency', 'taxes', 'stockLocation']
        }
        this.getCountryRelationAction(query1).then(res => {
          this.enrollmentData.salesData.location_id = this.locationsOptionsByCountry[0].value
          this.enrollmentData.salesData.stock_location_id = this.stockLocationsOptionsByCountry[0].value
          this.openCloseModal({name: 'enrollmentInitiationModal', status: true})
          // get enrollment type here
          this.getEnrollmentTypeByCountryAction(this.enrollmentData.memberData.details.country_id).then(() => {
          })
        })
      },
      reCalculateCart (param) {
      },
      addToCart (param) {

      }
    }
  }
</script>

<style scoped>

</style>
