import { Client } from '@core/client';

(function() {
  window.engine = new Client(document.getElementById('render-area'));
})();
