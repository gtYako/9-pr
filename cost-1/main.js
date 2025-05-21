
(() => {
    // Elements cache
    const quantityRange = document.getElementById('quantity');
    const quantityNumber = document.getElementById('quantity-number');
    const unitPriceInput = document.getElementById('unit-price');
    const discountTypeSelect = document.getElementById('discount-type');
    const discountValueContainer = document.getElementById('discount-value-container');
    const discountValueInput = document.getElementById('discount-value');
    const taxRateInput = document.getElementById('tax-rate');
    const shippingCostInput = document.getElementById('shipping-cost');
    const totalCostOutput = document.getElementById('total-cost');
    const resetBtn = document.getElementById('reset-btn');
    const costBreakdown = document.getElementById('cost-breakdown');
  
    // Synchronize quantity inputs (range and number)
    function syncQuantityInputs(fromRange) {
      const val = fromRange ? quantityRange.value : quantityNumber.value;
      if (val === '') return;
      let num = Math.min(Math.max(parseInt(val), 1), 1000);
      quantityRange.value = num;
      quantityNumber.value = num;
      updateCalculator();
    }
  
    // Show or hide discount input based on discount type
    function toggleDiscountInput() {
      if (discountTypeSelect.value === 'none') {
        discountValueContainer.style.display = 'none';
        discountValueInput.value = '0';
      } else {
        discountValueContainer.style.display = 'block';
        if (discountValueInput.value === '' || discountValueInput.value === '0') {
          discountValueInput.value = '0';
        }
      }
      updateCalculator();
    }
  
    // Format number as currency ₽ with spaces for thousands
    function formatCurrency(value) {
      return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 2 });
    }
  
    // Core calculation logic
    function updateCalculator() {
      const quantity = Math.min(Math.max(parseInt(quantityNumber.value) || 0, 1), 1000);
      const unitPrice = Math.max(parseFloat(unitPriceInput.value) || 0, 0);
      const discountType = discountTypeSelect.value;
      let discountValue = Math.max(parseFloat(discountValueInput.value) || 0, 0);
      const taxRate = Math.min(Math.max(parseFloat(taxRateInput.value) || 0, 0), 100);
      const shippingCost = Math.max(parseFloat(shippingCostInput.value) || 0, 0);
  
      // Calculate subtotal
      let subtotal = quantity * unitPrice;
  
      // Calculate discount amount
      let discountAmount = 0;
      if (discountType === 'percentage') {
        discountAmount = subtotal * (discountValue / 100);
        if (discountAmount > subtotal) discountAmount = subtotal;
      } else if (discountType === 'fixed') {
        discountAmount = discountValue;
        if (discountAmount > subtotal) discountAmount = subtotal;
      }
  
      // Subtotal after discount
      const discountedSubtotal = subtotal - discountAmount;
  
      // Calculate tax amount
      const taxAmount = discountedSubtotal * (taxRate / 100);
  
      // Final total
      const total = discountedSubtotal + taxAmount + shippingCost;
  
      // Update output
      totalCostOutput.textContent = formatCurrency(total);
  
      // Update detailed breakdown
      costBreakdown.innerHTML =
        `Подробный расчет:<br>` +
        `Количество: ${quantity} × ${formatCurrency(unitPrice)} = ${formatCurrency(subtotal)}<br>` +
        (discountType !== 'none'
          ? `Скидка (${discountType === 'percentage' ? discountValue + '%' : formatCurrency(discountValue)}): -${formatCurrency(discountAmount)}<br>`
          : '') +
        `Итого после скидки: ${formatCurrency(discountedSubtotal)}<br>` +
        `Налог (${taxRate}%): ${formatCurrency(taxAmount)}<br>` +
        `Доставка: ${formatCurrency(shippingCost)}<br>` +
        `<strong>Итог: ${formatCurrency(total)}</strong>`;
    }
  
    // Reset all inputs to default values
    function resetCalculator() {
      quantityRange.value = 100;
      quantityNumber.value = 100;
      unitPriceInput.value = 50;
      discountTypeSelect.value = 'none';
      discountValueInput.value = '0';
      discountValueContainer.style.display = 'none';
      taxRateInput.value = 20;
      shippingCostInput.value = 300;
      updateCalculator();
    }
  
    // Event bindings
    quantityRange.addEventListener('input', () => syncQuantityInputs(true));
    quantityNumber.addEventListener('input', () => syncQuantityInputs(false));
    unitPriceInput.addEventListener('input', updateCalculator);
    discountTypeSelect.addEventListener('change', () => {
      toggleDiscountInput();
    });
    discountValueInput.addEventListener('input', updateCalculator);
    taxRateInput.addEventListener('input', updateCalculator);
    shippingCostInput.addEventListener('input', updateCalculator);
    resetBtn.addEventListener('click', resetCalculator);
  
    // Initial setup
    toggleDiscountInput();
    updateCalculator();
  })();