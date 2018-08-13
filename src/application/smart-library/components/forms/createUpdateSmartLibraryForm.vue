<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="createSmartLibraryForm"
                    :backgroudColor="false"
                    :formTitle="$t('smartLibrary.newSmartLibrary.title')"
                    v-bind:formFieldData="smartLibraryData"
                    urlResetPathName="Smart Library List"
                    formAction="createSmartLibraryAction"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <div class="pwp-foc-section">
                    <div class="configuration-content-sections shadow-1 pd-10  bg-white">
                        <div class="row gutter-sm">
                            <div class="col-lg-6">
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('title')"
                                                 :error-label="getErrorMessage('title')"
                                                 :count="50"
                                        >
                                            <q-input name="titleInput" v-model="smartLibraryData.title"
                                                     :stack-label="$t('smartLibrary.title.label')"></q-input>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('description')"
                                                 :error-label="getErrorMessage('description')"
                                                 :count="500"
                                        >
                                            <q-input name="descriptionInput" type="textarea" :min-rows="5"
                                                     :max-height="80" v-model="smartLibraryData.description"
                                                     :stack-label="$t('smartLibrary.description.label')"></q-input>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :label="$t('smartLibrary.country.label')"
                                                 :error="getErrorState('countries')"
                                                 :labelWidth="2"
                                                 :error-label="getErrorMessage('countries')"
                                        >
                                            <q-option-group type="checkbox"
                                                            name="countries"
                                                            v-model="smartLibraryData.countries"
                                                            :options="countriesOptions.options"
                                            ></q-option-group>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('language_id')"
                                                 :error-label="getErrorMessage('language_id')"
                                        >
                                            <q-select
                                                    name="languageInput"
                                                    color="primary"
                                                    v-model="smartLibraryData.language_id"
                                                    :stack-label="$t('smartLibrary.language.label')"
                                                    :options="languageOptions.options"
                                            />
                                            <q-loader :visible="isProcessingSection"></q-loader>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field 
                                                 :error="getErrorState('sale_type_id')"
                                                 :error-label="getErrorMessage('sale_type_id')"
                                        >
                                            <q-select
                                                    name="saleTypeInput"
                                                    color="primary"
                                                    v-model="smartLibraryData.sale_type_id"
                                                    :stack-label="$t('smartLibrary.saleType.label')"
                                                    :options="masterDataOptionsCreator($const.masterKey.SALE_TYPES)"
                                            />
                                            <q-loader :visible="isProcessingSection"></q-loader>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field
                                                :error="getErrorState('product_category_id')"
                                                :error-label="getErrorMessage('product_category_id')"
                                        >
                                            <q-input
                                                    name="productCategoryInput"
                                                    readonly
                                                    :value="smartLibraryData.product_category_name"
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
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field
                                                :error="getErrorState('product_id')"
                                                :error-label="getErrorMessage('product_id')"
                                        >
                                            <q-input
                                                    name="productInput"
                                                    v-model="smartLibraryData.product_code"
                                                    :stack-label="$t('smartLibrary.product.label')"
                                                    @blur="productInputBlur">
                                                <q-autocomplete
                                                        :max-results="10"
                                                        @search="searchProduct"
                                                        @selected="productInputSelected"
                                                />
                                            </q-input>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :label="$t('smartLibrary.status.label')"
                                                 :error="getErrorState('status')"
                                                 :error-label="getErrorMessage('status')"
                                        >
                                            <q-option-group
                                                    type="radio"
                                                    color="primary"
                                                    inline
                                                    v-model="smartLibraryData.status"
                                                    :options="statusOptions"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('sequence_priority')"
                                                 :error-label="getErrorMessage('sequence_priority')"
                                        >
                                            <q-input name="sequencepriorityInput"
                                                     v-model="smartLibraryData.sequence_priority"
                                                     :stack-label="$t('smartLibrary.sequencePriority.label')"
                                                     type="number"></q-input>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item">
                                        <q-field helper="*"
                                                 :label="$t('smartLibrary.thumbnail.label')"
                                                 labelWidth="3"
                                                 :error="getErrorState('thumbnail_data')"
                                                 :error-label="getErrorMessage('thumbnail_data')"
                                        >
                                            <div class="col-2 shadow-1" v-if="smartLibraryData.thumbnail_link !== ''">
                                                <div class="col-lg-12">
                                                    <div class="img-row">
                                                        <q-carousel
                                                                height="200px"
                                                                no-swipe
                                                                class="text-white">
                                                            <q-carousel-slide
                                                                    :img-src="smartLibraryData.thumbnail_link">
                                                            </q-carousel-slide>
                                                            <q-carousel-control slot="control-nav"
                                                                                slot-scope="carousel">
                                                                <q-btn
                                                                        round dense
                                                                        color="tertiary"
                                                                        :icon="carousel.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                                                                        @click="carousel.toggleFullscreen()"
                                                                />
                                                            </q-carousel-control>
                                                        </q-carousel>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 cursor-pointer"
                                                 v-on:click="$refs.thumbnailUploadModal.show()">
                                                <q-card flat inline class="bigger q-ma-xs fit"
                                                        color="white text-black">
                                                    <q-card-main class="fit">
                                                        <div class="row fit justify-center">
                                                            <div class="text-grey-4 self-center">
                                                                <span class="q-display-3">
                                                                    <q-icon :name="smartLibraryData.thumbnail_link !== '' ? 'refresh' : 'add'"></q-icon>
                                                                </span>
                                                                <div class="q-caption">
                                                                    {{$t('smartLibrary.thumbnail.label')}}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </q-card-main>
                                                </q-card>
                                            </div>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('upload_file_type')"
                                                 :error-label="getErrorMessage('upload_file_type')"
                                        >
                                            <q-select
                                                    name="fileTypeInput"
                                                    color="primary"
                                                    v-model="smartLibraryData.upload_file_type"
                                                    :stack-label="$t('smartLibrary.fileType.label')"
                                                    :options="fileTypeOptions"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :label="$t('smartLibrary.file.label')"
                                                 labelWidth="3"
                                                 :error="getErrorState('upload_file_data')"
                                                 :error-label="getErrorMessage('upload_file_data')"
                                        >
                                            <q-card flat>
                                                <div class="row justify-center gutter-sm items-baseline header-row-mb" v-if="smartLibraryData.upload_file_data === ''">
                                                    <div class="col-lg-6 col-md-12 col-xs-12">
                                                        <q-btn class="fit" glossy size="sm" color="positive" @click="$refs.youtubeHelperModal.show()">
                                                            {{ $t('smartLibrary.AddYoutubeVideo.label') }}
                                                        </q-btn>
                                                    
                                                        <div class="fit text-center">{{ $t('smartLibrary.or.label') }}</div>
                                                    
                                                        <q-btn class="fit" glossy size="sm" color="positive" @click="$refs.fileUploadModal.show()">
                                                            {{ $t('smartLibrary.browseLocalFile.label') }}
                                                        </q-btn>
                                                    
                                                        <div class="fit text-center">{{ $t('smartLibrary.or.label') }}</div>
                                                    
                                                        <q-btn class="fit" glossy size="sm" color="positive" @click="$refs.customUrlModal.show()">
                                                            {{ $t('smartLibrary.customUrl.label') }}
                                                        </q-btn>
                                                    </div>
                                                </div>
                                                <div class="row gutter-sm items-baseline header-row-mb" v-else="">
                                                    <div class="col-lg-auto col-md-12 col-xs-12">
                                                        <a target="_blank" v-bind:href="smartLibraryData.upload_file_link">{{$t('smartLibrary.Download.label')}}</a>
                                                    </div>
                                                    <div class="col-lg-auto col-md-12 col-xs-12">
                                                        <q-btn class="fit" glossy size="sm" color="positive" @click="removeUploadFile">
                                                            {{ $t('smartLibrary.remove.label') }}
                                                        </q-btn>
                                                    </div>
                                                </div>
                                            </q-card>                                            
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field 
                                                 :error="getErrorState('new_joiner_essential_tools')"
                                                 :error-label="getErrorMessage('new_joiner_essential_tools')"
                                        >
                                            <q-checkbox v-model="smartLibraryData.new_joiner_essential_tools"
                                                        :label="$t('smartLibrary.newJoinerEssentialTool.label')"/>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </basic-form>
        <q-loader :message="message" :visible="isProcessingForm"></q-loader>
        <q-modal ref="thumbnailUploadModal" :minimized="true"
                 :content-css="{padding: '15px', minWidth: '50vw', minHeight: '80vh'}">
            <div class="row gutter-sm justify-between items-stretch content-stretch">
                <div class="col-8">
                    <div class="no-margin vertical-middle">{{ $t('smartLibrary.thumbnail.title') }}</div>
                </div>
                <div class="col-4">
                    <q-btn class="float-right material-icons" color="primary" icon="close"
                           @click="$refs.thumbnailUploadModal.hide()">
                    </q-btn>
                </div>
            </div>
            <hr>
            <div class="row gutter-sm">
                <div class="col-12">
                  <generalUploader
                    :stack-label="$t('smartLibrary.thumbnail.title')"
                    :multiple="false"
                    :uploadCallback='thumbnailUploaded'
                    uploaderFileType="smart_library_thumbnail">
                  </generalUploader>
                </div>
            </div>
        </q-modal>
        <q-modal ref="fileUploadModal" :minimized="true"
                 :content-css="{padding: '15px', minWidth: '50vw', minHeight: '80vh'}">
            <div class="row gutter-sm justify-between items-stretch content-stretch">
                <div class="col-8">
                    <div class="no-margin vertical-middle">{{ $t('smartLibrary.uploadFile.title') }}</div>
                </div>
                <div class="col-4">
                    <q-btn class="float-right material-icons" color="primary" icon="close"
                           @click="$refs.fileUploadModal.hide()">
                    </q-btn>
                </div>
            </div>
            <hr>
            <div class="row gutter-sm">
                <div class="col-12">
                  <generalUploader
                    :stack-label="$t('smartLibrary.uploadFile.title')"
                    :multiple="false"
                    :uploadCallback='fileUploaded'
                    uploaderFileType="smart_library_file">
                  </generalUploader>
                </div>
            </div>
        </q-modal>
        <q-modal ref="youtubeHelperModal" :minimized="true"
                 :content-css="{padding: '15px', minWidth: '50vw', minHeight: '80vh'}">
            <div class="row gutter-sm justify-between items-stretch content-stretch">
                <div class="col-8">
                    <div class="no-margin vertical-middle">{{ $t('smartLibrary.AddYoutubeVideo.label') }}</div>
                </div>
                <div class="col-4">
                    <q-btn class="float-right material-icons" color="primary" icon="close"
                           @click="$refs.youtubeHelperModal.hide()">
                    </q-btn>
                </div>
            </div>
            <hr>
            <div class="row gutter-sm">
                <div class="col-12">
                    <q-field
                            :error="youtubeVideoId === ''"
                            error-label="*"
                    >
                        <q-input
                            name="youtubeVideoIdInput"
                            v-model="youtubeVideoId"
                            :stack-label="$t('smartLibrary.youtubeVideoId.label')">
                        </q-input>
                    </q-field>
                </div>
                <div class="col-12">
                    <q-card flat>
                        <div class="row justify-end gutter-sm items-baseline header-row-mb">
                            <div class="col-lg-auto col-md-12 col-xs-12">
                                <q-btn class="fit" glossy size="sm" color="positive" @click="addYoutubeVideo">
                                    {{ $t('Common.Add.Btn') }}
                                </q-btn>
                            </div>
                        </div>
                    </q-card>
                </div>
            </div>
        </q-modal>
        <q-modal ref="customUrlModal" :minimized="true"
                 :content-css="{padding: '15px', minWidth: '50vw', minHeight: '80vh'}">
            <div class="row gutter-sm justify-between items-stretch content-stretch">
                <div class="col-8">
                    <div class="no-margin vertical-middle">{{ $t('smartLibrary.customUrl.label') }}</div>
                </div>
                <div class="col-4">
                    <q-btn class="float-right material-icons" color="primary" icon="close"
                           @click="$refs.customUrlModal.hide()">
                    </q-btn>
                </div>
            </div>
            <hr>
            <div class="row gutter-sm">
                <div class="col-12">
                    <q-field
                            :error="customUrl === ''"
                            error-label="*"
                    >
                        <q-input
                            name="customUrlInput"
                            v-model="customUrl"
                            :stack-label="$t('smartLibrary.customUrl.label')"
                            type="url">
                        </q-input>
                    </q-field>
                </div>
                <div class="col-12">
                    <q-card flat>
                        <div class="row justify-end gutter-sm items-baseline header-row-mb">
                            <div class="col-lg-auto col-md-12 col-xs-12">
                                <q-btn class="fit" glossy size="sm" color="positive" @click="addCustomUrl">
                                    {{ $t('Common.Add.Btn') }}
                                </q-btn>
                            </div>
                        </div>
                    </q-card>
                </div>
            </div>
        </q-modal>
    </div>
</template>
<script>
  import generalUploader from 'src/application/global/components/common/uploads/uploader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import masterDataTransformarMixin from 'src/application/global/mixins/masterDataTransformarMixin'
  import _ from 'lodash'
  import { api } from '../../api'
  import { required, minLength, maxLength, between, numeric, url } from 'vuelidate/lib/validators'
  import { mapActions, mapMutations, mapState } from 'vuex'

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
    name: 'create-smart-library-form',
    components: {
      generalUploader,
      BasicForm: basicForm,
      qLoader
    },
    mixins: [masterDataTransformarMixin],
    props: ['smartLibraryId'],
    computed: {
      ...mapState({
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        masterData: state => state.globalCMP.masterData.data.list,
        formData: state => state.globalCMP.formData,
        languageOptions: state => state.globalCMP.languagesOptions.data,
        productCategoryData: state => state.productsCMP.productCategories.list.data,
        productSearchData: state => state.smartLibraryCMP.productSearchData,
        smartLibraryFileTypeData: state => state.smartLibraryCMP.smartLibraryFileTypeData
      })
    },
    mounted: function () {
      this.master.keys = [this.$const.masterKey.SALE_TYPES]
      this.getCountriesAction()
      this.getLanguagesAction()
      let query = {
        for_marketing: true,
        active: true,
        limit: 0
      }
      this.getProductCategoriesAction(query).then(() => {
        this.productCategoryOptions = unflatten(this.productCategoryData)
      })
      this.getSmartLibraryFileTypeAction({}).then(() => {
        this.fileTypeOptions = this.smartLibraryFileTypeData.list
      })
      if (this.smartLibraryId) {
        this.setFormData()
      }
    },
    data: () => ({
      message: '',
      headers: {
        Accept: 'form-data',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('accessToken')
      },
      productCategoryOptions: [],
      fileTypeOptions: [],
      statusOptions: [
        {label: 'Published', value: 1},
        {label: 'Yet to Publish', value: 0}
      ],
      smartLibraryData: {
        title: '',
        description: '',
        countries: [],
        language_id: 0,
        sale_type_id: null,
        product_category_id: null,
        product_category_name: null,
        product_id: null,
        product_code: null,
        status: 0,
        sequence_priority: 0,
        thumbnail_data: '',
        thumbnail_link: '',
        upload_file_type: '',
        upload_file_data: '',
        upload_file_link: '',
        upload_file_user: true,
        new_joiner_essential_tools: false
      },
      selectedProductCode: null,
      youtubeVideoId: '',
      customUrl: ''
    }),
    validations: {
      smartLibraryData: {
        title: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(50)
        },
        description: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(500)
        },
        countries: {
          required,
          minLength: minLength(1)
        },
        language_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        sale_type_id: {
          numeric,
          between: between(1, 9999999999)
        },
        status: {
          required,
          numeric,
          between: between(0, 1)
        },
        sequence_priority: {
          required,
          numeric,
          between: between(0, 9999999999)
        },
        thumbnail_data: {
          required
        },
        upload_file_data: {
          required
        },
        upload_file_type: {
          required
        }
      }
    },
    methods: {
      ...mapActions([
        'getSmartLibraryProductAction',
        'getMastersWithKey',
        'getCountriesAction',
        'createSmartLibraryAction',
        'updateSmartLibraryAction',
        'getSmartLibraryAction',
        'getMasterDataOptionsAction',
        'getProductCategoriesAction',
        'getSmartLibraryFileTypeAction',
        'getLanguagesAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION',
        setIsProcessingForm: 'IS_PROCESSING_FORM',
      }),
      invalidRequest () {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'Smart Library List'})
        }, 1500)
      },
      setFormData: function () {
        this.getSmartLibraryAction(this.smartLibraryId).then((res) => {
          // clone object assign store state to local state
          this.smartLibraryData = Object.assign({}, this.formData.formData)
        }).catch((error) => {
          if (error.status === 404) {
            this.setNotification({
              title: 'Uh oh! An error occured',
              message: error.data.error,
              type: 'negative'
            })
          }
          this.invalidRequest()
        })
      },
      getErrorState: function (name) {
        var isError = false
        if (this.$v.smartLibraryData[name] !== undefined) {
          isError = this.$v.smartLibraryData[name].$error
        }
        if (isError === false) {
          if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
            isError = true
          } else {
            isError = false
          }
        }
        return isError
      },
      getErrorMessage: function (name) {
        var errorMessage = ''
        if (this.$v.smartLibraryData[name] !== undefined) {
          if (this.$v.smartLibraryData[name].$error) {
            if (this.$v.smartLibraryData[name].hasOwnProperty('required')) {
              if (this.$v.smartLibraryData[name].required === false) {
                errorMessage = 'Required'
              }
            }
            if (this.$v.smartLibraryData[name].hasOwnProperty('minLength')) {
              if (this.$v.smartLibraryData[name].minLength === false) {
                errorMessage = 'Minimum length'
              }
            }
            if (this.$v.smartLibraryData[name].hasOwnProperty('maxLength')) {
              if (this.$v.smartLibraryData[name].maxLength === false) {
                errorMessage = 'Maximum length'
              }
            }
            if (this.$v.smartLibraryData[name].hasOwnProperty('between')) {
              if (this.$v.smartLibraryData[name].url === false) {
                errorMessage = 'Value out of range'
              }
            }
            if (this.$v.smartLibraryData[name].hasOwnProperty('numeric')) {
              if (this.$v.smartLibraryData[name].numeric === false) {
                errorMessage = 'Must be numeric value'
              }
            }
            if (this.$v.smartLibraryData[name].hasOwnProperty('url')) {
              if (this.$v.smartLibraryData[name].url === false) {
                errorMessage = 'Must be url value'
              }
            }
          }
        }
        if (errorMessage === '') {
          if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
            if (this.errors.hasOwnProperty(name)) {
              errorMessage = this.errors[name][0]
            }
          }
        }
        return errorMessage
      },
      isProductCategorySelected (id) {
        return this.smartLibraryData.product_category_id === id
      },
      setProductCategory (id, name) {
        if (this.smartLibraryData.product_category_id === id) {
          this.smartLibraryData.product_category_id = null
          this.smartLibraryData.product_category_name = null
        }
        else {
          this.smartLibraryData.product_category_id = id
          this.smartLibraryData.product_category_name = name
        }
        this.$refs.productCategoryPopover.hide()
      },
      searchProduct (terms, done) {
        let query = {
          countries: this.smartLibraryData.countries,
          text: terms
        }
        this.getSmartLibraryProductAction(query).then(res => {
          done(this.productSearchData.list)
        })
      },
      productInputSelected (item) {
        this.smartLibraryData.product_id = item.value
        this.smartLibraryData.product_code = item.label
        this.selectedProductCode = item.label
      },
      productInputBlur () {
        if (this.smartLibraryData.product_code !== this.selectedProductCode) {
          this.smartLibraryData.product_id = null
          this.smartLibraryData.product_code = null
        }
      },
      thumbnailUploaded (file, res) {
        let imgStr = JSON.parse(res.response)
        if (imgStr) {
          this.smartLibraryData.thumbnail_data = imgStr.name
          this.smartLibraryData.thumbnail_link = imgStr.link
          this.$refs.thumbnailUploadModal.hide()
        }
      },
      fileUploaded (file, res) {
        let imgStr = JSON.parse(res.response)
        if (imgStr) {
          this.smartLibraryData.upload_file_data = imgStr.name
          this.smartLibraryData.upload_file_link = imgStr.link
          this.smartLibraryData.upload_file_user = false
          this.$refs.fileUploadModal.hide()
        }
      },
      removeUploadFile() {
        this.smartLibraryData.upload_file_data = ''
        this.smartLibraryData.upload_file_link = ''
        this.smartLibraryData.upload_file_user = true
      },
      addYoutubeVideo () {
        if (this.youtubeVideoId !== '') {
          this.$refs.youtubeHelperModal.hide()
          this.smartLibraryData.thumbnail_data = 'http://img.youtube.com/vi/' + this.youtubeVideoId + '/mqdefault.jpg'
          this.smartLibraryData.thumbnail_link = 'http://img.youtube.com/vi/' + this.youtubeVideoId + '/mqdefault.jpg'
          this.smartLibraryData.upload_file_type = 'V'
          this.smartLibraryData.upload_file_data = 'https://www.youtube.com/embed/' + this.youtubeVideoId
          this.smartLibraryData.upload_file_link = 'https://www.youtube.com/embed/' + this.youtubeVideoId
          this.smartLibraryData.upload_file_user = true
          this.youtubeVideoId = ''
        }
      },
      addCustomUrl () {
        if (this.customUrl !== '') {
          this.$refs.customUrlModal.hide()
          this.smartLibraryData.upload_file_data = '' + this.customUrl
          this.smartLibraryData.upload_file_link = '' + this.customUrl
          this.smartLibraryData.upload_file_user = true
          this.customUrl = ''
        }
      },
      processForm: function (formFieldData) {
        return new Promise((resolve, reject) => {
          this.$v.smartLibraryData.$touch()
          if (!this.$v.smartLibraryData.$error) {
            if (this.smartLibraryId) {
              this.updateSmartLibraryAction(formFieldData).then((response) => {
                resolve(response)
              })
            } else {
              this.createSmartLibraryAction(formFieldData).then((response) => {
                this.smartLibraryData = Object.assign({}, JSON.parse(JSON.stringify(response)))
                if (typeof this.smartLibraryData.errors !== 'undefined') {
                  delete this.smartLibraryData.errors
                }
                this.$router.push({ name: 'Update Smart Library', params: { smartLibraryId: response.id }})
                resolve(response)
              })
            }
          } else {
            this.setNotification({
              title: 'Smart Library Creation Failed',
              message: 'Validation Failed',
              type: 'negative'
            })
            reject(this.$v.smartLibraryData.$error)
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
    .options-holder
        border dotted 1px lightgray

    .product-category-popover > ul, .product-category-popover > ul > li > ul, .product-category-popover > ul > li > ul > li > ul
        list-style none

    .product-category-popover > ul > li
        padding 6px
        margin-left -30px

    .product-category-popover span:hover, .product-category-popover .active
        color #989898

    .thumbnail-content
        min-height 138px
</style>
