<script setup>
import { onMounted, ref, watch } from 'vue'
import CourseCard from '@/components/common/CourseCard.vue'
import LazyImage from '@/components/common/LazyImage.vue'
import { getCourseListApi, getCourseDetailApi } from '@/api/course'
import { debounce } from '@/utils/debounce'

const loading = ref(false)
const courses = ref([])
const categories = ref([])
const category = ref('all')
const keyword = ref('')

const drawerVisible = ref(false)
const detailLoading = ref(false)
const courseDetail = ref(null)

async function fetchList() {
  loading.value = true
  try {
    const res = await getCourseListApi({
      category: category.value === 'all' ? '' : category.value,
      keyword: keyword.value,
    })
    courses.value = res.data.list
    categories.value = res.data.categories || []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(() => {
  fetchList()
}, 400)

watch(keyword, () => {
  debouncedSearch()
})

watch(category, () => {
  fetchList()
})

onMounted(fetchList)

async function openDetail(course) {
  drawerVisible.value = true
  detailLoading.value = true
  courseDetail.value = null
  try {
    const res = await getCourseDetailApi(course.id)
    courseDetail.value = res.data
  } finally {
    detailLoading.value = false
  }
}
</script>

<template>
  <div class="page-container course-page">
    <el-card class="glass-card" shadow="never">
      <template #header>
        <div class="course-page__header">
          <span>课程管理</span>
          <div class="course-page__tools">
            <el-radio-group v-model="category" size="default">
              <el-radio-button
                v-for="cat in categories"
                :key="cat.value"
                :value="cat.value"
              >
                {{ cat.label }}
              </el-radio-button>
            </el-radio-group>
            <el-input v-model="keyword" clearable placeholder="搜索课程名称/讲师" style="width: 220px" />
          </div>
        </div>
      </template>

      <el-row v-loading="loading" :gutter="20">
        <el-col v-for="course in courses" :key="course.id" :xs="24" :sm="12" :lg="6">
          <CourseCard :course="course" class="course-page__card" @click="openDetail" />
        </el-col>
      </el-row>
      <el-empty v-if="!loading && !courses.length" description="暂无课程" />
    </el-card>

    <el-drawer v-model="drawerVisible" title="课程详情" size="420px" destroy-on-close>
      <div v-loading="detailLoading">
        <template v-if="courseDetail">
          <LazyImage :src="courseDetail.cover" :alt="courseDetail.title" class="course-detail__cover" />
          <h3>{{ courseDetail.title }}</h3>
          <p class="course-detail__desc">{{ courseDetail.description }}</p>
          <p class="course-detail__meta">
            讲师：{{ courseDetail.teacher }} · {{ courseDetail.lessons }} 课时
          </p>
          <div class="course-detail__progress">
            <span>学习进度</span>
            <span>{{ courseDetail.progress }}%</span>
          </div>
          <el-progress :percentage="courseDetail.progress" :stroke-width="10" />
          <el-divider>章节列表</el-divider>
          <el-timeline>
            <el-timeline-item
              v-for="ch in courseDetail.chapters"
              :key="ch.id"
              :type="ch.done ? 'success' : 'primary'"
            >
              {{ ch.title }} · {{ ch.duration }}
            </el-timeline-item>
          </el-timeline>
        </template>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.course-page__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.course-page__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.course-page__card {
  margin-bottom: 20px;
}

.course-detail__cover {
  width: 100%;
  height: 160px;
  border-radius: $radius-md;
  margin-bottom: 16px;
  overflow: hidden;

  :deep(.lazy-image) {
    height: 160px;
    border-radius: $radius-md;
  }
}

.course-detail__desc {
  color: $color-text-secondary;
  margin: 12px 0;
  line-height: 1.6;
}

.course-detail__meta {
  font-size: 13px;
  color: $color-text-muted;
  margin-bottom: 16px;
}

.course-detail__progress {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 8px;
}
</style>
