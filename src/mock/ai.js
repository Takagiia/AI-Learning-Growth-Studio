import { aiReplyMap, defaultAiReply } from './_store'

function matchReply(question) {
  const q = String(question || '').toLowerCase()
  for (const item of aiReplyMap) {
    if (item.keywords.some((kw) => q.includes(kw.toLowerCase()))) {
      return item.reply
    }
  }
  return defaultAiReply
}

/** AI 助手 Mock */
export default [
  {
    url: '/api/ai/chat',
    method: 'post',
    response: ({ body }) => {
      const question = body?.question || ''
      const reply = matchReply(question)
      return {
        code: 200,
        message: 'ok',
        data: {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: reply,
          createdAt: new Date().toISOString(),
        },
      }
    },
  },
  {
    url: '/api/ai/quick-questions',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: [
        '如何准备考研？',
        '怎样提高英语学习效率？',
        'Vue3 项目学习路线是什么？',
        '如何做时间管理？',
        '算法刷题有什么建议？',
      ],
    }),
  },
]
