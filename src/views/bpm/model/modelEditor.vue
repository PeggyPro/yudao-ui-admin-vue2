<template>
  <div
    v-loading="true"
    class="app-container"
  />
</template>

<script>
export default {
  name: 'BpmModelEditor',
  created() {
    const id = this.$route.query && (this.$route.query.modelId || this.$route.query.id)
    if (id) {
      this.$router.replace({
        name: 'BpmModelUpdate',
        params: { type: 'update', id }
      })
      return
    }
    this.$router.replace({ name: 'BpmModel' })
  }
}
</script>
