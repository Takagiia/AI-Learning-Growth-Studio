<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useStudyPlanStore } from '@/stores/studyPlan'
import { PLAN_PRIORITY, PLAN_STATUS } from '@/utils/constants'
import { debounce } from '@/utils/debounce'

const planStore = useStudyPlanStore()

const dialogVisible = ref(false)
const dialogTitle = ref('新增计划')
const editingId = ref(null)
const formRef = ref()

const form = reactive({
  title: '',
  content: '',
  deadline: '',
  priority: 'medium',
  status: 'pending',
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
}

/** 关键词防抖搜索（400ms） */
const debouncedKeywordSearch = debounce(() => {
  planStore.fetchPlans({ page: 1 })
}, 400)

watch(
  () => planStore.query.keyword,
  (val, oldVal) => {
    if (val !== oldVal) debouncedKeywordSearch()
  },
)

onMounted(() => {
  planStore.fetchPlans()
})

function openCreate() {
  editingId.value = null
  dialogTitle.value = '新增计划'
  Object.assign(form, { title: '', content: '', deadline: '', priority: 'medium', status: 'pending' })
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  dialogTitle.value = '编辑计划'
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

async function handleSubmit() {
  await formRef.value?.validate()
  if (editingId.value) {
    await planStore.editPlan(editingId.value, { ...form })
    ElMessage.success('更新成功')
  } else {
    await planStore.addPlan({ ...form })
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  planStore.fetchPlans()
}

async function handleDelete(row) {
  await ElMessageBox.confirm(`确定删除「${row.title}」？`, '提示', { type: 'warning' })
  await planStore.removePlan(row.id)
  ElMessage.success('已删除')
  planStore.fetchPlans()
}

async function handleToggle(row) {
  await planStore.toggleStatus(row.id)
  ElMessage.success('状态已更新')
}

function handleFilter() {
  planStore.fetchPlans({ page: 1 })
}

function handlePageChange(page) {
  planStore.fetchPlans({ page })
}
</script>

<template>
  <div class="page-container study-plan">
    <el-card class="glass-card" shadow="never">
      <template #header>
        <div class="study-plan__header">
          <span>学习计划</span>
          <el-button type="primary" :icon="Plus" @click="openCreate">新增计划</el-button>
        </div>
      </template>

      <el-form :inline="true" class="study-plan__filter">
        <el-form-item label="优先级">
          <el-select v-model="planStore.query.priority" clearable placeholder="全部" @change="handleFilter">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="planStore.query.status" clearable placeholder="全部" @change="handleFilter">
            <el-option label="待开始" value="pending" />
            <el-option label="进行中" value="doing" />
            <el-option label="已完成" value="done" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input
            v-model="planStore.query.keyword"
            clearable
            placeholder="搜索标题/内容"
            @keyup.enter="handleFilter"
            @clear="handleFilter"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="planStore.loading" :data="planStore.plans" stripe>
        <el-table-column prop="title" label="标题" min-width="140" />
        <el-table-column prop="content" label="学习内容" min-width="180" show-overflow-tooltip />
        <el-table-column prop="deadline" label="截止时间" width="120" />
        <el-table-column label="优先级" width="90">
          <template #default="{ row }">
            <el-tag :type="PLAN_PRIORITY[row.priority]?.type" size="small">
              {{ PLAN_PRIORITY[row.priority]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="PLAN_STATUS[row.status]?.type" size="small">
              {{ PLAN_STATUS[row.status]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleToggle(row)">切换状态</el-button>
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="planStore.query.page"
        :page-size="planStore.query.pageSize"
        :total="planStore.total"
        layout="total, prev, pager, next"
        class="study-plan__pager"
        @current-change="handlePageChange"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="学习内容">
          <el-input v-model="form.content" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker v-model="form.deadline" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-radio-group v-model="form.priority">
            <el-radio value="high">高</el-radio>
            <el-radio value="medium">中</el-radio>
            <el-radio value="low">低</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="pending">待开始</el-radio>
            <el-radio value="doing">进行中</el-radio>
            <el-radio value="done">已完成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.study-plan__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.study-plan__filter {
  margin-bottom: 16px;
}

.study-plan__pager {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
