<template>
    <div class="row empty-list text-center justify-center items-center text-grey-3 bg-img-cube">
        <div class="col-lg-auto pd-10">
            <slot></slot>
            <div class="q-display-3"><q-icon name="error_outline"></q-icon></div>
            <small>{{ message || $t('general.noData.label') }}</small>
        </div>
    </div>
</template>
<script>
    export default {
      name: 'empty-list',
      props: {
        message: {
          type: String
        }
      }
    }
</script>