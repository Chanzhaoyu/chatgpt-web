export interface TrainingFile {
  bytes: number
  created_at: number
  filename: string
  id: string
  object: string
  purpose: string
  status: string
  status_details: any
}

export interface HyperParam {
  batch_size: number
  learning_rate_multiplier: number
  n_epochs: number
  prompt_loss_weight: number
}
