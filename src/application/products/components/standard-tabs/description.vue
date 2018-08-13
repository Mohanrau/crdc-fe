<template>
    <div class="general-tab">
        <div class="row">
            <div class="col-lg-5 col-md-12 col-xs-12 pd-10">
                <div class="general-holder mb-10">
                    <div class="general-label text-grey-5">
                        <div>{{ $t('products.standard.description.availLanguages.label') }}</div>
                    </div>
                </div>
                <q-list dense>
                    <q-item class="relative-position">
                        <q-item-main>
                            <q-item-tile label>
                                <q-select
                                        v-model="descriptionTemp.language_id"
                                        color="white text-grey-6"
                                        class="no-shadow custom-input-border"
                                        inverted-light
                                        placeholder="Choose ..."
                                        filter
                                        :stack-label="$t('products.standard.description.choose.language')"
                                        radio
                                        :options="languageOptions"
                                />
                            </q-item-tile>
                        </q-item-main>
                        <q-item-side right>
                            <q-btn round outline small color="positive" icon="add" @click="addNewDescription"></q-btn>
                        </q-item-side>
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </q-item>
                    <q-item-separator/>
                    <q-item class="cursor-pointer" :class="{'bg-grey-2': currentLanguage === index }" @click.native="showSelectedDescription(index)"
                            multiline highlight tag="div"
                            v-for="(desc, index) in standardProduct.description" :key="desc.language_id">
                        <q-item-side>
                            <q-btn @click="removeDescription(index)" small outline round color="negative"
                                   icon="remove"></q-btn>
                        </q-item-side>
                        <q-item-main>
                            <q-item-tile label>{{ desc.language.name }}</q-item-tile>
                            <q-item-tile sublabel>
                                <small>{{ desc.language.key }}</small>
                            </q-item-tile>
                        </q-item-main>
                        <q-item-side right v-if="validation.standardProduct.description.$each[index].$invalid">
                            <q-item-tile icon="priority_high" size="10px" color="negative">
                                <q-tooltip>
                                    Required fields missing
                                </q-tooltip>
                            </q-item-tile>
                        </q-item-side>
                    </q-item>
                </q-list>
            </div>
            <div class="col-lg-7 col-md-12 col-xs-12 pd-10">
                <div class="general-holder mb-10">
                    <div class="general-title">
                        <div>{{ $t('products.standard.description.desc') }}</div>
                    </div>
                </div>
                <div class="general-body" v-for="(descriptionTemp, index) in standardProduct.description"
                     :key="descriptionTemp.language_id" v-if="currentLanguage === index">
                    <div class="general-holder marketing-description mb-20">
                        <div class="general-label text-grey-5">
                            <div>{{ $t('products.standard.description.mDesc') }}</div>
                        </div>
                        <div class="general-item text-bold">
                            <q-field
                                    helper="*"
                                    :error="validation.standardProduct.description.$each[index].marketing_description.$error"
                                    error-label="Please input some value"
                            >
                                <q-editor
                                        :toolbar="getEditorConfig('toolbar')"
                                        :fonts="getEditorConfig('fonts')"
                                        v-model="descriptionTemp.marketing_description"
                                        color="black"
                                        @input="validation.standardProduct.description.$each[index].marketing_description.$touch"
                                />
                            </q-field>
                        </div>
                    </div>
                    <div class="general-holder benefits mb-20">
                        <div class="general-label text-grey-5">
                            <div>Benefits</div>
                        </div>
                        <div class="general-item text-bold">
                            <q-field
                                    helper="*"
                                    :error="validation.standardProduct.description.$each[index].benefits.$error"
                                    error-label="Please input some value"
                            >
                                <q-editor
                                        v-model="descriptionTemp.benefits"
                                        :toolbar="getEditorConfig('toolbar')"
                                        :fonts="getEditorConfig('fonts')"
                                        color="black"
                                        @input="validation.standardProduct.description.$each[index].benefits.$touch"
                                />
                            </q-field>
                        </div>
                    </div>
                    <div class="general-holder specification mb-20">
                        <div class="general-label text-grey-5">
                            <div>Product Specification</div>
                        </div>
                        <div class="general-item text-bold">
                            <q-editor
                                    :toolbar="getEditorConfig('toolbar')"
                                    :fonts="getEditorConfig('fonts')"
                                    v-model="descriptionTemp.specification"
                                    color="black"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { EditorMixin } from 'src/application/global/mixins'
  import Vue from 'vue'

  export default {
    name: 'description-tab',
    components: {
      qLoader
    },
    mixins: [EditorMixin],
    props: {
      'standardProduct': {
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
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        languageOptions: state => state.globalCMP.languagesOptions.data.options,
        productData: state => state.productsCMP.saveData.data
      })
    },
    created () {
      this.getLanguagesAction()
    },
    data: () => ({
      test: 'moha',
      removedIndex: '',
      currentLanguage: 0,
      descriptionTemp: {
        language_id: '',
        marketing_description: '',
        benefits: '',
        specification: '',
        language: {
          id: '',
          name: '',
          key: ''
        }
      }
    }),
    methods: {
      ...mapActions([
        'getLanguagesAction'
      ]),
      addNewDescription () {
        if (this.descriptionTemp.language_id) {
          // Disallow selected language to be reselect
          if (!this.standardProduct.description.filter(e => e.language_id === this.descriptionTemp.language_id).length > 0) {
            var name = this.languageOptions.filter(lang => {
              return lang.value.toString().indexOf(this.descriptionTemp.language_id) > -1
            })
            this.descriptionTemp.language.name = name[0].label
            this.descriptionTemp.language.key = name[0].key
            this.standardProduct.description.push(Vue.util.extend({}, JSON.parse(JSON.stringify(this.descriptionTemp))))
          }
        }

        // Reset select value to original state
        this.descriptionTemp.language_id = ''
        this.showSelectedDescription(this.standardProduct.description.length - 1)
      },
      removeDescription (index) {
        this.removedIndex = index
        Vue.delete(this.standardProduct.description, index)
      },
      showSelectedDescription (index) {
        if (this.removedIndex === index) {
          this.currentLanguage = 0
        } else {
          this.currentLanguage = index
        }
      }
    }
  }
</script>
<style lang="stylus">

</style>