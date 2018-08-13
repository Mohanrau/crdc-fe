<template>
    <q-toolbar-title>
        <div class="col-lg-12">
            <div class="row gutter-xs justify-end">
                <div class="col-lg-auto col-md-auto col-xs-auto">
                    <slot name="more-buttons-one"></slot>
                </div>
                <div class="col-lg-auto col-md-auto col-xs-auto">
                    <slot name="more-buttons-two"></slot>
                </div>
                <div v-if="buttonOne !== ''" class="col-lg-auto col-md-auto col-xs-auto">
                    <q-btn size="sm" color="primary" @click="beforeClose()">
                        {{ buttonOne }}
                    </q-btn>
                </div>
                <div v-if="buttonTwo !== ''" class="col-lg-auto col-md-auto col-xs-auto">
                    <q-btn size="sm" color="negative" @click="beforeClose()">
                        {{ buttonTwo }}
                    </q-btn>
                </div>
            </div>
        </div>
    </q-toolbar-title>
</template>
<script>
  export default {
    name: 'layout-modal-footer',
    props: {
      buttonOne: {
        type: String,
        default: ''
      },
      buttonTwo: {
        type: String,
        default: ''
      },
      'beforeClose': {
        type: Function,
        required: true
      }
    }
  }
</script>

<style>
    .header-row-mb {
        margin-bottom: 10px;
    }
</style>