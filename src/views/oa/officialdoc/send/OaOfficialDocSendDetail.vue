<template>
  <AppDialog
    v-model="dialogVisible"
    title="公文发文详情"
    width="1000px"
  >
    <official-doc-send-detail
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
import OfficialDocSendDetail from './detail/index.vue'

export default {
  name: 'OaOfficialDocSendDetail',
  components: { AppDialog, OfficialDocSendDetail },
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
