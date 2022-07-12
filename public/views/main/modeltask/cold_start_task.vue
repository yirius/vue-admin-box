<template>
  <MarketUiEvent></MarketUiEvent>
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
    <modeltaskModeltaskTableEditLayer :layer="coldStarttask_table_edit_layer_data"
                                      @getTableData="getTableData"
                                      v-if="coldStarttask_table_edit_layer_data.show"/>
    <!--    <AwemeFanSelect :modelValue="awemeFanValue"></AwemeFanSelect>-->
    <!--    <Schedule :modelValue="schedule"></Schedule>-->
    <!--    &lt;!&ndash;    <DistrictSelect :modelValue="dsValue"></DistrictSelect>&ndash;&gt;-->

    <!--    <ActionInterestSelect :modelValue="aiValue"></ActionInterestSelect>-->
    <!--    <button @click="testActionInterestSelect">ActionInterestSelect</button>-->
    <!--    <MarketUiEvent></MarketUiEvent>-->

    <el-row justify="center">
      <div style="text-align: left">
        <el-steps :active="active" finish-status="success">
          <el-step
              title="基础设置&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"/>
          <el-step
              title="行为兴趣&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"/>
          <el-step
              title="抖音达人&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"/>
          <el-step
              title="创意设置&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"/>
          <el-step title="投放"/>

        </el-steps>
      </div>
    </el-row>
    <!--    <el-form ref="formRef" :model="formValue" :rules="firstPageRules" labelWidth="120px">-->
    <div v-if="active == 1">
      <el-form ref="firstPage" :model="formValue" :rules="firstPageRules" labelWidth="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告主" prop="advertiserId">
              <el-select v-model="formValue.advertiserId" placeholder="Select"
                         @change="getLiveRoomsAndCrowds($event, formValue.advertiserId)">
                <el-option v-for="adv in advertisers" :value="adv.advertiserId" :label="adv.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
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

            <el-form-item label="计划总数量" prop="totalNum">
              <el-input v-model="formValue.totalNum" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="计划比例">
            <el-form :rules="plansRate_rules" :model="formValue.plansRate" ref="plansRate">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="支付ROI" prop="payRoiRate">
                    <el-col :span="18">
                      <el-input v-model="formValue.plansRate.payRoiRate"
                                oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="直播间成交计划" prop="payRate">
                    <el-col :span="18">
                      <el-input v-model="formValue.plansRate.payRate"
                                oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="下单计划" prop="createRate">
                    <el-col :span="18">

                      <el-input v-model="formValue.plansRate.createRate"
                                oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                    </el-col>

                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="放量计划" prop="conservativeRate">
                    <el-col :span="18">
                      <el-input v-model="formValue.plansRate.conservativeRate"
                                oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预算" prop="budget">
              <el-input v-model="formValue.budget" oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付ROI目标" prop="paiRoiTarget">
              <el-input v-model="formValue.paiRoiTarget"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-row>-->
        <!--            <el-col :span="12">-->
        <!--              <el-form-item label="计划标题" prop="adTitle">-->
        <!--                <el-input :maxlength="10" v-model="formValue.adTitle"></el-input>-->
        <!--              </el-form-item>-->
        <!--            </el-col>-->
        <!--        </el-row>-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="出价">
              <el-form :model="formValue" :rules="firstPageRules" ref="bid">
                <el-row>
                  <el-col :span="11">
                    <el-form-item prop="minBid">
                      <el-input v-model.trim="formValue.minBid" @change="handleMinChange"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <div style="text-align: center; align: center; justify: center;">
                      -
                    </div>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item prop="maxBid">
                      <el-input v-model.trim="formValue.maxBid" @change="handleMaxChange"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>

            </el-form-item>

          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="投放时间段" prop="adKeywords">
              <div style="width: 100%">
                <Schedule v-model="formValue.schedule"></Schedule>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别比例">
              <el-form :rules="gender_rules" :model="formValue.gender_rate" ref="gender_rate">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="男" label-width="50px" prop="male_rate">
                      <el-col :span="18">
                        <el-input v-model="formValue.gender_rate.male_rate"
                                  oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="女" label-width="50px" prop="female_rate">
                      <el-col :span="18">
                        <el-input v-model="formValue.gender_rate.female_rate"
                                  oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-form>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="年龄比例">
            <el-form :rules="age_city_rules" :model="formValue.age_rate" ref="age_rate">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="18-23" label-width="70px" prop="first_class">
                    <el-col :span="18">
                      <el-input v-model="formValue.age_rate.first_class"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="24-30" label-width="70px" prop="second_class">
                    <el-col :span="18">
                      <el-input v-model="formValue.age_rate.second_class"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="31-40" label-width="70px" prop="third_class">
                    <el-col :span="18">

                      <el-input v-model="formValue.age_rate.third_class"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>

                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="41-49" label-width="70px" prop="forth_class">
                    <el-col :span="18">
                      <el-input v-model="formValue.age_rate.forth_class"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="50+" label-width="70px" prop="fifth_class">
                    <el-col :span="18">
                      <el-input v-model="formValue.age_rate.fifth_class"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地域比例">
            <el-form :rules="age_city_rules" :model="formValue.city_rate" ref="city_rate">
              <el-row>
                <el-col :span="4">
                  <el-form-item label="一线" label-width="50px" prop="first_class">
                    <el-col :span="18">
                      <el-input v-model="formValue.city_rate.first_class"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="二线" label-width="50px" prop="second_class">
                    <el-col :span="18">
                      <el-input v-model="formValue.city_rate.second_class"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="三线" label-width="50px" prop="third_class">
                    <el-col :span="18">

                      <el-input v-model="formValue.city_rate.third_class"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="四线" label-width="50px" prop="forth_class">
                    <el-col :span="18">
                      <el-input v-model="formValue.city_rate.forth_class"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="其他" label-width="50px" prop="fifth_class">
                    <el-col :span="18">
                      <el-input v-model="formValue.city_rate.fifth_class"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-form-item>
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
            <el-form-item label="选择城市" prop="includedCity">
              <el-cascader
                  :options="options"
                  :props="city_props"
                  collapse-tags
                  v-model="formValue.includedCity"
                  clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排除城市" prop="excludedCity">
              <el-cascader
                  :options="options"
                  :props="city_props"
                  collapse-tags
                  v-model="formValue.excludedCity"
                  clearable></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </div>
    <div v-if="active == 2">
      <el-form ref="secondPage" :model="formValue" :rules="secondPageRules" labelWidth="120px">
        <el-row>
          <el-form-item label="各类型比例">
            <el-form ref="aiKindsRate" :rules="aiKindsRate_rules" :model="formValue.aiKindsRate">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="自定义" prop="customRate">
                    <el-col :span="18">
                      <el-input v-model="formValue.aiKindsRate.customRate"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>

                <el-col :span="8">

                  <el-form-item label="系统推荐" prop="recommendRate">
                    <el-col :span="18">
                      <el-input v-model="formValue.aiKindsRate.recommendRate"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="不限" prop="unlimitedRate">
                    <el-col :span="18">
                      <el-input v-model="formValue.aiKindsRate.unlimitedRate"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="每条计划中行为兴趣数量" labelWidth="200px">
            <el-form :rules="secondPageRules" :model="formValue">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="行为" prop="actionPerNum">
                    <el-col :span="18">
                      <el-input v-model="formValue.actionPerNum"
                                oninput="value=value.replace(/[^0-9+]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="兴趣" prop="interestPerNum">
                    <el-col :span="18">
                      <el-input v-model="formValue.interestPerNum"
                                oninput="value=value.replace(/[^0-9+]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-form-item>
        </el-row>
        <el-row v-if="formValue.aiKindsRate.customRate!=null&&Number(formValue.aiKindsRate.customRate) !=0">
          <el-col :span="24">
            <el-form-item label="必选行为兴趣">
              <div style="overflow:hidden; width: 100%">
                <ActionInterestSelect v-model="formValue.chosenAiValue"
                                      style="margin-top: -55px"
                                      :advertiser_id="formValue.advertiserId"></ActionInterestSelect>
              </div>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row v-if="formValue.aiKindsRate.customRate!=null&&Number(formValue.aiKindsRate.customRate)!=0">
          <el-col :span="24">
            <el-form-item label="随机行为兴趣">
              <div style="overflow:hidden; width: 100%">
                <ActionInterestSelect v-model="formValue.randomAiValue"
                                      style="margin-top: -55px"
                                      :advertiser_id="formValue.advertiserId"></ActionInterestSelect>
              </div>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </div>
    <div v-if="active == 3">
      <el-form ref="thirdPage" :model="formValue" :rules="thirdPageRules" labelWidth="120px">
        <el-row>
          <el-form-item label="各类型比例">
            <el-form ref="awemeFanRates" :rules="awemeFanRatesRules" :model="formValue.awemeFanRates">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="自定义" prop="awemeFanCustomRate">
                    <el-col :span="18">
                      <el-input v-model="formValue.awemeFanRates.awemeFanCustomRate"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="不限" prop="awemeFanUnlimitedRate">
                    <el-col :span="18">
                      <el-input v-model="formValue.awemeFanRates.awemeFanUnlimitedRate"
                                oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                    </el-col>
                  </el-form-item>
                </el-col>


              </el-row>
            </el-form>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24"
                  v-if="formValue.awemeFanRates.awemeFanCustomRate!=null&&Number(formValue.awemeFanRates.awemeFanCustomRate)!=0">
            <el-form-item label="抖音达人">
              <div style="overflow:hidden; width: 100%">
                <AwemeFanSelect v-model="formValue.awemeFanValue" style="margin-top: -50px"></AwemeFanSelect>
              </div>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>


    </div>
    <div v-if="active == 4">
      <el-form ref="forthPage" :model="formValue" :rules="forthPageRules" labelWidth="120px">
        <el-row>

          <el-row>
            <el-form-item label="创意分类">
              <el-form :rules="creativeTypeRules" :model="formValue.creativeType" >
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="不限比例" prop="randomRate">
                      <el-col :span="18">
                        <el-input v-model="formValue.creativeType.randomRate"
                                  oninput="value=value.replace(/[^0-9+.]/g,'')"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="Number(formValue.creativeType.randomRate)<1">
                    <el-form-item label="必选创意分类" prop="mustBeChosen">
                      <el-col :span="24">
                        <el-cascader
                            :options="industryOptions"
                            :props="{emitPath: true, multiple: true}"
                            collapse-tags
                            v-model="formValue.creativeType.mustBeChosen"
                            clearable></el-cascader>
                      </el-col>
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-form>

            </el-form-item>
          </el-row>


          <el-col :span="24">
            <el-form-item label="必选创意标签" prop="adKeywords">
              <CreativeTag v-model="formValue.creativeTags.chosenCreativeTag"></CreativeTag>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="随机创意标签" prop="adKeywords">
              <CreativeTag v-model="formValue.creativeTags.randomCreativeTag"></CreativeTag>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="素材选择" v-if="imageMode!='AWEME_LIVE_ROOM'">
              <el-col :xs="24" :span="24">
                <div style="text-align: left; padding-left: 10px;width: 100%;">
                  <el-button @click="dialogVisible=true">添加视频</el-button>
                </div>

              </el-col>

            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="imageMode!='AWEME_LIVE_ROOM'">
              <el-col :xs="24" :span="24" v-for="(item,index) in formValue.creativeList"
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
          </el-col>
        </el-row>
      </el-form>


    </div>
    <!--    </el-form>-->
    <div v-if="active == 5">
      <el-table :data="parsedPlans" style="width: 100%" v-loading="model_task_loading"
                @selection-change="handleSelectionChange" @row-click="clickRow">
        <el-table-column type="selection" width="55"/>
        <!--          <el-table-column prop="advertiser_id" label="广告主" width="180" />-->
        <!--          <el-table-column prop="campaign_id" label="广告组" width="180" />-->
        <el-table-column width="55" label="id" prop="id"/>
        <el-table-column v-for="(item, index) in parsedPlansColumns" :key="index" :label="item" :prop="item"
                         :show-overflow-tooltip='true' width="100">
          <!-- 数据的遍历  scope.row就代表数据的每一个对象-->
          <template #default="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
      </el-table>
      <el-button type="success" :disabled="uploadDisavailability" @click="uploadPlan()">上传计划</el-button>
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
import CreativeTag from "/views/market_plugins/diy/creative_tag.vue";
import modeltaskModeltaskTableEditLayer from "./modelTaskEdit.vue";


export default defineComponent({
  components: {
    CreativeTag,
    AwemeFanSelect,
    DistrictSelect,
    AudienceTargeting,
    Schedule,
    ActionInterestSelect,
    MarketUiEvent,
    modeltaskModeltaskTableEditLayer
  },
  data() {
    return {
      limitBid: null,
      limitBudget: null,
      accessType: null,
      planType: "冷启动计划",
      coldStarttask_table_edit_layer_data: {"show": false, "showButton": true, "title": "编辑"},
      pageNum: 5,
      active: 1,
      audience_rules: {},
      city_props: {emitPath: true, multiple: true, checkStrictly: true},
      options: [],
      model_task_loading: false,
      all_loading: false,
      successful:[],
      failed:[],
      creative_loading: false,
      dialog3Visible: false,
      uploadDisavailability: true,
      chooseDisavailability: false,

      plansRate_rules: {
        payRoiRate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        createRate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        conservativeRate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        payRate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
      },
      aiKindsRate_rules: {
        customRate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        recommendRate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        unlimitedRate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
      },
      gender_rules: {
        male_rate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        female_rate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
      },
      age_city_rules: {
        first_class: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        second_class: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        third_class: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        forth_class: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        fifth_class: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],

      },
      firstPageRules: {
        paiRoiTarget: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateFloat, trigger: 'blur'},
        ],
        advertiserId: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        liveRoom: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        totalNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        budget: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateBudget, trigger: 'blur'}
        ],
        minBid: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateBid, trigger: 'blur'},
          {validator: this.validateMin, trigger: 'blur'},
        ],
        maxBid: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
          {validator: this.validateBid, trigger: 'blur'},
          {validator: this.validateMax, trigger: 'blur'},
        ]
      },
      awemeFanRatesRules: {
        awemeFanCustomRate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
        awemeFanUnlimitedRate: [{validator: this.validateFloat, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
      },
      secondPageRules: {
        // campaign: [
        //   {required: true, message: '必填项，请输入', trigger: 'blur'},
        // ],
        interestPerNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        actionPerNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],

      },
      thirdPageRules: {
        // campaign: [
        //   {required: true, message: '必填项，请输入', trigger: 'blur'},
        // ],
        interestPerNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        actionPerNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],

      },
      creativeTypeRules: {
        randomRate: [{validator: this.validateRate, trigger: 'blur'},
          {required: true, message: '必填项，请输入', trigger: 'blur'}],
      },
      forthPageRules: {
        // campaign: [
        //   {required: true, message: '必填项，请输入', trigger: 'blur'},
        // ],
        interestPerNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],
        actionPerNum: [
          {required: true, message: '必填项，请输入', trigger: 'blur'},
        ],

      },
      top: "top",
      strengthen: "strengthen",
      formValue: {
        budget: null,
        totalNum: null,
        awemeFanValue: {
          "aweme_fan_behaviors": [
            "FOLLOWED_USER"
          ],
          "aweme_fan_categories": [],
          "aweme_fan_accounts": [],
          "aweme_fan_time_scope": "FIFTEEN_DAYS"
        },
        maxBid: null,
        minBid: null,
        liveRoom: null,
        advertiserId: null,
        includedCity: [],
        includeCrowd: [],
        excludeCrowd: [],
        creativeType: {
          mustBeChosen: [],
          randomRate: null
        },
        creativeList: [],
        aiKindsRate: {
          customRate: null,
          recommendRate: null,
          unlimitedRate: null,
        },
        awemeFanRates: {
          awemeFanUnlimitedRate: null,
          awemeFanCustomRate: null,
        },
        chosenAiValue: {
          action_categories: [],
          action_days: 60,
          action_scene: ['E-COMMERCE', 'NEWS', 'APP'],
          action_words: [],
          interest_action_mode: "CUSTOM",
          interest_categories: [],
          interest_words: [],
        },
        randomAiValue: {
          action_categories: [],
          action_days: 60,
          action_scene: ['E-COMMERCE', 'NEWS', 'APP'],
          action_words: [],
          interest_action_mode: "CUSTOM",
          interest_categories: [],
          interest_words: [],
        },
        schedule: '',
        creativeTags: {
          chosenCreativeTag: [],
          randomCreativeTag: [],
        },
        age_rate: {
          first_class: null,
          second_class: null,
          third_class: null,
          forth_class: null,
          fifth_class: null,
        },

        city_rate: {
          first_class: null,
          second_class: null,
          third_class: null,
          forth_class: null,
          fifth_class: null
        },
        gender_rate: {
          male_rate: null,
          female_rate: null
        },
        plansRate: {
          payRate: null,//直播间成交计划数量
          createRate: null,
          conservativeRate: null,//放量计划数量
          payRoiRate: null,//支付ROI计划数量
        },
        paiRoiTarget: null,//支付ROI目标
        actionPerNum: null,
        interestPerNum: null
      },
      plansToUpload: [],
      parsedPlans: [],
      parsedPlansColumns: [],
      advertisers: [],
      liveRooms: {},
      liveRoomToShow: [],
      crowds: {},
      crowdToShow: [],
      checkOld: false,
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
    getRequest("/api/modeltask/getEditData").then(response => {
      industryOptions.value = response.data
    })
    const checkAll = ref(false);
    const dialogVisible = ref(false);
    const cityToShow = ref([])
    const imageMode = ref("")

    const inputValue = ref('')
    const inputVisible = ref(false)
    const videoLists = ref([])
    const hasMoreVideos = ref(true)

    const formInline = ref({source: "", title: "", videoId: ""})
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
      cityOptions,
      countyOptions,
      cityToShow,
      imageMode,
      liveRoomToShow,
      crowdToShow
    };
  },
  watch: {
    'formValue.includedCity': function (newV, oldV) {

      console.log("newV", newV)
      console.log("oldV", oldV)

    },
    // 'active': function (newV, oldV) {
    //   if (this.formValue.advertiserId == null || this.formValue.advertiserId ==''){
    //     this.active = oldV
    //     console.log("hahahaha")
    //   }
    //   // console.log("newV", newV)
    //   // console.log("oldV", oldV)
    //
    // }
  },
  methods: {
    validateAcitonInterest() {
      // if (this.formValue.chosenAiValue.action_words.length+this.formValue.chosenAiValue.action_categories>this.formValue.actionPerNum){
      //
      // }
      var result = false
      if (this.formValue.actionPerNum == null || typeof this.formValue.actionPerNum == "undefined") {
      } else {
        if (Number(this.formValue.actionPerNum)==0) {
          ElMessage.error("每条计划中行为数量必须大于0")
          result = true
          return result
        }
        if (this.formValue.chosenAiValue.action_words.length + this.formValue.chosenAiValue.action_categories.length
            + this.formValue.randomAiValue.action_words.length + this.formValue.randomAiValue.action_categories.length < this.formValue.actionPerNum) {
          ElMessage.error("选中的行为类目和关键词数量不满足所要求的数量")
          result = true
          return result
        }
      }
      if (this.formValue.interestPerNum == null || typeof this.formValue.interestPerNum == "undefined") {
      } else {
        if (Number(this.formValue.interestPerNum)==0) {
          ElMessage.error("每条计划中行为数量必须大于0")
          result = true
          return result
        }
        if (this.formValue.chosenAiValue.interest_words.length + this.formValue.chosenAiValue.interest_categories.length
            + this.formValue.randomAiValue.action_words.length + this.formValue.randomAiValue.interest_categories.length < this.formValue.interestPerNum) {
          ElMessage.error("选中的兴趣类目和关键词数量不满足所要求的数量")
          result = true
          return result
        }
      }
      return result
    },


    clickRow(row, event, column) {
      console.log(row['id'])
      this.coldStarttask_table_edit_layer_data.rowIdKey = row['id'];
      this.coldStarttask_table_edit_layer_data.liveRooms = this.liveRooms;
      this.coldStarttask_table_edit_layer_data.advertisers = this.advertisers;
      this.coldStarttask_table_edit_layer_data.crowds = this.crowds;
      this.coldStarttask_table_edit_layer_data.planType = this.planType;
      this.coldStarttask_table_edit_layer_data.rowSqlIdKey = row['sql_id'];
      this.coldStarttask_table_edit_layer_data.show = true;
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
        if (this.active == 1) {
          this.$refs.firstPage.validate((valid1) => {
            this.$refs.plansRate.validate((valid2) => {
              this.$refs.bid.validate((valid3) => {
                this.$refs.age_rate.validate((valid4) => {
                  this.$refs.city_rate.validate((valid5) => {
                    this.$refs.gender_rate.validate((valid6) => {
                      if (valid1 && valid2 && valid3 && valid4 && valid5 && valid6) {
                        resolve(valid)
                      } else {
                        ElMessage.error('参数不合法，请检查参数')
                        valid = false;
                        resolve(valid)
                      }
                    })
                  })
                })
              })
            })
          });
          if (this.formValue.schedule == null || this.formValue.schedule == '') {
            ElMessage.error('投放时间段不可为空')
            valid = false;
            resolve(valid)
          }else{
            resolve(valid)
          }
          if (this.formValue.advertiserId == null || this.formValue.advertiserId == '') {
            ElMessage.error('广告主不可为空')
            valid = false;
            resolve(valid)
          }else{
            resolve(valid)
          }
        }
        else if (this.active == 2) {
          this.$refs.secondPage.validate((valid1) => {
            this.$refs.aiKindsRate.validate((valid2) => {
              if (valid1 && valid2) {
                resolve(valid)
              } else {
                ElMessage.error('参数不合法，请检查参数')
                valid = false;
                resolve(valid)
              }
            })
          });
          if (this.validateAcitonInterest()) {
            valid = false;
            resolve(valid)
          }else{
            resolve(valid)
          }
        }
        else if (this.active == 3) {
          this.$refs.awemeFanRates.validate((valid1) => {
            if (valid1) {
              resolve(valid)
            } else {
              ElMessage.error('参数不合法，请检查参数')
              valid = false;
              resolve(valid)
            }
          });
          if (this.formValue.awemeFanRates.awemeFanCustomRate != null && Number(this.formValue.awemeFanRates.awemeFanCustomRate) != 0) {
            if (this.formValue.awemeFanValue.aweme_fan_categories.length + this.formValue.awemeFanValue.aweme_fan_accounts.length == 0) {
              ElMessage.error('没有选择抖音达人')
              valid = false;
              resolve(valid)
            }else{
              resolve(valid)
            }
          }
        }
        else if (this.active == 4) {
          if (this.formValue.creativeType.mustBeChosen.length == 0 && Number(this.creativeType.randomRate) < 1) {
            ElMessage.error('尚未选择创意分类')
            valid = false;
            resolve(valid)
          }else{
            resolve(valid)
          }
          if (this.formValue.creativeTags.chosenCreativeTag.length == 0) {
            ElMessage.error('必选创意标签不得为空')
            valid = false;
            resolve(valid)
          }else{
            resolve(valid)
          }
          if (this.formValue.creativeList.length == 0) {
            ElMessage.error('素材不得为空')
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
    //获得缓存计划数据
    getTableData() {
      postRequest("/api/modeltask/getTableData", {
        planType: this.planType
      }).then(response => {
        for (var i in response.data) {
          this[i] = response.data[i];
        }
      })
    },
    //获得渲染界面必要的值，比如adv id的list
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

    validateRate(rule, value, callback) {
      if (typeof value == "undefined" || value == null) {
        return callback(new Error('必填项，请输入'));
      }
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
        return callback(new Error('请输入0-1之间的数字'));
      }
      return callback();
    },
    validateFloat(rule, value, callback) {
      if (typeof value == "undefined" || value == null) {
        return callback(new Error('必填项，请输入'));
      }
      if (value.toString().indexOf(".") == 0) {
        return callback(new Error('输入值必须合法数字'));
      }
      if (value.toString().split(".").length > 2) {
        return callback(new Error('输入值必须合法数字'));
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

      const one = Number(value);
      var max = 10000
      if (this.limitBudget != null && this.accessType == 1) {
        max = this.limitBudget
      }
      if (one < 300) {
        return callback(new Error('预算必须大于300'));
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
      var max = 100
      if (this.formValue.creativeList.length == max) {
        ElMessage.error('已选择' + max + '条视频，最多选择' + max + '条视频')
      } else if (this.formValue.creativeList.length < max) {
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

    },
    isNotNull(value) {
      return typeof value != "undefined"
    },
    //筛选项发生变化之后，调用这个函数，获得相关的视频
    onSubmit() {
      this.videoLists = [];
      postRequest("/api/modeltask/getNewVideo", {
        data: JSON.stringify(this.formInline),
        num: this.videoLists.length,
        advertiserId: this.formValue.advertiserId
      }).then(response => {
        this.hasMoreVideos = true;
        var newVideos = eval("(" + response.data + ")");
        this.videoLists = this.videoLists.concat(newVideos)
      });

    },
    //触底加载更多的函数
    onLoad() {
      if (this.hasMoreVideos) {
        this.onLoadLoading = true;
        postRequest("/api/modeltask/getNewVideo", {
          data: JSON.stringify(this.formInline),
          num: this.videoLists.length,
          advertiserId: this.formValue.advertiserId
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
    choose() {
      this.model_task_loading = true;
      this.chooseDisavailability = true;
      postRequest("/api/modeltask/chooseColdStartPlan", {
        parameter: JSON.stringify(this.formValue),
        planType: this.planType
        // campaignId: this.formValue.campaign,
      }).then(response => {
        console.log(response)
        if (response.data.parsedPlans.length == 0) {
          ElMessage('计划生成失败')
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
      console.log("awemeFanValue", this.awemeFanValue);
      console.log("schedule", this.schedule);
      console.log("aiValue", this.aiValue);

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