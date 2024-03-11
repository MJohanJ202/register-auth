import { app } from 'server.js'

const PORT = process.env['PORT'] ?? 5000
const HOST = process.env['HOST'] ?? 'localhost'

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on http://${HOST}:${PORT}/`)
})
