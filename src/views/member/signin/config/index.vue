<template>
  <div class="app-container">
    <doc-alert
      title="会员等级、积分、签到"
      url="https://doc.iocoder.cn/member/level/"
    />

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['point:sign-in-config:create']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
    >
      <el-table-column
        label="签到天数"
        align="center"
        prop="day"
      >
        <template slot-scope="scope">第 {{ scope.row.day }} 天</template>
      </el-table-column>
      <el-table-column
        label="奖励积分"
        align="center"
        prop="point"
      />
      <el-table-column
        label="奖励经验"
        align="center"
        prop="experience"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          <dict-tag
            :type="DICT_TYPE.COMMON_STATUS"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['point:sign-in-config:update']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-hasPermi="['point:sign-in-config:delete']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <sign-in-config-form
      ref="form"
      @success="getList"
    />
  </div>
</template>

<script>
import {
  deleteSignInConfig,
  getSignInConfigList
} from '@/api/member/signin/config'
import { DICT_TYPE } from '@/utils/dict'
import SignInConfigForm from './SignInConfigForm.vue'

export default {
  name: 'SignInConfig',
  components: { SignInConfigForm },
  data() {
    return {
      DICT_TYPE,
      loading: true,
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getSignInConfigList()
        .then(response => {
          this.list = response.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleAdd() {
      this.$refs.form.open('create')
    },
    handleUpdate(row) {
      this.$refs.form.open('update', row.id)
    },
    handleDelete(row) {
      this.$modal
        .confirm(`确认删除第 ${row.day} 天的签到规则吗？`)
        .then(() => deleteSignInConfig(row.id))
        .then(() => {
          this.$modal.msgSuccess('删除成功')
          this.getList()
        })
        .catch(() => {})
    }
  }
}
</script>
