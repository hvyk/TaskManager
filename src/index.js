const app = require('./app');

const port = process.env.PORT;

// Start server
app.listen(port, () => {
  console.log(`Server runnning on port ${port}`);
});