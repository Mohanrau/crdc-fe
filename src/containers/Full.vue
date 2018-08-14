<template>
    <q-layout view="LHh Lpr lff" class="frontend bg-e9e9e9">
        <q-layout-header reveal>
            <!--Toolbar-->
            <q-toolbar class="bg-white text-black">
                <q-toolbar-title class="q-body-1 text-weight-light no-padding">
                    <div class="row items-baseline justify-between">
                        <div class="col-auto">
                            <div class="row items-center ">
                                <div class="col-lg-auto">
                                    <q-btn
                                            :loading="isProcessing || isProcessingForm || isProcessingTable || isProcessingSection || isProcessingList"
                                            class="text-f263b7 full-height" flat
                                            @click="leftDrawerOpen = !leftDrawerOpen">
                                        <q-icon name="menu"></q-icon>
                                    </q-btn>
                                    <q-btn flat v-go-back.single="store.backRoute" class="platform-android-only">
                                        <q-icon name="arrow_back"></q-icon>
                                    </q-btn>
                                </div>
                                <div class="col-lg-auto on-left on-right gt-md">
                                    <simple-clock></simple-clock>
                                </div>
                                <div class="col-lg-auto gt-md">
                                    <q-btn
                                            size="sm"
                                            dense
                                            color="grey-6"
                                            @click="openCloseModal({name: 'appHelperModal', status: true})"
                                            icon="fas fa-lightbulb"
                                            flat>
                                        <q-tooltip>
                                            ? Helper
                                        </q-tooltip>
                                    </q-btn>
                                </div>
                            </div>
                        </div>
                        <div class="col-auto">
                            <div class="row items-center">
                                <div class="col-lg-auto on-right">
                                    <flag :iso="selectedFilters.countryID !== null ? getCountryCode() : ''"/>
                                </div>
                                <div class="col-lg-auto on-right gt-md"
                                     v-if="userInfo.member && Object.keys(userInfo.member).length > 0">
                                    <div>CW - {{ userInfo.member.cw }}</div>
                                </div>
                                <div class="col-lg-auto on-right gt-md"
                                     v-if="userInfo.name">
                                    <q-btn
                                            dense
                                            class="text-1898df"
                                            flat
                                            icon="fas fa-user-circle"
                                    >
                                        <q-popover
                                                :disable="!userInfo"
                                                anchor="bottom right"
                                                self="top right"
                                                fit>
                                            <q-list highlight dense>
                                                <q-item>
                                                    <q-item-side inverted :letter="userInfo.name[0]"/>
                                                    <q-item-main :label="userInfo.name"/>
                                                </q-item>
                                            </q-list>
                                        </q-popover>
                                    </q-btn>
                                </div>
                                <div class="col-lg-auto on-right">
                                    <q-btn class="text-1898df" flat dense>
                                        <audio ref="audioElm"
                                               src="statics/sounds/ding.mp3"></audio>
                                        <span class="text-negative"
                                              :class="{'animate-blink': notificationCount > 0 }">{{ notificationCount > 0 ? notificationCount + '+' : notificationCount
                                            }}</span>
                                        <q-icon name="fas fa-bell"></q-icon>
                                        <q-popover
                                                anchor="bottom right"
                                                self="top right"
                                                fit>
                                            <q-list v-if="websocket.channels.length > 0"
                                                    link separator link style="min-width: 100px">
                                                <q-item v-for="(item, index) in websocket.channels"
                                                        :key="index"
                                                        :to="{name: 'View Sales Order', params: { saleID: item.response.sales.id }}"
                                                        replace
                                                        exact>
                                                    <q-item-side icon="notifications" color="grey"/>
                                                    <q-item-main @click="unsetWebsocketChannelData({index})">
                                                        <q-item-tile label>{{ item.channel }}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                            created on {{ item.response.sales.created_at }}
                                                        </q-item-tile>
                                                    </q-item-main>
                                                    <q-item-side right
                                                                 :stamp="humanizeDateTime(item.response.sales.created_at)"/>
                                                </q-item>
                                            </q-list>
                                            <div v-else="" class="col-auto q-ma-md text-center">
                                                <q-icon color="grey-5" name="fas fa-bell-slash"
                                                        class="q-ma-sm"></q-icon>
                                                <div class="q-caption">
                                                    Caught up with everything!
                                                </div>
                                            </div>
                                        </q-popover>
                                    </q-btn>
                                </div>
                                <div class="col-lg-auto on-right">
                                    <q-btn
                                            dense
                                            :loading="isProcessingRefreshToken"
                                            class="text-1898df"
                                            @click="logoutHandler"
                                            icon="fas fa-power-off fas fa-rotate-90"
                                            flat>
                                    </q-btn>
                                </div>
                                <div class="col-lg-auto on-right" :class="{'q-mr-xl' : reconnecting_count < 1}">
                                    <q-icon class="pd-2" :color="websocket.connected ? 'positive' : 'negative'"
                                            name="lens"></q-icon>
                                </div>
                                <div :class="{'q-mr-xl' : reconnecting_count > 0}" class="col-lg-auto on-right websocket-reconnector"
                                v-if="reconnecting_count > 0">
                                    <q-spinner-puff color="secondary" :size="20">
                                    </q-spinner-puff>
                                    <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
                                        Re-connecting to live notification server ...
                                    </q-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </q-toolbar-title>
            </q-toolbar>
            <!--Toolbar End-->
        </q-layout-header>
        <q-layout-drawer content-class="bg-grey-2" v-model="leftDrawerOpen">
            <!--Sidebar-->
            <q-scroll-area
                    class="fit bg-020c35">
                <div class="sidebar text-white relative-position">
                    <div class="row flex-center bg-12256b brand-logo-pd">
                        <div class="header-logo">
                            <div class="col-12">
                                <div class="row justify-center">
                                    <div class="col-auto">
                                        <p class="q-body-1 q-mt-md text-white text-weight-bolder">Credit Control v 0.1</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <q-list no-border link>
                        <template v-for="(menu, navigationIndex) in sidebarNavigations"
                                  v-if="menu.meta.menuItem && (menu.meta.permission || $aclDisable) && (parentHasChild(menu.children) || $aclDisable)">
                            <q-item
                                    @click.native="trackCurrentMenu(navigationIndex)"
                                    item
                                    exact
                                    :key="'main-' + navigationIndex"
                                    replace
                                    :class="{'active-root': currentRoute.path.includes(menu.path)}"
                            >
                                <q-item-main>
                                    {{ $t(menu.meta.title) }}
                                </q-item-main>
                                <q-item-side v-if="currentRoute.path.includes(menu.path)">
                                    <q-btn flat class="no-pointer-events"
                                           :icon="currentMenuIndex === navigationIndex ? 'expand_less' : 'expand_more'"></q-btn>
                                </q-item-side>
                            </q-item>
                            <q-item
                                    @click.native="trackCurrentSubMenu(childIndex)"
                                    class="q-ml-lg"
                                    exact
                                    :class="{'active-sub': currentSubMenuIndex === childIndex}"
                                    item
                                    v-for="(child, childIndex) in menu.children"
                                    v-if="child.meta.menuItem && currentMenuIndex === navigationIndex && (child.meta.permission || $aclDisable)"
                                    :key="'sub-' + childIndex"
                                    :to="`${child.path}`"
                                    replace
                            >
                                <q-icon class="q-mr-xs" name="fas fa-caret-right"></q-icon>
                                <q-item-main>
                                    {{ $t(child.meta.title) }}
                                </q-item-main>
                            </q-item>
                        </template>
                    </q-list>
                </div>
            </q-scroll-area>
            <!--Sidebar End-->
        </q-layout-drawer>
        <!--Content-->
        <q-page-container class="general-page">
            <transition
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut"
                    mode="out-in"
                    :duration="300"
                    @leave="resetScroll"
            >
                <router-view/>
            </transition>
        </q-page-container>
        <!--Content End-->
        <basic-modal refs="appHelperModal" urlResetPathName="">
            <template slot="modal-data" slot-scope="props">
                <div class="row q-ma-sm">
                    <div class="col-lg-12">
                        <div class="helper q-mb-md q-mt-md" v-for="shortcut in appSettings.shortcuts">
                            <div class="q-title">
                                <q-chip square color="primary">{{ shortcut.module }}</q-chip>
                            </div>
                            <table class="q-table-html bordered fit text-weight-light">
                                <tr v-for="item in shortcut.items">
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.desc }}</td>
                                    <td>
                                        <q-chip>{{ item.shortcut }}</q-chip>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
        </basic-modal>
        <schema-manager></schema-manager>
        <div class="text-center">
        </div>
    </q-layout>
</template>

<script>
  import Store from 'src/services/navigationService'
  import Translation from 'src/application/global/components/common/translations/translation'
  import {routes} from '../application/'
  import _ from 'lodash'
  import {date, QChip, QPopover} from 'quasar'
  import {DatesMixin, GeneralsMixin, WebsocketMixin} from 'src/application/global/mixins/index'
  import basicModal from 'src/application/global/components/common/modal/basicModal'
  import simpleClock from 'src/application/global/components/common/clock/simple-clock'
  import {EventBus} from 'src/services/eventService'
  import {mapActions, mapMutations, mapState} from 'vuex'
  import SchemaManager from '../pages/schemaManager.vue'
  import VueOfflineMixin from 'vue-offline/mixin'
  import {
    QSpinnerPuff
  } from 'quasar'

  export default {
    name: 'full',
    components: {
      SchemaManager,
      QPopover,
      QChip,
      basicModal,
      'language': Translation,
      simpleClock
    },
    mixins: [GeneralsMixin, DatesMixin, WebsocketMixin, VueOfflineMixin],
    computed: {
      ...mapState({
        isProcessing: state => state.globalCMP.isProcessing,
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        isProcessingList: state => state.globalCMP.isProcessingList,
        isProcessingRefreshToken: state => state.globalCMP.isProcessingRefreshToken,
        errors: state => state.globalCMP.errors,
        currentRoute: state => state.route,
        userInfo: state => state.globalCMP.userInfo.data,
        appSettings: state => state.globalCMP.appSettings,
        roles: state => state.globalCMP.roles,
        selectedFilters: state => state.globalCMP.selectedFilters,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
      })
    },
    watch: {
      websocket: {
        handler() {
          this.refreshNotification()
        },
        deep: true
      },
      selectedFilters: {
        handler() {
        }
      }
    },
    async mounted() {
      await this.appInit()
      await this.buildNavigations()
    },
    created() {
      this.$on('online', function () {
        this.$q.loading.hide()
      })
      this.$on('offline', function () {
        this.$q.loading.show({
          spinner: QSpinnerPuff,
          message: this.$t('Common.NoInternet.Info'),
          messageColor: 'white',
          spinnerSize: 50, // in pixels
          spinnerColor: 'white',
          customClass: 'z-top'
        })
      })
      EventBus.$on('buildNavigationsEvent', data => {
        // Rebuild Navigation based on user selected country
        this.buildNavigations()
      })
    },
    data() {
      return {
        onlineState: navigator.onLine,
        sidebarSearch: '',
        sidebarNavigations: [],
        searchData: {},
        store: Store.state,
        notificationCount: 0,
        leftDrawerOpen: true,
        currentMenuIndex: '',
        currentSubMenuIndex: ''
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'isProcessingAction',
        'getUserDetailsAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
      }),
      appInit() {
        this.getCountriesAction()
      },
      resetScroll(el, done) {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        done()
      },
      generateImagesUrl() {
        return require('assets/' + 'profile/default-avatar.png')
      },
      refreshNotification() {
        if (this.websocket.channels.length > 0) {
          this.notificationCount = this.websocket.channels.length
          this.$refs.audioElm.play()
        }
        ``
      },
      trackCurrentMenu(selectedIndex) {
        if (this.currentMenuIndex === selectedIndex) {
          this.currentMenuIndex = ''
        } else {
          this.currentMenuIndex = selectedIndex
        }
      },
      trackCurrentSubMenu(selectedIndex) {
        if (this.currentSubMenuIndex !== selectedIndex) {
          this.currentSubMenuIndex = selectedIndex
        }
      },
      getCountryCode() {
        let code = ''
        if (this.countriesOptions.options.length > 0) {
          let item = this.countriesOptions.options.find((x) => x.value === this.selectedFilters.countryID)
          if (item !== undefined) {
            code = item.code_iso_2
          }
        }
        return code
      },
      buildNavigations() {
        const getDefaultNavigation = this.$router.options.routes.filter((item) => item.name === 'default')
        if (getDefaultNavigation.length > 0) {
          this.sidebarNavigations = getDefaultNavigation[0].children
        } else {
          this.sidebarNavigations = []
        }
      },
      parentHasChild(childrens) {
        let count = childrens.filter((x) => x.meta !== undefined && x.meta.permission !== undefined && x.meta.permission.length > 0).length
        if (count > 0) {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>
<style lang="stylus">
    .general-page-holder
        padding 15px
</style>
<style>
    /*Skip css loader*/
    @import "~intro.js/introjs.css";
</style>