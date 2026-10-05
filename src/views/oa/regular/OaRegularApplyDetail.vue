<template>
  <AppDialog
    v-model="dialogVisible"
    title="转正申请详情"
    width="900px"
    append-to-body
  >
    <oa-regular-apply-detail
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
import OaRegularApplyDetail from './detail/index.vue'

export default {
  name: 'OaRegularApplyDetailDialog',
  components: { AppDialog, OaRegularApplyDetail },
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
