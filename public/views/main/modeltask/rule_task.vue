<template>

  <el-dialog
      v-model="dialogVisible"
      title="新增视频"
      width="80%"
      style="height: 100%">
    <el-scrollbar height="400px" always="ture" v-loading="creative_loading">
      <el-form :model="formInline" class="demo-form-inline" labelWidth="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="素材类型">
              <el-select v-model="formInline.creativeType">
                <el-option label="爆款" value="top"/>
                <el-option label="增强" value="strengthen"/>
                <el-option label="上新" value="new"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="素材统计天数" prop="creativeDayNum">
              <el-input v-model="formInline.creativeDayNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-show="formInline.creativeType == top">
            <el-form-item label="视频数量" prop="creativeNum">
              <el-input v-model="formInline.creativeNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="-12" v-show="formInline.creativeType == strengthen">
            <el-form-item label="有成交天数天数" prop="havePayNum">
              <el-input v-model="formInline.havePayNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="formInline.creativeType != top && formInline.creativeType != strengthen"></el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6">
            <el-button type="success" @click="onSubmit()">筛选视频</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div
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
              <el-image :preview-src-list="newVideoSrcList" style="width: 80%;"
                        :src="item.url"
                        :fit="fill" v-if="isNotNull(item.url)"/>
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
              <div v-if="isNotNull(item.stat_cost)" :title='item.stat_cost'>
                <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block; width: 90%;">
                  成本：{{ item.stat_cost }}</p>
              </div>
              <div v-if="isNotNull(item.pay_order_amount)" :title='item.pay_order_amount'>
                <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block; width: 90%;">
                  消耗：{{ item.pay_order_amount }}</p>
              </div>
              <div v-if="isNotNull(item.roi)" :title='item.roi'>
                <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block; width: 90%;">
                  ROI：{{ item.roi }}</p>
              </div>
            </el-card>
          </div>
        </el-col>
      </div>
    </el-scrollbar>
    <el-empty v-loading="onLoadLoading" v-if="onLoadLoading" description="加载中">
    </el-empty>
  </el-dialog>

  <el-dialog
      v-model="dialog3Visible"
      title="投放结果"
      width="50%">
    <el-row>
      <div style="margin: 15px" v-if="successful.length!=0">成功计划</div>
    </el-row>
    <el-row>
      <el-table style="margin-left: 15px" stripe v-if="successful.length!=0" :data="successful" style="width: 100%">
        <el-table-column width="55" label="id" prop="id"/>
        <el-table-column prop="ad_id" label="计划ID" :show-overflow-tooltip='true'/>
      </el-table>
    </el-row>
    <el-row>
      <div style="margin: 15px" v-if="failed.length!=0">失败计划</div>
    </el-row>
    <el-row>
      <el-table style="margin-left: 15px" stripe v-if="failed.length!=0" :data="failed" style="width: 100%">
        <el-table-column width="55" label="id" prop="id"/>
        <el-table-column prop="code" label="返回码" width="180" :show-overflow-tooltip='true'/>
        <el-table-column prop="message" label="具体信息" :show-overflow-tooltip='true'/>
      </el-table>
    </el-row>
  </el-dialog>

  <div class="box" v-loading="all_loading">
    <modeltaskModeltaskTableEditLayer :layer="ruletask_table_edit_layer_data"
                                      @getTableData="getTableData"
                                      v-if="ruletask_table_edit_layer_data.show" />
<!--    <AwemeFanSelect v-model="awemeFanValue"></AwemeFanSelect>-->
<!--    <Schedule v-model="schedule"></Schedule>-->
<!--    &lt;!&ndash;    <DistrictSelect :modelValue="dsValue"></DistrictSelect>&ndash;&gt;-->

<!--    <ActionInterestSelect v-model="aiValue"></ActionInterestSelect>-->
<!--    <div>-->
<!--      <QianchuanAudience v-model="audience" :goals="'LIVE_PROM_GOODS'" :promotionWay="'SIMPLE'" advertiser_id="1711685115933699"></QianchuanAudience>-->

<!--    </div>-->

<!--    <button @click="testActionInterestSelect">ActionInterestSelect</button>-->
<!--    <MarketUiEvent></MarketUiEvent>-->

    <el-row justify="center">
      <div style="text-align: left">
        <el-steps :active="active" finish-status="success">
          <el-step
              title="基础设置&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"/>
          <el-step
              title="素材选择&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"/>
          <el-step title="投放"/>
        </el-steps>
      </div>
    </el-row>
    <el-form ref="formRef" :model="formValue" :rules="rules" labelWidth="120px">
      <div v-show="active == 1">
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告主" prop="advertiser">
              <el-select v-model="formValue.advertiser" placeholder="Select"
                         @change="getLiveRoomsAndCrowds($event, formValue.advertiser)">
                <el-option v-for="adv in advertisers" :value="adv.advertiserId" :label="adv.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="直播间" prop="liveRoom">
              <el-select v-model="formValue.liveRoom" filterable placeholder="Select">
                <el-option v-for="r in liveRoomToShow" :label="r.awemeName" :key="r.awemeId"
                           :value="r.awemeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规则定向类型" prop="ruleType">
              <el-select v-model="formValue.ruleType" placeholder="Select">
                <el-option label="模型人群" value="模型人群"/>
                <el-option label="规定人群" value="规定人群"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出价最小值" prop="minBid">
              <el-input v-model.trim="formValue.minBid" @change="handleMinChange"
                        oninput="value=value.replace(/[^0-9+.]/g,'')"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出价最大值" prop="maxBid">
              <el-input v-model.trim="formValue.maxBid" @change="handleMaxChange"
                        oninput="value=value.replace(/[^0-9+.]/g,'')"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="支付ROI计划数量" prop="payRoiNum" labelWidth="150px">
              <el-input v-model="formValue.payRoiNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="直播间成交计划数量" prop="payNum" labelWidth="150px">
              <el-input v-model="formValue.payNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="下单计划数量" prop="createNum" labelWidth="150px">
              <el-input v-model="formValue.createNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="放量计划数量" prop="conservativeNum" labelWidth="150px">
              <el-input v-model="formValue.conservativeNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付ROI目标" prop="paiRoiTarget">
              <el-input v-model="formValue.paiRoiTarget"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划标题" prop="adTitle">
              <el-input :maxlength="10" v-model="formValue.adTitle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择人群包" prop="includeCrowd">
              <el-select v-model="formValue.includeCrowd" filterable multiple placeholder="Select">
                <el-option v-for="c in crowdToShow" :label="c.name" :key="c.retargetingTagsId"
                           :value="c.retargetingTagsId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排除人群包" prop="excludeCrowd">
              <el-select v-model="formValue.excludeCrowd" filterable multiple placeholder="Select">
                <el-option v-for="c in crowdToShow" :label="c.name" :key="c.retargetingTagsId"
                           :value="c.retargetingTagsId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排除城市" prop="excludedCity">
              <el-cascader
                  :options="options"
                  :props="props"
                  collapse-tags
                  v-model="formValue.excludedCity"
                  clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择城市" prop="includedCity">
              <el-cascader
                  :options="options"
                  :props="props"
                  collapse-tags
                  v-model="formValue.includedCity"
                  clearable></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-show="active == 2">
        <el-form-item label="素材选择" v-if="imageMode!='AWEME_LIVE_ROOM'">
          <el-col :xs="24" :span="24">
            <div style="text-align: left; padding-left: 10px;width: 100%;">
              <el-button @click="dialogVisible=true">添加视频</el-button>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item v-if="imageMode!='AWEME_LIVE_ROOM'">
          <el-col :xs="24" :span="12" v-for="(item,index) in formValue.creativeList"
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
                    <el-aside width="100px"
                              v-if=" isNotNull(getVideoValue(item.video_material.video_id ,'url'))||isNotNull(getVideoValue(item.video_material.aweme_item_id ,'videoCoverUrl') )">
                      <el-image :preview-src-list="srcList" style="width: 80%; "
                                :src="getVideoValue(item.video_material.aweme_item_id ,'videoCoverUrl')"
                                :fit="fill"
                                v-if="isNotNull(getVideoValue(item.video_material.aweme_item_id ,'videoCoverUrl') )"/>
                      <!--                      <el-image :preview-src-list="srcList" style="width: 80%;"-->
                      <!--                                :src="getVideoValue(item.video_material.video_id ,'posterUrl')"-->
                      <!--                                :fit="fill"-->
                      <!--                                v-if="isNotNull(getVideoValue(item.video_material.video_id ,'posterUrl'))"/>-->
                      <el-image :preview-src-list="srcList" style="width: 80%;"
                                :src="getVideoValue(item.video_material.video_id ,'url')"
                                :fit="fill"
                                v-if="isNotNull(getVideoValue(item.video_material.video_id ,'url'))"/>
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
                                  v-if="!isNotNull(getVideoValue(item.video_material.video_id ,'url'))&&!isNotNull(getVideoValue(item.video_material.aweme_item_id ,'videoCoverUrl'))"/>

                        <el-form-item>
                          <el-input v-model="item.title_material.title" prop="title_material"
                                    label="文案" :autosize="{ minRows: 2, maxRows:4 }" type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item prop="stat_cost" label="成本">
                          <p v-if="isNotNull(getVideoValue(item.video_material.video_id ,'stat_cost'))">
                            {{ getVideoValue(item.video_material.video_id, 'stat_cost') }}
                          </p>
                        </el-form-item>
                        <el-form-item prop="pay_order_amount" label="消耗">
                          <p v-if="isNotNull(getVideoValue(item.video_material.video_id ,'pay_order_amount'))">
                            {{ getVideoValue(item.video_material.video_id, 'pay_order_amount') }}
                          </p>
                        </el-form-item>
                        <el-form-item prop="roi" label="ROI">
                          <p v-if="isNotNull(getVideoValue(item.video_material.video_id ,'roi'))">
                            {{ getVideoValue(item.video_material.video_id, 'roi') }}
                          </p>
                        </el-form-item>
                      </div>
                    </el-main>
                  </el-container>
                </el-card>
              </div>
            </el-form-item>
          </el-col>
        </el-form-item>
      </div>
    </el-form>
    <div v-show="active == 3">
      <el-table :data="parsedPlans" style="width: 100%" v-loading="model_task_loading"
                @selection-change="handleSelectionChange" @row-click="clickRow">
        <el-table-column type="selection" width="55"/>
        <el-table-column width="55" label="id" prop="id"/>

        <!--          <el-table-column prop="advertiser_id" label="广告主" width="180" />-->
        <!--          <el-table-column prop="campaign_id" label="广告组" width="180" />-->
        <el-table-column v-for="(item, index) in parsedPlansColumns" :key="index" :label="item" :prop="item"
                         :show-overflow-tooltip='true' width="100">
          <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
          <template #default="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
      </el-table>
      <el-button type="success" :disabled="uploadDisavailability" @click="uploadPlan">上传计划</el-button>
    </div>
    <div id="footer">
      <el-button v-show="active == 1" style="margin-top: 12px" @click="checkCachedPlans">查看历史计划</el-button>
      <el-button v-show="active > 1&&!checkOld" style="margin-top: 12px" @click="pre">上一步</el-button>
      <el-button v-show="active < pageNum" style="margin-top: 12px" @click="next">下一步</el-button>
      <el-button v-show="active == pageNum" style="margin-top: 12px" @click="backToOne">返回首页</el-button>

    </div>
  </div>
</template>

<script>
import {getRequest, postRequest} from "@/api/request"
import {defineComponent, ref} from "vue"
import {CirclePlus, Connection, Delete, Plus} from "@element-plus/icons";
import {ElMessage} from "element-plus"
import ActionInterestSelect from "/views/market_plugins/action_interest_select.vue";
import Schedule from "/views/market_plugins/schedule.vue";
import AudienceTargeting from "/views/market_plugins/audience_targeting.vue";
import DistrictSelect from "/views/market_plugins/district_select.vue";
import AwemeFanSelect from "/views/market_plugins/aweme_fan_select.vue";
import MarketUiEvent from "/views/market_plugins/market_ui_event.vue";
import QianchuanAudience from "/views/market_plugins/qianchuan_audience.vue";
import modeltaskModeltaskTableEditLayer from "./modelTaskEdit.vue";


export default defineComponent({
  components: {
    QianchuanAudience,
    AwemeFanSelect, DistrictSelect, AudienceTargeting, Schedule, ActionInterestSelect, MarketUiEvent,modeltaskModeltaskTableEditLayer},

  data() {
    return {
      planType:"规则计划",
      limitBid: null,
      limitBudget: null,
      accessType: null,
      ruletask_table_edit_layer_data :{ "show": false, "showButton": true, "title": "编辑"},
      aiValue: {
        action_categories: [],
        action_days: 60,
        action_scene: ['E-COMMERCE', 'NEWS', 'APP'],
        action_words: [],
        interest_action_mode: "RECOMMEND",
        interest_categories: [],
        interest_words: [],
      },
      audience: {
      },
      //这个区域用不上。。。和千川的不一样
      // dsValue:{},
      // 用户定向有难点，value不一样。
      // atValue: {
      //   "age": ["GENDER_MALE"]
      // },
      // awemeFanValue: {
      //   aweme_fan_behaviors: [],// 抖音用户行为类型
      //   aweme_fan_accounts: [], //  抖音号id
      //   aweme_fan_categories: [], //  抖音类目id
      // },
      // schedule: '1111',
      active: 1,
      pageNum: 3,
      checkOld: false,
      cas_props: {multiple: true, emitPath: false},

      audience_rules: {},
      options: [],
      model_task_loading: false,
      all_loading: false,
      creative_loading: false,
      dialog1Visible: false,
      dialog2Visible: false,
      dialog3Visible: false,
      uploadDisavailability: true,
      chooseDisavailability: false,
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
      rules: {
        ratioOfPay: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateRatioOfPay, trigger: 'blur'},
        ],
        liveRoom: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        ruleType: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        conservativeNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        payRoiNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        paiRoiTarget: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        payNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        createNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        advertiser: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        // campaign: [
        //   {required: true, message: '必填项，请输入', trigger: 'blur'},
        // ],
        minBid: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateBid, trigger: 'blur'},
          {validator: this.validateMin, trigger: 'blur'},
        ],
        maxBid: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateBid, trigger: 'blur'},
          {validator: this.validateMax, trigger: 'blur'},
        ],
      },
      top: "top",
      strengthen: "strengthen",
      formValue: {
        ratioOfPay: null,
        maxBid: null,
        minBid: null,
        liveRoom: null,
        creativeList:[],
        advertiser: null,
        excludedCity: [],
        includedCity: [],
        includeCrowd: [],
        excludeCrowd: [],

        ifPeoplePack: null,
        conservativeNum: null,//放量计划数量
        payRoiNum: null,//支付ROI计划数量
        paiRoiTarget: null,//支付ROI目标
        payNum: null,//直播间成交计划数量
        createNum: null,
        adTitle: null,
        creativeDayNum: null,
        ruleType: null,
        creativeNum: null,
        havePayNum: null
      },
      plansToUpload: [],
      successful:[],
      failed:[],
      parsedPlans: [],
      parsedPlansColumns: [],
      advertisers: [],
      liveRooms: {},
      liveRoomToShow: [],
      crowds: {},
      crowdToShow: [],
    }
  },
  mounted() {
    this.getData();
    this.getCityTreeData();
  },
  setup() {
    const onLoadLoading = ref(false);
    const creativeListsToShow = ref([]);
    const srcList = ref([]);
    const roiList = ref([]);
    const scList = ref([]);
    const poaList = ref([]);
    const acShow = ref([]);
    const industryOptions = ref([]);
    const creativeType = ref([]);


    const checkAll = ref(false);
    const dialogVisible = ref(false);
    const cityToShow = ref([])
    const imageMode = ref("")

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
    const liveRoomToShow = ref([])
    const crowdToShow = ref([])

    return {
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
      roiList,
      scList,
      poaList,
      onLoadLoading,
      checkAll,
      acShow,
      industryOptions,
      creativeType,
      externalAction,
      deepExternalAction,
      cityOptions,
      countyOptions,
      cityToShow,
      districtToShow,
      imageMode,
      liveRoomToShow,
      crowdToShow
    };
  },
  watch: {
    // 'audience': function (newV, oldV) {
    //   console.log("newV", newV)
    //   console.log("oldV", oldV)
    //
    // }
  },
  methods: {
    clickRow(row,event,column){
      this.ruletask_table_edit_layer_data.rowIdKey = row['id'];
      this.ruletask_table_edit_layer_data.liveRooms = this.liveRooms;
      this.ruletask_table_edit_layer_data.advertisers = this.advertisers;
      this.ruletask_table_edit_layer_data.crowds = this.crowds;
      this.ruletask_table_edit_layer_data.planType = this.planType;
      this.ruletask_table_edit_layer_data.rowSqlIdKey = row['sql_id'];
      this.ruletask_table_edit_layer_data.show = true;
    },
    backToOne() {
      this.active = 1
    },
    checkCachedPlans() {
      this.active = this.pageNum
      this.checkOld = true;
    },

    next() {
      var valid = true;
      new Promise((resolve, reject) => {
        if (this.active==1){
          this.$refs.formRef.validate((valid1) => {
            if (!valid1) {
              valid = false;
              resolve(valid)
              ElMessage.error('参数不合法，请检查参数')
            }else{
              resolve(valid)
            }
          });
        }
        else if (this.active == 2) {
          if (this.formValue.creativeList.length==0) {
            ElMessage.error('尚未选择素材')
            valid = false;
            resolve(valid)
          }else{
            resolve(valid)
          }
        }
      }).then(res=>{
        if (res){
          if (this.active > this.pageNum - 1) {
            this.checkOld = false;
            this.active = 1
          } else {
            this.checkOld = false;
            this.active++
          }
          if (this.active == this.pageNum) {
            if (!this.checkOld) {
              this.choose();
            }
          }
        }
      })



    },
    pre() {
      if (this.active > 1) {
        this.active--
      }
    },
    handleSelectionChange(val) {
      // 获取到选中行的数据
      if (val.length == 0) {
        this.uploadDisavailability = true;
      } else {
        this.uploadDisavailability = false;
        var planArray = [];
        for (var i = 0; i < val.length; i++) {
          planArray.push(val[i].postData);
        }
        this.plansToUpload = planArray;
      }

    },
    uploadPlan() {
      if (this.plansToUpload.length != 0) {
        this.chooseDisavailability = true;
        this.uploadDisavailability = true;
        this.all_loading = true;
        postRequest("/api/modeltask/uploadPlan", {
          postData: JSON.stringify(this.plansToUpload),
          resultType: this.planType,
          planType: this.planType
        })
            .then(response => {
              this.getTableData()
              this.dialog3Visible = true;
              this.failed = response.data.result["failedIds"]
              this.successful = response.data.result["successfulIds"]
              this.chooseDisavailability = false;
              this.uploadDisavailability = false;
              this.all_loading = false;
            })
      }
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
    getTableData() {
      postRequest("/api/modeltask/getTableData",  {
        planType: this.planType
      }).then(response => {
        for (var i in response.data) {
          this[i] = response.data[i];
        }
      })
    },

    getData() {
      postRequest("/api/modeltask/getData", {}).then(response => {
        for (var i in response.data) {
          this[i] = response.data[i];
        }
      })
      this.getTableData();
    },
    getLiveRoomsAndCrowds(val, advId) {
      if (val != null && val != '' && val != undefined) {
        this.liveRoomToShow = this.liveRooms[advId];
        this.formValue.liveRoom = null;
        this.crowdToShow = this.crowds[advId];
        this.formValue.excludeCrowd = null;
        this.formValue.includeCrowd = null;
      }
    },

    getFormData() {
      const ret = {
        valid: null,
        form: null,
      };
      this.$refs.formRef.validate((valid) => {
        ret.valid = valid;
        ret.form = this.form;
      });
      return ret;
    },
    resetForm() {
      this.$refs.formRef.resetFields();
    },
    handleMinChange() {
      this.$refs.formRef.validateField('minBid');
    },
    handleMaxChange() {
      this.$refs.formRef.validateField('maxBid');
    },
    validateRatioOfPay(rule, value, callback) {
      if (value.toString().indexOf(".") == 0) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length > 2) {
        return callback(new Error('输入值必须合法数字'));
      }

      const one = Number(value);
      var max = 1
      if (one < 0) {
        return callback(new Error('输入值必须大于0'));
      } else if (one > max) {
        return callback(new Error('输入值超出限制'));
      }
      return callback();
    },
    validateBid(rule, value, callback) {
      if (value.toString().indexOf(".") == 0) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length > 2) {
        return callback(new Error('输入值必须合法数字'));
      }

      const one = Number(value);
      var max = 10000
      if (this.limitBid != null && this.accessType == 1) {
        max = this.limitBid
      }
      if (one < 0) {
        return callback(new Error('输入值必须大于0'));
      } else if (one > max) {
        return callback(new Error('输入值超出限制'));
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
      var min = 0.1;
      if (one < 0) {
        return callback(new Error('输入值必须大于0'));
      } else if (one < min) {
        return callback(new Error('输入值最小' + min + '元'));

      }
      return callback();
    },
    addCreative(index) {
      var newCreative = {
        "video_material": {},
        "title_material": {
          "title": ""
        },
        "image_mode": "VIDEO_VERTICAL"
      }

      if (this.formValue.creativeList.length == 100) {
        ElMessage.error('已选择100条视频，最多选择100条视频')
      } else if (this.formValue.creativeList.length < 100) {
        var newVideo = this.videoLists[index];
        if (typeof newVideo["videoId"] != "undefined") {
          var videoIds = this.formValue.creativeList.map(x => x["video_material"]["video_id"])
          var vi = videoIds.indexOf(newVideo["videoId"]);
          if (vi != -1) {
            ElMessage.error('该视频已经选中，选择失败')
            return
          }
          this.creativeListsToShow[newVideo["videoId"]] = newVideo
          this.roiList.push(newVideo["roi"])
          this.scList.push(newVideo["stat_cost"])
          this.poaList.push(newVideo["pay_order_amount"])
          this.srcList.push(newVideo["url"])
          newCreative["video_material"]["video_id"] = newVideo["videoId"]
          newCreative["video_material"]["video_cover_id"] = newVideo["videoCoverId"]
          newCreative["title_material"]["title"] = newVideo["title"]
        } else if (typeof newVideo["awemeItemId"] != "undefined") {

          var awemeIds = this.formValue.creativeList.map(x => x["video_material"]["aweme_item_id"])
          var awi = awemeIds.indexOf(newVideo["awemeItemId"]);
          if (awi != -1) {
            ElMessage.error('该视频已经选中，选择失败')
            return
          }
          this.creativeListsToShow[newVideo["awemeItemId"]] = newVideo
          this.roiList.push(newVideo["roi"])
          this.scList.push(newVideo["stat_cost"])
          this.poaList.push(newVideo["pay_order_amount"])
          this.srcList.push(newVideo["videoCoverUrl"])
          newCreative["video_material"]["aweme_item_id"] = newVideo["awemeItemId"]
          newCreative["title_material"]["title"] = newVideo["title"]
        }
        this.formValue.creativeList.push(newCreative)
        var creativeLength = this.formValue.creativeList.length
        ElMessage.success('添加成功，目前已选择' + creativeLength + "条视频")
      }
    },
    deleteCreative(index) {
      this.formValue.creativeList.splice(index, 1)
      var creativeLength = this.formValue.creativeList.length
      ElMessage.success('删除成功，目前已选择' + creativeLength + "条视频")
      // console.log(this.formValue)

    },
    isNotNull(value) {
      return typeof value != "undefined"
    },
    onSubmit() {
      var valid = true;
      if (typeof this.formInline.creativeType =="undefined"||this.formInline.creativeType==null){
        ElMessage.error("素材类型不得为空")
        valid = false
      }else{
        if (this.formInline.creativeType=="new"){
          if (typeof this.formInline.creativeDayNum=="undefined"||this.formInline.creativeDayNum==null){
            ElMessage.error("素材统计天数不得为空")
            valid = false
          }
        }else if(this.formInline.creativeType=="strengthen"){
          if (typeof this.formInline.creativeDayNum=="undefined"||this.formInline.creativeDayNum==null){
            ElMessage.error("素材统计天数不得为空")
            valid = false
          }else if (typeof this.formInline.havePayNum=="undefined"||this.formInline.havePayNum==null){
            ElMessage.error("有成交天数天数不得为空")
            valid = false
          }
        }
        else if(this.formInline.creativeType=="top"){
          if (typeof this.formInline.creativeDayNum=="undefined"||this.formInline.creativeDayNum==null){
            ElMessage.error("素材统计天数不得为空")
            valid = false
          }else if (typeof this.formInline.creativeNum=="undefined"||this.formInline.creativeNum==null){
            ElMessage.error("视频数量不得为空")
            valid = false
          }
        }
      }
      if (valid){
        this.creative_loading = true;
        this.videoLists = [];
        postRequest("/api/modeltask/createRulePlanAndChooseVideo", {
          type: this.formInline.creativeType,
          creativeDayNum: this.formInline.creativeDayNum,
          havePayNum: this.formInline.havePayNum,
          creativeNum: this.formInline.creativeNum,
          advertiserId: this.formValue.advertiser,
          awemeId: this.formValue.liveRoom
        }).then(response => {
          this.hasMoreVideos = true;
          var newVideos = eval("(" + response.data + ")");
          // console.log(newVideos)
          this.videoLists = this.videoLists.concat(newVideos)
          // console.log(this.videoLists)
          this.creative_loading = false;
        });
      }


    },
    choose() {
      this.model_task_loading = true;
      this.chooseDisavailability = true;
      postRequest("/api/modeltask/chooseRule", {
        awemeId: this.formValue.liveRoom,
        ruleType: this.formValue.ruleType,
        bidRangeMin: this.formValue.minBid,
        bidRangeMax: this.formValue.maxBid,
        conservativeNum: this.formValue.conservativeNum,
        payRoiNum: this.formValue.payRoiNum,
        paiRoiTarget: this.formValue.paiRoiTarget,
        payNum: this.formValue.payNum,
        createNum: this.formValue.createNum,
        adTitle: this.formValue.adTitle,
        payRate: this.formValue.ratioOfPay,
        // crowd: this.formValue.ifPeoplePack,
        advertiserId: this.formValue.advertiser,
        excludeCity: JSON.stringify(this.formValue.excludedCity),
        includeCity: JSON.stringify(this.formValue.includedCity),
        excludeCrowd: JSON.stringify(this.formValue.excludeCrowd),
        includeCrowd: JSON.stringify(this.formValue.includeCrowd),
        creativeList: JSON.stringify(this.formValue.creativeList),
        planType: this.planType
        // campaignId: this.formValue.campaign,
      }).then(response => {
        if (response.data.parsedPlans.length != parseInt(this.formValue.conservativeNum) +
            parseInt(this.formValue.payRoiNum) + parseInt(this.formValue.payNum) + parseInt(this.formValue.createNum)) {
          ElMessage('系统中计划数不足所输入数量，总共' + response.data.parsedPlans.length + "条")
        }
        for (var i in response.data) {
          this[i] = response.data[i];
        }
        this.model_task_loading = false;
        this.chooseDisavailability = false;
      })
    },
    getCityTreeData() {
      postRequest("/restful/monitor/qcCity/getCityTree", {}).then(response => {
        this.$data.options = response.data;
      })
    },
    testActionInterestSelect() {
      console.log("audience",this.audience);

    }
  },
})
</script>

<style scoped>
.box {
  padding: 15px;
  /*height: 100%;*/
  /*width: 100%;*/
}

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

</style>