(function (window) {
  window.__env__ = window.__env__ || {};
  // In development this uses the Angular proxy, so requests are sent to the backend
  // without triggering browser CORS issues.
  window.__env__.API_BASE_URL = '/api/v1';
  window.__env__.API_KEY = '';
})(this);
