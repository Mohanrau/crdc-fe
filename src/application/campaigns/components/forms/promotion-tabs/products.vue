<template>
    <div class="products-tab">
        <div class="row">
            <div class="col-12">
                <q-field
                        helper="*"
                >
                    <table class="q-table-html bordered cell-separator full-width mt-10">
                        <thead>
                        <tr class="header bg-grey-3">
                            <th width="20%" class="text-center">{{ $t('campaigns.esacPromotion.productType') }}</th>
                            <th width="20%" class="text-center">{{ $t('campaigns.esacPromotion.productCode') }}</th>
                            <th width="50%" class="text-center">{{ $t('campaigns.esacPromotion.productName') }}</th>
                            <th width="10%" class="text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td data-th="Product Type">
                                <q-option-group
                                    type="radio"
                                    color="primary"
                                    inline
                                    v-model="adderRowTemp.product_type"
                                    :options="productTypesOptions"
                                />
                            </td>
                            <td data-th="Product Code">
                                <q-search v-model.trim="adderRowTemp.display_code" :placeholder="$t('Common.search.placeholder')">
                                    <q-autocomplete
                                            :max-results="10"
                                            @search="search"
                                            @selected="selected"
                                    />
                                </q-search>
                            </td>
                            <td data-th="Product Name">
                                <q-search v-model.trim="adderRowTemp.display_name" :placeholder="$t('Common.search.placeholder')">
                                    <q-autocomplete
                                            :max-results="10"
                                            @search="search"
                                            @selected="selected"
                                    />
                                </q-search>
                            </td>
                            <td>
                                <q-btn :disable="!(adderRowTemp.product_id > 0 || adderRowTemp.kitting_id > 0)" @click="addRow" color="positive" flat>
                                    <q-icon name="add"/>
                                </q-btn>
                            </td>
                        </tr>
                        <tr v-for="(item, index) in esacPromotionData.products_and_kittings">
                            <td data-th="Product Type">{{ item.display_type }}</td>
                            <td data-th="Product Code">{{ item.display_code }}</td>
                            <td data-th="Product Name">{{ item.display_name }}</td>
                            <td>
                                <q-btn @click="removeRow(index)" color="negative" flat>
                                    <q-icon name="delete"/>
                                </q-btn>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </q-field>
            </div>
        </div>
    </div>
</template>
<script>
  import { mapState, mapActions, mapMutations } from 'vuex'
  import Vue from 'vue'

  // Initialize adderRow
  function initializeAdderRow () {
    return {
      product_type: 'P',
      product_id: 0,
      kitting_id: 0,
      display_code: '',
      display_name: '',
      display_type: ''
    }
  }

  export default {
    name: 'products-tab',
    props: {
      'esacPromotionData': {
        type: Object,
        required: true
      },
      'validation': {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        productSearchData: state => state.productsCMP.productSearchData,
        selectedFilters: state => state.globalCMP.selectedFilters
      })
    },
    data: () => ({
      productTypesOptions: [
        {label:'Product', value:'P'},
        {label:'Kitting', value:'K'}
      ],
      adderRow: initializeAdderRow(),
      adderRowTemp: initializeAdderRow()
    }),
    watch: {
      adderRow: {
        handler (val) {
          // Reset adderRow
          if ((val.product_code === '' && val.product_name !== '') || (val.product_name === '' && val.product_code !== '')) {
            let newRow = initializeAdderRow()
            newRow.product_type = val.product_type
            Object.assign(this.adderRow, newRow)
          }
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'getProductSearchAction',
        'getKittingSearchAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION'
      }),
      search (terms, done) {
        if (this.adderRowTemp.product_type === 'P') {
          let query = {
            country_id: this.selectedFilters.countryID,
            text: terms
          }
          this.getProductSearchAction(query).then(res => {
            done(this.productSearchData.list)
          })
        }
        else {
          let query = {
            country_id: this.selectedFilters.countryID,
            kitting_code: terms
          }
          this.getKittingSearchAction(query).then(res => {
            done(this.productSearchData.list)
          })
        }
      },
      selected (item) {
        if (this.adderRowTemp.product_type === 'P') {
          this.adderRowTemp.display_type = 'Product'
          this.adderRowTemp.product_id = item.value
        }
        else {
          this.adderRowTemp.display_type = 'Kitting'
          this.adderRowTemp.kitting_id = item.value
        }
        this.adderRowTemp.display_code = item.label
        this.adderRowTemp.display_name = item.sublabel
        Object.assign(this.adderRow, this.adderRowTemp)
      },
      addRow () {
        if (this.adderRow.product_id > 0 || this.adderRow.kitting_id > 0) {
          let duplicated = false;
          this.esacPromotionData.products_and_kittings.forEach(element => {
            if (element.product_type === 'P' && this.adderRow.product_type === 'P' && element.product_id === this.adderRow.product_id) {
              duplicated = true;
            }
            if (element.product_type === 'K' && this.adderRow.product_type === 'K' && element.kitting_id === this.adderRow.kitting_id) {
              duplicated = true;
            }
          });
          if(duplicated) {
            this.setNotification({
              title: 'Duplicated',
              message: 'Duplicated',
              type: 'negative'
            })
          }
          else {
            if (this.adderRow.product_id > 0) {
              this.adderRow.kitting_id = null
            }
            else {
              this.adderRow.product_id = null
            }
            this.esacPromotionData.products_and_kittings.push(Vue.util.extend({}, JSON.parse(JSON.stringify(this.adderRow))))
            // Reset adderRow
            let newRow = initializeAdderRow()
            newRow.product_type = this.adderRow.product_type
            Object.assign(this.adderRowTemp, newRow)
            Object.assign(this.adderRow, this.adderRowTemp)
          }
        }
      },
      removeRow (index) {
        Vue.delete(this.esacPromotionData.products_and_kittings, index)
      }
    }
  }
</script>
