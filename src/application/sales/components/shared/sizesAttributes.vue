<template>
    <table class="q-table cell-separator fit text-center responsive">
        <thead class="bg-grey-4">
        <th width="30%">Product Code</th>
        <th width="40%">Product Name</th>
        <th width="10%">Quantity</th>
        <th width="20%"></th>
        </thead>
        <tbody>
        <tr>
            <td :data-th="tableTh[1]">{{ typeof standardProductModalData.item.sku !== 'undefined' ? standardProductModalData.item.sku : standardProductModalData.item.product.sku }}
            </td>
            <td :data-th="tableTh[2]">{{ typeof standardProductModalData.item.name !== 'undefined' ? standardProductModalData.item.name : standardProductModalData.item.product.name }}
            </td>
            <td width="10%" :data-th="tableTh[4]">
                {{ standardProductModalData.item.quantity * (typeof standardProductModalData.item.kitting_qty !== 'undefined' ? standardProductModalData.item.kitting_qty : 1) }}
            </td>
            <td v-if="!salesData.selected.additional_requirements.evoucher.filter(x => x.product_id === standardProductModalData.item.product_id && x.kitting_id === normalizeKittindID(standardProductModalData.item.kitting_id)).length > 0 && Object.keys(standardProductModalData.item.size_groups).length > 0">
                <q-btn :disable="standardProductModalData.item.size_groups.length < 1"
                       @click="addNewAttribute(standardProductModalData.item.product_id, standardProductModalData.item.kitting_id, 'sizes')"
                       small
                       outline><span class="animate-blink text-negative">Choose Size</span>
                </q-btn>
            </td>
            <td v-else="">
                <span v-if="typeof standardProductModalData.item.general !== 'undefined' && typeof standardProductModalData.item.general.product_additional_requirements !== 'undefined'">eVoucher</span>
                <span v-else=""></span>
            </td>
        </tr>
        <tr v-if="Object.keys(standardProductModalData.item.size_groups).length > 0 && typeof standardProductModalData.item.size_groups.master_data !== 'undefined' && standardProductModalData.item.size_groups.master_data.length > 0 && attributesSelectionToggle('sizes', standardProductModalData.item.product_id, standardProductModalData.item.kitting_id) && salesData.selected.additional_requirements.evoucher.filter(x => x.product_id === standardProductModalData.item.product_id).length < 1">
            <td valign="top" width="25%" class="no-border">
                <q-input v-model="attributeSizesTerms"
                         placeholder="Search Size : CBS"
                         :ref="standardProductModalData.item.product_id"
                         inverted
                         clearable
                         color="grey-7"
                         :after="[
                                    {
                                      icon: 'search',
                                      handler: () => {
                                        filterAndProcessAttributeOptions($refs, standardProductModalData.item.size_groups.master_data, standardProductModalData.item.product_id, standardProductModalData.item.kitting_id)
                                      }
                                    }
                                  ]"
                ></q-input>
            </td>
            <td colspan="3" class="no-border">
                <q-list no-border>
                    <q-item v-for="(size, index) in standardProductModalData.item.size_groups.master_data"
                            :key="index">
                        <div class="row fit items-baseline justify-between gutter-sm">
                            <div class="col-lg-auto">
                                {{ standardProductModalData.item.size_groups.title }} - {{ size.title }}
                            </div>
                            <div class="col-lg-6">
                                <div class="row justify-start items-baseline group">
                                    <div class="col-lg-2">
                                        <q-input align="center" readonly type="number"
                                                 :value="getAttributeQuantityCount('sizes', standardProductModalData.item.product_id, standardProductModalData.item.kitting_id, size.master_id, size.id)"
                                                 :min="0"></q-input>
                                    </div>
                                    <div class="col-lg-auto">
                                        <q-btn color="negative"
                                               @click="minusAttributeQuantity(standardProductModalData.item.quantity, standardProductModalData.item.product_id, standardProductModalData.item.kitting_id, 'sizes', size.master_id, size.id)"
                                               small round outline
                                               icon="remove"></q-btn>
                                    </div>
                                    <div class="col-lg-auto">
                                        <q-btn color="positive"
                                               @click="addAttributeQuantity(standardProductModalData.item.quantity, standardProductModalData.item.product_id, standardProductModalData.item.kitting_id, 'sizes', size.master_id, size.id, standardProductModalData.item.kitting_qty)"
                                               small round outline icon="add"></q-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </q-item>
                </q-list>
            </td>
        </tr>
        </tbody>
    </table>
    <!--<pre> {{ standardProductModalData }}</pre>-->
</template>
<script>
  export default {
    name: 'sizes-attributes',
    props: {
      salesData: {
        type: Object,
        required: true
      },
      standardProductModalData: {
        type: Object,
        required: true
      },
      tableTh: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      attributeSizesTerms: '',
      requiremets: {}
    }),
    created () {
      this.requiremets = this.salesData.selected.additional_requirements
    },
    methods: {
      filterAndProcessAttributeOptions (terms, options, productID, kittingID) {
        kittingID = this.normalizeKittindID(kittingID)
        let term = terms[productID].value
        if (term !== '') {
        } else {
        }
      },
      addNewAttribute (productID, kittingID, type, quantity) {
        kittingID = this.normalizeKittindID(kittingID)
        if (this.requiremets[type].filter(x => x.product_id === productID && x.kitting_id === kittingID).length < 1) {
          let attributeTemp = {
            product_id: productID,
            kitting_id: kittingID,
            data: []
          }
          this.requiremets[type].push(attributeTemp)
        }
      },
      addAttributeQuantity (requiredQuantity, productID, kittingID, type, masterID, masterDataID, kittingQty) {
        kittingID = this.normalizeKittindID(kittingID)
        if (typeof kittingQty !== 'undefined' && kittingQty !== '') {
          requiredQuantity = requiredQuantity * kittingQty
        }
        let selectedQuantity = 0
        let requirementIndex = this.requiremets[type].findIndex(x => x.product_id === productID && x.kitting_id === kittingID)
        if (requirementIndex !== -1) {
          let quantity = {
            master_id: masterID,
            master_data_id: masterDataID,
            quantity: 1
          }
          let dataIndex = this.requiremets[type][requirementIndex].data.findIndex(x => x.master_data_id === masterDataID)
          let selectedQuantityData = this.requiremets[type][requirementIndex].data.filter(x => x.master_id === masterID)
          if (selectedQuantityData.length > 0) {
            selectedQuantityData.forEach((item) => {
              selectedQuantity += item.quantity
            })
          }
          if (selectedQuantity < requiredQuantity) {
            if (dataIndex !== -1) {
              this.requiremets[type][requirementIndex].data[dataIndex].quantity += 1
            } else {
              this.requiremets[type][requirementIndex].data.push(quantity)
            }
          }
        }
      },
      minusAttributeQuantity (requiredQuantity, productID, kittingID, type, masterID, masterDataID) {
        kittingID = this.normalizeKittindID(kittingID)
        let requirementIndex = this.requiremets[type].findIndex(x => x.product_id === productID && x.kitting_id === kittingID)
        if (requirementIndex !== -1) {
          let dataIndex = this.requiremets[type][requirementIndex].data.findIndex(x => x.master_data_id === masterDataID)
          if (dataIndex !== -1) {
            if (this.requiremets[type][requirementIndex].data[dataIndex].quantity >= 1) {
              this.requiremets[type][requirementIndex].data[dataIndex].quantity -= 1
            }
            if (this.requiremets[type][requirementIndex].data[dataIndex].quantity === 0) {
              this.requiremets[type][requirementIndex].data.splice(dataIndex, 1)
            }
          }
        }
      },
      getAttributeQuantityCount (type, productID, kittingID, masterID, masterDataID) {
        kittingID = this.normalizeKittindID(kittingID)
        let products = this.requiremets[type].filter(x => x.product_id === productID && x.kitting_id === kittingID)
        let count = 0
        if (products.length > 0) {
          products.forEach((item) => {
            item.data.forEach((item) => {
              if (item.master_id === masterID && item.master_data_id === masterDataID) {
                count = item.quantity
              }
            })
          })
          return count
        }
      },
      attributesSelectionToggle (type, productID, kittingID) {
        kittingID = this.normalizeKittindID(kittingID)
        let selected = this.requiremets[type].filter(x => x.product_id === productID && x.kitting_id === kittingID)
        if (selected.length > 0) {
          return true
        } else {
          return false
        }
      },
      normalizeKittindID (kittingID) {
        return typeof kittingID !== 'undefined' ? kittingID : null
      }
    }
  }
</script>