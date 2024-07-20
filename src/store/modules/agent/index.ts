import { defineStore } from 'pinia'
import { Agent } from '@/typings/agentChat/Agent'
import newsIcon from '@/assets/news.svg'
import syllabusIcon from '@/assets/syllabus.svg'
import pheonixIcon from '@/assets/pheonix.svg'

export interface AgentPreview {
  agent: Agent
  iconSrc: string
  title: string
}

export const agentList: AgentPreview[] = [
  { agent: Agent.NEWS_AGENT, iconSrc: newsIcon, title: '薯塔' },
  { agent: Agent.SYLLABUS_AGENT, iconSrc: syllabusIcon, title: '学姐Lora' },
  { agent: Agent.PHEONIX, iconSrc: pheonixIcon, title: '凤凰GPT' },
]

export const useAgentStore = defineStore('agent-store', {
  state: () => ({
    agent: Agent.NEWS_AGENT,
  }),

  actions: {
    setAgent(agent: Agent) {
      this.agent = agent
    },
  },
})
