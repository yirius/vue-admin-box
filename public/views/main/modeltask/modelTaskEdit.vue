<template>
  <el-dialog
      v-model="dialogVisible"
      title="新增视频"
      width="80%"
      style="height: 100%">
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="视频来源">
          <el-select v-model="formInline.source" @change="onSubmit">
            <el-option label="素材库视频" value="videoMaterial"/>
            <el-option label="抖音号主页视频" value="awemeAccount"/>
          </el-select>
        </el-form-item>
        <el-form-item label="视频名称">
          <el-input v-model="formInline.title" @change="onSubmit"/>
        </el-form-item>
        <el-form-item label="视频ID">
          <el-input v-model="formInline.videoId" @change="onSubmit"/>
        </el-form-item>
      </el-form>

      <div
          v-infinite-scroll="onLoad"
          infinite-scroll-immediate="false"
          infinite-scroll-delay="500">
        <el-col :xs="24" :span="6" v-for="(item,index) in videoLists"
                :key="index">
          <div class="grayBox">
            <el-card>

              <template #header>
                <div class="card-header">
                  <el-button type="success" :icon="Plus" circle @click="addCreative(index)"/>
                </div>
              </template>

              <el-image :preview-src-list="newVideoSrcList" style="width: 80%; "
                        :src="item.videoCoverUrl"
                        :fit="fill"
                        v-if="isNotNull(item.videoCoverUrl)"/>
              <el-image :preview-src-list="newVideoSrcList" style="width: 80%;"
                        :src="item.posterUrl"
                        :fit="fill" v-if="isNotNull(item.posterUrl)"/>
              <div v-if="isNotNull(item.fileName)"
                   style="width: 90%;" :title='item.fileName'>
                <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;">{{
                    item.fileName
                  }}</span>
              </div>

              <div v-if="isNotNull(item.title)" :title='item.title'>
                <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block; width: 90%;">
                  {{ item.title }}</p>
              </div>


            </el-card>
          </div>
        </el-col>


      </div>


    </el-row>

    <el-empty v-loading="onLoadLoading" v-if="onLoadLoading" description="加载中">

    </el-empty>

  </el-dialog>

  <ThinkerFormLayer :layer="layer" @confirm="modeltask_modeltaskedit_form_layer_submit"
                    ref="modeltask_modeltaskedit_form_layer">
    <el-scrollbar>
      <el-form labelWidth="120px" ref="modeltask_modeltaskedit_form" :rules="rules"
               :model="modeltask_modeltaskedit_form_formValue">
        <el-row>

          <el-col :xs="24" :span="24">
            <el-col :span="12">
              <el-form-item label="广告主" prop="advertiser">
                <el-select v-model="modeltask_modeltaskedit_form_formValue.advertiserId" placeholder="Select"
                           @change="getLiveRoomsAndCrowds($event, modeltask_modeltaskedit_form_formValue.advertiserId)"
                           :disabled="true">
                  <el-option v-for="adv in layer.advertisers" :value="adv.advertiserId" :label="adv.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-col>

          <el-col :xs="24" :span="24">
            <el-form-item prop="campaignId" label="广告组ID">
              <el-input v-model="modeltask_modeltaskedit_form_formValue.campaignId" prop="campaignId"
                        label="广告组ID"></el-input>
            </el-form-item>
          </el-col>


          <el-col :xs="24" :span="24">
            <el-form-item prop="awemeId" label="直播间">
              <el-select v-model="modeltask_modeltaskedit_form_formValue.awemeId" filterable placeholder="Select">
                <el-option v-for="r in liveRoomToShow" :label="r.awemeName" :key="r.awemeId"
                           :value="r.awemeId">
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>


          <el-col :xs="24" :span="24">
            <el-form-item prop="name" label="计划名称">
              <el-input v-model="modeltask_modeltaskedit_form_formValue.name" prop="name" label="计划名称"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-divider border-style="dashed">投放设置</el-divider>
          <el-form labelWidth="120px" ref="deliverySetting" :rules="delivery_setting_rules"
                   :model="modeltask_modeltaskedit_form_formValue.deliverySetting">
            <el-row>
              <!--        <el-form-item prop="deliverySetting" label="投放设置">-->
              <!--          <el-input v-model="modeltask_modeltaskedit_form_formValue.deliverySetting" prop="deliverySetting"-->
              <!--                    label="投放设置"></el-input>-->
              <!--        </el-form-item>-->
              <el-col :xs="24" :span="24">
                <div style="text-align: left;">
                  <el-form-item prop="smart_bid_type" label="投放场景">
                    <el-radio-group v-model="modeltask_modeltaskedit_form_formValue.deliverySetting.smart_bid_type"
                                    @change="handleChange">
                      <el-radio-button label="SMART_BID_CUSTOM"> 控成本投放</el-radio-button>
                      <el-radio-button label="SMART_BID_CONSERVATIVE"> 放量投放</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :xs="24" :span="24"
                      v-if="modeltask_modeltaskedit_form_formValue.deliverySetting.smart_bid_type==='SMART_BID_CUSTOM'">
                <div style="text-align: left;">
                  <el-form-item prop="flow_control_mode" label="投放速度">
                    <el-radio-group v-model="modeltask_modeltaskedit_form_formValue.deliverySetting.flow_control_mode"
                                    @change="handleChange">
                      <el-radio-button label="FLOW_CONTROL_MODE_FAST">尽快投放</el-radio-button>
                      <el-radio-button label="FLOW_CONTROL_MODE_BALANCE">均匀投放</el-radio-button>
                      <el-radio-button label="FLOW_CONTROL_MODE_SMOOTH">严格控制成本上限</el-radio-button>

                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :xs="24" :span="24">
                <div style="text-align: left;">

                  <el-form-item prop="external_action" label="转化目标">
                    <el-radio-group v-model="externalAction"
                                    @change="handleChange">
                      <el-radio-button label="PAY_ROI">支付ROI</el-radio-button>
                      <el-radio-button label="AD_CONVERT_TYPE_LIVE_ENTER_ACTION">进入直播间</el-radio-button>
                      <el-radio-button label="AD_CONVERT_TYPE_LIVE_CLICK_PRODUCT_ACTION">直播间商品点击</el-radio-button>
                      <el-radio-button label="AD_CONVERT_TYPE_LIVE_SUCCESSORDER_ACTION">直播间下单</el-radio-button>
                      <el-radio-button label="AD_CONVERT_TYPE_NEW_FOLLOW_ACTION">直播间粉丝提升</el-radio-button>
                      <el-radio-button label="AD_CONVERT_TYPE_LIVE_COMMENT_ACTION">直播间评论</el-radio-button>
                      <el-radio-button label="AD_CONVERT_TYPE_LIVE_SUCCESSORDER_PAY">直播间成交</el-radio-button>
                    </el-radio-group>
                  </el-form-item>


                </div>
              </el-col>

              <el-col :span="24"
                      v-if="externalAction==='AD_CONVERT_TYPE_LIVE_ENTER_ACTION'||externalAction==='AD_CONVERT_TYPE_LIVE_CLICK_PRODUCT_ACTION'">
                <div style="text-align: left;">
                  <el-form-item prop="deep_external_action">
                    <el-checkbox v-model="deepExternalAction" label="同时优化【直播间下单】"/>
                  </el-form-item>
                </div>
              </el-col>


              <el-col :span="24"
                      v-if="externalAction==='PAY_ROI'">
                <div style="text-align: left;">
                  <el-form-item label="支付ROI目标" prop="roi_goal">
                    <el-input type="number" v-model="modeltask_modeltaskedit_form_formValue.deliverySetting.roi_goal"/>
                  </el-form-item>
                </div>
              </el-col>


              <el-col :xs="24" :span="24">

                <div style="text-align: left;">
                  <el-form-item prop="budget_mode" label="预算类型">
                    <el-radio-group v-model="modeltask_modeltaskedit_form_formValue.deliverySetting.budget_mode">
                      <el-radio-button label="BUDGET_MODE_DAY">日预算</el-radio-button>
                      <el-radio-button label="BUDGET_MODE_TOTAL">总预算</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>

              </el-col>


              <el-col :xs="24" :span="24">
                <el-form-item prop="budget" label="预算">
                  <el-input v-model.trim="modeltask_modeltaskedit_form_formValue.deliverySetting.budget"
                            @change="handleBudgetChange"
                            oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                </el-form-item>
              </el-col>


              <el-col :xs="24" :span="24"
                      v-if="modeltask_modeltaskedit_form_formValue.deliverySetting.smart_bid_type==='SMART_BID_CUSTOM'">
                <el-form-item prop="cpa_bid" label="转化出价">
                  <el-input v-model.trim="modeltask_modeltaskedit_form_formValue.deliverySetting.cpa_bid"
                            oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-divider border-style="dashed">人群定向</el-divider>
          <el-form labelWidth="200px" ref="audience" :rules="audience_rules"
                   :model="modeltask_modeltaskedit_form_formValue.audience">
            <el-row>
              <el-col :xs="24" :span="24">
                <div style="text-align: left;">
                  <el-form-item prop="district" label="地域定向类型">
                    <el-radio-group v-model="districtToShow"
                                    @change="handleDistrictChange">
                      <el-radio-button label="NONE"> 不限</el-radio-button>
                      <el-radio-button label="CITY"> 省市</el-radio-button>
                      <el-radio-button label="COUNTY">区县</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :xs="24" :span="24" v-if="districtBoolen">
                <el-form-item prop="city" label="具体定向的城市列表">
                  <el-cascader
                      ref="cityCas"
                      :options="options"
                      :props="cas_props"
                      @change="handleCasChange"
                      collapse-tags
                      v-model="cityToShow"
                      clearable></el-cascader>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :span="24" v-if="districtBoolen">
                <div style="text-align: left;">
                  <el-form-item prop="location_type" label="地域定向的用户状态类型">
                    <el-radio-group v-model="modeltask_modeltaskedit_form_formValue.audience.location_type">
                      <el-radio-button label="CURRENT"> 正在该地区的用户</el-radio-button>
                      <el-radio-button label="HOME"> 居住在该地区的用户</el-radio-button>
                      <el-radio-button label="TRAVEL">到该地区旅行的用户</el-radio-button>
                      <el-radio-button label="ALL">该地区内的所有用户</el-radio-button>

                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>


              <el-col :xs="24" :span="24">
                <div style="text-align: left;">
                  <el-form-item prop="gender" label="性别">


                    <el-radio-group v-model="modeltask_modeltaskedit_form_formValue.audience.gender">
                      <el-radio-button label="NONE"> 不限</el-radio-button>
                      <el-radio-button label="GENDER_MALE"> 男性</el-radio-button>
                      <el-radio-button label="GENDER_FEMALE">女性</el-radio-button>

                    </el-radio-group>

                    <!--                <el-checkbox-group v-model="modeltask_modeltaskedit_form_formValue.audience.gender" @change="handleNoneChange($event,'gender')">-->
                    <!--                  <el-checkbox-button :label="'NONE'">不限</el-checkbox-button>-->
                    <!--                  <el-checkbox-button :label="'GENDER_MALE'" >男性</el-checkbox-button>-->
                    <!--                  <el-checkbox-button :label="'GENDER_FEMALE'" >女性</el-checkbox-button>-->
                    <!--                </el-checkbox-group>-->
                  </el-form-item>
                </div>

              </el-col>

              <el-col :xs="24" :span="24">

                <div style="text-align: left;">
                  <el-form-item prop="age" label="年龄">
                    <el-checkbox-group v-model="modeltask_modeltaskedit_form_formValue.audience.age"
                                       @change="handleNoneChange($event,'age')">
                      <el-checkbox-button :label="'NONE'">不限</el-checkbox-button>
                      <el-checkbox-button :label="'AGE_BETWEEN_18_23'">18-23</el-checkbox-button>
                      <el-checkbox-button :label="'AGE_BETWEEN_24_30'">24-30</el-checkbox-button>
                      <el-checkbox-button :label="'AGE_BETWEEN_31_40'">31-40</el-checkbox-button>
                      <el-checkbox-button :label="'AGE_BETWEEN_41_49'">41-49</el-checkbox-button>
                      <el-checkbox-button :label="'AGE_ABOVE_50'">50岁以上</el-checkbox-button>
                    </el-checkbox-group>
                  </el-form-item>
                </div>

              </el-col>

              <!--          <el-col :xs="24" :span="24">-->
              <!--            <el-form-item prop="aweme_fan_behaviors" label="抖音用户行为类型">-->
              <!--              <el-input v-model="modeltask_modeltaskedit_form_formValue.audience.aweme_fan_behaviors"-->
              <!--                        prop="aweme_fan_behaviors"-->
              <!--                        label="抖音用户行为类型"></el-input>-->
              <!--            </el-form-item>-->
              <!--          </el-col>-->
              <!--          <el-col :xs="24" :span="24">-->
              <!--            <el-form-item prop="aweme_fan_behaviors_days" label="抖音达人互动用户行为天数">-->
              <!--              <el-input v-model="modeltask_modeltaskedit_form_formValue.audience.aweme_fan_behaviors_days"-->
              <!--                        prop="aweme_fan_behaviors_days" label="抖音达人互动用户行为天数"></el-input>-->
              <!--            </el-form-item>-->
              <!--          </el-col>-->

              <el-col :xs="24" :span="24">
                <div style="text-align: left;">
                  <el-form-item prop="autoExtendEnabled" label="是否启用智能放量">
                    <el-radio-group v-model="modeltask_modeltaskedit_form_formValue.audience.auto_extend_enabled"
                                    @change="handleCreativeMaterialModeChange">
                      <el-radio-button label="1"> 是</el-radio-button>
                      <el-radio-button label="0"> 否</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :xs="24" :span="24">
                <div style="text-align: left;">
                  <el-form-item prop="auto_extend_targets" label="可放开定向列表">
                    <el-col :span="12">
                      <div style="padding-right: 10px;">
                        <el-checkbox-group v-model="modeltask_modeltaskedit_form_formValue.audience.auto_extend_targets"
                                           :disabled="!autoTargetsBoolen">
                          <el-checkbox-button :label="'AGE'">年龄</el-checkbox-button>
                          <el-checkbox-button :label="'REGION'">地域</el-checkbox-button>
                          <el-checkbox-button :label="'GENDER'">性别</el-checkbox-button>
                          <el-checkbox-button :label="'INTEREST_ACTION'">行为兴趣</el-checkbox-button>
                          <el-checkbox-button :label="'CUSTOM_AUDIENCE'">更多人群-自定义人群</el-checkbox-button>
                        </el-checkbox-group>
                      </div>

                    </el-col>
                    <el-col :span="12">
                      <div style="padding-left: 10px;padding-right: 10px;">
                        <el-checkbox v-model="checkAll" @change="handleCheckAutoAllChange"
                                     :disabled="!autoTargetsBoolen">
                          全选
                        </el-checkbox>

                      </div>
                    </el-col>


                  </el-form-item>
                </div>
              </el-col>

              <!--          <el-col :xs="24" :span="24">-->
              <!--            <el-form-item prop="smart_interest_action" label="行为兴趣意向定向模式">-->
              <!--              <el-input v-model="modeltask_modeltaskedit_form_formValue.audience.smart_interest_action"-->
              <!--                        prop="smart_interest_action" label="行为兴趣意向定向模式"></el-input>-->
              <!--            </el-form-item>-->
              <!--          </el-col>-->


              <el-col :xs="24" :span="24">


                <div style="text-align: left;">
                  <el-form-item prop="platform" label="投放平台">
                    <el-radio-group v-model="modeltask_modeltaskedit_form_formValue.audience.platform">
                      <el-radio-button label="">全选</el-radio-button>
                      <el-radio-button label="ANDROID"> 安卓</el-radio-button>
                      <el-radio-button label="IOS">IOS</el-radio-button>

                    </el-radio-group>

                    <!--                <el-checkbox-group v-model="modeltask_modeltaskedit_form_formValue.audience.gender" @change="handleNoneChange($event,'gender')">-->
                    <!--                  <el-checkbox-button :label="'NONE'">不限</el-checkbox-button>-->
                    <!--                  <el-checkbox-button :label="'GENDER_MALE'" >男性</el-checkbox-button>-->
                    <!--                  <el-checkbox-button :label="'GENDER_FEMALE'" >女性</el-checkbox-button>-->
                    <!--                </el-checkbox-group>-->
                  </el-form-item>
                </div>
              </el-col>
              <el-col :xs="24" :span="24">
                <div style="text-align: left;">
                  <el-form-item prop="ac" label="网络类型">
                    <el-checkbox-group v-model="acShow"
                                       @change="handleNoneChange($event,'acShow')">
                      <el-checkbox-button :label="'NONE'">不限</el-checkbox-button>
                      <el-checkbox-button :label="'WIFI'">WIFI</el-checkbox-button>
                      <el-checkbox-button :label="'2G'">2G</el-checkbox-button>
                      <el-checkbox-button :label="'3G'">3G</el-checkbox-button>
                      <el-checkbox-button :label="'4G'">4G</el-checkbox-button>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>

          <el-divider border-style="dashed">创意设置</el-divider>


          <el-col :xs="24" :span="24">
            <div style="text-align: left;">
              <el-form-item prop="imageMode" label="创意形式">
                <el-radio-group v-model="imageMode"
                                @change="handleImageModeChange" :disabled="true">
                  <el-radio-button label="AWEME_LIVE_ROOM">直播间画面</el-radio-button>
                  <el-radio-button label="VIDEO">视频</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>

          </el-col>

          <el-col :xs="24" :span="24" v-if="imageMode!='AWEME_LIVE_ROOM'">
            <div style="text-align: left;">
              <el-form-item prop="creativeMaterialMode" label="创意类型">
                <el-radio-group v-model="modeltask_modeltaskedit_form_formValue.creativeMaterialMode"
                                :disabled="true">
                  <el-radio-button label="CUSTOM_CREATIVE"> 自定义创意</el-radio-button>
                  <el-radio-button label="PROGRAMMATIC_CREATIVE"> 程序化创意</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>

          </el-col>


          <!--          <el-col :span="24">-->
          <!--            <div style="width: 80%;margin-left: auto;margin-right: auto;">-->
          <!--              <el-divider border-style="dotted">素材选择</el-divider>-->
          <!--            </div>-->
          <!--          </el-col>-->
          <el-form-item label="素材选择" v-if="imageMode!='AWEME_LIVE_ROOM'">
            <el-col :xs="24" :span="24">
              <div style="text-align: left; padding-left: 10px;width: 100%;">
                <el-button @click="dialogVisible=true">添加视频</el-button>
              </div>

            </el-col>

          </el-form-item>

          <el-form-item v-if="imageMode!='AWEME_LIVE_ROOM'">
            <el-col :xs="24" :span="24" v-for="(item,index) in modeltask_modeltaskedit_form_formValue.creativeList"
                    :key="index">
              <el-form-item>
                <div class="grayBox">

                  <el-card>

                    <template #header>
                      <div class="card-header">
                        <el-button type="danger" :icon="Delete" circle @click="deleteCreative(index)"/>
                      </div>
                    </template>

                    <el-container>


                      <el-aside width="155.6px"
                                v-if=" isNotNull(getVideoValue(item.video_material.video_id ,'posterUrl'))||isNotNull(getVideoValue(item.video_material.aweme_item_id ,'videoCoverUrl') )">
                        <el-image :preview-src-list="srcList" style="width: 80%; "
                                  :src="getVideoValue(item.video_material.aweme_item_id ,'videoCoverUrl')"
                                  :fit="fill"
                                  v-if="isNotNull(getVideoValue(item.video_material.aweme_item_id ,'videoCoverUrl') )"/>
                        <el-image :preview-src-list="srcList" style="width: 80%;"
                                  :src="getVideoValue(item.video_material.video_id ,'posterUrl')"
                                  :fit="fill"
                                  v-if="isNotNull(getVideoValue(item.video_material.video_id ,'posterUrl'))"/>
                        <div v-if="isNotNull(getVideoValue(item.video_material.video_id ,'fileName'))">
                          <span>{{ getVideoValue(item.video_material.video_id, 'fileName') }}</span>
                        </div>
                        <div v-if="isNotNull(item.video_material.aweme_item_id)">
                          <span>抖音号主页视频</span>
                        </div>
                      </el-aside>
                      <el-main>
                        <div>
                          <el-empty style="align: center;"
                                    :description="'该视频不可用\n视频ID:'+item.video_material.video_id +'\n' + '抖音视频ID:'+item.video_material.aweme_item_id "
                                    v-if="!isNotNull(getVideoValue(item.video_material.video_id ,'posterUrl'))&&!isNotNull(getVideoValue(item.video_material.aweme_item_id ,'videoCoverUrl') )"/>

                          <el-form-item prop="title_material" label="视频文案">
                            <el-input v-model="item.title_material.title" prop="title_material"
                                      label="视频文案" :autosize="{ minRows: 2, maxRows:4 }" type="textarea"
                                      :disabled="!isNotNull(item.video_material.video_cover_id)"></el-input>
                          </el-form-item>
                        </div>
                      </el-main>
                    </el-container>


                  </el-card>

                </div>
              </el-form-item>
            </el-col>
          </el-form-item>


          <el-col :xs="24" :span="24" v-if="imageMode!='AWEME_LIVE_ROOM'">
            <div style="text-align: left;">
              <el-form-item prop="isHomepageHide" label="抖音主页隐藏视频">
                <el-radio-group v-model="modeltask_modeltaskedit_form_formValue.isHomepageHide">
                  <el-radio-button label="1"> 隐藏</el-radio-button>
                  <el-radio-button label="0"> 不隐藏</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>

          <el-col :xs="24" :span="24">
            <el-form-item prop="creativeType" label="创意分类">
              <el-cascader
                  :options="industryOptions"
                  :props="{emitPath: true}"
                  collapse-tags
                  v-model="creativeType"
                  clearable></el-cascader>
            </el-form-item>
          </el-col>


          <el-col :xs="24" :span="24">
<!--            <el-form-item label="创意标签" prop="adKeywords">-->
<!--              <CreativeTag v-model="modeltask_modeltaskedit_form_formValue.adKeywords"></CreativeTag>-->
<!--            </el-form-item>-->
              <el-form-item label="创意标签" prop="adKeywords">
                <el-tag
                    :key="tag"
                    v-for="tag in modeltask_modeltaskedit_form_formValue.adKeywords"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                  {{ tag }}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </el-form-item>

          </el-col>


        </el-row>
      </el-form>

      <div>
        <el-button type="primary" @click="modeltask_modeltaskedit_form_layer_submit">确认</el-button>
        <el-button @click="layer.show=false">取消</el-button>
      </div>


    </el-scrollbar>


  </ThinkerFormLayer>

</template>

<script lang="ts">
// 进行导入模块的渲染

import ThinkerFormLayer from "./layer_drawer.vue"
import {getRequest, postRequest, putRequest} from "@/api/request"
import {defineComponent, ref, unref, reactive, toRaw} from "vue"
import {Plus, Connection, CirclePlus, Delete} from "@element-plus/icons";
import {ElMessage, ElMessageBox} from "element-plus"
import CreativeTag from "/views/market_plugins/diy/creative_tag.vue";


export default defineComponent({
  components: {ThinkerFormLayer,CreativeTag},
  data() {
    return {
      cas_props: {multiple: true, emitPath: false},

      audience_rules: {},
      delivery_setting_rules: {
        budget: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateBudget, trigger: 'blur'},
        ],
        cpa_bid: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateCpaBid, trigger: 'blur'}
        ],
        roi_goal: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateRoiGoal, trigger: 'blur'}
        ],
      },
      rules: {},

    }
  },
  setup(props, ctx) {
    const setupRunData = () => {
    }
    const getDataParse = (sendData) => {
    }
    const onLoadLoading = ref(false);
    const creativeListsToShow = ref([]);
    const srcList = ref([]);
    const acShow = ref([]);
    const industryOptions = ref([]);
    const creativeType = ref([]);


    const checkAll = ref(false);
    if (props.layer && props.layer.rowData) {
      modeltask_modeltaskedit_form_formValue.value = JSON.parse(JSON.stringify(props.layer.rowData))
      setupRunData();
    } else if (props.layer && props.layer.rowIdKey) {
      let url = "/api/modeltask/getOriginCacheModelTask";

      let sendData = {
        cacheId: props.layer.rowIdKey,
        planType: props.layer.planType
      };
      getRequest("/api/modeltask/getEditData").then(response => {
        industryOptions.value = response.data
      })

      getDataParse(sendData);
      getRequest(url, sendData).then(response => {
        let values = modeltask_modeltaskedit_form_formValue.value;
        creativeType.value.push(parseInt(response.data.firstIndustryId.toString()).toString())
        creativeType.value.push(parseInt(response.data.secondIndustryId.toString()).toString())
        creativeType.value.push(parseInt(response.data.thirdIndustryId.toString()).toString())
        for (var i in values) {

          if (i == "adKeywords") {
            var adKeyWords = eval("(" + JSON.stringify(response.data[i]) + ")");
            values["adKeywords"] = adKeyWords;
          } else if (i == "advertiserId") {
            values[i] = parseInt(response.data[i]);
            liveRoomToShow.value = props.layer.liveRooms[values[i]]
            crowdToShow.value = props.layer.crowds[values[i]]
          } else if (i == "awemeId") {
            values[i] = parseInt(response.data[i]);
          } else if (i == "deliverySetting") {
            var map = eval("(" + JSON.stringify(response.data[i]) + ")");
            values[i] = map;
            if (map.external_action == "AD_CONVERT_TYPE_LIVE_SUCCESSORDER_PAY"
                && map.deep_external_action == "AD_CONVERT_TYPE_LIVE_PAY_ROI"
                && map.deep_bid_type == "MIN"){
              externalAction.value = "PAY_ROI"
            }else{
              externalAction.value = map.external_action
            }
            if (map.deep_external_action == "AD_CONVERT_TYPE_LIVE_SUCCESSORDER_ACTION") {
              deepExternalAction.value = true
            }
          } else if (i == "audience") {

            var map = eval("(" + JSON.stringify(response.data[i]) + ")");
            if (typeof map["city"] != "undefined") {
              cityToShow.value = eval("(" + map["city"] + ")");

            }
            if (typeof map['district'] != 'undefined') {
              districtToShow.value = map["district"];
            }
            if (typeof map["age"] == "undefined" || map["age"] == "NONE") {
              map["age"] = ["NONE"]
            }

            if (typeof map["gender"] == "undefined") {
              map["gender"] = "NONE"
            }
            map["ac"] = []
            values[i] = map;
          } else if (i == "creativeList") {
            var creativeList = eval("(" + JSON.stringify(response.data[i]) + ")");
            values[i] = creativeList;
            if (creativeList.length > 0) {
              if (creativeList[0]["image_mode"] == "AWEME_LIVE_ROOM") {
                imageMode.value = "AWEME_LIVE_ROOM"
              } else {
                imageMode.value = "VIDEO"
              }
              if (creativeList[0]["image_mode"] != "AWEME_LIVE_ROOM") {

                postRequest("/api/modeltask/getVideoDetail", {creativeLists: JSON.stringify(response.data[i])}).then(response1 => {

                  creativeListsToShow.value = eval("(" + response1.data + ")");

                  for (let j = 0; j < creativeList.length; j++) {
                    var creativeListsToShowValue = creativeListsToShow.value;


                    if (typeof creativeList[j]["video_material"]["aweme_item_id"] != "undefined" && creativeList[j]["video_material"]["aweme_item_id"] != 0) {
                      var awemeItemId = creativeList[j]["video_material"]["aweme_item_id"];
                      if (typeof creativeListsToShowValue[awemeItemId] == "undefined") {
                        continue
                      } else {
                        if (typeof creativeListsToShowValue[awemeItemId]["videoCoverUrl"] != "undefined") {
                          srcList.value.push(creativeListsToShowValue[awemeItemId]["videoCoverUrl"])
                        }
                      }

                    } else if (typeof creativeList[j]["video_material"]["video_id"] != "undefined") {
                      var videoId = creativeList[j]["video_material"]["video_id"];
                      if (typeof creativeListsToShowValue[videoId] == "undefined") {
                        continue
                      }
                      {
                        if (typeof creativeListsToShowValue[videoId]["posterUrl"] != "undefined") {
                          srcList.value.push(creativeListsToShowValue[videoId]["posterUrl"])
                        }
                      }
                    }
                  }

                })
              }
            }
          } else {
            if (typeof response.data[i] != "undefined") {
              values[i] = response.data[i];
            }
          }
        }
        postRequest("/restful/monitor/qcCity/getCityTypeTree", {}).then(response => {
          if (values["audience"]["district"] == "CITY") {
            options.value = response.data;
          }

          cityOptions.value = response.data;

        })
        postRequest("/restful/monitor/qcCity/getCityTree", {}).then(response => {
          if (values["audience"]["district"] == "COUNTY") {
            options.value = response.data;
          }
          countyOptions.value = response.data;
        })

        setupRunData();
      })
    }
    const dialogVisible = ref(false);
    const cityToShow = ref([])
    const imageMode = ref("")
    var planType = props.layer.planType;

    const modeltask_modeltaskedit_form_formValue = ref({
      "advertiserId": null,
      "campaignId": null,
      "marketingGoal": null,
      "promotionWay": null,
      "name": null,
      "awemeId": null,
      "deliverySetting": {},
      "audience": {},
      "creativeMaterialMode": null,
      "firstIndustryId": null,
      "secondIndustryId": null,
      "thirdIndustryId": null,
      "creativeList": [],
      "adKeywords": null,
      "platform": null,
      "ac": null,
      "isHomepageHide": null,
      "resultType": null
    });


    const inputValue = ref('')
    const inputVisible = ref(false)
    const videoLists = ref([])
    const hasMoreVideos = ref(true)

    const formInline = ref({source: "", title: "", videoId: ""})
    const externalAction = ref('')
    const districtToShow = ref('')
    const deepExternalAction = ref(false)
    const cityOptions = ref([])
    const countyOptions = ref([])
    const options = ref([])
    const liveRoomToShow = ref([])
    const crowdToShow = ref([])

    return {
      modeltask_modeltaskedit_form_formValue,
      Plus,
      Connection,
      CirclePlus,
      inputValue,
      inputVisible,
      Delete,
      hasMoreVideos,
      dialogVisible,
      formInline,
      videoLists,
      creativeListsToShow,
      srcList,
      onLoadLoading,
      checkAll,
      acShow,
      industryOptions,
      creativeType,
      externalAction,
      deepExternalAction,
      cityOptions,
      options,
      countyOptions,
      cityToShow,
      districtToShow,
      imageMode,
      liveRoomToShow,
      crowdToShow,
      planType
    };
  },
  props: {
    layer: {
      type: Object, default: () => {
        return {show: false, title: '', showButton: true}
      }
    },
  }, watch: {
    'modeltask_modeltaskedit_form_formValue.audience.district': function (newV, oldV) {
      if (newV == "CITY") {
        this.options = this.cityOptions
      } else if (newV == "COUNTY") {
        this.options = this.countyOptions
      } else if (newV == "NONE") {
        this.options = []
        this.modeltask_modeltaskedit_form_formValue.audience.city = []
      }
    },
    deepExternalAction: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.modeltask_modeltaskedit_form_formValue.deliverySetting.deep_external_action = "AD_CONVERT_TYPE_LIVE_SUCCESSORDER_ACTION";

        } else {
          delete this.modeltask_modeltaskedit_form_formValue.deliverySetting["deep_external_action"];
        }
      },
    }, externalAction: {
      handler(newVal, oldVal) {

        if (newVal == "PAY_ROI" && oldVal != "") {
          this.modeltask_modeltaskedit_form_formValue.deliverySetting.external_action = "AD_CONVERT_TYPE_LIVE_SUCCESSORDER_PAY";
          this.modeltask_modeltaskedit_form_formValue.deliverySetting.deep_external_action = "AD_CONVERT_TYPE_LIVE_PAY_ROI";
          this.modeltask_modeltaskedit_form_formValue.deliverySetting.deep_bid_type = "MIN";
        } else {
          this.modeltask_modeltaskedit_form_formValue.deliverySetting.external_action = newVal;
          if (typeof this.modeltask_modeltaskedit_form_formValue.deliverySetting.deep_external_action != 'undefined' && oldVal != "") {
            this.deepExternalAction = false;
            delete this.modeltask_modeltaskedit_form_formValue.deliverySetting["deep_external_action"];
          }
          if (typeof this.modeltask_modeltaskedit_form_formValue.deliverySetting.deep_bid_type != 'undefined' && oldVal != "") {
            delete this.modeltask_modeltaskedit_form_formValue.deliverySetting["deep_bid_type"];
          }

        }

      },
    }, creativeType: {
      handler(newVal, oldVal) {
        this.modeltask_modeltaskedit_form_formValue.firstIndustryId = newVal[0]
        this.modeltask_modeltaskedit_form_formValue.secondIndustryId = newVal[1]
        this.modeltask_modeltaskedit_form_formValue.thirdIndustryId = newVal[2]

      },
    }
  }, computed: {
    // 计算属性的 getter
    newVideoSrcList: function () {
      if (typeof this.videoLists[0]["posterUrl"] != "undefined") {
        return this.videoLists.map(x => x["posterUrl"])
      } else {
        return this.videoLists.map(x => x["videoCoverUrl"])
      }

    },

    autoTargetsBoolen: function () {
      return this.modeltask_modeltaskedit_form_formValue.audience.auto_extend_enabled == 1;

    },
    districtBoolen: function () {
      if (this.modeltask_modeltaskedit_form_formValue.audience.district == "NONE") {
        return false
      } else {
        return true
      }
    }
  }, methods: {
    getLiveRoomsAndCrowds(val, advId) {
      if (val != null && val != '' && val != undefined) {
        this.liveRoomToShow = this.layer.liveRooms[advId];
        // this.formValue.liveRoom = null;
        this.crowdToShow = this.layer.crowds[advId];
        // this.formValue.excludeCrowd = null;
        // this.formValue.includeCrowd = null;
      }
    },
    validateRoiGoal(rule, value, callback) {
      if (value.toString().indexOf(".") == 0) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length > 2) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length == 2) {
        if (value.toString().split(".")[1].length > 2) {
          return callback(new Error('最多支持两位小数'));
        }
      }
      const one = Number(value);
      var max = 100
      var min = 0.1;
      if (one < 0) {
        return callback(new Error('输入值必须大于0'));
      } else if (one > max) {
        return callback(new Error('输入值不得超过100'));
      } else if (one < min) {
        return callback(new Error('输入值最小' + min + '元'));

      }
      return callback();
    },
    validateCpaBid(rule, value, callback) {
      if (value.toString().indexOf(".") == 0) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length > 2) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length == 2) {
        if (value.toString().split(".")[1].length > 2) {
          return callback(new Error('最多支持两位小数'));
        }
      }
      const one = Number(value);
      var max = this.modeltask_modeltaskedit_form_formValue.deliverySetting.budget
      var min = 0.1;
      if (one < 0) {
        return callback(new Error('输入值必须大于0'));
      } else if (one > max) {
        return callback(new Error('输入值不得超过预算'));
      } else if (one < min) {
        return callback(new Error('输入值最小' + min + '元'));

      }
      return callback();
    },
    validateBudget(rule, value, callback) {
      if (value.toString().indexOf(".") == 0) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length > 2) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length == 2) {
        console.log(value.toString().split("."))
        console.log(value.toString().split(".")[1])
        console.log(value.toString().split(".")[1].length)
        if (value.toString().split(".")[1].length > 2) {
          console.log(value.toString().split(".")[1])
          console.log(value.toString().split(".")[1].length)
          return callback(new Error('最多支持两位小数'));
        }
      }
      const one = Number(value);
      var max = 9999999.99
      var min = 300;
      if (this.modeltask_modeltaskedit_form_formValue.deliverySetting.budget_mode == 'BUDGET_MODE_DAY') {
        max = 9999999.99
      } else if (this.modeltask_modeltaskedit_form_formValue.deliverySetting.budget_mode == 'BUDGET_MODE_TOTAL') {

      }

      if (one < 0) {
        return callback(new Error('输入值必须大于0'));
      } else if (one > max) {
        return callback(new Error('输入值最大' + max + '元'));
      } else if (one < min) {
        return callback(new Error('输入值最小' + min + '元'));

      }
      return callback();
    },
    onSubmit() {
      this.videoLists = [];
      postRequest("/api/modeltask/getNewVideo", {
        data: JSON.stringify(this.formInline),
        num: this.videoLists.length,
        advertiserId: this.modeltask_modeltaskedit_form_formValue.advertiserId
      }).then(response => {
        this.hasMoreVideos = true;

        var newVideos = eval("(" + response.data + ")");
        console.log(newVideos)
        this.videoLists = this.videoLists.concat(newVideos)
        console.log(this.videoLists)
      });

    }, handleBudgetChange() {
      this.$refs.modeltask_modeltaskedit_form.validateField('budget');
    },

    onLoad() {
      if (this.hasMoreVideos) {
        this.onLoadLoading = true;
        postRequest("/api/modeltask/getNewVideo", {
          data: JSON.stringify(this.formInline),
          num: this.videoLists.length,
          advertiserId: this.modeltask_modeltaskedit_form_formValue.advertiserId
        }).then(response => {
          this.onLoadLoading = false;
          var newVideos = eval("(" + JSON.stringify(response.data) + ")");
          if (newVideos.length > 0) {
            this.videoLists = this.videoLists.concat(newVideos)
          } else {
            this.hasMoreVideos = false;
          }
        });
      }

    },
    addCreative(index) {
      var newCreative = {
        "video_material": {},
        "title_material": {
          "title": ""
        },
        "image_mode": "VIDEO_VERTICAL"
      }

      if (this.modeltask_modeltaskedit_form_formValue.creativeList.length == 10) {
        ElMessage.error('已选择10条视频，最多选择10条视频')
      } else if (this.modeltask_modeltaskedit_form_formValue.creativeList.length < 10) {
        var newVideo = this.videoLists[index];

        if (typeof newVideo["videoId"] != "undefined") {
          var videoIds = this.modeltask_modeltaskedit_form_formValue.creativeList.map(x => x["video_material"]["video_id"])
          var vi = videoIds.indexOf(newVideo["videoId"]);
          if (vi != -1) {
            ElMessage.error('该视频已经选中，选择失败')
            return
          }
          this.creativeListsToShow[newVideo["videoId"]] = newVideo
          this.srcList.push(newVideo["posterUrl"])
          newCreative["video_material"]["video_id"] = newVideo["videoId"]
          newCreative["video_material"]["video_cover_id"] = newVideo["videoCoverId"]
        } else if (typeof newVideo["awemeItemId"] != "undefined") {

          var awemeIds = this.modeltask_modeltaskedit_form_formValue.creativeList.map(x => x["video_material"]["aweme_item_id"])
          var awi = awemeIds.indexOf(newVideo["awemeItemId"]);
          if (awi != -1) {
            ElMessage.error('该视频已经选中，选择失败')
            return
          }
          this.creativeListsToShow[newVideo["awemeItemId"]] = newVideo
          this.srcList.push(newVideo["videoCoverUrl"])
          newCreative["video_material"]["aweme_item_id"] = newVideo["awemeItemId"]
          newCreative["title_material"]["title"] = newVideo["title"]
        }
        this.modeltask_modeltaskedit_form_formValue.creativeList.push(newCreative)
        var creativeLength = this.modeltask_modeltaskedit_form_formValue.creativeList.length
        ElMessage.success('添加成功，目前已选择' + creativeLength + "条视频")
      }
    },
    deleteCreative(index) {
      this.modeltask_modeltaskedit_form_formValue.creativeList.splice(index, 1)
      var creativeLength = this.modeltask_modeltaskedit_form_formValue.creativeList.length
      ElMessage.success('删除成功，目前已选择' + creativeLength + "条视频")
      console.log(this.modeltask_modeltaskedit_form_formValue)

    },
    handleClose(tag) {
      this.modeltask_modeltaskedit_form_formValue.adKeywords.splice(this.modeltask_modeltaskedit_form_formValue.adKeywords.indexOf(tag), 1);
    },
    handleCreativeMaterialModeChange(val) {
      if (val == 0) {
        this.modeltask_modeltaskedit_form_formValue.audience.auto_extend_targets = []
        this.checkAll = false
      }
    },
    handleCheckAutoAllChange(val) {
      if (val) {
        this.modeltask_modeltaskedit_form_formValue.audience.auto_extend_targets = ["AGE", "REGION", "GENDER", "INTEREST_ACTION", "CUSTOM_AUDIENCE"]
      } else {
        this.modeltask_modeltaskedit_form_formValue.audience.auto_extend_targets = []
      }
    },
    handleNoneChange(value, t) {
      console.log(value)
      if (t == "acShow") {
        var index = value.indexOf("NONE");
        this.modeltask_modeltaskedit_form_formValue.audience.ac = this.acShow
        if (index != -1) {
          if (index == value.length - 1) {
            this.acShow = ["NONE"]
            this.modeltask_modeltaskedit_form_formValue.audience.ac = []
          } else {
            this.acShow.splice(index, 1)
          }
        }

        console.log(this.acShow)
        console.log(this.modeltask_modeltaskedit_form_formValue.audience.ac)
      } else {
        console.log(this.modeltask_modeltaskedit_form_formValue.audience.age)
        var index = value.indexOf("NONE");
        if (index != -1) {
          if (index == value.length - 1) {
            if (t == "gender") {
              this.modeltask_modeltaskedit_form_formValue.audience.gender = ["NONE"]
            }
            if (t == "age") {
              this.modeltask_modeltaskedit_form_formValue.audience.age = ["NONE"]
            }
          } else {
            if (t == "gender") {
              this.modeltask_modeltaskedit_form_formValue.audience.gender.splice(index, 1)
            }
            if (t == "age") {
              this.modeltask_modeltaskedit_form_formValue.audience.age.splice(index, 1)
            }
          }

        }
      }


    },
    handleCasChange(value) {
      console.log(value)
      // console.log(this.$refs.cityCas.getCheckedNodes())
      // console.log(this.modeltask_modeltaskedit_form_formValue.audience.city)
      if (this.modeltask_modeltaskedit_form_formValue.audience.district == "CITY") {
        let checkArr = this.$refs.cityCas.getCheckedNodes()
        checkArr = checkArr.filter(item => !(item.parent && item.parent.checked))
        console.log(checkArr.map(x => x["value"]))
        console.log(this.modeltask_modeltaskedit_form_formValue.audience.city)
        this.modeltask_modeltaskedit_form_formValue.audience.city = checkArr.map(x => x["value"])
        console.log(this.modeltask_modeltaskedit_form_formValue.audience.city)
      } else if (this.modeltask_modeltaskedit_form_formValue.audience.district == "COUNTY") {
        this.modeltask_modeltaskedit_form_formValue.audience.city = this.cityToShow
        console.log(this.modeltask_modeltaskedit_form_formValue.audience.city)
      }
    },
    handleDistrictChange(newV) {
      console.log(newV)
      ElMessageBox.confirm(
          '如果更改，已选择的地区将被清空，是否继续?',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            this.modeltask_modeltaskedit_form_formValue.audience.district = newV
            this.cityToShow = []
            this.modeltask_modeltaskedit_form_formValue.audience.city = []
            if (newV == "CITY") {
              this.options = this.cityOptions
            } else if (newV == "COUNTY") {
              this.options = this.countyOptions
            } else if (newV == "NONE") {
              this.options = []
            }
          })
          .catch(() => {
            this.districtToShow = this.modeltask_modeltaskedit_form_formValue.audience.district
          })

    },
    handleChange(value) {
      console.log(value)
      console.log(this.deepExternalAction)
    },
    handleImageModeChange(value) {
      if (value == "AWEME_LIVE_ROOM") {
        ElMessageBox.confirm(
            '如果更改，已选择的视频将被清空，是否继续?',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
        )
            .then(() => {
              this.modeltask_modeltaskedit_form_formValue.creativeList = [{image_mode: "AWEME_LIVE_ROOM"}]
            })
            .catch(() => {
              if (value != "AWEME_LIVE_ROOM") {
                this.imageMode = "AWEME_LIVE_ROOM"
              } else {
                this.imageMode = "VIDEO"
              }
            })
      } else {
        this.modeltask_modeltaskedit_form_formValue.creativeList = []
        this.modeltask_modeltaskedit_form_formValue.isHomepageHide = 1
      }


    },
    // creativeListHandleChange(value) {
    //   this.modeltask_modeltaskedit_form_formValue.creativeList = JSON.stringify(this.modeltask_modeltaskedit_form_formValue.creativeListToShow);
    // },
    //
    // deliverySettingHandleChange(value) {
    //   this.modeltask_modeltaskedit_form_formValue.deliverySetting = JSON.stringify(this.modeltask_modeltaskedit_form_formValue.deliverySetting);
    // },
    // audienceHandleChange(value) {
    //   this.modeltask_modeltaskedit_form_formValue.audience = JSON.stringify(this.modeltask_modeltaskedit_form_formValue.audience);
    // },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    isNotNull(value) {
      var a = typeof value != "undefined";
      return a
    },
    getVideoValue(id, value) {
      if (typeof id == "undefined") {
        return id
      }
      if (typeof this.creativeListsToShow[id] != "undefined") {
        return this.creativeListsToShow[id][value]
      } else {
        return this.creativeListsToShow[id]
      }

    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.modeltask_modeltaskedit_form_formValue.adKeywords.push(inputValue);
      }

      this.inputVisible = false;
      this.inputValue = '';
    },
    modeltask_modeltaskedit_form_submitData() {
      let formValues = unref(this["modeltask_modeltaskedit_form_formValue"]);
      if (formValues.audience.district == "NONE") {
        delete formValues.audience["city"]
        delete formValues.audience["location_type"]
      }
      if (formValues.deliverySetting.smart_bid_type == "SMART_BID_CONSERVATIVE") {
        delete formValues.deliverySetting["flow_control_mode"]
      }

      if (formValues.audience.platform == "IOS") {
        formValues.audience.platform = ["IOS"]
      } else if (formValues.audience.platform == "ANDROID") {
        formValues.audience.platform = ["ANDROID"]
      } else {
        delete formValues.audience["platform"]
      }

      if (formValues.audience.age.indexOf("NONE") != -1) {
        formValues.audience.age = []
      }

      if (this.imageMode != "VIDEO") {
        if (typeof formValues.isHomepageHide != "undefined") {
          delete formValues.isHomepageHide
        }
      }

      if (this.externalAction != "PAY_ROI") {
        if (typeof formValues.deliverySetting.roi_goal != "undefined") {
          delete formValues.deliverySetting["roi_goal"]

        }
      }

      // 说明是新增
      postRequest("/api/modeltask/modifyModelTask", {
        taskValue: JSON.stringify(formValues),
        sqlId: this.layer.rowSqlIdKey,
        cacheId: this.layer.rowIdKey,
        planType: this.planType
      }).then(response => {
        this.$refs["modeltask_modeltaskedit_form_layer"].close()
        this.$emit('getTableData')
      });
    }
    , modeltask_modeltaskedit_form_validateData() {
      if (this.$refs["modeltask_modeltaskedit_form"]) {
        this.$refs["modeltask_modeltaskedit_form"].validate((valid) => {
          if (valid) {
            this.modeltask_modeltaskedit_form_submitData();
          } else {
            return false;
          }
        });
      } else {
        this.modeltask_modeltaskedit_form_submitData();
      }
    },
    modeltask_modeltaskedit_form_layer_submit() {

      if (this.$refs.modeltask_modeltaskedit_form) {
        this.$refs["modeltask_modeltaskedit_form"].validate((valid1) => {
          this.$refs.audience.validate((valid2) => {
            this.$refs.deliverySetting.validate((valid3) => {
              if (valid1 && valid2 && valid3) {
                this.modeltask_modeltaskedit_form_submitData();
              } else {
                ElMessage.error('参数不合法，请检查参数')
                return false;
              }
            })
          })

        });
      } else {
        this.modeltask_modeltaskedit_form_submitData();
      }
    }
    ,
  },
});
</script>

<style scoped>
.grayBox {
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 10px;
  margin-top: 10px;
}

.card-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.grayBox .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px;
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}

.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.el-row .el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all .5s;
}
</style>

