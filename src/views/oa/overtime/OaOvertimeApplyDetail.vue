<template>
  <AppDialog
    v-model="dialogVisible"
    title="加班申请详情"
    width="900px"
    append-to-body
  >
    <oa-overtime-apply-detail
      v-if="dialogVisible && detailId"
      :id="detailId"
      :key="detailId"
    />
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/Dialog'
import OaOvertimeApplyDetail from './detail/index.vue'

export default {
  name: 'OaOvertimeApplyDetailDialog',
  components: { AppDialog, OaOvertimeApplyDetail },
  data() {
    return {
      dialogVisible: false, // 弹窗是否展示
      detailId: undefined // 申请编号
    }
  },
  methods: {
    /** 打开弹窗 */
    open(id) {
      this.detailId = id
      this.dialogVisible = true
    }
  }
}
</script>
