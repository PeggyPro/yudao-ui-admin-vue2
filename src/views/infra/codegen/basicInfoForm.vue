<template>
  <el-form
    ref="basicInfoForm"
    :model="info"
    :rules="rules"
    label-width="150px"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item
          label="表名称"
          prop="tableName"
        >
          <el-input
            v-model="info.tableName"
            placeholder="请输入仓库名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="表描述"
          prop="tableComment"
        >
          <el-input
            v-model="info.tableComment"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="className">
          <span slot="label">
            实体类名称
            <el-tooltip
              content="默认去除表名的前缀。如果存在重复，则需要手动添加前缀，避免 MyBatis 报 Alias 重复的问题。"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </span>
          <el-input
            v-model="info.className"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="作者"
          prop="author"
        >
          <el-input
            v-model="info.author"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="info.remark"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: 'BasicInfoForm',
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rules: {
        tableName: [
          { required: true, message: '请输入表名称', trigger: 'blur' }
        ],
        tableComment: [
          { required: true, message: '请输入表描述', trigger: 'blur' }
        ],
        className: [
          { required: true, message: '请输入实体类名称', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
