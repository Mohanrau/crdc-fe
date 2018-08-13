<template>
    <div class="product-categories-tab">
        <div class="row">
            <div class="col-12">
                <q-field
                        helper="*"
                >
                    <table class="q-table-html bordered cell-separator full-width mt-10">
                        <thead>
                        <tr class="header bg-grey-3">
                            <th width="90%" class="text-center">{{ $t('campaigns.esacPromotion.categoryName') }}</th>
                            <th width="10%" class="text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td data-th="Category Name">
                                <q-input
                                        name="productCategoryInput"
                                        readonly
                                        :value="adderRow.name"
                                        :stack-label="$t('smartLibrary.productCategory.label')">
                                    <q-popover fit :offset="[0, 10]" ref="productCategoryPopover">
                                        <div class="product-category-popover pd-10">
                                            <ul>
                                                <li v-for="level1 in productCategoryOptions">
                                                    <q-icon name="chevron_right"/>
                                                    <span :class="{'active': isProductCategorySelected(level1.id) }"
                                                          class="cursor-pointer"
                                                          @click="setProductCategory(level1.id, level1.name)">
                                                            {{ level1.name }}
                                                        </span>
                                                    <ul>
                                                        <li v-for="level2 in level1.children">
                                                            <span :class="{'active': isProductCategorySelected(level2.id) }"
                                                                  class="cursor-pointer"
                                                                  @click="setProductCategory(level2.id, level2.name)">
                                                                {{ level2.name }}
                                                            </span>
                                                            <ul>
                                                                <li v-for="level3 in level2.children">
                                                                    <span :class="{'active': isProductCategorySelected(level3.id) }"
                                                                          class="cursor-pointer"
                                                                          @click="setProductCategory(level3.id, level3.name)">
                                                                        {{ level3.name }}
                                                                    </span>
                                                                    <ul>
                                                                        <li v-for="level4 in level3.children">
                                                                            <span :class="{'active': isProductCategorySelected(level4.id) }"
                                                                                  class="cursor-pointer"
                                                                                  @click="setProductCategory(level4.id, level4.name)">
                                                                                {{ level4.name }}
                                                                            </span>
                                                                        </li>
                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </q-popover>
                                </q-input>
                            </td>
                            <td>
                                <q-btn :disable="!adderRow.id > 0" @click="addRow" color="positive" flat>
                                    <q-icon name="add"/>
                                </q-btn>
                            </td>
                        </tr>
                        <tr v-for="(item, index) in esacPromotionData.esac_promotion_product_categories">
                            <td data-th="Category Name">{{ item.name }}</td>
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
      id: 0,
      name: ''
    }
  }

  function unflatten (array, parent, tree) {
    tree = typeof tree !== 'undefined' ? tree : []
    parent = typeof parent !== 'undefined' ? parent : {id: 0}

    var children = _.filter(array, function (child) { return child.parent_id === parent.id })

    if (!_.isEmpty(children)) {
      if (parent.id === 0) {
        tree = children
      } else {
        parent['children'] = children
      }
      _.each(children, function (child) { unflatten(array, child) })
    }
    tree.sort(function (a, b) {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
    return tree
  }

  export default {
    name: 'product-categories-tab',
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
        productCategoryData: state => state.productsCMP.productCategories.list.data,
        selectedFilters: state => state.globalCMP.selectedFilters
      })
    },
    mounted: function () {
      let query = {
        for_sales: true,
        active: true,
        limit: 0
      }
      this.getProductCategoriesAction(query).then(() => {
        this.productCategoryOptions = unflatten(this.productCategoryData)
      })
    },
    data: () => ({
      adderRow: initializeAdderRow(),
      addRowTemp: {
        id: 0,
        name: ''
      },
      productCategoryOptions: []
    }),
    methods: {
      ...mapActions([
        'getProductCategoriesAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION'
      }),
      isProductCategorySelected (id) {
        return this.adderRow.id === id
      },
      setProductCategory (id, name) {
        if (this.adderRow.id === id) {
          this.adderRow.id = null
          this.adderRow.name = null
        }
        else {
          this.adderRow.id = id
          this.adderRow.name = name
        }
        this.$refs.productCategoryPopover.hide()
      },
      addRow () {
        if (this.adderRow.id > 0) {
          let duplicated = false;
          this.esacPromotionData.esac_promotion_product_categories.forEach(element => {
            if(element.id === this.adderRow.id) {
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
            this.esacPromotionData.product_categories.push(this.adderRow.id)
            this.esacPromotionData.esac_promotion_product_categories.push(Vue.util.extend({}, JSON.parse(JSON.stringify(this.adderRow))))
            // Reset adderRow
            Object.assign(this.adderRow, initializeAdderRow())
          }
        }
      },
      removeRow (index) {
        Vue.delete(this.esacPromotionData.product_categories, index)
        Vue.delete(this.esacPromotionData.esac_promotion_product_categories, index)
      }
    }
  }
</script>
<style lang="stylus">
    .product-category-popover > ul, .product-category-popover > ul > li > ul, .product-category-popover > ul > li > ul > li > ul
        list-style none

    .product-category-popover > ul > li
        padding 6px
        margin-left -30px

    .product-category-popover span:hover, .product-category-popover .active
        color #989898
</style>
