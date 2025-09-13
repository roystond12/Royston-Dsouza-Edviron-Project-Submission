🔑 Auth

POST /api/login
→ Login with username & password → returns JWT token + user info.

👤 Users

(Auto-created) A test user is seeded when the server starts:
username: royston, password: hii.

💳 Payments

POST /api/payments/create (protected)
→ Create a new payment order.

🔔 Webhooks

POST /api/webhook
→ Endpoint for payment gateway to update transaction status.

📊 Transactions

GET /api/transactions (protected)
→ Get paginated list of all transactions. Supports ?page=1&limit=10&sort=payment_time&order=desc.

GET /api/transactions/school/:schoolId (protected)
→ Fetch transactions for a specific school.

GET /api/transactions/status/:custom_order_id (protected)
→ Fetch status of a single transaction by order id.

POST /api/transactions/seed 
→ Insert dummy transactions for testing.
