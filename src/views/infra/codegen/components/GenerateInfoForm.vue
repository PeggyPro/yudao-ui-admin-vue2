<template>
  <gen-info-form
    ref="inner"
    :form-data="table"
    :columns="columns"
    :menus="menus"
    @field-change="(field, value) => $emit('field-change', field, value)"
  />
</template>

<script>
import GenInfoForm from '../genInfoForm.vue'

export default {
  name: 'InfraCodegenGenerateInfoForm',
  components: { GenInfoForm },
  props: {
    table: { type: Object, default: null },
    columns: { type: Array, default: () => [] },
    menus: { type: Array, default: () => [] }
  },
  methods: {
    validate(callback) {
      const form = this.$refs.inner && this.$refs.inner.$refs.genInfoForm
      if (!form) return Promise.resolve(true)
      if (callback) return form.validate(callback)
      return new Promise(resolve => form.validate(resolve))
    }
  }
}
</script>
