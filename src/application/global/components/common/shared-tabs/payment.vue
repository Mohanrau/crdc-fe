<template>
    <div class="payment-tab">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-xs-12 text-right">
                <div class="q-title" :class="{'text-grey-5' : balance === 0}">
                    {{$t('Common.payment.label.balance')}} :
                    <q-chip square :color="balance !== 0 ? 'negative' : 'grey-5'">
                        {{ currencyLabelByCountry
                        }} {{ Math.sign(balance) === -1 ? 'invalid' : balance | formatPriceDouble }}
                    </q-chip>
                </div>
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12"
                 v-if="paymentData.selected.payments.unpaid.length > 0 || paymentData.selected.payments.paid.length > 0">
                <hr>
            </div>
            <div class="col-lg-6 col-md-12 col-xs-12 payment-selection">
                <q-card flat square>
                    <div class="row">
                        <div class="col-lg-5 col-md-12 col-xs-12 q-mt-sm q-mb-sm">
                            <q-btn icon="add" color="positive" class="fit"
                                   :disable="balance <= 0 || paymentData.selected.payments.unpaid.length === 1 || lockPayment">
                                {{$t('Common.payment.label.addPayment')}}
                                <q-popover fit anchor="top middle" self="bottom middle" ref="paymentPopover"
                                           :disable="balance <= 0 || paymentData.selected.payments.unpaid.length === 1 || lockPayment">
                                    <div class="payment-popover q-mr-sm">
                                        <ul>
                                            <li v-for="level1 in paymentOptions">
                                                <q-chip class="fit" icon="list" square small pointing="down"
                                                        color="primary">
                                            <span class="fit" :class="{'active': activeSelected(level1.id) }">
                                                                    {{ level1.title }}
                                                                </span>
                                                </q-chip>
                                                <ul>
                                                    <li v-for="level2 in level1.payment_mode_provider">
                                                                    <span
                                                                            :class="{'active': activeSelected(level2.id) }"
                                                                            class="cursor-pointer"
                                                                            @click="addPaymentMode(level2.payment_mode_setting[0]
.id, level2.name, level2.payment_mode_setting[0].setting_detail[0]), $refs.paymentPopover.hide()">
                                                                        <p class="q-subheading"><q-icon
                                                                                name="chevron_right"/> {{ level2.name }}</p>
                                                                    </span>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </q-popover>
                            </q-btn>
                        </div>
                    </div>
                </q-card>
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12 unpaid-list">
                <q-card square
                        class="fa-border q-mt-md"
                        color="grey-1 text-black shadow-0"
                        v-for="(unpaid, unpaidIndex) in paymentData.selected.payments.unpaid"
                        :key="unpaidIndex">
                    <q-card-main>
                        <div class="row justify-between items-center">
                            <div class="col-lg-12 col-md-12 col-xs-12">
                                <div class="row items-center justify-between group q-ma-sm">
                                    <div class="col-lg-auto">
                                        <div class="q-title">
                                            {{ unpaid.payment_mode_name }}
                                        </div>
                                    </div>
                                    <div class="col-lg-auto">
                                        <q-btn size="md" flat round @click="removePaymentMode(unpaidIndex)"
                                               color="negative">
                                            <q-icon name="close"></q-icon>
                                        </q-btn>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12 col-xs-12">
                                <div class="row group justify-center">
                                    <div class="col-lg-6 col-md-12 col-xs-12" v-if="unpaid.fields.length !== 0"
                                         v-for="(field, fieldIndex) in unpaid.fields"
                                         :key="fieldIndex">
                                        <!--Todo remove field.type === link from form temp only-->
                                        <q-field class="q-ma-sm dynamic-fields"
                                                 v-if="field.type !== 'link'"
                                                 :error="$v.paymentData.selected.payments.unpaid.$each[unpaidIndex].fields.$each[fieldIndex].value.$invalid"
                                                 error-label="invalid"
                                                 helper="*"
                                        >
                                            <q-input clearable
                                                     :type="field.password === undefined && !field.password ? 'text' : 'password'"
                                                     color="white"
                                                     v-on:keydown="$v.paymentData.selected.payments.unpaid.$each[unpaidIndex].fields.$each[fieldIndex].value.$touch"
                                                     v-if="field.type === 'field'"
                                                     inverted-light
                                                     :readonly="isSinglePaymentMethod && field.name === 'amount'"
                                                     @input="calculateUnpaidBalance()"
                                                     :stack-label="field.text"
                                                     v-model.trim="field.autofill !== undefined && unpaid.fields[fieldIndex].value === '' ? getAutoFill(field.autofill, unpaidIndex, fieldIndex) : unpaid.fields[fieldIndex].value"/>
                                            <q-select clearable
                                                      color="white"
                                                      inverted-light
                                                      :stack-label="field.text"
                                                      @input="field.inherit_data ? setInheritData(field.name, field.inherit_data, field.value, unpaidIndex) : ''"
                                                      placeholder="Choose"
                                                      v-on:keydown="$v.paymentData.selected.payments.unpaid.$each[unpaidIndex].fields.$each[fieldIndex].value.$touch"
                                                      v-if="field.type === 'dropdown'"
                                                      v-model="unpaid.fields[fieldIndex].value"
                                                      :options="field.inherit ? getInheritDataOptions(field.inherit) : keyValueObjectToOptionsGenerator(field.data)"
                                            />
                                        </q-field>
                                    </div>
                                    <div v-else="" class="col-lg-auto">
                                        <div class="q-caption text-muted text-negative">
                                            {{$t('Common.payment.errorMessage.paymentUnavailable')}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12 col-xs-12">
                                <div class="row justify-end q-ma-sm">
                                    <div class="col-lg-auto">
                                        <q-btn glossy
                                               size="md"
                                               @click="makePayment(unpaidIndex)" color="positive">
                                            Submit
                                        </q-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </q-card-main>
                </q-card>
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12 paid-list">
                <q-card square v-for="(paid, paidIndex) in paymentData.selected.payments.paid"
                        class="q-mb-md q-mt-md"
                        color="grey-1 text-black shadow-0 fa-border"
                        :key="paidIndex">
                    <q-card-main>
                        <div class="row justify-end items-center">
                            <div class="col-lg-12 col-md-12 col-xs-12">
                                <div class="row items-center justify-between gutter-xs">
                                    <div class="col-lg-auto q-ma-sm">
                                        <div class="q-title">
                                            {{ paid.payment_mode_provider.name }}
                                        </div>
                                    </div>
                                    <div class="col-lg-2 q-ma-sm" v-if="paid.is_approve !== undefined && paid.is_approve">
                                        <q-chip square small tag
                                                class="fit"
                                                :color="paid.status === 1 ? 'positive' : paid.status === 0 ? 'negative' : paid.status > 1 ? 'warning' : 'grey-8'">
                                            {{ paid.status === 1 ? $t('Common.payment.label.paymentApproved') : paid.status === 0 ?
                                          $t('Common.payment.label.paymentRejected') : paid.status > 1 ?
                                            $t('Common.payment.label.paymentPending') : $t('Common.payment.label.paymentUnknown')
                                            }}
                                        </q-chip>
                                    </div>
                                    <div class="col-lg-2 q-ma-sm" v-else="">
                                        <q-chip square small tag
                                                class="fit"
                                                :color="paid.status === 1 ? 'positive' : paid.status === 0 ? 'negative' : paid.status > 1 ? 'warning' : 'grey-8'">
                                            {{ paid.status === 1 ? $t('Common.payment.label.paymentPaid') : paid.status === 0 ?
                                          $t('Common.payment.label.paymentFailed') : paid.status > 1 ?
                                            $t('Common.payment.label.paymentPending') : $t('Common.payment.label.paymentUnknown')
                                            }}
                                        </q-chip>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <div class="row justify-end">
                                    <div class="col-lg-3 col-md-12 col-xs-12"
                                         v-if="field.type === 'field'"
                                         v-for="(field, fieldIndex) in decodeJSON(paid.payment_detail).fields.sort((a, b) => a.order > b.order)"
                                         :key="fieldIndex">
                                        <!--Todo remove field.type === link from form temp only-->
                                        <q-field class="q-ma-sm"
                                                 v-if="field.type !== 'link'">
                                            <q-input clearable
                                                     :type="field.password === undefined && !field.password ? 'text' : 'password'"
                                                     :stack-label="field.text"
                                                     readonly
                                                     disable
                                                     inverted-light
                                                     class="no-shadow"
                                                     color="white"
                                                     v-model="field.value"/>
                                            <q-select clearable
                                                      :stack-label="field.text"
                                                      :placeholder="$t('Common.payment.label.choose')"
                                                      v-if="field.type === 'dropdown'"
                                                      v-model="field.value"
                                                      readonly
                                                      class="no-shadow"
                                                      inverted-light
                                                      disable
                                                      color="white"
                                                      :options="keyValueObjectToOptionsGenerator(field.data)"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12 col-md-12 col-xs-12">
                                <div class="row items-baseline justify-end q-ma-sm">
                                    <div class="col-lg-auto col-md-12 col-xs-12 text-right">
                                        <q-chip color="grey-1 text-black" class="fit q-mb-xs" square small icon="access_time">
                                            {{ paid.created_at }} [ {{ humanizeDateTime(paid.created_at) }} ]
                                        </q-chip>
                                    </div>
                                    <div class="col-lg-auto col-md-12 col-xs-12 text-right">
                                        <q-chip color="grey-1 text-black" class="fit q-mb-xs" square small icon="face">
                                            {{ paid.created_by !== null ? paid.created_by.name : '-' }}
                                        </q-chip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </q-card-main>
                </q-card>
            </div>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList.vue'
  import {AddressMixin, GeneralsMixin, MasterDataTransformarMixin} from 'src/application/global/mixins/index'
  import {Dialog} from 'quasar'
  import {between, required} from 'vuelidate/lib/validators'
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
  import {DatesMixin} from '../../../mixins/index'
  import {formatPrice} from 'src/helpers/filters'

  export default {
    name: 'sales-payment-tab',
    mixins: [MasterDataTransformarMixin, AddressMixin, GeneralsMixin, DatesMixin],
    components: {
      EmptyList,
      qLoader
    },
    props: {
      paymentData: {
        type: Object,
        required: true
      },
      totalPayableAmount: {
        type: [String, Number],
        required: true
      },
      processForm: {
        type: Function,
        required: true
      },
      callback: {
        type: Function
      },
      initSetupArea: {
        type: Function,
        required: true
      },
      lock: {
        type: Boolean,
        default: false
      },
      lockPayment: {
        type: Boolean,
        default: false
      },
      tabChanger: {
        type: Object,
        default: () => ({
          emiter: '',
          to: '',
          current: ''
        })
      },
      makePaymentData: {
        type: Object,
        default: () => ({
          payType: 'sales',
          consignmentDepositId: null
        })
      },
      popupDialog: {
        type: Object,
        default: () => ({
          disableLock: false,
          title: '',
          message: '',
          noEscDismiss: '',
          position: '',
          okBtnText: 'Yes',
          cancelBtnText: 'No'
        })
      },
      excludePaymentMode: {
        type: Array,
        default: () => []
      },
      excludePaymentModeProvider: {
        type: Array,
        default: () => []
      },
      isSinglePaymentMethod: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        masterData: state => state.globalCMP.masterData.data.list,
        memberData: state => state.membersCMP.memberData.data,
        paymentOptions: state => state.salesCMP.paymentOptions.list
      }),
      ...mapGetters([
        'currencyLabelByCountry'
      ])
    },
    validations() {
      let def = {
        paymentData: {
          selected: {
            payments: {
              unpaid: {}
            }
          }
        }
      }
      if (this.paymentData !== undefined && this.paymentData.selected.payments.unpaid !== undefined && this.paymentData.selected.payments.unpaid.length > 0) {
        def.paymentData.selected.payments.unpaid = {
          required,
          $each: {
            fields: {
              $each: {
                value: {
                  required,
                  between(value, elm) {
                    if (elm.name === 'amount') {
                      let balance = 0
                      let paid = this.paymentData.selected.payments.paid
                      let paidTotal = 0.00
                      paid.forEach((paidItem) => {
                        if (paidItem.status >= 1) {
                          paidTotal += parseFloat(paidItem.amount)
                        }
                      })
                      balance = (this.totalPayableAmount) - (paidTotal)
                      return between(0.01, formatPrice(balance))(value)
                    } else {
                      return true
                    }
                  }
                }
              }
            }
          }
        }
      }
      return def
    },
    data: () => ({
      selected_payment_mode_id: '',
      balance: 0.00,
      paymentModeID: 0,
      paymentModeName: '',
      total: 0,
      inheritDataOptions: []
    }),
    async mounted() {
      this.master.keys = ['payment_mode']
      let query = {
        'location_id': this.paymentData.location_id,
        'country_id': this.paymentData.country_id,
        'exclude_payment_mode': this.excludePaymentMode,
        'exclude_payment_provider': this.excludePaymentModeProvider
      }
      this.getPaymentModesAction(query)
      this.calculateUnpaidBalance()
      this.popupDialog.disableLock = await this.lock

      if (this.popupDialog.disableLock === false) {
        this.$q.dialog({
          title: this.popupDialog.title,
          message: this.popupDialog.message,
          noEscDismiss: this.popupDialog.noEscDismiss ? this.popupDialog.noEscDismiss : true,
          noBackdropDismiss: true,
          position: this.popupDialog.position ? this.popupDialog.position : 'top',
          ok: {
            label: this.popupDialog.okBtnText ? this.popupDialog.okBtnText : 'Yes',
            color: 'positive'
          },
          cancel: {
            label: this.popupDialog.cancelBtnText ? this.popupDialog.cancelBtnText : 'No',
            color: 'negative'
          },
        }).then(() => {
          this.processForm(this.paymentData, false)
          if (this.tabChanger && this.tabChanger.to !== this.tabChanger.current) {
            this.$emit(this.tabChanger.emiter, this.tabChanger.to)
          }
        }).catch(() => {
          if (this.tabChanger) {
            this.$emit(this.tabChanger.emiter, this.tabChanger.to)
          }
        })
      }
    },
    methods: {
      ...mapActions([
        'getPaymentModesAction',
        'makePaymentAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
        validationReset: 'VALIDATION_FAILED'
      }),
      async addPaymentMode(id, name, settings) {
        settings = JSON.parse(JSON.stringify(settings))
        if (settings.fields !== undefined && Array.isArray(settings.fields)) {
          settings.fields.sort((a, b) => a.order > b.order)
          // Todo remove once backend includes value
          settings.fields.forEach((x) => {
            x.value = ''
            if (x.name === 'amount') {
              x.value = parseFloat(this.balance).toFixed(2)
            }
            // Todo remove field.type === link from form temp only
            if (x.type === 'link') {
              x.value = 'skip'
            }
          })
        }
        let data = {
          sale_id: this.paymentData.sale_id,
          pay_type: this.makePaymentData.payType,
          consignment_deposit_id: this.makePaymentData.consignmentDepositId,
          payment_mode_id: id,
          payment_mode_name: name,
          fields: settings.fields !== undefined ? settings.fields : []
        }
        await this.paymentData.selected.payments.unpaid.push(data)
        await this.calculateUnpaidBalance()
      },
      removePaymentMode(index) {
        this.paymentData.selected.payments.unpaid.splice(index, 1)
        this.calculateUnpaidBalance()
      },
      calculateUnpaidBalance() {
        let paid = this.paymentData.selected.payments.paid
        let unpaid = this.paymentData.selected.payments.unpaid
        let paidTotal = 0.00
        let unpaidTotal = 0.00
        paid.forEach((paidItem, paidIndex) => {
          if (paidItem.status >= 1) {
            paidTotal += parseFloat(paidItem.amount)
          }
        })
        unpaid.forEach((unPaidItem, unPaidIndex) => {
          unPaidItem.fields.forEach((unPaidItemField) => {
            if (unPaidItemField.name === 'amount' && unPaidItemField.value > 0) {
              unpaidTotal += parseFloat(unPaidItemField.value)
            }
          })
        })
        this.balance = parseFloat(this.totalPayableAmount) - (parseFloat(paidTotal) + parseFloat(unpaidTotal))
      },
      activeSelected(id) {
        if (typeof this.paymentModeID !== 'undefined') {
          return this.paymentModeID === id
        }
        return false
      },
      makePayment(unpaidIndex) {
        let unPaidAmountIndex = this.paymentData.selected.payments.unpaid[unpaidIndex].fields.findIndex(x => x.name === 'amount')
        if (unPaidAmountIndex !== -1) {
          this.paymentData.selected.payments.unpaid[unpaidIndex].fields[unPaidAmountIndex].value = formatPrice(this.paymentData.selected.payments.unpaid[unpaidIndex].fields[unPaidAmountIndex].value)
        }
        if (!this.$v.paymentData.selected.payments.unpaid.$error && !this.$v.paymentData.selected.payments.unpaid.$invalid) {
          this.makePaymentAction(this.removeFalsyValues(this.paymentData.selected.payments.unpaid[unpaidIndex])).then((res) => {
            let response = res.data
            if (response.next_step !== undefined && response.next_step && response.form_data !== undefined) {
              var form = document.createElement('form')

              let formData = JSON.parse(response.form_data)
              form.setAttribute('method', formData.form_attributes.method) // form method
              form.setAttribute('action', formData.form_attributes.action) // form action url
              form.setAttribute('name', 'sales_payment_form') // form name
              form.setAttribute('id', 'sales_payment_form') // form ID

              // To create input control with javascript
              let inputs = formData.form_inputs
              Object.keys(inputs).forEach(function (key, value) {
                var inputCtrl = document.createElement('input')
                inputCtrl.type = 'hidden' // input control type
                inputCtrl.name = key // input control name
                inputCtrl.value = inputs[key] // input control value
                form.appendChild(inputCtrl)
              })
              // To bind created input control with created from
              form.target = 'paymentForm'

              // To bind created form with current document body
              document.body.appendChild(form)
              window.open('', 'paymentForm', 'fullscreen=yes,toolbar=0')
              form.submit()
            }
            this.paymentData.selected.payments.unpaid.splice(unpaidIndex, 1)
            if (response) {
              this.paymentData.selected.payments.paid = [...response.payments]
            }
            if (this.callback) {
              this.callback()
            }
            this.calculateUnpaidBalance()
          }).catch(error => {
            if (typeof error.response !== 'undefined' && error.response.status === 422) {
              this.openCloseModal({name: 'errorsModal', status: true})
            }
          })
        } else {
          Dialog.create({
            title: 'Attention !',
            noBackdropDismiss: true,
            noEscDismiss: true,
            message: this.$t('Common.PaymentValidation.Error.Info')
          })
        }
      },
      setInheritData(inheritFieldName, inheritData, value, index) {
        if (this.inheritDataOptions[inheritFieldName] !== undefined) {
          this.inheritDataOptions[inheritFieldName] = {}
        }
        this.inheritDataOptions[inheritFieldName] = inheritData[value]
        let inheritFieldIndex = this.paymentData.selected.payments.unpaid[index].fields.findIndex((x) => x.inherit !== undefined && x.inherit === inheritFieldName)
        if (inheritFieldIndex !== -1) {
          this.paymentData.selected.payments.unpaid[index].fields[inheritFieldIndex].value = ''
        }
      },
      getInheritDataOptions(inheritFieldName) {
        let options = []
        if (this.inheritDataOptions[inheritFieldName] !== undefined) {
          options = this.keyValueObjectToOptionsGenerator(this.inheritDataOptions[inheritFieldName].data)
        }
        return options
      },
      // Todo getAutoFill only use memberData at the moment, logic changes needed
      getAutoFill (key, index, fieldIndex) {
        if (this.memberData !== undefined || Object.keys(this.memberData).length > 0) {
          var value = key.split('.').reduce((a, b) => a[b], this.memberData)
          if (value !== '' || value !== null) {
            this.paymentData.selected.payments.unpaid[index].fields[fieldIndex].value = value.toString()
          }
        }
      }
    }
  }
</script>
<style lang="stylus">
    .payment-popover > ul, .payment-popover > ul > li > ul, .payment-popover > ul > li > ul > li > ul
        list-style none

    .payment-popover > ul > li
        padding 6px
        margin-left -30px

    .payment-popover ul > li > span:hover, .payment-popover .active
        color #989898
</style>
