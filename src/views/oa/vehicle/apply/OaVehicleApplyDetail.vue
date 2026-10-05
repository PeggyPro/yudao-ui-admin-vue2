<template>
  <AppDialog
    v-model="dialogVisible"
    title="用车申请详情"
    width="900px"
  >
    <!-- 复用独立业务详情，列表与 BPM 审批页保持一致 -->
    <vehicle-apply-detail
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
import VehicleApplyDetail from './detail/index.vue'

export default {
  name: 'OaVehicleApplyDetail',
  components: { AppDialog, VehicleApplyDetail },
  data() {
    return {
      dialogVisible: false,
      detailId: undefined
    }
  },
  methods: {
    open(id) {
      this.detailId = id
      this.dialogVisible = true
    }
  }
}
</script>
