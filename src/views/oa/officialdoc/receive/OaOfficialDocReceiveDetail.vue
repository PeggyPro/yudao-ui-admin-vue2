<template>
  <AppDialog
    v-model="dialogVisible"
    title="公文收文详情"
    width="1000px"
  >
    <official-doc-receive-detail
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
import OfficialDocReceiveDetail from './detail/index.vue'

export default {
  name: 'OaOfficialDocReceiveDetail',
  components: { AppDialog, OfficialDocReceiveDetail },
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
