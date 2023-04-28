// import type { Document } from 'mongoose'
// import { Schema, model } from 'mongoose'

// interface Prompt {
//   content: string
//   order: number
// }

// interface LessonPlan extends Document {
//   title: string
//   description?: string
//   prompts: Prompt[]
// }

// const PromptSchema = new Schema<Prompt>({
//   content: {
//     type: String,
//     required: true,
//   },
//   order: {
//     type: Number,
//     required: true,
//   },
// })

// const LessonPlanSchema = new Schema<LessonPlan>({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//   },
//   prompts: [PromptSchema],
// })

// const LessonPlan = model<LessonPlan>('LessonPlan', LessonPlanSchema)

// export default { LessonPlan }
