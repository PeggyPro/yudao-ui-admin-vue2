<template>
  <AppDialog
    v-model="dialogVisible"
    title="还车申请详情"
    width="900px"
  >
    <vehicle-return-detail
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
import VehicleReturnDetail from './detail/index.vue'

export default {
  name: 'OaVehicleReturnDetail',
  components: { AppDialog, VehicleReturnDetail },
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
