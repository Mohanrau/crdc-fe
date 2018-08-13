<template>
    <div class="row wrap items-baseline">
        <!--Left Action buttons-->
        <div class="col-lg-6 col-md-12 col-xs-12">
            <div class="row" :class="placementLeft">
                <slot name="left-side"></slot>
                <div class="q-title">{{ formTitle }}</div>
            </div>
        </div>
        <!--Right action buttons-->
        <div class="col-lg-6 col-md-12 col-xs-12">
            <div class="row" :class="placementRight">
                <slot name="right-side"></slot>
                <div class="col-lg-auto col-md-auto col-xs-auto">
                    <!--submit(false) prevent form from redirect to listing-->
                    <q-btn v-shortkey="['ctrl', 'alt', 's']" @shortkey.native="submit(autoClose)" icon="done" glossy size="sm" color="positive" @click="submit(autoClose)">{{ buttonTitleCaption }}</q-btn>
                </div>
                <div class="col-lg-auto col-md-auto col-xs-auto">
                    <q-btn icon="clear" v-shortkey="['ctrl', 'alt', 'c']" @shortkey.native="beforeClose()" glossy size="sm" color="negative" @click="beforeClose()">{{ $t('Common.Cancel.Btn') }}</q-btn>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { Platform } from 'quasar'
  export default {
    name: 'modal-header-form',
    computed: {
      placementLeft () {
        if (Platform.is.desktop || Platform.is.electron) {
          return 'gutter-sm justify-start items-baseline header-row-mb'
        } else {
          return 'gutter-sm justify-between header-row-mb'
        }
      },
      placementRight () {
        if (Platform.is.desktop || Platform.is.electron) {
          return 'gutter-sm justify-end items-baseline header-row-mb'
        } else {
          return 'justify-between header-row-mb'
        }
      }
    },
    props: {
      'formTitle': {
        type: String
      },
      'formName': {
        type: String,
        required: true
      },
      'buttonTitleCaption': {
        type: String,
        required: true
      },
      'submit': {
        type: Function,
        required: true
      },
      'resetForm': {
        type: Function,
        required: true
      },
      'beforeClose': {
        type: Function,
        required: true
      },
      autoClose: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style>
    .header-row-mb{
        margin-bottom: 10px;
    }
</style>