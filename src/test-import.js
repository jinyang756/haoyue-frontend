try {
  require('./services/apiService');
  console.log('Module loaded successfully');
} catch (e) {
  console.error('Failed to load module:', e);
}