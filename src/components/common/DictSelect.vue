<template>
  <template v-if="props.type === 'select'">
    <n-select
      :placeholder="props.placeholder"
      max-tag-count="responsive"
      :options="options"
      :value="value"
      label-field="dictValue"
      value-field="dictKey"
      :multiple="isMultiple"
      clearable
      style="min-width: 200px"
      @update:value="updateValue"
    />
  </template>
  <template v-else>
    <template v-if="isMultiple">
      <n-checkbox-group :value="value" @update:value="updateValue">
        <n-space item-style="display: flex;">
          <n-checkbox
            v-for="(v, k) in options"
            :key="k"
            :value="v.dictKey"
            :label="v.dictValue"
          />
        </n-space>
      </n-checkbox-group>
    </template>
    <template v-else>
      <n-radio-group
        :value="value"
        name="radiogroup"
        @update:value="updateValue"
      >
        <n-space>
          <n-radio v-for="(v, k) in options" :key="k" :value="v.dictKey">
            {{ v.dictValue }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </template>
  </template>
</template>

<script setup>
import { useAppStore } from '@/store'

defineOptions({ name: 'DictSelect' })
const props = defineProps({
  dictKey: {
    type: String,
    default: 'project_category',
  },
  modelValue: {
    default: null,
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  // 选择方式,select下拉框,box 单选或者多选框
  type: {
    type: String,
    default: 'select',
  },
  multiple: {
    type: Boolean,
    default: null,
  },
})
const emits = defineEmits(['update:modelValue', 'change'])
const appStore = useAppStore()
const options = computed(() => {
  return appStore.allDict?.find(i => i.code === props.dictKey)?.children
})
const value = ref(null)
const isMultiple = ref(false)

onMounted(() => {
  setValue()
})

watch(
  () => props.modelValue,
  () => {
    setValue()
  },
)

function setValue() {
  if (!props.modelValue) {
    isMultiple.value = props.multiple
    value.value = null
    return
  }
  const parentValue = JSON.parse(JSON.stringify(props.modelValue))
  value.value = parentValue
  isMultiple.value = Array.isArray(parentValue)
}

function updateValue(e) {
  emits('update:modelValue', e)
  emits('change', e)
}
</script>
