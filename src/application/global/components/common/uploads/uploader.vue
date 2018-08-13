<template>
    <div>
        <q-uploader ref="upld"
                    :prefix="prefix"
                    :suffix="suffix"
                    :float-label="floatLabel"
                    :stack-label="stackLabel"
                    :color="color"
                    :inverted="inverted"
                    :inverted-light="invertedLight"
                    :dark="dark"
                    :hide-underline="hideUnderline"
                    :align="align"
                    :disable="disable"
                    :error="error"
                    :before="before"
                    :after="after"

                    :url="url"
                    :headers="headers"
                    :method="method"
                    :extensions="extensions"
                    :multiple="multiple"
                    :hide-upload-button="hideUploadButton"
                    :hide-upload-progress="hideUploadProgress"
                    :additional-fields="additionalFields"
                    :no-thumbnails="noThumbnails"
                    :auto-expand="autoExpand"
                    :send-raw="sendRaw"
                    :readonly="readonly"
                    :clearable="clearable"
                    
                    @add="add"
                    @remove:abort="removeAbort"
                    @remove:cancel="removeCancel"
                    @remove:done="removeDone"
                    @uploaded="uploaded"
                    @fail="fail"
                    @start="emit('start')"
                    @finish="emit('finish')"
        ></q-uploader>
    </div>
</template>
<script>
  import { api } from 'src/application/global/api'
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'general-uploader',
    props: {
      'prefix': {
        type: String
      },
      'suffix': {
        type: String
      },
      'floatLabel': {
        type: String
      },
      'stackLabel': {
        type: String
      },
      'color': {
        type: String
      },
      'inverted': {
        type: Boolean,
        default: false
      },
      'invertedLight': {
        type: Boolean,
        default: false
      },
      'dark': {
        type: Boolean,
        default: false
      },
      'hideUnderline': {
        type: Boolean,
        default: false
      },
      'align': {
        type: String,
        default: 'left'
      },
      'disable': {
        type: Boolean,
        default: false
      },
      'error': {
        type: Boolean,
        default: false
      },
      'before': {
        type: Array
      },
      'after': {
        type: Array
      },

      'multiple': {
        type: Boolean,
        default:true
      },
      'hideUploadButton': {
        type: Boolean,
        default:false
      },
      'hideUploadProgress': {
        type: Boolean,
        default: false
      },
      'noThumbnails': {
        type: Boolean,
        default: false
      },
      'autoExpand': {
        type: Boolean,
        default: true
      },
      'sendRaw': {
        type: Boolean,
        default: false
      },
      'readonly': {
        type: Boolean,
        default: false
      },
      'clearable': {
        type: Boolean,
        defalt: true
      },

      'types': {
        type: Array
      },
      'uploaderFileType': {
        type: String,
        required: true
      },

      'uploadCallback': {
        type: Function,
        required: true
      }
    },
    data () {
      return {
        url: api.fileUploadProcess,
        headers: {
          Accept: 'form-data',
          Authorization: 'Bearer' + ' ' + localStorage.getItem('accessToken')
        },
        method: 'POST',
        extensions: '',
        additionalFields: [],
        events: [],
        count: 0
      }
    },
    mounted: function () {
      let query = {
        'file_type': this.uploaderFileType
      }
      this.getUploaderFileUploadSetting(query).then(() => {
        this.extensions = this.uploaderFileUploadSetting.data.client_validate
        this.additionalFields = [{name: 'file_type', value: this.uploaderFileUploadSetting.data.file_type}]
      })
    },
    computed: {
      ...mapState({
        uploaderFileUploadSetting: state => state.globalCMP.uploaderFileUploadSetting,
      })
    },
    methods: {
      ...mapActions([
        'getUploaderFileUploadSetting',
        'uploadErrorsAction',
        'uploadSuccessAction',
        'removeUploadImage'
      ]),
      add (files) {
        this.events.push(`add ${files.length}`)
      },
      removeAbort (file) {
        this.events.push(`remove:abort ${file.name}`)
      },
      removeCancel (file) {
        // this.removeImage(file)
      },
      removeDone (file) {
        this.events.push(`remove:done ${file.name}`)
      },
      uploaded (file, res) {
        this.uploadCallback(file, res)
      },
      fail (file, res) {
        this.uploadErrorsAction(res.statusText)
      },
      clear () {
        this.events = []
      },
      emit (evt) {
        this.events.push(evt)
      },
      reset () {
        this.$refs.upld.reset()
      }
    }
  }
</script>
