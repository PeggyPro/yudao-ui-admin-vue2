<template>
  <div class="app-container">
    <doc-alert
      title="配置中心"
      url="https://doc.iocoder.cn/config-center/"
    />
    <!-- 搜索工作栏 -->
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item
        label="参数名称"
        prop="name"
      >
        <el-input
          v-model="queryParams.name"
          placeholder="请输入参数名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="参数键名"
        prop="key"
      >
        <el-input
          v-model="queryParams.key"
          placeholder="请输入参数键名"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="系统内置"
        prop="type"
      >
        <el-select
          v-model="queryParams.type"
          placeholder="系统内置"
          clearable
        >
          <el-option
            v-for="dict in getDictDatas(DICT_TYPE.INFRA_CONFIG_TYPE)"
            :key="parseInt(dict.value)"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="创建时间"
        prop="createTime"
      >
        <el-date-picker
          v-model="queryParams.createTime"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['infra:config:create']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['infra:config:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['infra:config:delete']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="isEmpty(checkedIds)"
          @click="handleDeleteBatch"
        >
          批量删除
        </el-button>
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <el-table
      v-loading="loading"
      :data="configList"
      @selection-change="handleRowCheckboxChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="参数主键"
        align="center"
        prop="id"
      />
      <el-table-column
        label="参数分类"
        align="center"
        prop="category"
      />
      <el-table-column
        label="参数名称"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="参数键名"
        align="center"
        prop="key"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="参数键值"
        align="center"
        prop="value"
      />
      <el-table-column
        label="系统内置"
        align="center"
        prop="type"
      >
        <template slot-scope="scope">
          <dict-tag
            :type="DICT_TYPE.INFRA_CONFIG_TYPE"
            :value="scope.row.type"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="是否可见"
        align="center"
        prop="visible"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.visible ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['infra:config:update']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['infra:config:delete']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <config-form
      ref="form"
      @success="getList"
    />
  </div>
</template>

<script>
import { getConfigPage, deleteConfig, exportConfig, deleteConfigList } from '@/api/infra/config'
import ConfigForm from './ConfigForm.vue'

export default {
  name: 'InfraConfig',
  components: { ConfigForm },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 参数表格数据
      configList: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: undefined,
        key: undefined,
        type: undefined,
        createTime: []
      },
      checkedIds: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      getConfigPage(this.queryParams).then(response => {
        this.configList = response.data.list
        this.total = response.data.total
      }).catch(() => {
        this.configList = []
        this.total = 0
      }).finally(() => {
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.form.open('create')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.form.open('update', row.id)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$modal.confirm('是否确认删除参数编号为"' + ids + '"的数据项?').then(function() {
        return deleteConfig(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$modal.confirm('是否确认导出所有参数数据项?').then(() => {
        // 处理查询参数
        const params = { ...this.queryParams }
        params.pageNo = undefined
        params.pageSize = undefined
        this.exportLoading = true
        return exportConfig(params)
      }).then(response => {
        this.$download.excel(response, '参数配置.xls')
      }).finally(() => {
        this.exportLoading = false
      })
    },
    handleRowCheckboxChange(selection) {
      this.checkedIds = selection.map(item => item.id)
    },
    handleDeleteBatch() {
      const ids = this.checkedIds
      this.$modal.confirm('是否确认删除选中的' + this.checkedIds.length + '项数据?').then(function() {
        return deleteConfigList(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    }
  }
}
</script>
