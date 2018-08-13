<template>
    <div class="image-tab">
        <div class="row justify-center">
            <div class="col-lg-3 col-md-12 col-xs-12 shadow-1 q-ma-md"
                 v-for="(image, index) in standardProduct.images.list"
                 :key="index">
                <div class="row justify-end bg-tertiary">
                    <div class="col-auto">
                        <q-btn flat @click="setDefaultImage(index)"
                               :color="(image.default) ? defaultImgColor='red' : defaultImgColor='grey-4'"
                        >
                            <q-icon name="favorite"/>
                        </q-btn>
                    </div>
                    <div class="col-auto">
                        <q-btn @click="removeUploadedImage(image, index)"
                               color="grey-4" flat>
                            <q-icon name="delete"/>
                        </q-btn>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="img-row">
                        <q-carousel
                                height="250px"
                                no-swipe
                                class="text-white">
                            <q-carousel-slide class="flex flex-center fit" :img-src="image.image_link">
                            </q-carousel-slide>
                            <q-carousel-control
                                    slot="control-button"
                                    slot-scope="carousel"
                                    position="bottom-right"
                                    :offset="[18, 22]"
                            >
                                <q-btn
                                        round dense push
                                        color="tertiary"
                                        :icon="carousel.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                                        @click="fullscreen(image.image_link, 'standardImageModal')"
                                />
                            </q-carousel-control>
                        </q-carousel>
                    </div>
                </div>
            </div>
            <div class="col-lg-12 cursor-pointer"
                 v-on:click="$refs.productImgModal.show()">
                <q-card flat inline class="bigger q-ma-xs fit"
                        color="white text-black">
                    <q-card-main class="fit">
                        <div class="row fit justify-center">
                            <div class="text-grey-4 self-center">
                                <span class="q-display-3">
                                    <q-icon name="add"></q-icon>
                                </span>
                            </div>
                        </div>
                    </q-card-main>
                </q-card>
            </div>
        </div>
        <q-modal ref="productImgModal"
                 :content-css="{padding: '50px', minWidth: '50vw'}">
            <div class="row gutter-sm justify-between">
                <div class="col-auto">
                    <div>{{ $t('products.standard.images.label') }}</div>
                </div>
                <div class="col-auto">
                    <q-btn color="negative"
                           @click="$refs.productImgModal.hide()">
                        <i class="material-icons">close</i>
                    </q-btn>
                </div>
            </div>
            <hr>
            <generalUploader :types="types"
                             :float-label="$t('products.standard.images.label')"
                             :color="color"
                             v-model="standardProduct.images"
                             :multiple="true"
                             :uploadCallback="uploadImages"
                             uploaderFileType="product_standard_image">
            </generalUploader>
        </q-modal>
        <basic-modal refs="standardImageModal" urlResetPathName="" maximized>
            <template slot="modal-data" slot-scope="props">
                <div class="row justify-center items-center">
                    <img class="col-auto" :src="imageSrc"/>
                </div>
            </template>
        </basic-modal>
    </div>
</template>
<script>
  import generalUploader from 'src/application/global/components/common/uploads/uploader'
  import basicModal from 'src/application/global/components/common/modal/basicModal'
  import { api } from 'src/application/products/api'
  import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'image-tab',
    components: {
      generalUploader,
      basicModal
    },
    props: {
      'standardProduct': {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        productData: state => state.productsCMP.saveData.data
      })
    },
    data: () => ({
      imageSrc: '',
      color: 'faded',
      types: [
        {
          label: 'Upload Photo',
          ref: 'productImgModal'
        }
      ],
      defaultText: 'Default',
      defaultImgColor: 'faded',
      defaultImg: false,
      showUpload: false,
      imageData: []
    }),
    methods: {
      ...mapActions([
        'removeUploadedImageAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
      }),
      uploadImages: function (file, res) {
        let imgStr = JSON.parse(res.response)
        if (imgStr) {
          this.standardProduct.images.list.push({
            image_path: imgStr.name,
            image_link: imgStr.link,
            default: false,
            active: true
          })
        }
      },
      removeUploadedImage (img, index) {
        if (img.id !== '' && typeof img.id !== 'undefined') {
          this.removeUploadedImageAction(img)
        }
        this.standardProduct.images.list.splice(index, 1)
      },
      setDefaultImage (index) {
        let image = this.standardProduct.images.list.filter(e => e.default === 1)
        if (image.length > 0) {
          image[0].default = 0
        }
        this.standardProduct.images.list[index].default = 1
      },
      fullscreen (link, name) {
        this.imageSrc = link
        this.openCloseModal({name: name, status: true})
      }
    }
  }
</script>
<style lang="stylus">
</style>
