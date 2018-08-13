<template>
    <div class="row wrap gutter-md justify-between">
        <div class="col-lg-6 col-md-12 col-xs-12">
            <div class="general-holder">
                <div class="general-item">
                    <div class="col-lg-12 col-md-12 col-xs-12">
                        <q-field helper="*"
                                 :error="validation.roleBuilderData.country_id.$error"
                                 error-label="Please input role label">
                            <q-select
                                    radio
                                    filter
                                    clearable
                                    ref="salesCountrySelector"
                                    color="black"
                                    v-model="roleBuilderData.country_id"
                                    :options="countriesOptions.options"
                                    :stack-label="$t('settings.role.prefix')"
                                    @input="setPrefix()"
                            />
                        </q-field>
                    </div>
                </div>
            </div>
            <div class="general-holder">
                <div class="general-item">
                    <div class="col-lg-12 col-md-12 col-xs-12">
                        <q-field helper="*"
                                 :error="validation.roleBuilderData.name.$error"
                                 error-label="Please input role name">
                            <q-input name="name"
                                     :prefix="roleBuilderData.prefix"
                                     v-model="roleBuilderData.name"
                                     :stack-label="$t('settings.role.roleName')"
                                     @change="validation.roleBuilderData.name.$touch"></q-input>
                        </q-field>
                    </div>
                </div>
            </div>
            <div class="general-holder">
                <div class="general-item">
                    <div class="col-lg-12 col-md-12 col-xs-12">
                        <q-toggle v-model="roleBuilderData.active"
                                  :label="$t('settings.role.activeLabel')"
                                  left-label
                                  checked-icon="visibility"
                                  unchecked-icon="visibility_off"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-6 col-md-12 col-xs-12">
            <div class="general-holder">
                <div class="general-label text-grey-5">
                    <div class="q-heading">{{ $t('settings.roleForm.assignRoleGroup.Label') }}
                        <q-chip square color="positive">{{ roleBuilderData.role_group_ids.length }}</q-chip>
                    </div>
                </div>
                <q-field
                        helper="*"
                        :error="validation.roleBuilderData.role_group_ids.$error"
                        error-label="Please tick atleast 1"
                >
                    <div class="general-item relative-position pd-10 relative-position">
                        <q-scroll-area style="height: 55vh; max-height: 55vh;">
                            <q-list link highlight separator
                                    v-for="(item, index) in allRoleGroupList"
                                    :key="index"
                                    class="no-padding no-margin">
                                <q-list-header class="bg-tertiary text-white">{{ item.label }}</q-list-header>
                                <q-item @click.native="doRoleGroupSelection(opt.id)"
                                        :class="{'bg-green-1' : selectedStatus(opt.id)}"
                                        v-for="(opt, index) in item.options"
                                        :key="index">
                                    <q-item-main :label="opt.title"
                                                 label-lines="1"/>
                                    <q-item-side
                                            :icon="selectedStatus(opt.id) ? 'check' : 'check_box_outline_blank'"></q-item-side>
                                </q-item>
                            </q-list>
                        </q-scroll-area>
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </div>
                </q-field>
            </div>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'general-tab',
    components: {
      qLoader
    },
    computed: {
      ...mapState({
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        allRoleGroupList: state => state.settingsCMP.allRoleGroupList.list,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
      })
    },
    props: {
      'roleBuilderData': {
        type: Object,
        required: true
      },
      'validation': {
        type: Object,
        required: true
      }
    },
    watch: {
      openCloseModalForm: {
        handler (newData) {
          // Call if modal name match
          if (newData.status && newData.name === 'roleBuilderModal') {
            this.getAllRoleGroupAction()
          }
        }
      }
    },
    data: () => ({
      roleGroupId: ''
    }),
    methods: {
      ...mapActions([
        'getAllRoleGroupAction'
      ]),
      setPrefix () {
        this.roleBuilderData.prefix = this.countriesOptions.options.find(x => x.value === this.roleBuilderData.country_id).code + '-'
      },
      doRoleGroupSelection (id) {
        // Toggle remove and add id into array based on user selection
        if (this.roleBuilderData.role_group_ids.includes(id)) {
          const index = this.roleBuilderData.role_group_ids.indexOf(id)
          this.roleBuilderData.role_group_ids.splice(index, 1)
        } else {
          this.roleBuilderData.role_group_ids.push(id)
        }
      },
      selectedStatus (id) {
        return this.roleBuilderData.role_group_ids.includes(id)
      }
    }
  }
</script>