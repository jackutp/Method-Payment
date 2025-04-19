document.addEventListener('DOMContentLoaded', function() {
    const methods = document.querySelectorAll('.method');
    const modal = document.getElementById('paymentModal');
    const closeModal = document.querySelector('.close');
    const confirmPaymentBtn = document.getElementById('confirmPayment');
    const successModal = document.getElementById('successModal');
    const closeSuccess = document.getElementById('closeSuccess');
    const cardNumberPreview = document.querySelector('.card-number span');
    const cardNamePreview = document.querySelector('.card-name span');
    const cardExpiryPreview = document.querySelector('.card-expiry span');
    const cardLogo = document.querySelector('.card-logo i');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardNameInput = document.getElementById('cardName');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    const cardForm = document.getElementById('cardForm');
    const qrForm = document.getElementById('qrForm');
    const cashForm = document.getElementById('cashForm');
    const modalTitle = document.getElementById('modalTitle');
    
    let selectedMethod = '';
    methods.forEach(method => {
        method.addEventListener('click', function() {
            selectedMethod = this.getAttribute('data-method');
            openModal(selectedMethod);
        });
    });
    
    function openModal(method) {
        modal.style.display = 'block';
        cardForm.style.display = 'none';
        qrForm.style.display = 'none';
        cashForm.style.display = 'none';
        
        switch(method) {
            case 'debit':
            case 'credit':
            case 'mastercard':
                modalTitle.textContent = 'Ingrese los datos de la tarjeta';
                cardForm.style.display = 'block';
                if (method === 'mastercard') {
                    cardLogo.className = 'fab fa-cc-mastercard';
                } else {
                    cardLogo.className = method === 'credit' ? 'far fa-credit-card' : 'fas fa-credit-card';
                }
                break;
                
            case 'yape':
            case 'plin':
                modalTitle.textContent = `Pago con ${method.charAt(0).toUpperCase() + method.slice(1)}`;
                qrForm.style.display = 'block';
                break;
                
            case 'cash':
                modalTitle.textContent = 'Pago en Efectivo';
                cashForm.style.display = 'block';
                break;
        }
    }
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    closeSuccess.addEventListener('click', function() {
        successModal.style.display = 'none';
        modal.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === successModal) {
            successModal.style.display = 'none';
            modal.style.display = 'none';
        }
    });
    
    confirmPaymentBtn.addEventListener('click', function() {
        if (selectedMethod === 'debit' || selectedMethod === 'credit' || selectedMethod === 'mastercard') {
            if (validateCardForm()) {
                setTimeout(() => {
                    modal.style.display = 'none';
                    successModal.style.display = 'block';
                }, 1000);
            }
        } else {
            modal.style.display = 'none';
            successModal.style.display = 'block';
        }
    });
    
    function validateCardForm() {
        let isValid = true;
        
        const cardNumber = cardNumberInput.value.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cardNumber)) {
            document.getElementById('cardNumberError').textContent = 'El número de tarjeta debe tener 16 dígitos';
            document.getElementById('cardNumberError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('cardNumberError').style.display = 'none';
        }
        
        if (cardNameInput.value.trim() === '') {
            document.getElementById('cardNameError').textContent = 'Ingrese el nombre del titular';
            document.getElementById('cardNameError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('cardNameError').style.display = 'none';
        }
        
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDateInput.value)) {
            document.getElementById('expiryDateError').textContent = 'Formato inválido (MM/AA)';
            document.getElementById('expiryDateError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('expiryDateError').style.display = 'none';
        }
        
        if (!/^\d{3}$/.test(cvvInput.value)) {
            document.getElementById('cvvError').textContent = 'El CVV debe tener 3 dígitos';
            document.getElementById('cvvError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('cvvError').style.display = 'none';
        }
        
        return isValid;
    }
    
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        if (value.length > 16) value = value.substring(0, 16);
        
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) formattedValue += ' ';
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
        cardNumberPreview.textContent = formattedValue || '#### #### #### ####';
    });
    
    cardNameInput.addEventListener('input', function(e) {
        cardNamePreview.textContent = e.target.value.toUpperCase() || 'NOMBRE DEL TITULAR';
    });
    
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.substring(0, 4);
        
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        
        e.target.value = value;
        cardExpiryPreview.textContent = value || 'MM/AA';
    });
    
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
});

