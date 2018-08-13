<template>
    <q-inner-loading :visible="visible">
        <q-spinner-dots size="50px" class="text-f263b7" :class="{'fixed-center' : fixedCenter}"></q-spinner-dots>
        {{ message }}
    </q-inner-loading>
</template>
<script>
    export default {
      name: 'gLoader',
      props: {
        fixedCenter: {
          type: Boolean,
          default: false
        },
        message: {
          type: String
        },
        visible: {
          type: Boolean,
          required: true
        }
      }
    }
</script>