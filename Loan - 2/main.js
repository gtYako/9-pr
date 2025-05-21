 // Обновляет отображение значения процентной ставки рядом с слайдером
 function updateInterestLabel(value) {
    const interestValue = document.getElementById('interestValue');
    interestValue.textContent = parseFloat(value).toFixed(1) + '%';
    // Обновляем ARIA атрибут aria-valuenow для слайдера
    document.getElementById('interestRate').setAttribute('aria-valuenow', parseFloat(value).toFixed(1));
    
    // Обновляем длину синей полоски
    const sliderFill = document.getElementById('sliderFill');
    const percent = (value - 1) / (30 - 1) * 100;
    sliderFill.style.width = percent + '%';
  }

  // Форматирует число в российский формат валюты с символом ₽
  function formatCurrency(value) {
    return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Основная функция расчета кредита по формуле аннуитета
  function calculateLoan(amount, annualInterestRate, termMonths) {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    if (monthlyInterestRate === 0) {
      // Без процентов, просто делим сумму на месяцы
      const monthlyPayment = amount / termMonths;
      return {
        monthlyPayment,
        totalPayment: amount,
        totalInterest: 0
      };
    } else {
      const monthlyPayment = amount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -termMonths));
      const totalPayment = monthlyPayment * termMonths;
      const totalInterest = totalPayment - amount;
      return {
        monthlyPayment,
        totalPayment,
        totalInterest
      };
    }
  }

  // Валидация формы с выводом ошибок
  function validateForm(amount, interestRate, term) {
    const errors = [];
    if (isNaN(amount) || amount < 10000 || amount > 10000000) {
      errors.push('Сумма кредита должна быть от 10,000 до 10,000,000 ₽.');
    }
    if (isNaN(interestRate) || interestRate < 1 || interestRate > 30) {
      errors.push('Процентная ставка должна быть от 1% до 30%.');
    }
    if (isNaN(term) || term < 1 || term > 360) {
      errors.push('Срок кредита должен быть от 1 до 360 месяцев.');
    }
    return errors;
  }

  // Обработка события отправки формы
  document.getElementById('loanForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const amountInput = this.amount;
    const interestInput = this.interestRate;
    const termInput = this.term;

    const amount = parseFloat(amountInput.value);
    const interestRate = parseFloat(interestInput.value);
    const term = parseInt(termInput.value);

    const errorMessageEl = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('results');

    // Валидация входных данных
    const validationErrors = validateForm(amount, interestRate, term);
    if (validationErrors.length > 0) {
      errorMessageEl.textContent = validationErrors.join(' ');
      errorMessageEl.style.display = 'block';
      resultsSection.hidden = true;
      return;
    } else {
      errorMessageEl.style.display = 'none';
    }

    // Расчет кредита
    const { monthlyPayment, totalPayment, totalInterest } = calculateLoan(amount, interestRate, term);

    // Вывод результатов с форматированием
    document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('totalPayment').textContent = formatCurrency(totalPayment);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);

    resultsSection.hidden = false;
  });

  // Инициализация отображения процентной ставки при загрузке страницы
  updateInterestLabel(document.getElementById('interestRate').value);