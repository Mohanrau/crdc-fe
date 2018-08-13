<template>
    <div class="row full-width mt-10 items-center">
        <div class="col-lg-8">
            <q-toolbar-title>
                {{ title }}
                <br>
                <small class="text-grey-6">{{ subTitle }}</small>
            </q-toolbar-title>
        </div>
        <div class="col-lg-4">
            <q-search
                    ref="headerSearchBarField"
                    v-if="headerSearchBar"
                    clearable
                    inverted-light
                    color="white"
                    class="no-shadow custom-input-border"
                    @input="setHeaderSearchBarFieldMutation"
                    v-model="headerSearchBarField"></q-search>
        </div>
    </div>
</template>
<script>
  import { mapMutations } from 'vuex'
  export default {
    name: 'layout-modal-header',
    props: {
      title: {
        type: String
      },
      subTitle: {
        type: String
      },
      headerSearchBar: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      headerSearchBarField: ''
    }),
    methods: {
      ...mapMutations({
        setHeaderSearchBarField: 'SET_HEADER_SEARCH_BAR_FIELD'
      }),
      setHeaderSearchBarFieldMutation () {
        this.setHeaderSearchBarField(this.headerSearchBarField)
      }
    }
  }
</script>