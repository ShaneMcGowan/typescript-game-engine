import { Client } from './client';

(function() {
  window.engine = new Client(document.getElementById('render-area'));
})();
