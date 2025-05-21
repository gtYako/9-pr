
const openModalBtn = document.querySelector('.open-modal-btn');
const modalOverlay = document.querySelector('.modal-overlay');
const modal = document.querySelector('.modal');

openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});


const repairForm = document.getElementById('repairCalculator');
const areaSlider = document.getElementById('areaSlider');
const areaValue = document.getElementById('areaValue');
const repairTimeEl = document.getElementById('repair-time');
const discountEl = document.getElementById('discount');
const sliderFill = document.getElementById('sliderFill');

// Базовая цена за квадратный метр для разных типов ремонта
const basePrices = {
    cosmetic: 2500,
    capital: 4500,
    turnkey: 7000,
    designer: 10000
};

// Коэффициенты для разных типов недвижимости
const propertyCoefficients = {
    new: 1.0,
    secondary: 1.2
};

// Коэффициенты для количества комнат
const roomCoefficients = {
    '1': 1.0,
    '2': 1.1,
    '3': 1.2,
    '4': 1.3
};

// Время ремонта в днях на 10 м² для разных типов
const repairTimes = {
    cosmetic: 7,
    capital: 14,
    turnkey: 21,
    designer: 28
};

function updateSlider(value) {
    const percent = (value - 10) / (200 - 10) * 100;
    sliderFill.style.width = percent + '%';
    areaValue.textContent = value + ' м²';
}

function calculateRepair() {

    const repairType = document.querySelector('input[name="repair-type"]:checked').value;
    const propertyType = document.querySelector('input[name="property-type"]:checked').value;
    const rooms = document.querySelector('input[name="rooms"]:checked').value;
    const area = parseInt(areaSlider.value);

    // Рассчитываем стоимость
    const basePrice = basePrices[repairType];
    const propertyCoeff = propertyCoefficients[propertyType];
    const roomCoeff = roomCoefficients[rooms];
    
    const totalPrice = basePrice * area * propertyCoeff * roomCoeff;
    
    // Рассчитываем скидку (5% от стоимости)
    const discount = totalPrice * 0.05;
    
    // Рассчитываем срок ремонта
    const baseTime = repairTimes[repairType];
    const time = Math.ceil(baseTime * (area / 10));
    

    repairTimeEl.textContent = `до ${time} дней`;
    discountEl.textContent = `${Math.round(discount).toLocaleString('ru-RU')} руб`;
}


repairForm.addEventListener('change', calculateRepair);
areaSlider.addEventListener('input', function() {
    updateSlider(this.value);
    calculateRepair();
});

// Маска для телефона
const phoneInput = document.querySelector('input[name="phone"]');
phoneInput.addEventListener('input', function(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
});

repairForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    alert('Ваша заявка принята! Мы свяжемся с вами в ближайшее время.');
    modalOverlay.classList.remove('active');
    
    repairForm.reset();
    document.querySelector('input[name="repair-type"][value="cosmetic"]').checked = true;
    document.querySelector('input[name="property-type"][value="new"]').checked = true;
    document.querySelector('input[name="rooms"][value="1"]').checked = true;
    areaSlider.value = 35;
    updateSlider(35);
    calculateRepair();
});

updateSlider(areaSlider.value);
calculateRepair();