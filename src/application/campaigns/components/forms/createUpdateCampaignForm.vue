<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="createUpdateCampaignForm"
                    :backgroudColor="false"
                    :formTitle="$t('campaigns.campaignNew.title')"
                    v-bind:formFieldData="campaignData"
                    urlResetPathName="Campaign List"
                    formAction="createCampaignAction"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <div class="pwp-foc-section">
                    <div class="configuration-content-sections shadow-1 pd-10  bg-white">
                        <div class="row gutter-sm">
                            <div class="col-12">
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('name')"
                                                 :error-label="getErrorMessage('name')"
                                                 :count="50"
                                        >
                                            <q-input name="nameInput" v-model="campaignData.name"
                                                     :stack-label="$t('campaigns.campaign.name')"></q-input>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('report_group')"
                                                 :error-label="getErrorMessage('report_group')"
                                                 :count="50"
                                        >
                                            <q-input name="reportGroupInput" v-model="campaignData.report_group"
                                                     :stack-label="$t('campaigns.campaign.reportGroup')"></q-input>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                :error="getErrorState('from_cw_schedule_id')"
                                                :error-label="getErrorMessage('from_cw_schedule_id')"
                                        >
                                            <q-select
                                                    name="cwScheduleFromInput"
                                                    color="primary"
                                                    v-model="campaignData.from_cw_schedule_id"
                                                    :stack-label="$t('campaigns.campaign.dateFromCw')"
                                                    :options="commissionWeeks"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                :error="getErrorState('to_cw_schedule_id')"
                                                :error-label="getErrorMessage('to_cw_schedule_id')"
                                        >
                                            <q-select
                                                    name="cwScheduleToInput"
                                                    color="primary"
                                                    v-model="campaignData.to_cw_schedule_id"
                                                    :stack-label="$t('campaigns.campaign.dateToCw')"
                                                    :options="commissionWeeks"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-tree
                                            :nodes="campaignRuleTreeData"
                                            node-key="id"
                                            :default-expand-all="true"
                                            :expanded.sync="campaignRuleTreeExpanded"
                                            v-if="campaignRuleTreeData.length > 0"
                                        >
                                            <div slot="default-body" slot-scope="prop">
                                                <q-collapsible v-model="prop.node.collapsibleExpand" header-class="campaign-rules">
                                                    <template slot="header">
                                                        <q-item-main :label="prop.node.ruleItem.name" />
                                                        <q-item-side right>
                                                            <q-btn @click="removeCampaignRule(prop.node.ruleIndex)" color="negative" flat>
                                                                <q-icon name="delete"/>
                                                            </q-btn>
                                                            <div class="q-dot" v-if="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].$error"></div>
                                                        </q-item-side>
                                                    </template>
                                                    <div>
                                                        <div class="row gutter-xs justify-between items-baseline" v-if="campaignData.campaign_rules.length > 1">
                                                            <div class="col-12">
                                                                <q-field>
                                                                    <q-select
                                                                        color="primary"
                                                                        clearable
                                                                        v-model="prop.node.ruleItem.parent_id"
                                                                        :stack-label="$t('campaigns.campaign.ruleParent')"
                                                                        :options="getParentIDsOptions(prop.node.ruleItem.id)"
                                                                        @input="buildCampaignRuleTreeData"
                                                                    />
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-12">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].name.$error"
                                                                        :count="50"
                                                                >
                                                                    <q-input v-model="prop.node.ruleItem.name"
                                                                            :stack-label="$t('campaigns.campaign.ruleName')"></q-input>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-12">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].report_title.$error"
                                                                        :count="50"
                                                                >
                                                                    <q-input v-model="prop.node.ruleItem.report_title"
                                                                            :stack-label="$t('campaigns.campaign.reportTitle')"></q-input>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-12">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].qualify_member_status.$error"
                                                                >
                                                                    <q-select
                                                                        color="primary"
                                                                        v-model="prop.node.ruleItem.qualify_member_status"
                                                                        :stack-label="$t('campaigns.campaign.qualifyMemberStatus')"
                                                                        :options="masterDataOptionsCreator($const.masterKey.MEMBER_STATUS)"
                                                                    />
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-6">
                                                                <q-field helper="*"
                                                                        :label="$t('campaigns.campaign.qualifyMemberTeamBonusRank')"
                                                                        label-width="12"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].qualify_team_bonus_ranks.$error"
                                                                >
                                                                    <q-checkbox label="All" 
                                                                        v-model="prop.node.qualify_team_bonus_rank_checkall" 
                                                                        @input="(val) => {allCheckboxInput(val, teamBonusRanksOptions, prop.node.ruleItem.qualify_team_bonus_ranks)}">
                                                                    </q-checkbox>
                                                                    <div class="checkbox-list-container">
                                                                        <q-option-group type="checkbox"
                                                                                        v-model="prop.node.ruleItem.qualify_team_bonus_ranks"
                                                                                        :options="teamBonusRanksOptions"
                                                                        ></q-option-group>
                                                                    </div>
                                                                </q-field>
                                                            </div>
                                                            <div class="col-6">
                                                                <q-field helper="*"
                                                                        :label="$t('campaigns.campaign.qualifyMemberEnrollmentRank')"
                                                                        label-width="12"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].qualify_enrollment_ranks.$error"
                                                                >
                                                                    <q-checkbox label="All" 
                                                                        v-model="prop.node.qualify_enrollment_rank_checkall" 
                                                                        @input="(val) => {allCheckboxInput(val, enrollmentRanksOptions, prop.node.ruleItem.qualify_enrollment_ranks)}">
                                                                    </q-checkbox>
                                                                    <div class="checkbox-list-container">
                                                                        <q-option-group type="checkbox"
                                                                                        v-model="prop.node.ruleItem.qualify_enrollment_ranks"
                                                                                        :options="enrollmentRanksOptions"
                                                                        ></q-option-group>
                                                                    </div>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-4">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].sale_item_quantity.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.sale_item_quantity"
                                                                        :stack-label="$t('campaigns.campaign.saleItemQuantity')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                            <div class="col-4">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].team_bonus_rank_quantity.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.team_bonus_rank_quantity"
                                                                        :stack-label="$t('campaigns.campaign.teamBonusRankQuantity')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                            <div class="col-4">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].enrollment_rank_quantity.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.enrollment_rank_quantity"
                                                                        :stack-label="$t('campaigns.campaign.enrollmentRankQuantity')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-6">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].from_sale_item_level.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.from_sale_item_level"
                                                                        :stack-label="$t('campaigns.campaign.fromSaleItemLevel')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                            <div class="col-6">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].to_sale_item_level.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.to_sale_item_level"
                                                                        :stack-label="$t('campaigns.campaign.toSaleItemLevel')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-6">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].from_team_bonus_rank_level.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.from_team_bonus_rank_level"
                                                                        :stack-label="$t('campaigns.campaign.fromTeamBonusRankLevel')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                            <div class="col-6">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].to_team_bonus_rank_level.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.to_team_bonus_rank_level"
                                                                        :stack-label="$t('campaigns.campaign.toTeamBonusRankLevel')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-6">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].from_enrollment_rank_level.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.from_enrollment_rank_level"
                                                                        :stack-label="$t('campaigns.campaign.fromEnrollmentRankLevel')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                            <div class="col-6">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].to_enrollment_rank_level.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.to_enrollment_rank_level"
                                                                        :stack-label="$t('campaigns.campaign.toEnrollmentRankLevel')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-6">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].from_cv.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.from_cv"
                                                                        :stack-label="$t('campaigns.campaign.cvFrom')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                            <div class="col-6">
                                                                <q-field helper="*"
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].to_cv.$error"
                                                                >
                                                                    <q-input
                                                                        v-model="prop.node.ruleItem.to_cv"
                                                                        :stack-label="$t('campaigns.campaign.cvTo')"
                                                                        type="number">
                                                                    </q-input>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-12">
                                                                <q-field
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].point.$error"
                                                                >
                                                                    <q-checkbox v-model="prop.node.ruleItem.point" :label="$t('campaigns.campaign.point')" />
                                                                    <div class="campaign-rule-reward-wrapper" v-if="prop.node.ruleItem.point === true">
                                                                        <q-field helper="*"
                                                                                :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].point_value.$error"
                                                                        >
                                                                            <q-input
                                                                                v-model="prop.node.ruleItem.point_value"
                                                                                :stack-label="$t('campaigns.campaign.value')"
                                                                                type="number" :decimals="2">
                                                                            </q-input>
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                                :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].point_value_multiplier.$error"
                                                                        >
                                                                            <q-select
                                                                                color="primary"
                                                                                v-model="prop.node.ruleItem.point_value_multiplier"
                                                                                :stack-label="$t('campaigns.campaign.valueMultiplier')"
                                                                                :options="masterDataOptionsCreator($const.masterKey.CAMPAIGN_REWARD_VALUE_MULTIPLIER)"
                                                                            />
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                                :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].min_point_value.$error"
                                                                        >
                                                                            <q-input
                                                                                v-model="prop.node.ruleItem.min_point_value"
                                                                                :stack-label="$t('campaigns.campaign.minValue')"
                                                                                type="number" :decimals="2">
                                                                            </q-input>
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                                :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].max_point_value.$error"
                                                                        >
                                                                            <q-input
                                                                                v-model="prop.node.ruleItem.max_point_value"
                                                                                :stack-label="$t('campaigns.campaign.maxValue')"
                                                                                type="number" :decimals="2">
                                                                            </q-input>
                                                                        </q-field>
                                                                    </div>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-12">
                                                                <q-field 
                                                                        :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].voucher.$error"
                                                                >
                                                                    <q-checkbox v-model="prop.node.ruleItem.voucher" :label="$t('campaigns.campaign.voucher')" />
                                                                    <div class="campaign-rule-reward-wrapper" v-if="prop.node.ruleItem.voucher === true">
                                                                        <q-field helper="*"
                                                                                :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].voucher_type_id.$error"
                                                                        >
                                                                            <q-select
                                                                                color="primary"
                                                                                v-model="prop.node.ruleItem.voucher_type_id"
                                                                                :stack-label="$t('campaigns.campaign.voucherType')"
                                                                                :options="esacVoucherTypesOptions"
                                                                            />
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                                :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].voucher_sub_type_id.$error"
                                                                        >
                                                                            <q-select
                                                                                color="primary"
                                                                                v-model="prop.node.ruleItem.voucher_sub_type_id"
                                                                                :stack-label="$t('campaigns.campaign.voucherSubType')"
                                                                                :options="getEsacVoucherSubTypeOptions(prop.node.ruleItem.voucher_type_id)"
                                                                            />
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                            :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].voucher_value.$error"
                                                                        >
                                                                            <q-input
                                                                                v-model="prop.node.ruleItem.voucher_value"
                                                                                :stack-label="$t('campaigns.campaign.value')"
                                                                                type="number" :decimals="2"
                                                                                :prefix="currencyLabelByCountry">
                                                                            </q-input>
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                            :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].voucher_value_multiplier.$error"
                                                                        >
                                                                            <q-select
                                                                                color="primary"
                                                                                v-model="prop.node.ruleItem.voucher_value_multiplier"
                                                                                :stack-label="$t('campaigns.campaign.valueMultiplier')"
                                                                                :options="masterDataOptionsCreator($const.masterKey.CAMPAIGN_REWARD_VALUE_MULTIPLIER)"
                                                                            />
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                                :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].min_voucher_value.$error"
                                                                        >
                                                                            <q-input
                                                                                v-model="prop.node.ruleItem.min_voucher_value"
                                                                                :stack-label="$t('campaigns.campaign.minValue')"
                                                                                type="number" :decimals="2"
                                                                                :prefix="currencyLabelByCountry">
                                                                            </q-input>
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                                :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].max_voucher_value.$error"
                                                                        >
                                                                            <q-input
                                                                                v-model="prop.node.ruleItem.max_voucher_value"
                                                                                :stack-label="$t('campaigns.campaign.maxValue')"
                                                                                type="number" :decimals="2"
                                                                                :prefix="currencyLabelByCountry">
                                                                            </q-input>
                                                                        </q-field>
                                                                    </div>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-12">
                                                                <q-field
                                                                    :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].ewallet_money.$error">
                                                                    <q-checkbox v-model="prop.node.ruleItem.ewallet_money" :label="$t('campaigns.campaign.ewalletMoney')" />
                                                                    <div class="campaign-rule-reward-wrapper" v-if="prop.node.ruleItem.ewallet_money === true">
                                                                        <q-field helper="*"
                                                                            :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].ewallet_money_value.$error">
                                                                            <q-input
                                                                                v-model="prop.node.ruleItem.ewallet_money_value"
                                                                                :stack-label="$t('campaigns.campaign.value')"
                                                                                type="number" :decimals="2">
                                                                            </q-input>
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                            :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].ewallet_money_value_multiplier.$error"
                                                                        >
                                                                            <q-select
                                                                                color="primary"
                                                                                v-model="prop.node.ruleItem.ewallet_money_value_multiplier"
                                                                                :stack-label="$t('campaigns.campaign.valueMultiplier')"
                                                                                :options="masterDataOptionsCreator($const.masterKey.CAMPAIGN_REWARD_VALUE_MULTIPLIER)"
                                                                            />
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                                :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].min_ewallet_money_value.$error"
                                                                        >
                                                                            <q-input
                                                                                v-model="prop.node.ruleItem.min_ewallet_money_value"
                                                                                :stack-label="$t('campaigns.campaign.minValue')"
                                                                                type="number" :decimals="2">
                                                                            </q-input>
                                                                        </q-field>
                                                                        <q-field helper="*"
                                                                                :error="$v.campaignData.campaign_rules.$each[prop.node.ruleIndex].max_ewallet_money_value.$error"
                                                                        >
                                                                            <q-input
                                                                                v-model="prop.node.ruleItem.max_ewallet_money_value"
                                                                                :stack-label="$t('campaigns.campaign.maxValue')"
                                                                                type="number" :decimals="2">
                                                                            </q-input>
                                                                        </q-field>
                                                                    </div>
                                                                </q-field>
                                                            </div>
                                                        </div>
                                                        <div class="row gutter-xs justify-between items-baseline">
                                                            <div class="col-12">
                                                                <div class="campaign-rule-item-wrapper">
                                                                    <div class="campaign-rule-item-container">
                                                                        <q-tabs>
                                                                            <q-tab slot="title" name="tab-1" :label="$t('campaigns.campaign.location')" :count="prop.node.ruleItem.locations.length" default />
                                                                            <q-tab slot="title" name="tab-2" :label="$t('campaigns.campaign.productCategory')" :count="prop.node.ruleItem.product_categories.length" />
                                                                            <q-tab slot="title" name="tab-3" :label="$t('campaigns.campaign.product')" :count="prop.node.ruleItem.products_and_kittings.length" />
                                                                            <q-tab slot="title" name="tab-4" :label="$t('campaigns.campaign.saleType')" :count="prop.node.ruleItem.sale_types.length" />
                                                                            <q-tab slot="title" name="tab-5" :label="$t('campaigns.campaign.teamBonusRank')" :count="prop.node.ruleItem.team_bonus_ranks.length" />
                                                                            <q-tab slot="title" name="tab-6" :label="$t('campaigns.campaign.enrollmentRank')" :count="prop.node.ruleItem.enrollment_ranks.length" />
                                                                            <q-tab-pane name="tab-1">
                                                                                <q-checkbox label="All" 
                                                                                    v-model="prop.node.location_checkall" 
                                                                                    @input="(val) => {allCheckboxInput(val, locationsOptions, prop.node.ruleItem.locations)}">
                                                                                </q-checkbox>
                                                                                <div class="checkbox-list-container">
                                                                                    <q-option-group type="checkbox"
                                                                                        v-model="prop.node.ruleItem.locations"
                                                                                        :options="locationsOptions"
                                                                                    ></q-option-group>
                                                                                </div>
                                                                            </q-tab-pane>
                                                                            <q-tab-pane name="tab-2">
                                                                                <q-checkbox label="All" 
                                                                                    v-model="prop.node.product_category_checkall" 
                                                                                    @input="(val) => {allCheckboxInput(val, productCategoryOptions, prop.node.ruleItem.product_categories)}">
                                                                                </q-checkbox>
                                                                                <div class="checkbox-list-container">
                                                                                    <q-option-group type="checkbox"
                                                                                        v-model="prop.node.ruleItem.product_categories"
                                                                                        :options="productCategoryOptions"
                                                                                    ></q-option-group>
                                                                                </div>
                                                                            </q-tab-pane>
                                                                            <q-tab-pane name="tab-3">
                                                                                <table class="q-table-html bordered cell-separator full-width mt-10">
                                                                                    <thead>
                                                                                    <tr class="header bg-grey-3">
                                                                                        <th width="25%" class="text-center">{{ $t('campaigns.campaign.productType') }}</th>
                                                                                        <th width="25%" class="text-center">{{ $t('campaigns.campaign.productCode') }}</th>
                                                                                        <th width="40%" class="text-center">{{ $t('campaigns.campaign.productName') }}</th>
                                                                                        <th width="10%" class="text-center"></th>
                                                                                    </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                    <tr>
                                                                                        <td data-th="Product Type">
                                                                                            <q-option-group
                                                                                                type="radio"
                                                                                                color="primary"
                                                                                                inline
                                                                                                v-model="adderRuleProductRowTemp.product_type"
                                                                                                :options="productTypesOptions"
                                                                                            />
                                                                                        </td>
                                                                                        <td data-th="Product Code">
                                                                                            <q-search v-model.trim="adderRuleProductRowTemp.display_code" :placeholder="$t('Common.search.placeholder')">
                                                                                                <q-autocomplete
                                                                                                        :max-results="10"
                                                                                                        @search="searchProduct"
                                                                                                        @selected="selectProduct"
                                                                                                />
                                                                                            </q-search>
                                                                                        </td>
                                                                                        <td data-th="Product Name">
                                                                                            <q-search v-model.trim="adderRuleProductRowTemp.display_name" :placeholder="$t('Common.search.placeholder')">
                                                                                                <q-autocomplete
                                                                                                        :max-results="10"
                                                                                                        @search="searchProduct"
                                                                                                        @selected="selectProduct"
                                                                                                />
                                                                                            </q-search>
                                                                                        </td>
                                                                                        <td>
                                                                                            <q-btn :disable="(adderRuleProductRow.product_id === null && adderRuleProductRow.kitting_id === null)" @click="addRuleProductRow(prop.node.ruleIndex)" color="positive" flat>
                                                                                                <q-icon name="add"/>
                                                                                            </q-btn>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr v-for="(item, index) in prop.node.ruleItem.products_and_kittings" :key="index">
                                                                                        <td data-th="Product Type">{{ item.display_type }}</td>
                                                                                        <td data-th="Product Code">{{ item.display_code }}</td>
                                                                                        <td data-th="Product Name">{{ item.display_name }}</td>
                                                                                        <td>
                                                                                            <q-btn @click="removeProductRow(prop.node.ruleIndex, index)" color="negative" flat>
                                                                                                <q-icon name="delete"/>
                                                                                            </q-btn>
                                                                                        </td>
                                                                                    </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </q-tab-pane>
                                                                            <q-tab-pane name="tab-4">
                                                                                <q-checkbox label="All" 
                                                                                    v-model="prop.node.sale_type_checkall" 
                                                                                    @input="(val) => {allCheckboxInput(val, masterDataOptionsCreator($const.masterKey.SALE_TYPES), prop.node.ruleItem.sale_types)}">
                                                                                </q-checkbox>
                                                                                <div class="checkbox-list-container">
                                                                                  <q-option-group type="checkbox"
                                                                                      v-model="prop.node.ruleItem.sale_types"
                                                                                      :options="masterDataOptionsCreator($const.masterKey.SALE_TYPES)"
                                                                                  ></q-option-group>
                                                                                </div>
                                                                            </q-tab-pane>
                                                                            <q-tab-pane name="tab-5">
                                                                                <q-checkbox label="All" 
                                                                                    v-model="prop.node.team_bonus_rank_checkall" 
                                                                                    @input="(val) => {allCheckboxInput(val, teamBonusRanksOptions, prop.node.ruleItem.team_bonus_ranks)}">
                                                                                </q-checkbox>
                                                                                <div class="checkbox-list-container">
                                                                                    <q-option-group type="checkbox"
                                                                                        v-model="prop.node.ruleItem.team_bonus_ranks"
                                                                                        :options="teamBonusRanksOptions"
                                                                                    ></q-option-group>
                                                                                </div>
                                                                            </q-tab-pane>
                                                                            <q-tab-pane name="tab-6">
                                                                                <q-checkbox label="All" 
                                                                                    v-model="prop.node.enrollment_rank_checkall" 
                                                                                    @input="(val) => {allCheckboxInput(val, enrollmentRanksOptions, prop.node.ruleItem.enrollment_ranks)}">
                                                                                </q-checkbox>
                                                                                <div class="checkbox-list-container">
                                                                                    <q-option-group type="checkbox"
                                                                                        v-model="prop.node.ruleItem.enrollment_ranks"
                                                                                        :options="enrollmentRanksOptions"
                                                                                    ></q-option-group>
                                                                                </div>
                                                                            </q-tab-pane>
                                                                        </q-tabs>       
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </q-collapsible>
                                            </div>
                                        </q-tree>
                                        <q-field helper="*"
                                                :error="getErrorState('campaign_rules')"
                                                :error-label="getErrorMessage('campaign_rules')"
                                        >
                                            <q-btn class="full-width"
                                                  color="primary" icon="add"
                                                  @click="addCampaignRule()">
                                                {{ $t('Common.Add.Btn') }}
                                            </q-btn>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field
                                                 :error="getErrorState('custom_script')"
                                                 :error-label="getErrorMessage('custom_script')"
                                        >
                                            <q-input name="customScriptInput" type="textarea" :min-rows="5"
                                                     :max-height="80" v-model="campaignData.custom_script"
                                                     :stack-label="$t('campaigns.campaign.customScript')"></q-input>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </basic-form>
        <q-loader :message="message" :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import masterDataTransformarMixin from 'src/application/global/mixins/masterDataTransformarMixin'
  import _ from 'lodash'
  import { api } from '../../api'
  import { required, requiredIf, minLength, maxLength, between, numeric, url } from 'vuelidate/lib/validators'
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  import Vue from 'vue'
  import { isNull } from 'util';

  function initializeRuleProductAdderRow() {
    return {
      product_type: 'P',
      product_id: null,
      kitting_id: null,
      display_code: '',
      display_name: '',
      display_type: ''
    }
  }

  export default {
    name: 'create-update-esac-voucher-type-form',
    components: {
      BasicForm: basicForm,
      qLoader
    },
    mixins: [masterDataTransformarMixin],
    props: ['campaignId'],
    computed: {
      ...mapState({
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        productCategoryData: state => state.productsCMP.productCategories.list.data,
        productSearchData: state => state.productsCMP.productSearchData,
        campaignLocationListData: state => state.campaignsCMP.campaignLocationList,
        teamBonusRankListData: state => state.campaignsCMP.teamBonusRankList,
        enrollmentRankListData: state => state.campaignsCMP.enrollmentRankList,
        masterData: state => state.globalCMP.masterData.data.list,
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        selectedFilters: state => state.globalCMP.selectedFilters,
        formData: state => state.globalCMP.formData,
      }),
      ...mapGetters({
        currencyLabelByCountry: 'currencyLabelByCountry'
      })
    },
    mounted: function () {
      this.master.keys = [
        this.$const.masterKey.SALE_TYPES,
        this.$const.masterKey.MEMBER_STATUS,
        this.$const.masterKey.CAMPAIGN_REWARD_VALUE_MULTIPLIER
      ]
      this.getCountriesAction()
      let query = {
        country_id: this.selectedFilters.countryID,
        relations: ['currency']
      }
      this.getCountryRelationAction(query)
      this.getCommissionWeeksData()
      query = {
        for_sales: true,
        active: true,
        limit: 0
      }
      this.getProductCategoriesAction(query).then(() => {
        this.productCategoryOptions = this.productCategoryData.map(opt => ({label: opt.name, value: opt.id}))
      })
      query = {
          country_id: this.selectedFilters.countryID,
          relations: ['entity.locations']
      }
      this.getCampaignLocationListAction(query).then(() => {
        this.locationsOptions = this.campaignLocationListData.list.entity.locations.map(opt => ({label: opt.name, value: opt.id}))
      })
      this.getEsacVoucherTypeListAction(_(query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(res => {
        this.esacVoucherTypesOptions = res.data.map(opt => ({label: opt.name, value: opt.id}))
      })
      this.getEsacVoucherSubTypeListAction(_(query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(res => {
        this.esacVoucherSubTypesData = res.data.map(opt => ({voucher_type_id: opt.voucher_type_id ,label: opt.name, value: opt.id}))
      })
      query = {
        order: 'asc',
        sort: 'id'
      }
      this.getTeamBonusRankListAction(query).then(() => {
        this.teamBonusRanksOptions = this.teamBonusRankListData.list.data.map(opt => ({label: opt.rank_name, value: opt.id}))
      })
      this.getEnrollmentRankListAction(query).then(() => {
        this.enrollmentRanksOptions = this.enrollmentRankListData.list.data.map(opt => ({label: opt.rank_name, value: opt.id}))
      })
      if (this.campaignId) {
        this.setFormData()
      }
      else {
        this.campaignData.country_id = this.selectedFilters.countryID
      }
    },
    data: () => ({
      message: '',
      headers: {
        Accept: 'form-data',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('accessToken')
      },
      adderRuleProductRow: initializeRuleProductAdderRow(),
      adderRuleProductRowTemp: initializeRuleProductAdderRow(),
      productCategoryOptions: [],
      productTypesOptions: [
        {label:'Product', value:'P'},
        {label:'Kitting', value:'K'}
      ],
      locationsOptions: [],
      teamBonusRanksOptions: [],
      enrollmentRanksOptions: [],
      esacVoucherTypesOptions: [],
      esacVoucherSubTypesData: [],
      esacVoucherSubTypesOptions: [],
      campaignData: {
        country_id: null,
        name: '',
        report_group: '',
        from_cw_schedule_id: null,
        to_cw_schedule_id: null,
        custom_script: '',
        active: 1,
        campaign_rules: []
      },
      campaignRuleTreeExpanded: [],
      campaignRuleTreeState: [],
      campaignRuleTreeData: [],
      campaignRuleRunningNumber: 0
    }),
    validations: {
      campaignData: {
        country_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        name: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(50)
        },
        report_group: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(50)
        },
        from_cw_schedule_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        to_cw_schedule_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        active: {
          required
        },
        campaign_rules: {
          required,
          minLength: minLength(1),
          $each: {
            name: {
              required,
              minLength: minLength(3),
              maxLength: maxLength(50)
            },
            report_title: {
              required,
              minLength: minLength(2),
              maxLength: maxLength(50)
            },
            qualify_member_status: {
              required,
              numeric
            },
            qualify_team_bonus_ranks: {
              required,
              minLength: minLength(1)
            },
            qualify_enrollment_ranks: {
              required,
              minLength: minLength(1)
            },
            sale_item_quantity: {
              required,
              numeric,
              between: between(0, 9999999999)
            },
            team_bonus_rank_quantity: {
              required,
              numeric,
              between: between(0, 9999999999)
            },
            enrollment_rank_quantity: {
              required,
              numeric,
              between: between(0, 9999999999)
            },
            from_sale_item_level: {
              required,
              numeric,
              between: between(0, 9999999999)
            },
            to_sale_item_level: {
              required,
              numeric,
              between: between(0, 9999999999),
              customValidator (val, nestedModel) {
                return (val === 0 || val >= nestedModel.from_sale_item_level)
              }
            },
            from_team_bonus_rank_level: {
              required,
              numeric,
              between: between(0, 9999999999)
            },
            to_team_bonus_rank_level: {
              required,
              numeric,
              between: between(0, 9999999999),
              customValidator (val, nestedModel) {
                return (val === 0 || val >= nestedModel.from_team_bonus_rank_level)
              }
            },
            from_enrollment_rank_level: {
              required,
              numeric,
              between: between(0, 9999999999)
            },
            to_enrollment_rank_level: {
              required,
              numeric,
              between: between(0, 9999999999),
              customValidator (val, nestedModel) {
                return (val === 0 || val >= nestedModel.from_enrollment_rank_level)
              }
            },
            from_cv: {
              required,
              numeric,
              between: between(0, 9999999999)
            },
            to_cv: {
              required,
              numeric,
              between: between(0, 9999999999),
              customValidator (val, nestedModel) {
                return (val === 0 || val >= nestedModel.from_cv)
              }
            },
            point: {
              customValidator (val, nestedModel) {
                return (nestedModel.point || nestedModel.voucher || nestedModel.ewallet_money)
              }
            },
            point_value: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.point)
              }),
              customValidator (val, nestedModel) {
                if (nestedModel.point && val !== null) {
                  return val > 0
                }
                return true
              }
            },
            point_value_multiplier: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.point)
              }),
              numeric
            },
            min_point_value: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.point)
              })
            },
            max_point_value: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.point)
              })
            },
            voucher: {
              customValidator (val, nestedModel) {
                return (nestedModel.point || nestedModel.voucher || nestedModel.ewallet_money)
              }
            },
            voucher_type_id: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.voucher)
              }),
              numeric
            },
            voucher_sub_type_id: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.voucher)
              }),
              numeric
            },
            voucher_value: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.voucher)
              }),
              customValidator (val, nestedModel) {
                if (nestedModel.voucher && val !== null) {
                  return val > 0
                }
                return true
              }
            },
            voucher_value_multiplier: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.voucher)
              }),
              numeric
            },
            min_voucher_value: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.voucher)
              })
            },
            max_voucher_value: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.voucher)
              })
            },
            ewallet_money: {
              customValidator (val, nestedModel) {
                return (nestedModel.point || nestedModel.voucher || nestedModel.ewallet_money)
              }
            },
            ewallet_money_value: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.ewallet_money)
              }),
              numeric,
              customValidator (val, nestedModel) {
                if (nestedModel.ewallet_money && val !== null) {
                  return val > 0
                }
                return true
              }
            },
            ewallet_money_value_multiplier: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.ewallet_money)
              }),
              numeric
            },
            min_ewallet_money_value: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.ewallet_money)
              })
            },
            max_ewallet_money_value: {
              required: requiredIf(function (nestedModel) {
                return (nestedModel.ewallet_money)
              })
            }
          }
        }
      }
    },
    watch: {
      adderRuleProductRow: {
        handler (val) {
          // Reset adderRow
          if ((val.product_code === '' && val.product_name !== '') || (val.product_name === '' && val.product_code !== '')) {
            let newRow = initializeRuleProductAdderRow()
            newRow.product_type = val.product_type
            Object.assign(this.adderRuleProductRowTemp, newRow)
          }
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getCountryRelationAction',
        'getCommissionWeekSearchAction',
        'getProductCategoriesAction',
        'getProductSearchAction',
        'getKittingSearchAction',
        'getCampaignLocationListAction',
        'getTeamBonusRankListAction',
        'getEnrollmentRankListAction',
        'getMasterDataOptionsAction',
        'getEsacVoucherTypeListAction',
        'getEsacVoucherSubTypeListAction',
        'createCampaignAction',
        'updateCampaignAction',
        'getCampaignAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION',
        setIsProcessingForm: 'IS_PROCESSING_FORM',
      }),
      invalidRequest () {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'Campaign List'})
        }, 1500)
      },
      setFormData: function () {
        this.getCampaignAction(this.campaignId).then((res) => {
          this.campaignData = Object.assign({}, this.formData.formData)
          this.manipulateSaveData()
        }).catch((error) => {
          if (error.status === 404) {
            this.setNotification({
              title: 'Uh oh! An error occured',
              message: error.data.error,
              type: 'negative'
            })
          }
          this.invalidRequest()
        })
      },
      manipulateSaveData: function () {
        let campaignData = Object.assign({}, JSON.parse(JSON.stringify(this.campaignData)))
        campaignData.campaign_rules.forEach(z => {
          if (z.voucher_type_id === null || z.voucher_type === null) {
            z.voucher_type_name = ''
          } else {
            z.voucher_type_name = z.voucher_type.name
          }
          if (z.voucher_sub_type_id === null || z.voucher_sub_type === null) {
            z.voucher_sub_type_name = ''
          } else {
            z.voucher_sub_type_name = z.voucher_sub_type.name
          }
          z.point = (z.point === 1 || z.point === true)
          z.voucher = (z.voucher === 1 || z.voucher === true)
          z.ewallet_money = (z.ewallet_money === 1 || z.ewallet_money === true)
          if (z.point_value !== null) {
            z.point_value = parseFloat(z.point_value)
          }
          if (z.min_point_value !== null) {
            z.min_point_value = parseFloat(z.min_point_value)
          }
          if (z.max_point_value !== null) {
            z.max_point_value = parseFloat(z.max_point_value)
          }
          if (z.voucher_value !== null) {
            z.voucher_value = parseFloat(z.voucher_value)
          }
          if (z.min_voucher_value !== null) {
            z.min_voucher_value = parseFloat(z.min_voucher_value)
          }
          if (z.max_voucher_value !== null) {
            z.max_voucher_value = parseFloat(z.max_voucher_value)
          }
          if (z.ewallet_money_value !== null) {
            z.ewallet_money_value = parseFloat(z.ewallet_money_value)
          }
          if (z.min_ewallet_money_value !== null) {
            z.min_ewallet_money_value = parseFloat(z.min_ewallet_money_value)
          }
          if (z.max_ewallet_money_value !== null) {
            z.max_ewallet_money_value = parseFloat(z.max_ewallet_money_value)
          }
          z.products_and_kittings = []
          z.campaign_rule_products.forEach(x => {
            z.products_and_kittings.push({
              product_id: x.id,
              kitting_id: null,
              product_type: 'P',
              display_type: "Product",
              display_code: x.sku,
              display_name: x.name
            })
          })
          z.campaign_rule_kittings.forEach(x => {
            z.products_and_kittings.push({
              product_id: null,
              kitting_id: x.id,
              product_type: 'K',
              display_type: "Kitting",
              display_code: x.code,
              display_name: x.name
            })
          })
        })
        this.campaignData = campaignData
        this.buildCampaignRuleTreeData()
      },
      getErrorState: function (name) {
        var isError = false
        if (this.$v.campaignData[name] !== undefined) {
          isError = this.$v.campaignData[name].$error
        }
        if (isError === false) {
          if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
            isError = true
          } else {
            isError = false
          }
        }
        return isError
      },
      getErrorMessage: function (name) {
        var errorMessage = ''
        if (this.$v.campaignData[name] !== undefined) {
          if (this.$v.campaignData[name].$error) {
            if (this.$v.campaignData[name].hasOwnProperty('required')) {
              if (this.$v.campaignData[name].required === false) {
                errorMessage = 'Required'
              }
            }
            if (this.$v.campaignData[name].hasOwnProperty('minLength')) {
              if (this.$v.campaignData[name].minLength === false) {
                errorMessage = 'Minimum length'
              }
            }
            if (this.$v.campaignData[name].hasOwnProperty('maxLength')) {
              if (this.$v.campaignData[name].maxLength === false) {
                errorMessage = 'Maximum length'
              }
            }
            if (this.$v.campaignData[name].hasOwnProperty('numeric')) {
              if (this.$v.campaignData[name].numeric === false) {
                errorMessage = 'Must be numeric value'
              }
            }
          }
        }
        if (errorMessage === '') {
          if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
            if (this.errors.hasOwnProperty(name)) {
              errorMessage = this.errors[name][0]
            }
          }
        }
        return errorMessage
      },
      getParentIDsOptions(current_id) {
        let options = []
        this.campaignData.campaign_rules.forEach(x => {
          if (x.id !== current_id) {
            options.push({
              label: (x.name === null || x.name === '') ? this.$t('campaigns.campaign.ruleNumber') + (this.campaignData.campaign_rules.findIndex(z => z.id === x.id) + 1) : x.name,
              value: x.id
            })
          }
        })
        return options
      },
      getEsacVoucherSubTypeOptions (voucher_type_id) {
        let options = []
        if (voucher_type_id !== null) {
          this.esacVoucherSubTypesData.forEach(x => {
            if (x.voucher_type_id === voucher_type_id) {
              options.push({
                label: x.label,
                value: x.value
              })
            }
          })
        }
        return options
      },
      populateCampaignRuleTreeState: function (node) {
        node.forEach(x => {
          this.campaignRuleTreeState.push({
            id: x.id,
            collapsibleExpand: (x.collapsibleExpand) ? true : false
          })
          this.populateCampaignRuleTreeState(x.children)
        })
      },
      getCampaignRuleTreeState: function (currentId) {
        let treeState = this.campaignRuleTreeState.find(x => x.id === currentId)
        if (typeof treeState === 'undefined' || treeState === null) {
          treeState = {
            id: currentId,
            collapsibleExpand: true
          }
        }
        return treeState
      },
      buildCampaignRuleTreeData: function () {
        this.campaignRuleTreeState = []
        this.populateCampaignRuleTreeState(this.campaignRuleTreeData)
        this.campaignRuleTreeData = []
        this.campaignData.campaign_rules.forEach(x => {
          if (x.parent_id === null) {
            let treeState = this.getCampaignRuleTreeState(x.id)
            let data = {
              id: x.id,
              ruleIndex: this.campaignData.campaign_rules.findIndex(z => z.id === x.id),
              ruleItem: x,
              collapsibleExpand: (treeState.collapsibleExpand) ? true : false,
              qualify_team_bonus_rank_checkall: false,
              qualify_enrollment_rank_checkall: false,
              location_checkall: false,
              product_category_checkall: false,
              sale_type_checkall: false,
              team_bonus_rank_checkall: false,
              enrollment_rank_checkall: false,
              children: []
            }
            this.buildCampaignRuleTreeDataHelper(data)
            this.campaignRuleTreeData.push(data)
          }
        })
      },
      buildCampaignRuleTreeDataHelper: function (data) {
        this.campaignData.campaign_rules.forEach(x => {
          if (x.parent_id === data.id) {
            let treeState = this.getCampaignRuleTreeState(x.id)
            let mydata = {
              id: x.id,
              ruleIndex: this.campaignData.campaign_rules.findIndex(z => z.id === x.id),
              ruleItem: x,
              collapsibleExpand: (treeState.collapsibleExpand) ? true : false,
              qualify_team_bonus_rank_checkall: false,
              qualify_enrollment_rank_checkall: false,
              location_checkall: false,
              product_category_checkall: false,
              sale_type_checkall: false,
              team_bonus_rank_checkall: false,
              enrollment_rank_checkall: false,
              children: []
            }
            data.children.push(mydata)
            this.buildCampaignRuleTreeDataHelper(mydata)
          }
        })
      },
      allCheckboxInput(value, options, model) {
        if (model.length > 0) {
          model.splice(0, model.length)
        }
        if (value) {
          options.forEach(x => {
            model.push(x.value)
          })
        }
      },
      searchProduct (terms, done) {
        if (this.adderRuleProductRowTemp.product_type === 'P') {
          let query = {
            country_id: this.selectedFilters.countryID,
            text: terms
          }
          this.getProductSearchAction(query).then(res => {
            done(this.productSearchData.list)
          })
        }
        else {
          let query = {
            country_id: this.selectedFilters.countryID,
            text: terms
          }
          this.getKittingSearchAction(query).then(res => {
            done(this.productSearchData.list)
          })
        }
      },
      selectProduct (item) {
        if (this.adderRuleProductRowTemp.product_type === 'P') {
          this.adderRuleProductRowTemp.display_type = 'Product'
          this.adderRuleProductRowTemp.product_id = item.value
        }
        else {
          this.adderRuleProductRowTemp.display_type = 'Kitting'
          this.adderRuleProductRowTemp.kitting_id = item.value
        }
        this.adderRuleProductRowTemp.display_code = item.label
        this.adderRuleProductRowTemp.display_name = item.sublabel
        Object.assign(this.adderRuleProductRow, this.adderRuleProductRowTemp)
      },
      addCampaignRule () {
        this.campaignRuleRunningNumber = this.campaignRuleRunningNumber - 1
        this.campaignData.campaign_rules.push({
          id: this.campaignRuleRunningNumber,
          parent_id: null,
          name: null,
          report_title: null,
          qualify_member_status: null,
          qualify_team_bonus_ranks: [],
          qualify_enrollment_ranks: [],
          sale_item_quantity: null,
          team_bonus_rank_quantity: null,
          enrollment_rank_quantity: null,
          from_sale_item_level: null,
          to_sale_item_level: null,
          from_team_bonus_rank_level: null,
          to_team_bonus_rank_level: null,
          from_enrollment_rank_level: null,
          to_enrollment_rank_level: null,
          from_cv: null,
          to_cv: null,
          point: false,
          point_value: null,
          point_value_multiplier: null,
          min_point_value: null,
          max_point_value: null,
          voucher: false,
          voucher_type_id: null,
          voucher_sub_type_id: null,
          voucher_value: null,
          voucher_value_multiplier: null,
          min_voucher_value: null,
          max_voucher_value: null,
          ewallet_money: false,
          ewallet_money_value: null,
          ewallet_money_value_multiplier: null,
          min_ewallet_money_value: null,
          max_ewallet_money_value: null,
          locations: [],
          product_categories: [],
          products_and_kittings: [],
          sale_types: [],
          team_bonus_ranks: [],
          enrollment_ranks: []
        })
        this.buildCampaignRuleTreeData()
      },
      removeCampaignRule (index) {
        let refId = this.campaignData.campaign_rules[index].id
        let refParentId = this.campaignData.campaign_rules[index].parent_id
        this.campaignData.campaign_rules.forEach(x => {
          if (x.parent_id === refId) {
            x.parent_id = refParentId
          }
        })
        Vue.delete(this.campaignData.campaign_rules, index)
        this.buildCampaignRuleTreeData()
      },
      addRuleProductRow (index) {
        if (this.adderRuleProductRow.product_id !== null || this.adderRuleProductRow.kitting_id !== null) {
          let duplicated = false;
          this.campaignData.campaign_rules[index].products_and_kittings.forEach(element => {
            if (element.product_type === 'P' && this.adderRuleProductRow.product_type === 'P' && element.product_id === this.adderRuleProductRow.product_id) {
              duplicated = true;
            }
            if (element.product_type === 'K' && this.adderRuleProductRow.product_type === 'K' && element.kitting_id === this.adderRuleProductRow.kitting_id) {
              duplicated = true;
            }
          });
          if (duplicated) {
            this.setNotification({
              title: 'Duplicated',
              message: 'Duplicated',
              type: 'negative'
            })
          }
          else {
            if (this.adderRuleProductRow.product_id > 0) {
              this.adderRuleProductRow.kitting_id = null
            }
            else {
              this.adderRuleProductRow.product_id = null
            }
            this.campaignData.campaign_rules[index].products_and_kittings.push(Vue.util.extend({}, JSON.parse(JSON.stringify(this.adderRuleProductRow))))
            // Reset adderRuleProductRow
            let newRow = initializeRuleProductAdderRow()
            newRow.product_type = this.adderRuleProductRow.product_type
            Object.assign(this.adderRuleProductRowTemp, newRow)
            Object.assign(this.adderRuleProductRow, this.adderRuleProductRowTemp)
          }
        }
      },
      removeProductRow (ruleIndex, index) {
        Vue.delete(this.campaignData.campaign_rules[ruleIndex].products_and_kittings, index)
      },
      processForm: function (formFieldData) {
        return new Promise((resolve, reject) => {
          this.$v.campaignData.$touch()
          if (!this.$v.campaignData.$error) {
            formFieldData.campaign_rules.forEach(z => {
              z.products = []
              z.kittings = []
              z.products_and_kittings.forEach(x => {
                if (x.product_type === 'P') {
                  z.products.push(x.product_id)
                } else {
                  z.kittings.push(x.kitting_id)
                }
              });
            });
            if (this.campaignId) {
              this.updateCampaignAction(formFieldData).then((response) => {
                resolve(response)
              }).catch(error => {
                if (typeof error.response !== 'undefined' && error.response.status === 422) {
                  if (typeof error.response.data !== 'undefined' && typeof error.response.data.id !== 'undefined') {
                    this.setNotification({
                      title: 'Campaign Editing Failed',
                      message: error.response.data.id[0],
                      type: 'negative'
                    })
                  }
                }
              })
            } else {
              this.createCampaignAction(formFieldData).then((response) => {
                this.campaignData = Object.assign({}, JSON.parse(JSON.stringify(response)))
                if (typeof this.campaignData.errors !== 'undefined') {
                  delete this.campaignData.errors
                }
                this.manipulateSaveData()
                this.$router.push({ name: 'Update Campaign', params: { campaignId: response.id }})
                resolve(response)
              })
            }
          } else {
            this.setNotification({
              title: 'Campaign Creation Failed',
              message: 'Validation Failed',
              type: 'negative'
            })
            reject(this.$v.campaignData.$error)
          }
        })
      },
      getCommissionWeeksData () {
        let query = {
          filter_type: 'current_future',
          limit: 15
        }
        this.getCommissionWeekSearchAction(query)
      }
    }
  }
</script>
<style lang="stylus">
    .campaign-rules
        background-color #26a69a

    .campaign-rules + div
        border solid 1px #26a69a
    
    .checkbox-list-container
        margin-left: 20px;
        max-height 210px
        overflow-y auto
        overflow-x hidden 
        border 1px solid #e0e0e0
    
    .campaign-rule-wrapper
        background-color #c0c0c0
        padding 10px
        margin-top 10px
        margin-bottom 10px

    .campaign-rule-container
      background-color #ffffff

    .campaign-rule-title
      font-size 16px
      font-weight bold
      padding-left 20px
      padding-top 10px

    .campaign-rule-content
      padding 10px

    .campaign-rule-item-wrapper
      background-color #e0e0e0
      padding 5px
      margin-top: 5px;
      margin-bottom: 5px;

    .campaign-rule-item-container
      background-color #ffffff

    .campaign-rule-item-title
      padding-left 10px
      font-weight bold

    .campaign-rule-reward-wrapper
      border solid 1px #26a69a
      padding 20px
</style>
