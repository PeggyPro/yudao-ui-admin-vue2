<template>
  <el-form
    ref="listenerForm"
    :model="value"
    label-position="top"
    size="small"
  >
    <div
      v-for="listener in listeners"
      :key="listener.type"
      class="task-listener"
    >
      <el-divider content-position="left">{{ listener.name }}</el-divider>
      <el-switch
        :value="value[listener.enableKey]"
        active-text="开启"
        inactive-text="关闭"
        @input="$emit('input', { ...value, [listener.enableKey]: $event })"
      />
      <template v-if="value[listener.enableKey]">
        <el-alert
          title="仅支持 POST 请求，以请求体方式接收参数"
          type="warning"
          show-icon
          :closable="false"
          class="listener-alert"
        />
        <el-form-item
          label="请求地址"
          :prop="listener.pathKey"
          :rules="pathRules"
        >
          <el-input
            :value="value[listener.pathKey]"
            placeholder="https://example.com/listener"
            @input="$emit('input', { ...value, [listener.pathKey]: $event })"
          />
        </el-form-item>
        <HttpRequestParamSetting
          :header="value[listener.configKey].header"
          :body="value[listener.configKey].body"
          :form-fields="formFields"
        />
      </template>
    </div>
  </el-form>
</template>

<script>
import HttpRequestParamSetting from './HttpRequestParamSetting.vue'

const LISTENERS = [
  { name: '创建任务', type: 'Create', enableKey: 'taskCreateListenerEnable', pathKey: 'taskCreateListenerPath', configKey: 'taskCreateListener' },
  { name: '指派任务执行人员', type: 'Assign', enableKey: 'taskAssignListenerEnable', pathKey: 'taskAssignListenerPath', configKey: 'taskAssignListener' },
  { name: '完成任务', type: 'Complete', enableKey: 'taskCompleteListenerEnable', pathKey: 'taskCompleteListenerPath', configKey: 'taskCompleteListener' }
]

export default {
  name: 'UserTaskListener',
  components: { HttpRequestParamSetting },
  props: {
    value: {
      type: Object,
      required: true
    },
    formFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listeners: LISTENERS,
      pathRules: [{ required: true, message: '请求地址不能为空', trigger: 'blur' }]
    }
  },
  created() {
    this.ensureShape()
  },
  methods: {
    ensureShape() {
      const value = { ...this.value }
      let changed = false
      LISTENERS.forEach((listener) => {
        if (value[listener.enableKey] == null) {
          value[listener.enableKey] = false
          changed = true
        }
        if (value[listener.pathKey] == null) {
          value[listener.pathKey] = ''
          changed = true
        }
        const original = value[listener.configKey]
        const setting = original && typeof original === 'object' ? original : {}
        if (!Array.isArray(setting.header) || !Array.isArray(setting.body)) {
          value[listener.configKey] = {
            ...setting,
            header: Array.isArray(setting.header) ? setting.header : [],
            body: Array.isArray(setting.body) ? setting.body : []
          }
          changed = true
        }
      })
      if (changed) this.$emit('input', value)
    },
    async validate() {
      this.ensureShape()
      await this.$nextTick()
      const formValid = await new Promise((resolve) => {
        if (!this.$refs.listenerForm) return resolve(true)
        this.$refs.listenerForm.validate(resolve)
      })
      if (!formValid) return false
      for (const listener of LISTENERS) {
        if (!this.value[listener.enableKey]) continue
        const setting = this.value[listener.configKey]
        if (!String(this.value[listener.pathKey] || '').trim()) return false
        for (const group of ['header', 'body']) {
          for (const item of setting[group] || []) {
            if (!item || !String(item.key || '').trim() || !String(item.value || '').trim()) return false
            if (![1, 2].includes(Number(item.type))) return false
          }
        }
      }
      return true
    }
  }
}
</script>

<style scoped>
.task-listener {
  margin-bottom: 16px;
}

.listener-alert {
  margin: 10px 0;
}
</style>
