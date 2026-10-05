<template>
  <div class="app-container">
    <doc-alert
      title="支付功能开启"
      url="https://doc.iocoder.cn/pay/build/"
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
        label="应用名"
        prop="name"
      >
        <el-input
          v-model="queryParams.name"
          placeholder="请输入应用名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="开启状态"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          placeholder="请选择开启状态"
          clearable
        >
          <el-option
            v-for="dict in getDictDatas(DICT_TYPE.COMMON_STATUS)"
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

    <!-- 操作工具栏 -->
    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['pay:app:create']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <right-toolbar
        :show-search.sync="showSearch"
        @queryTable="getList"
      />
    </el-row>

    <!-- 列表 -->
    <el-table
      v-loading="loading"
      :data="list"
    >
      <el-table-column
        label="应用标识"
        align="center"
        prop="appKey"
      />
      <el-table-column
        label="应用编号"
        align="center"
        prop="id"
      />
      <el-table-column
        label="应用名"
        align="center"
        prop="name"
      />
      <el-table-column
        label="开启状态"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="支付宝配置"
        align="center"
      >
        <el-table-column
          :label="payChannelEnum.ALIPAY_APP.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.ALIPAY_APP.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.ALIPAY_APP.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.ALIPAY_APP.code)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="payChannelEnum.ALIPAY_PC.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.ALIPAY_PC.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.ALIPAY_PC.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.ALIPAY_PC.code)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="payChannelEnum.ALIPAY_WAP.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.ALIPAY_WAP.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.ALIPAY_WAP.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.ALIPAY_WAP.code)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="payChannelEnum.ALIPAY_QR.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.ALIPAY_QR.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.ALIPAY_QR.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.ALIPAY_QR.code)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="payChannelEnum.ALIPAY_BAR.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.ALIPAY_BAR.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row,payChannelEnum.ALIPAY_BAR.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.ALIPAY_BAR.code)"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="微信配置"
        align="center"
      >
        <el-table-column
          :label="payChannelEnum.WX_LITE.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.WX_LITE.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WX_LITE.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WX_LITE.code)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="payChannelEnum.WX_PUB.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.WX_PUB.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WX_PUB.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WX_PUB.code)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="payChannelEnum.WX_APP.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.WX_APP.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WX_APP.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WX_APP.code)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="payChannelEnum.WX_NATIVE.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.WX_NATIVE.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WX_NATIVE.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WX_NATIVE.code)"
            />
          </template>
        </el-table-column>
        <!-- 微信 WAP 网站支付 -->
        <el-table-column
          :label="wxWapChannel.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, wxWapChannel.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, wxWapChannel.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, wxWapChannel.code)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="payChannelEnum.WX_BAR.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.WX_BAR.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WX_BAR.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WX_BAR.code)"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="模拟支付配置"
        align="center"
      >
        <el-table-column
          :label="payChannelEnum.MOCK.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.MOCK.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.MOCK.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.MOCK.code)"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="钱包支付配置"
        align="center"
      >
        <el-table-column
          :label="payChannelEnum.WALLET.name"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isChannelExists(scope.row.channelCodes, payChannelEnum.WALLET.code)"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WALLET.code)"
            />
            <el-button
              v-else
              type="danger"
              icon="el-icon-close"
              circle
              @click="handleChannel(scope.row, payChannelEnum.WALLET.code)"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['pay:app:update']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-hasPermi="['pay:app:delete']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <app-form
      ref="appFormRef"
      @success="getList"
    />

    <!-- 对话框（支付应用的配置） -->
    <WeixinChannelForm
      ref="weixinChannelFormRef"
      @success="getList"
    />
    <AlipayChannelForm
      ref="alipayChannelFormRef"
      @success="getList"
    />
    <MockChannelForm
      ref="mockChannelFormRef"
      @success="getList"
    />
    <WalletChannelForm
      ref="walletChannelFormRef"
      @success="getList"
    />
  </div>
</template>

<script>
import { changeAppStatus, deleteApp, getAppPage } from '@/api/pay/app'
import { PayChannelEnum, CommonStatusEnum } from '@/utils/constants'
import { DICT_TYPE, getDictDatas } from '@/utils/dict'
import AppForm from './components/AppForm.vue'
import AlipayChannelForm from './components/channel/AlipayChannelForm.vue'
import WeixinChannelForm from './components/channel/WeixinChannelForm.vue'
import MockChannelForm from './components/channel/MockChannelForm.vue'
import WalletChannelForm from './components/channel/WalletChannelForm.vue'

export default {
  name: 'PayApp',
  components: {
    AppForm,
    AlipayChannelForm,
    WeixinChannelForm,
    MockChannelForm,
    WalletChannelForm
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 支付应用信息列表
      list: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        status: null,
        createTime: []
      },
      DICT_TYPE,
      // 支付渠道枚举
      payChannelEnum: PayChannelEnum,
      // 微信 WAP 网站支付渠道（页面专用）
      wxWapChannel: { code: 'wx_wap', name: '微信 WAP 网站支付' }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getDictDatas,
    /** 查询列表 */
    getList() {
      this.loading = true
      // 执行查询
      getAppPage(this.queryParams).then(response => {
        const page = response.data
        this.list = page.list
        this.total = page.total
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
      this.$refs.appFormRef.open('create')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.appFormRef.open('update', row.id)
    },
    // 用户状态修改
    handleStatusChange(row) {
      const text = row.status === CommonStatusEnum.ENABLE ? '启用' : '停用'
      this.$modal.confirm('确认要"' + text + '""' + row.name + '"应用吗?').then(() => {
        return changeAppStatus({ id: row.id, status: row.status })
      }).then(() => {
        this.$modal.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE
          : CommonStatusEnum.ENABLE
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除支付应用信息编号为"' + row.id + '"的数据项?').then(function() {
        return deleteApp(row.id)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /**
     * 修改支付渠道信息
     */
    handleChannel(row, code) {
      if (code.indexOf('alipay_') === 0) {
        this.$refs['alipayChannelFormRef'].open(row.id, code)
        return
      }
      if (code.indexOf('wx_') === 0) {
        this.$refs['weixinChannelFormRef'].open(row.id, code)
        return
      }
      if (code === 'mock') {
        this.$refs['mockChannelFormRef'].open(row.id, code)
        return
      }
      if (code === 'wallet') {
        this.$refs['walletChannelFormRef'].open(row.id, code)
        return
      }
    },
    /**
     * 根据渠道编码判断渠道列表中是否存在
     *
     * @param channels 渠道列表
     * @param channelCode 渠道编码
     */
    isChannelExists(channels, channelCode) {
      return channels && channels.indexOf(channelCode) !== -1
    }
  }
}
</script>
