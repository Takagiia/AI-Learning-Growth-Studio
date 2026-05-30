/**
 * ECharts 按需引入（tree-shaking）
 * 仅注册项目实际使用的图表类型与组件，将 echarts 体积从 ~1MB 降至 ~350KB
 *
 * 使用方式：import echarts from '@/utils/echarts-init'
 * 替代原先的 import('echarts') 全量导入
 */
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'

echarts.use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

export default echarts
