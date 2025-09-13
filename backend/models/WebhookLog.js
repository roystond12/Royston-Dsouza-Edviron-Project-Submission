import mongoose from 'mongoose';

const WebhookLogSchema = new mongoose.Schema({
  gateway_name: String,
  payload: Object,
  receivedAt: { type: Date, default: Date.now }
});

export default mongoose.models.WebhookLog || mongoose.model("WebhookLog", WebhookLogSchema);
