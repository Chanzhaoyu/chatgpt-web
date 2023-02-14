declare namespace Chat{
	 interface ChatOptions {
		conversationId?: string
		parentMessageId?: string
	}

	 interface Chat {
		dateTime: string
		message: string
		reversal?: boolean
		error?: boolean
		options?: ChatOptions
	}

	 interface HistoryChat {
		title: string
		isEdit: boolean
		data: Chat[]
	}
}
