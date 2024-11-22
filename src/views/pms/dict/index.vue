<template>
  <CommonPage>
    <template #action>
      <NButton
        type="primary"
        @click="handleAdd({ parentId: 0, sort: 0, isSealed: 0, isEditable: 0, dictKey: '-1' })"
      >
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新字典
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.getDicts"
      export-name="字典列表"
      :is-pagination="false"
    />

    <MeModal ref="modalRef" width="500px" title="创建新字典">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="字典编号" path="code" :span="3" :rule="{
            required: true,
            message: '请输入字典编号',
          }"
        >
          <n-input
            v-model:value="modalForm.code"
            :disabled="modalForm.dictKey !== '-1'"
            placeholder="请输入字典编号"
          />
        </n-form-item>

        <n-form-item label="上级字典" :span="3">
          <n-input
            v-model:value="modalForm.parentDictValue"
            disabled
            placeholder="请选择上级字典"
          />
        </n-form-item>

        <n-form-item
          label="字典名称" path="dictValue" :span="3" :rule="{
            required: true,
            message: '请输入字典名称',
          }"
        >
          <n-input
            v-model:value="modalForm.dictValue"
            placeholder="请输入字典名称"
          />
        </n-form-item>

        <n-form-item label="字典键值" path="dictKey" :span="3" :rule="{ required: true, message: '请输入字典键值' }">
          <n-input
            v-model:value="modalForm.dictKey"
            placeholder="请输入字典键值"
            :disabled="modalForm.dictKey === '-1'"
          />
        </n-form-item>

        <n-form-item label="排序" path="sort" :span="3">
          <n-input-number
            v-model:value="modalForm.sort"
            placeholder="请输入排序"
          />
        </n-form-item>

        <n-form-item label="备注" path="remark" :span="3">
          <n-input
            v-model:value="modalForm.remark"
            placeholder="请输入备注"
            type="textarea"
          />
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { MeCrud, MeModal } from '@/components'
import { useCrud } from '@/composables'
import { NButton, NTag } from 'naive-ui'
import api from './api'

defineOptions({
  name: 'DictsIndex',
})

const $table = shallowRef(null)
onMounted(() => {
  $table.value?.handleSearch()
})

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleEdit,
} = useCrud({
  name: '字典',
  initForm: { },
  doCreate: api.save,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: _ => $table.value?.handleSearch(),
})

const columns = [
  {
    title: '字典编号',
    key: 'code',
    width: 200,
    treeNode: true,
  },
  // {
  //   title: '上级字典',
  //   key: 'parentId',
  //   width: 200,
  //   formatter: ({ row }) => {
  //     return row.parentId === 0 ? '根字典' : row.parentId
  //   },
  // },
  {
    title: '字典名称',
    key: 'dictValue',
  },
  {
    title: '字典键值',
    key: 'dictKey',
    width: 160,
  },
  {
    title: '是否封存',
    key: 'isSealed',
    width: 100,
    align: 'center',
    render(row) {
      return [
        h(
          NTag,
          {
            type: 'primary',
            bordered: false,
          },
          {
            default: () => (row.isSealed ? '是' : '否'),
          },
        ),
      ]
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 310,
    fixed: 'right',
    align: 'right',
    render: (row) => {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: async () => {
              handleAdd({ parentId: row.id, parentDictValue: row.dictValue, code: row.code, sort: 0 })
            },
          },
          {
            default: () => '添加子字典',
            icon: () =>
              h('i', { class: 'i-material-symbols:add text-18' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: async () => {
              handleEdit(row)
            },
          },
          {
            default: () => '编辑',
            /** ***********  ✨ Codeium Command ⭐  */
            // render an edit icon, see https://icones.js.org/collection/material-symbols for more icons
            /** ****  c800d184-4b02-432a-b649-ccfe17384040  */
            icon: () =>
              h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: async () => {
              handleDelete(row.id)
            },
          },
          {
            default: () => '删除',
            icon: () =>
              h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          },
        ),
      ]
    },
  },
]
</script>

<style lang="scss" scoped></style>
