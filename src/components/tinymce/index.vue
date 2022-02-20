<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script>
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import { uploadHttpRequestApi } from "../upload/index";

const tinymceCDN = '/tinymce/tinymce.min.js'

export default {
  name: 'Tinymce',
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    modelValue: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    plugins: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'edit view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 400
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    uploadUrl: {
      type: String,
      required: false,
      default: "/thinker/admin/upload"
    },
    fontsize: {
      type: String,
      required: false,
      default: "12px 14px 16px 18px 24px 36px 48px 56px 72px"
    },
    linkList: {
      type: Array,
      required: false,
      default: []
    },
    imageList: {
      type: Array,
      required: false,
      default: []
    },
    templateList: {
      type: Array,
      required: false,
      default: []
    },
    tplReplaceValues: {
      type: Object,
      required: false,
      default: {}
    }
  },
  data() {
    return {
      hasInit: false,
      tinymceId: null,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    modelValue(val) {
      if (this.hasInit && this.getContent() !== val) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  created() {
    this.tinymceId = this.id
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          console.log(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        content_style: "img {max-width:100%;}",
        language: this.languageTypeList['zh'],
        body_class: 'panel-body ',
        object_resizing: true,
        // 组件配置
        plugins: this.plugins.length > 0 ? this.plugins : plugins,
        // 工具栏配置
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        // 字体格式
        fontsize_formats: this.fontsize,
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif',
        height: this.height,
        min_height: 400,
        link_list: this.linkList&&this.linkList.length>0?this.linkList:null,
        image_list: this.imageList&&this.imageList.length>0?this.imageList:null,
        //为内容模板插件提供预置模板
        templates: this.templateList&&this.templateList.length>0?this.templateList:null,
        template_cdate_format: '%Y-%m-%d %H:%M:%S',
        template_mdate_format: '%Y-%m-%d',
        template_replace_values: this.tplReplaceValues,
        template_selected_content_classes: "selcontent",
        // 其他附属内容
        extended_valid_elements:'script[src]',
        autosave_ask_before_unload: false,
        toolbar_mode : 'wrap',
        automatic_uploads : true,
        images_upload_handler: (blobInfo, succFun, failFun) => {
          uploadHttpRequestApi({
            action: this.uploadUrl,
            filename: "file",
            file: blobInfo.blob(),
            data: {},
            method: "POST",
            headers: {}
          }).then(response => {
            succFun(response.data.file);
          }).catch(response => {
            failFun(response.msg||'未知错误');
          });
        },
        init_instance_callback: editor => {
          if (_this.modelValue) {
            editor.setContent(_this.modelValue)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.$emit('update:modelValue', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        convert_urls: false
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }
      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      return window.tinymce.get(this.tinymceId).getContent()
    },
    // 图片上传时使用
    imageSuccessCBK(str) {
      window.tinymce.get(this.tinymceId).insertContent(`<img src="${process.env.VUE_APP_Image}/${str}" >`)
    },
		// 上传远程图片
		uploadRemoteFile(imageArray, n) {
			// if (n < imageArray.length) {
			// 	// 判断图片url是本地图片还是外部图片
			// 	if(imageArray[n].indexOf('blob:')== 0) {
			// 		// 本地图片查看images_upload_handler函数，当前函数不做处理
			// 	}
			// 	else {
			// 		let params = {
			// 			imgUrl: imageArray[n]
			// 		}
			// 		uploadRemoteImage(params)
			// 		.then(res => {
			// 			let html = window.tinymce.get(this.tinymceId).getContent()
			// 			html = html.replace(imageArray[n], `${process.env.VUE_APP_Image}/${res.data}`)
			// 			window.tinymce.get(this.tinymceId).setContent(html)
			// 			this.uploadRemoteFile(imageArray, ++n)
			// 		})
			// 	}
			// }else {
			// 	//this.loading = false
			// 	this.$emit('input', tinymce.activeEditor.getContent())
			// }
		},
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  :deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 6px;
  top: 8px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>

<style type="text/css">
  .mce-branding {
    display: none !important;
  }
  .mce-wordcount {
    margin-right: 20px !important;
  }
  .mce-flow-layout {
    padding: 5px 0 !important;
  }
  .mce-stack-layout .mce-menu-item:nth-child(3) {
	  display: none;
  }
</style>
