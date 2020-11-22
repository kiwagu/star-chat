'use strict';

(function () {
  const loadPinForm = (paymentSessionKey) => {
    const gatewayUrl = 'http://localhost:4000';
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=300,left=100,top=100`;
    const form = document.createElement('form');
    form.target = 'Payment';
    form.method = 'POST';
    form.action = gatewayUrl;
    form.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'paymentSessionKey';
    input.value = paymentSessionKey;
    form.appendChild(input);

    document.body.appendChild(form);

    const paymentWindow = window.open('', 'Payment', params);
    if (paymentWindow) {
      form.submit();
    }
  };

  if (!window.PMNTS) window.PMNTS = { loadPinForm };
})();
