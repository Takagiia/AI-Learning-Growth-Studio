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
        data: values,
        barWidth: '40%',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
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
        },
        emphasis: { focus: 'series' },
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

/** 学习热力图（日历形式，展示每日学习时长分布） */
export function buildHeatmapOption({ data, year = 2026, isDark = true }) {
  return {
    tooltip: {
      formatter: (p) => `${p.value[0]}：${p.value[1]} 分钟`,
    },
    visualMap: {
      min: 0,
      max: 180,
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
    },
    calendar: {
      top: 30,
      left: 30,
      right: 30,
      range: year,
      cellSize: ['auto', 14],
      splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#e2e8f0' } },
      itemStyle: { borderColor: isDark ? '#0b1020' : '#fff', borderWidth: 2 },
      dayLabel: { color: isDark ? '#94a3b8' : '#718096', margin: 4 },
      monthLabel: { color: isDark ? '#94a3b8' : '#718096', margin: 8, align: 'left' },
      yearLabel: { show: false },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data,
      },
    ],
  }
}
