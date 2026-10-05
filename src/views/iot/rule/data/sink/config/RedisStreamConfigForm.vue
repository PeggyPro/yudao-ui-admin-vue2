<template>
<div class="iot-vue2-root">

  <el-form-item label="主机地址" prop="config.host">
    <el-input v-model="config.host" placeholder="请输入主机地址，如：localhost" />
  </el-form-item>
  <el-form-item label="端口" prop="config.port">
    <el-input-number
      v-model="config.port"
      :max="65535"
      :min="1"
      controls-position="right"
      placeholder="请输入端口"
    />
  </el-form-item>
  <el-form-item label="密码" prop="config.password">
    <el-input v-model="config.password" placeholder="请输入密码" show-password type="password" />
  </el-form-item>
  <el-form-item label="数据库" prop="config.database">
    <el-input-number
      v-model="config.database"
      :max="15"
      :min="0"
      controls-position="right"
      placeholder="请输入数据库索引"
    />
  </el-form-item>
  <el-form-item label="主题" prop="config.topic">
    <el-input v-model="config.topic" placeholder="请输入主题" />
  </el-form-item>

    <el-form-item
      label="数据结构"
      prop="config.dataStructure"
    >
      <el-select
        v-model="config.dataStructure"
        placeholder="请选择数据结构"
        style="width: 100%"
      >
        <el-option
          v-for="item in IOT_REDIS_DATA_STRUCTURE_OPTIONS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="config.dataStructure === IotRedisDataStructureEnum.HASH"
      label="Hash 字段"
      prop="config.hashField"
    >
      <el-input
        v-model="config.hashField"
        placeholder="留空时使用设备 ID"
      />
    </el-form-item>
    <el-form-item
      v-if="config.dataStructure === IotRedisDataStructureEnum.ZSET"
      label="Score 字段"
      prop="config.scoreField"
    >
      <el-input
        v-model="config.scoreField"
        placeholder="留空时使用当前时间戳"
      />
    </el-form-item>
</div>
</template>
<script>
import '@/views/iot/styles/vue2.css';
import { onMounted, set } from 'vue';
import { defineComponent as _defineComponent } from 'vue';
import { IotDataSinkTypeEnum } from '@/api/iot/rule/data/sink';
import { useVModel } from '@/views/iot/utils/composables';
import { IOT_REDIS_DATA_STRUCTURE_OPTIONS, IotRedisDataStructureEnum } from '@/views/iot/utils/constants';
export default /*@__PURE__*/ _defineComponent({
    ...{ name: 'RedisStreamMQConfigForm' },
    __name: 'RedisStreamConfigForm',
    props: {
        value: { type: null, required: true }
    },
    emits: ['input'],
    setup(__props, { expose: __expose, emit: __emit }) {
        __expose();
        const props = __props;
        const emit = __emit;
        const config = useVModel(props, 'value', emit);
        /** 组件初始化 */
    onMounted(() => {
      // 数字控件挂载会回写 undefined，键全为空时初始化配置
      if (config.value && Object.keys(config.value).some((key) => config.value[key] !== undefined)) {
        if (config.value.dataStructure == null) {
          set(config.value, 'dataStructure', IotRedisDataStructureEnum.STREAM)
        }
        return
      }
      config.value = {
        type: IotDataSinkTypeEnum.REDIS_STREAM + '', // 序列化成对应类型时使用
        host: '',
        port: 6379,
        password: '',
        database: 0,
        dataStructure: IotRedisDataStructureEnum.STREAM,
        topic: ''
      }
    })
    const __returned__ = { props, emit, config, IOT_REDIS_DATA_STRUCTURE_OPTIONS, IotRedisDataStructureEnum };
        Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
        return __returned__;
    }
});

</script>

