/** ECharts 主题配色与基础配置（深色 + 浅色） */

export const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444']

/** 全局图表动画配置（考核点：动态效果） */
export const chartAnimation = {
  animation: true,
  animationDuration: 1200,
  animationEasing: 'cubicOut',
  animationDelay: (idx) => idx * 80,
}

/** 深色模式图表主题 */
export const darkChartTheme = {
  backgroundColor: 'transparent',
  textStyle: { color: '#94a3b8' },
  ...chartAnimation,
}

/** 浅色模式图表主题（Gemini 建议：坐标轴灰色、网格线更淡） */
export const lightChartTheme = {
  backgroundColor: 'transparent',
  textStyle: { color: '#718096' },
  ...chartAnimation,
}

/** 根据当前模式返回图表主题 */
export function getChartTheme(isDark = true) {
  return isDark ? darkChartTheme : lightChartTheme
}

/** 获取坐标轴样式（浅色模式下灰色适配） */
export function getAxisStyle(isDark = true) {
  return {
    axisLine: { lineStyle: { color: isDark ? 'rgba(148,163,184,0.3)' : '#d1d5db' } },
    axisLabel: { color: isDark ? '#94a3b8' : '#718096' },
    splitLine: { lineStyle: { color: isDark ? 'rgba(148,163,184,0.1)' : '#e5e7eb' } },
  }
}

/** 折线图基础 option */
export function buildLineOption({ title, labels, values, seriesName = '学习时长', isDark = true }) {
  const theme = getChartTheme(isDark)
  const axis = getAxisStyle(isDark)
  return {
    ...theme,
    title: title ? { text: title, textStyle: { color: isDark ? '#f1f5f9' : '#2d3748', fontSize: 14 } } : undefined,
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 24, top: title ? 48 : 32, bottom: 32 },
    xAxis: {
      type: 'category',
      data: labels,
      ...axis,
    },
    yAxis: {
      type: 'value',
      ...axis,
    },
    series: [
      {
        name: seriesName,
        type: 'line',
        smooth: true,
        data: values,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59,130,246,0.35)' },
              { offset: 1, color: 'rgba(59,130,246,0)' },
            ],
          },
        },
        lineStyle: { color: CHART_COLORS[0], width: 2 },
        itemStyle: { color: CHART_COLORS[0] },
        emphasis: { focus: 'series' },
      },
    ],
  }
}

/** 柱状图基础 option */
export function buildBarOption({ title, labels, values, seriesName = '任务数', isDark = true }) {
  const theme = getChartTheme(isDark)
  const axis = getAxisStyle(isDark)
  return {
    ...theme,
    title: title ? { text: title, textStyle: { color: isDark ? '#f1f5f9' : '#2d3748', fontSize: 14 } } : undefined,
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 24, top: title ? 48 : 32, bottom: 32 },
    xAxis: {
      type: 'category',
      data: labels,
      ...axis,
    },
    yAxis: {
      type: 'value',
      ...axis,
    },
    series: [
      {
        name: seriesName,
        type: 'bar',
        barWidth: '40%',
        data: values,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: CHART_COLORS[1] },
              { offset: 1, color: CHART_COLORS[0] },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: { focus: 'series' },
      },
    ],
  }
}

/** 把各种日期格式归一化为 YYYY-MM-DD（echarts calendar 必需） */
function normalizeDate(input) {
  if (input == null) return ''
  if (typeof input === 'number') {
    // 纯数字按时间戳处理
    const d = new Date(input)
    if (Number.isNaN(d.getTime())) return ''
    return formatYMD(d)
  }
  const str = String(input).trim()
  if (!str) return ''
  // 已经是 YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(str)) {
    const [y, m, d] = str.split('-')
    return `${y}-${pad(m)}-${pad(d)}`
  }
  // YYYY/MM/DD 或 YYYY.MM.DD 或 YYYY_MM_DD
  const m1 = str.match(/^(\d{4})[\/.\u5e74](\d{1,2})[\/.\u6708](\d{1,2})/)
  if (m1) return `${m1[1]}-${pad(m1[2])}-${pad(m1[3])}`
  // MM/DD/YYYY
  const m2 = str.match(/^(\d{1,2})[\/.\u6708](\d{1,2})[\/.\u65e5](\d{4})/)
  if (m2) return `${m2[3]}-${pad(m2[1])}-${pad(m2[2])}`
  // ISO 8601 / RFC 2822 等
  const d = new Date(str)
  if (!Number.isNaN(d.getTime())) return formatYMD(d)
  return ''
}

function pad(n) {
  return String(n).padStart(2, '0')
}
function formatYMD(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 学习热力图 option */
export function buildHeatmapOption({ data = [], year, isDark = true }) {
  const theme = getChartTheme(isDark)
  // 归一化日期 + 过滤无效项
  const normalized = (Array.isArray(data) ? data : [])
    .map((item) => {
      if (!Array.isArray(item) || item.length < 2) return null
      const date = normalizeDate(item[0])
      if (!date) return null
      return [date, Number(item[1]) || 0]
    })
    .filter(Boolean)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))

  const values = normalized.map(([, v]) => v)
  const maxValue = Math.max(...values, 0)
  const usesMinuteScale = maxValue > 5
  const range =
    year ??
    (normalized.length
      ? [normalized[0][0], normalized[normalized.length - 1][0]]
      : new Date().getFullYear())

  return {
    ...theme,
    tooltip: {
      position: 'top',
      formatter: (params) => {
        const [date, value] = Array.isArray(params.value) ? params.value : ['', params.value]
        return usesMinuteScale ? `${date}：${value} 分钟` : `${date}：${value}`
      },
    },
    visualMap: usesMinuteScale
      ? {
          min: 0,
          max: Math.max(maxValue, 180),
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          bottom: 0,
          textStyle: { color: isDark ? '#94a3b8' : '#718096' },
          pieces: [
            { min: 120, label: '120分钟以上', color: '#6366f1' },
            { min: 60, max: 119, label: '60-119分钟', color: '#8b5cf6' },
            { min: 30, max: 59, label: '30-59分钟', color: '#06b6d4' },
            { min: 1, max: 29, label: '1-29分钟', color: '#a5b4fc' },
            { min: 0, max: 0, label: '未学习', color: isDark ? '#1e293b' : '#e5e7eb' },
          ],
        }
      : {
          min: 0,
          max: Math.max(maxValue, 5),
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '0%',
          inRange: {
            color: isDark
              ? ['rgba(59, 130, 246, 0.1)', '#3b82f6']
              : ['#eff6ff', '#1d4ed8'],
          },
          show: false,
        },
    calendar: {
      top: 30,
      left: 30,
      right: 30,
      range,
      cellSize: ['auto', usesMinuteScale ? 14 : 13],
      splitLine: usesMinuteScale
        ? { lineStyle: { color: isDark ? '#1e293b' : '#e2e8f0' } }
        : { show: false },
      itemStyle: {
        borderWidth: 2,
        borderColor: isDark ? (usesMinuteScale ? '#0b1020' : 'rgba(0,0,0,0.2)') : '#fff',
        color: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
        borderRadius: 2,
      },
      yearLabel: { show: false },
      dayLabel: {
        color: isDark ? '#94a3b8' : '#718096',
        fontSize: 10,
        margin: usesMinuteScale ? 4 : undefined,
        nameMap: 'cn',
      },
      monthLabel: {
        color: isDark ? '#94a3b8' : '#718096',
        fontSize: 10,
        margin: usesMinuteScale ? 8 : undefined,
        align: usesMinuteScale ? 'left' : undefined,
        nameMap: 'cn',
      },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: normalized,
      },
    ],
  }
}

/** 环形图基础 option */
export function buildPieOption({ title, data, isDark = true }) {
  const theme = getChartTheme(isDark)
  return {
    ...theme,
    title: title ? { text: title, textStyle: { color: isDark ? '#f1f5f9' : '#2d3748', fontSize: 14 } } : undefined,
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: isDark ? '#94a3b8' : '#718096' } },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#0a0e1a', borderWidth: 2 },
        label: { color: '#cbd5e1' },
        emphasis: {
          scale: true,
          scaleSize: 8,
        },
        data: data.map((item, i) => ({
          ...item,
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        })),
      },
    ],
  }
}

