<template>
    <div class="image-tab">
        <div class="row justify-center">
            <div class="col-lg-3 col-md-12 col-xs-12 shadow-1 q-ma-md"
                 v-for="(image, index) in memberData.verification"
                 :key="index">
                <div class="row justify-end bg-grey-1">
                    <div class="col-auto">
                        <q-btn @click="removeUploadedImage(image, index)"
                               color="grey-4" flat>
                            <q-icon name="delete"/>
                        </q-btn>
                    </div>
                </div>
                <div class="col-lg-12 col-md-12 col-xs-12">
                    <div class="img-row">
                        <q-carousel
                                height="150px"
                                no-swipe
                                class="text-white">
                            <q-carousel-slide :img-src="image.image_link">
                            </q-carousel-slide>
                            <q-carousel-control slot="control-nav" slot-scope="carousel">
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
            <div class="col-lg-12 col-md-12 col-xs-12 cursor-pointer"
                 v-on:click="$refs.memberImageUploader.show()">
                <q-card flat inline class="bigger q-ma-xs fit"
                        color="white text-black">
                    <q-card-main class="fit">
                        <div class="row fit justify-center">
                            <div class="text-grey-4 self-center">
                                <span class="q-display-3">
                                    <q-icon name="add"></q-icon>
                                </span>
                                <div class="q-caption text-center">Upload</div>
                            </div>
                        </div>
                    </q-card-main>
                </q-card>
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12 mt-20" v-show="false">
                <div class="row">
                    <div class="col-lg-4">
                        <span>Uploaded Date: {{ memberData.verification.uploaded_date }}</span>
                    </div>
                    <div class="col-lg-4">
                        <span>Last Verified Date: {{ memberData.verification.latest_verified_date}}</span>
                    </div>
                    <div class="col-lg-4" v-if="memberData.verification.latest_verified_by">
                        <span>Last Verified By: {{ memberData.verification.latest_verified_by.name}}</span>
                    </div>
                </div>
            </div>
        </div>
        <q-modal ref="memberImageUploader"
                 :content-css="{padding: '15px', minWidth: '50vw', minHeight: '80vh'}">
            <div class="row gutter-sm justify-between">
                <div class="col-auto">
                    <div>{{ $t('members.imageUploader.label') }}</div>
                </div>
                <div class="col-auto">
                    <q-btn class="pull-right" color="negative"
                           @click="$refs.memberImageUploader.hide()">
                        <i class="material-icons">close</i>
                    </q-btn>
                </div>
            </div>
            <hr>
            <generalUploader :types="types"
                             :float-label="$t('members.uploadVerificationDocs.label')"
                             color="grey-7"
                             v-model="memberData.images"
                             :multiple="true"
                             :uploadCallback="uploadImages"
                             uploaderFileType="member_ic_passport">
            </generalUploader>
        </q-modal>
    </div>
</template>
<script>
  import generalUploader from 'src/application/global/components/common/uploads/uploader'
  import { api } from 'src/application/products/api'

  export default {
    name: 'image-tab',
    components: {
      generalUploader
    },
    props: {
      'memberData': {
        type: Object,
        required: true
      }
    },
    data: () => ({
      color: 'dark',
      types: [
        {
          label: 'Upload Photo',
          ref: 'memberImageUploader'
        }
      ],
      defaultText: 'Default',
      defaultImgColor: 'faded',
      defaultImg: false,
      showUpload: false,
      imageData: []
    }),
    methods: {
      uploadImages: function (file, res) {
        let imgStr = JSON.parse(res.response)
        if (imgStr) {
          this.memberData.verification.push({
            type: 'IC',
            user_id: this.memberData.details.user_id,
            image_path: imgStr.name,
            image_link: imgStr.link
          })
        }
      },
      removeUploadedImage (img, index) {
        this.memberData.verification.splice(index, 1)
      }
    }
  }
</script>
