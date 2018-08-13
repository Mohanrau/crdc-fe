<template>
    <div class="general-page-holder">
        <general-header :genaralTitle="TitleLabel"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row gutter-xs items-baseline">
                <div class="col-lg-4">
                    <div class="row gutter-xs">
                        <div class="col-lg-12 col-md-12 col-xs-12">
                            <div class="col-lg-4 col-md-12 col-xs-12">
                                <q-search v-model="terms"
                                          clearable
                                          inverted-light
                                          @clear="reset"
                                          class="no-shadow custom-input-border"
                                          color="white text-grey-6"
                                          :placeholder="$t('members.iboIbName.label')">
                                    <q-autocomplete
                                            @search="search"
                                            :max-results="7"
                                            :debounce="1000"
                                            :min-characters="2"
                                            @selected="selected"/>
                                </q-search>
                                <!--<small class="text-faded light-paragraph no-padding no-margin">(Minimum 2 characters to trigger search)</small>-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row gutter-xs content-stretch" v-if="Object.keys(getMemberData).length > 0">
            <div class="col-lg-5">
                <q-card color="white text-black">
                    <q-list>
                        <q-item>
                            <q-item-side style="width: 30%;">
                                <q-item-tile sublabel>{{ $t('members.iboId.label') }}</q-item-tile>
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile sublabel>{{ getMemberData.details.user.name }}</q-item-tile>
                            </q-item-main>
                        </q-item>
                        <q-item>
                            <q-item-side style="width: 30%;">
                                <q-item-tile sublabel>{{ $t('members.iboName.label') }}</q-item-tile>
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile sublabel>{{ getMemberData.details.user.old_member_id }}</q-item-tile>
                            </q-item-main>
                        </q-item>
                        <q-item>
                            <q-item-side style="width: 30%;">
                                <q-item-tile sublabel>{{ $t('members.joinedDate.label') }}</q-item-tile>
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile sublabel>{{ getMemberData.details.join_date }}</q-item-tile>
                            </q-item-main>
                        </q-item>
                        <q-item>
                            <q-item-side style="width: 30%;">
                                <q-item-tile sublabel>{{ $t('members.expiryDate.label') }}</q-item-tile>
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile sublabel>{{ getMemberData.details.expiry_date }}
                                    <q-icon v-if="getMemberData.details.expiry_date" name="check_circle"
                                            style="font-weight:bold; font-size: 1rem;" color="green circle"/>
                                </q-item-tile>
                            </q-item-main>
                        </q-item>
                        <q-item>
                            <q-item-side style="width: 30%;">
                                <q-item-tile sublabel>{{ $t('members.country.label') }}</q-item-tile>
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile sublabel>{{ getMemberData.details.country.name }}</q-item-tile>
                            </q-item-main>
                        </q-item>
                        <q-item>
                            <q-item-side style="width: 30%;">
                                <q-item-tile sublabel>{{ $t('members.email.label') }}</q-item-tile>
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile sublabel>{{ getMemberData.details.user.email }}</q-item-tile>
                            </q-item-main>
                        </q-item>
                    </q-list>
                </q-card>
            </div>
            <div class="col-lg-7">
                <div class="row">
                    <div class="col-md-12">
                        <q-card color="white text-black" class="q-pa-sm">
                            <q-field :label-width="12" :label="$t('members.selectType.label')">
                                <q-checkbox v-model="checkAccount" :label="$t('members.loginAccount.label')"
                                            color="secondary"
                                            val="loginAccount"/>
                                <q-checkbox v-model="checkAccount" :label="$t('members.eWallet.label')" val="eWallet"
                                            color="secondary"
                                            style="margin-left: 10px"/>

                            </q-field>
                            <q-btn color="primary" class="block q-mt-md" v-on:click="sendPassword">
                                {{ $t('Common.confirmReset.Btn')
                                }}
                            </q-btn>
                        </q-card>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 justify-center empty-list bg-white shadow-1" v-else="">
            <empty-list></empty-list>
        </div>
    </div>
</template>
<script>
  import {Dialog} from 'quasar'
  import generalHeader from '../../global/components/common/header/generalHeader'
  import qLoader from '../../global/components/common/loading/loader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList'
  import {required, minLength} from 'vuelidate/lib/validators'
  import {mapGetters, mapState, mapActions, mapMutations} from 'vuex'

  export default {
    components: {
      generalHeader,
      qLoader,
      EmptyList
    },
    data() {
      return {
        TitleLabel: 'Reset Password',
        memberCode: '',
        terms: '',
        checkAccount: ['loginAccount'],
        error: true
      }
    },
    validations: {
      memberCode: {
        required,
        minLength: minLength(2)
      }
    },
    computed: {
      ...mapGetters([
        'getMemberData'
      ]),
      ...mapState({
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
      })
    },
    methods: {
      // declare vuex actions
      ...mapActions(['getMemberByUserIdAction', 'getMemberListingAction', 'getMemberSearchAction', 'sendMemberPassword']),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION',
        unSetMemberData: 'UNSET_MEMBER_DATA'
      }),
      // search via auto suggestion
      search(terms, done) {
        let query = {
          search_text: this.terms,
          verified: 3,
          limit: 20
        }
        this.getMemberSearchAction(query).then(res => {
          done(this.membersSearchData.list)
        })
      },
      // selected search member
      selected(item, keyboard) {
        if (!keyboard) {
          this.name = item.label
          this.iboId = item.value
          this.userId = item.userID
          this.getMemberTreeData()
        }
      },
      // Member data
      getMemberTreeData() {
        let query = {
          user_id: this.userId
        }
        this.getMemberByUserIdAction(query)
      },
      // send email and show responses
      sendPassword() {
        if (this.getMemberData.details.user.email !== '') {
          let query = {
            email: this.getMemberData.details.user.email
          }
          this.sendMemberPassword(query).then(() => {
            this.setNotification({
              title: this.TitleLabel,
              message: 'Password Reset Success',
              type: 'positive'
            })
          })
        }
      },
      reset() {
        this.name = ''
        this.iboId = ''
        this.userId = ''
        this.terms = ''
        this.unSetMemberData()
      }
    }
  }
</script>