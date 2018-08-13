<template>
    <div>
        <table class="q-table-html bordered full-width text-center responsive">
            <thead class="bg-grey-4">
            <th>Product Code</th>
            <th>Product Name</th>
            <th width="5%">Quantity</th>
            <th></th>
            </thead>
            <tbody>
            <template v-for="itemData, index in itemsData">
                <tr v-if="itemData.dummy !== null">
                    <td align="left" :data-th="tableTh[1]">
                        {{ itemData.product.sku }}
                    </td>
                    <td align="left" :data-th="tableTh[2]">
                        {{ itemData.product.name }} <span class="text-grey-5" v-if="itemData.foc_qty > 0"> (FOC) </span>
                    </td>
                    <td :data-th="tableTh[4]">
                        {{ getAttributesTotalSelectedQuantityCount(itemData.kitting_id, itemData.dummy.id, itemData.quantity === 0)
                        }} / {{ kittingQty * (itemData.quantity !== 0 ? itemData.quantity : itemData.foc_qty) }}
                    </td>
                    <td>
                        <q-btn :disable="itemData.dummy === null && itemData.dummy.dummy_products.length < 1"
                               v-if="itemData.dummy !== null"
                               :color="getAttributesTotalSelectedQuantityCount(itemData.kitting_id, itemData.dummy.id, itemData.quantity === 0) === (kittingQty * (itemData.quantity !== 0 ? itemData.quantity : itemData.foc_qty)) ? 'positive' : 'negative'"
                               @click="attributesSelectionToggle(index)"
                               small
                               :label="getAttributesTotalSelectedQuantityCount(itemData.kitting_id, itemData.dummy.id, itemData.quantity === 0) === (kittingQty * (itemData.quantity !== 0 ? itemData.quantity : itemData.foc_qty)) ? $t('Common.ChangeSize.Text') : $t('Common.ChooseSize.Text')"
                               outline>
                        </q-btn>
                    </td>
                </tr>
                <tr class="bg-blue-1 animated fadeInDown"
                    v-if="itemData.dummy !== null && itemData.dummy.dummy_products !== null && toggleAttributes.findIndex(x => x === index) !== -1">
                    <td colspan="4">
                        <div class="row">
                            <q-input class="col-lg-3 no-shadow custom-input-border"
                                     placeholder="Search Size : CBS"
                                     clearable
                                     inverted-light
                                     color="white text-gery-6"
                                     v-model="terms[index]"
                                     @clear="results.splice(results.indexOf(index), 1)"
                                     @input="filterAndProcessAttributeOptions(itemData.dummy.dummy_products, index)"
                                     :after="[
                                    {
                                        icon: 'search'
                                    }
                                ]"
                            ></q-input>
                        </div>
                    </td>
                </tr>
                <tr class="animated fadeInDown" :class="{'text-bold bg-amber-3' : dummy.is_dummy_code === 1, 'bg-blue-1' : dummy.is_dummy_code !== 1}"
                    v-if="toggleAttributes.findIndex(x => x === index) !== -1"
                    v-for="(dummy, index2) in (itemData.dummy !== null ? (results[index] !== undefined ? results[index] : itemData.dummy.dummy_products) : [])">
                    <td align="left">
                        {{ dummy.sku }}
                    </td>
                    <td align="left">
                        {{ dummy.name }}
                    </td>
                    <td>
                        <q-input align="center"
                                 readonly
                                 type="number"
                                 class="no-shadow custom-input-border"
                                 inverted-light
                                 color="white text-gery-6"
                                 :value="getAttributeQuantityCount('sizes', itemData.product_id, itemData.kitting_id, itemData.dummy.id, dummy.id, dummy.is_dummy_code, itemData.quantity === 0)"
                                 :min="0"></q-input>
                    </td>
                    <td colspan="2">
                        <div class="row justify-center items-baseline group">
                            <div class="col-lg-auto">
                                <q-btn color="grey-7"
                                       @click="minusAttributeQuantity((itemData.quantity !== 0 ? itemData.quantity : itemData.foc_qty), itemData.product_id, itemData.kitting_id, itemData.dummy.id, 'sizes', dummy.id, dummy.is_dummy_code, itemData.quantity === 0)"
                                       small round outline
                                       icon="remove"></q-btn>
                            </div>
                            <div class="col-lg-auto">
                                <q-btn color="grey-7"
                                       @click="addAttributeQuantity((itemData.quantity !== 0 ? itemData.quantity : itemData.foc_qty), itemData.product_id, itemData.kitting_id, itemData.dummy.id, 'sizes', dummy.id, kittingQty, dummy.is_dummy_code, itemData.quantity === 0)"
                                       small round outline icon="add"></q-btn>
                            </div>
                        </div>
                    </td>
                </tr>
            </template>
            </tbody>
        </table>
    </div>
</template>
<script>
  export default {
    name: 'sizes-attributes',
    props: {
      additional_requirements: {
        type: Object,
        required: true
      },
      itemsData: {
        type: Array,
        required: true
      },
      tableTh: {
        type: Array,
        required: true
      },
      kittingQty: {
        type: Number,
        required: true
      }
    },
    data: () => ({
      terms: [],
      results: [],
      requirements: {},
      toggleAttributes: []
    }),
    created() {
      this.requirements = this.additional_requirements
    },
    methods: {
      filterAndProcessAttributeOptions(options, index) {
        let term = this.terms[index]
        this.results[index] = options.filter(item => {
          if (item.sku.toLowerCase().indexOf(term.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(term.toLowerCase()) > -1) {
            return item
          }
        })
      },
      addNewAttribute(productID, kittingID, dummyID, type) {
        kittingID = this.normalizeKittindID(kittingID)
        if (this.requirements[type].filter(x => x.product_id === productID && x.kitting_id === kittingID).length < 1) {
          let attributeTemp = {
            product_id: productID,
            kitting_id: kittingID,
            dummy_id: dummyID ? dummyID : '',
            data: []
          }
          this.requirements[type].push(attributeTemp)
        }
      },
      addAttributeQuantity(requiredQuantity, productID, kittingID, dummyID, type, attributeProductID, kittingQty, isDummy, isFoc) {
        kittingID = this.normalizeKittindID(kittingID)
        if (typeof kittingQty !== 'undefined' && kittingQty !== '') {
          requiredQuantity = requiredQuantity * kittingQty
        }
        if (isDummy) {
          type = 'evoucher'
        }
        this.addNewAttribute(productID, kittingID, dummyID, type)
        let selectedQuantity = 0
        let totalSelectedQuantity = this.getTotalSelectedQuantitySizes(kittingID, dummyID, isFoc)
        let totalSelectedQuantityEvoucher = this.getTotalSelectedQuantityEvoucher(kittingID, dummyID, isFoc)
        let requirementIndex = this.requirements[type].findIndex(x => x.product_id === productID && x.kitting_id === kittingID)
        if (requirementIndex !== -1) {
          let quantity = {
            product_id: attributeProductID,
            quantity: isFoc ? 0 : 1,
            foc_qty: isFoc ? 1 : 0
          }
          let dataIndex = this.requirements[type][requirementIndex].data.findIndex(x => x.product_id === attributeProductID)
          let selectedQuantityData = this.requirements[type][requirementIndex].data.find(x => x.product_id === attributeProductID)
          if (selectedQuantityData !== undefined && Object.keys(selectedQuantityData).length > 0) {
            selectedQuantity += isFoc ? selectedQuantityData.foc_qty : selectedQuantityData.quantity
          }
          if (selectedQuantity < requiredQuantity && (totalSelectedQuantity + totalSelectedQuantityEvoucher) < requiredQuantity) {
            if (dataIndex !== -1) {
              if (isFoc) {
                this.requirements[type][requirementIndex].data[dataIndex].foc_qty += 1
              } else {
                this.requirements[type][requirementIndex].data[dataIndex].quantity += 1
              }
            } else {
              this.requirements[type][requirementIndex].data.push(quantity)
            }
          }
          if (this.requirements[type][requirementIndex].data.length < 1) {
            this.requirements[type].splice(requirementIndex, 1)
          }
        }
      },
      minusAttributeQuantity(requiredQuantity, productID, kittingID, dummyID, type, attributeProductID, isDummy, isFoc) {
        kittingID = this.normalizeKittindID(kittingID)
        if (isDummy) {
          type = 'evoucher'
        }
        let requirementIndex = this.requirements[type].findIndex(x => x.product_id === productID && x.kitting_id === kittingID)
        if (requirementIndex !== -1) {
          let dataIndex = this.requirements[type][requirementIndex].data.findIndex(x => x.product_id === attributeProductID)
          if (dataIndex !== -1) {
            let qty = isFoc ? this.requirements[type][requirementIndex].data[dataIndex].foc_qty : this.requirements[type][requirementIndex].data[dataIndex].quantity
            if (qty >= 1) {
              if (isFoc) {
                this.requirements[type][requirementIndex].data[dataIndex].foc_qty -= 1
              } else {
                this.requirements[type][requirementIndex].data[dataIndex].quantity -= 1
              }
            }
            if (isFoc ? this.requirements[type][requirementIndex].data[dataIndex].foc_qty : this.requirements[type][requirementIndex].data[dataIndex].quantity === 0) {
              this.requirements[type][requirementIndex].data.splice(dataIndex, 1)
            }
          }
          if (this.requirements[type][requirementIndex].data.length < 1) {
            this.requirements[type].splice(requirementIndex, 1)
          }
        }
      },
      getAttributeQuantityCount(type, productID, kittingID, dummyID, rowItemID, rowItemIsDummy, isFoc) {
        kittingID = this.normalizeKittindID(kittingID)
        if (rowItemIsDummy) {
          type = 'evoucher'
        }
        let selections = this.requirements[type].find(x => x.product_id === productID && x.kitting_id === kittingID && x.dummy_id === dummyID)
        let count = 0
        if (selections !== undefined) {
          if (selections.data.length > 0) {
            selections.data.forEach((item) => {
              if (item.product_id === rowItemID) {
                count = isFoc ? item.foc_qty : item.quantity
              }
            })
          }
        }
        return count
      },
      getAttributesTotalSelectedQuantityCount(kittingID, dummyID, isFoc) {
        let totalSelected = 0
        totalSelected = this.getTotalSelectedQuantitySizes(kittingID, dummyID, isFoc) + this.getTotalSelectedQuantityEvoucher(kittingID, dummyID, isFoc)
        return totalSelected
      },
      getTotalSelectedQuantitySizes(kittingID, dummyID, isFoc) {
        let totalSelectedQuantity = 0
        let totalSelectedQuantitySizesData = this.requirements.sizes.filter(x => x.kitting_id === kittingID)
        if (totalSelectedQuantitySizesData.length > 0) {
          totalSelectedQuantitySizesData.forEach((item) => {
            if (item.data.length > 0 && item.dummy_id === dummyID) {
              item.data.forEach((x) => {
                totalSelectedQuantity += isFoc ? x.foc_qty : x.quantity
              })
            }
          })
        }
        return totalSelectedQuantity
      },
      getTotalSelectedQuantityEvoucher(kittingID, dummyID, isFoc) {
        let totalSelectedQuantityEvoucher = 0
        let totalSelectedQuantityEvoucherData = this.requirements.evoucher.filter(x => x.kitting_id === kittingID)
        if (totalSelectedQuantityEvoucherData.length > 0) {
          totalSelectedQuantityEvoucherData.forEach((item) => {
            if (item.data.length > 0 && item.dummy_id === dummyID) {
              item.data.forEach((y) => {
                totalSelectedQuantityEvoucher += isFoc ? y.foc_qty : y.quantity
              })
            }
          })
        }
        return totalSelectedQuantityEvoucher
      },
      attributesSelectionToggle(index) {
        let attributeIndex = this.toggleAttributes.findIndex(x => x === index)
        if (attributeIndex !== -1) {
          this.toggleAttributes.splice(attributeIndex, 1)
        } else {
          this.toggleAttributes.push(index)
        }
      },
      normalizeKittindID(kittingID) {
        return typeof kittingID !== 'undefined' ? kittingID : null
      }
    }
  }
</script>