<template>
  <el-form labelWidth="200px" ref="audience" :model="audience">
      <el-row>

        <el-col :xs="24" :span="12">
          <div style="text-align: left;">
            <el-form-item  label="定向包名称">
              <el-input v-model="audience.audienceName" placeholder="请输入定向包名称" clearable >{{audience.audienceName}}</el-input>
            </el-form-item>
          </div>
        </el-col>

        <el-col :xs="24" :span="24">
          <div style="text-align: left;">
            <el-form-item  label="地域定向类型">
              <el-radio-group v-model="audience.district">
                <el-radio-button label="NONE">不限</el-radio-button>
                <el-radio-button label="CITY">省市</el-radio-button>
                <el-radio-button label="COUNTY">区县</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>

        <el-col :xs="24" :span="12">
          <el-form-item  label="具体定向的城市列表">
            <el-cascader :options="options" :props="set_props" v-model="audience.city" collapse-tags
                         collapse-tags-tooltip clearable>
            </el-cascader>
          </el-form-item>

        </el-col>

        <el-col :xs="24" :span="24">
          <div style="text-align: left;">
            <el-form-item  label="地域定向的用户状态类型">
              <el-radio-group v-model="audience.locationType">
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
            <el-form-item label="性别">
              <el-radio-group v-model="audience.gender">
                <el-radio-button label="NONE"> 不限</el-radio-button>
                <el-radio-button label="GENDER_MALE"> 男性</el-radio-button>
                <el-radio-button label="GENDER_FEMALE">女性</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>

        <el-col :xs="24" :span="24">
          <div style="text-align: left;">
            <el-form-item  label="年龄">
              <el-checkbox-group v-model="audience.age">
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

        <el-col :xs="24" :span="24">
          <div style="text-align: left;">
            <el-form-item  label="是否启用智能放量">
              <el-radio-group v-model="audience.autoExtendEnabled"
                              @change="handleAutoExtendTargetsChange">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>

        <el-col :xs="24" :span="24">
          <div style="text-align: left;">
            <el-form-item  label="可放开定向列表">
              <el-col :span="12">
                <div style="padding-right: 10px;">
                  <el-checkbox-group v-model="audience.autoExtendTargets"
                                     :disabled="!autoExtendTargetsBoolen">
                    <el-checkbox-button :label="'AGE'">年龄</el-checkbox-button>
                    <el-checkbox-button :label="'REGION'">地域</el-checkbox-button>
                    <el-checkbox-button :label="'GENDER'">性别</el-checkbox-button>
                    <el-checkbox-button :label="'INTEREST_ACTION'">行为兴趣</el-checkbox-button>
                    <el-checkbox-button :label="'CUSTOM_AUDIENCE'">更多人群-自定义人群
                    </el-checkbox-button>
                  </el-checkbox-group>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="padding-left: 10px;padding-right: 10px;">
                  <el-checkbox v-model="checkAll" @change="handleCheckAutoAllChange"
                               :disabled="!autoExtendTargetsBoolen">全选</el-checkbox>
                </div>
              </el-col>
            </el-form-item>
          </div>
        </el-col>

        <el-col :xs="24" :span="24">
          <div style="text-align: left;">
            <el-form-item  label="投放平台">
              <el-radio-group v-model="audience.platform">
                <el-radio-button label="">全选</el-radio-button>
                <el-radio-button label="ANDROID"> 安卓</el-radio-button>
                <el-radio-button label="IOS">IOS</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>

        <el-col :xs="24" :span="24">
          <div style="text-align: left;">
            <el-form-item  label="网络类型">
              <el-checkbox-group v-model="audience.ac">
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
</template>


<script lang="ts">
import StepLayer from "@/components/layer/index.vue"
import {postRequest,} from "@/api/request"
import {defineComponent, ref} from "vue"
import {ElMessage, ElMessageBox} from "element-plus"

export default defineComponent({
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          audienceName:'',
          district: '',
          city: [],
          locationType: '',
          gender: '',
          age: [],
          autoExtendEnabled: [],
          autoExtendTargets: [],
          platform: '',
          ac: [],
          title : '',
          show: false,
          showButton: false,
        }
      },
      required: true
    }
  },

  data() {
    return {
      options: [],
      set_props: {
        multiple: true,
        emitPath: false
      },
      audience: {
        audienceName: null,
        district: null,
        city: [],
        locationType: null,
        gender: null,
        age: [],
        autoExtendEnabled: [],
        autoExtendTargets: [],
        platform: null,
        ac: [],
      },
    }
  },

  setup() {
    const checkAll = ref(false);

    return {
      checkAll
    }
  },

  // 通常是为  methods  函数提前定义, 类似提前声明变量 进入页面内容全部渲染完成后自动引函数
  mounted() {
    this.getCityTreeData();
  },
  watch:{
    layer:{
      immediate:true,
      handler(newV,oldV){
        if (newV.show){
          this.audience.audienceName = this.layer.audienceName;
          this.audience.district = this.layer.district;
          this.audience.city = this.layer.city;
          this.audience.gender = this.layer.gender;
          this.audience.age = this.layer.age;
          this.audience.autoExtendEnabled = this.layer.autoExtendEnabled;
          this.audience.autoExtendTargets = this.layer.autoExtendTargets;
          this.audience.platform = this.layer.platform;
          this.audience.ac = this.layer.ac;
        }
      },
      deep:true
    }
  },

  computed: {
    // 计算属性的 getter
    autoExtendTargetsBoolen: function() {
      return this.audience.autoExtendEnabled == 1;
    },
  },

  methods: {
    getCityTreeData() {
      postRequest("/restful/monitor/qcCity/getCityTree", {}).then(response => {
        this.$data.options = response.data;
      })
    },
    handleAutoExtendTargetsChange(val) {
      if (val == 0) {
        this.audience.autoExtendTargets = []
        this.checkAll = false
      }
    },
    handleCheckAutoAllChange(val) {
      if (val) {
        this.audience.autoExtendTargets = ["AGE", "REGION", "GENDER", "INTEREST_ACTION", "CUSTOM_AUDIENCE"]
      } else {
        this.audience.autoExtendTargets = []
      }
    },

/*    onSubmit() {
      let response;
      response = postRequest("/api/RuleTask/SaveAudiencePackage",{
        audienceName: this.audience.audienceName,
        district: this.audience.district,
        city: this.audience.city,
        locationType : this.audience.locationType,
        gender: this.audience.gender,
        age: this.audience.age,
        autoExtendEnabled: this.audience.autoExtendEnabled,
        autoExtendTargets: this.audience.autoExtendTargets,
        platform: this.audience.platform,
        ac: this.audience.ac,
      })
    }*/
  },
})
</script>


<style scoped>
.el-tag+.el-tag {
  margin-left: 10px;
}


.input-new-tag>>>.el-input__inner {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
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
