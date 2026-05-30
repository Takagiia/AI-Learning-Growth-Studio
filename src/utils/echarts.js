/** ECharts 深色主题配色与基础配置 */

export const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4']

/** 全局图表动画配置（考核点：动态效果） */
export const chartAnimation = {
  animation: true,
  animationDuration: 1200,
  animationEasing: 'cubicOut',
  animationDelay: (idx) => idx * 80,
}

export const darkChartTheme = {
  backgroundColor: 'transparent',
  textStyle: { color: '#94a3b8' },
  ...chartAnimation,
}

/** 折线图基础 option */
export function buildLineOption({ title, labels, values, seriesName = '学习时长' }) {
  return {
    ...darkChartTheme,
    title: title ? { text: title, textStyle: { color: '#f1f5f9', fontSize: 14 } } : undefined,
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 24, top: title ? 48 : 32, bottom: 32 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.3)' } },
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
      axisLabel: { color: '#94a3b8' },
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
export function buildBarOption({ title, labels, values, seriesName = '任务数' }) {
  return {
    ...darkChartTheme,
    title: title ? { text: title, textStyle: { color: '#f1f5f9', fontSize: 14 } } : undefined,
    tooltip: { trigger: 'axis' },
    grid: { left: 48, right: 24, top: title ? 48 : 32, bottom: 32 },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.3)' } },
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
      axisLabel: { color: '#94a3b8' },
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
export function buildPieOption({ title, data }) {
  return {
    ...darkChartTheme,
    title: title ? { text: title, textStyle: { color: '#f1f5f9', fontSize: 14 } } : undefined,
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#94a3b8' } },
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
