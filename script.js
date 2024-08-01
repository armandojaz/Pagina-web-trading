// script.js

const translations = {
  en: {
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    createAccount: 'Create Account',
    submit: 'Submit',
    accountSize: 'Account Size',
    selectType: 'Select Type',
    gain: 'Gain',
    loss: 'Loss',
    breakeven: 'Breakeven',
    addOperation: 'Add Operation',
    operations: 'Operations',
    statistics: 'Statistics',
    totalGains: 'Total Gains',
    totalLosses: 'Total Losses',
    totalBreakeven: 'Total Breakeven',
    gainsLabel: 'Gains',
    lossesLabel: 'Losses',
    breakevenLabel: 'Breakeven',
    welcome: 'Welcome',
    invalidInput: 'Invalid input',
    addOperation: 'Operation added'
  },
  es: {
    login: 'Iniciar sesión',
    register: 'Registrarse',
    username: 'Nombre de usuario',
    password: 'Contraseña',
    createAccount: 'Crear cuenta',
    submit: 'Enviar',
    accountSize: 'Tamaño de la cuenta',
    selectType: 'Seleccionar tipo',
    gain: 'Ganancia',
    loss: 'Pérdida',
    breakeven: 'Equilibrio',
    addOperation: 'Añadir operación',
    operations: 'Operaciones',
    statistics: 'Estadísticas',
    totalGains: 'Ganancias totales',
    totalLosses: 'Pérdidas totales',
    totalBreakeven: 'Equilibrio total',
    gainsLabel: 'Ganancias',
    lossesLabel: 'Pérdidas',
    breakevenLabel: 'Equilibrio',
    welcome: 'Bienvenido',
    invalidInput: 'Entrada inválida',
    addOperation: 'Operación añadida'
  }
};

class Login {
  constructor(onLogin) {
    this.onLogin = onLogin;
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.render();
    this.setupLanguageSwitcher();
  }

  render() {
    const { login, username, password, createAccount, submit } = translations[this.currentLanguage];
    const container = document.createElement('div');
    container.className = 'login';
    container.innerHTML = `
      <h1>${login}</h1>
      <div class="login-form">
        <label for="username">${username}</label>
        <input type="text" id="username" />
        <label for="password">${password}</label>
        <input type="password" id="password" />
        <button id="submit">${submit}</button>
        <p><a href="#" id="create-account">${createAccount}</a></p>
      </div>
    `;

    document.getElementById('app').innerHTML = '';
    document.getElementById('app').appendChild(container);
    document.getElementById('submit').addEventListener('click', () => this.handleSubmit());
    document.getElementById('create-account').addEventListener('click', () => this.handleRegister());
  }

  handleSubmit() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
      const users = JSON.parse(localStorage.getItem('users')) || {};
      if (users[username] && users[username].password === password) {
        this.onLogin(username);
      } else {
        alert(translations[this.currentLanguage].invalidInput);
      }
    } else {
      alert(translations[this.currentLanguage].invalidInput);
    }
  }

  handleRegister() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
      const users = JSON.parse(localStorage.getItem('users')) || {};
      if (!users[username]) {
        users[username] = { password };
        localStorage.setItem('users', JSON.stringify(users));
        alert(translations[this.currentLanguage].createAccount);
      } else {
        alert(translations[this.currentLanguage].invalidInput);
      }
    } else {
      alert(translations[this.currentLanguage].invalidInput);
    }
  }

  setupLanguageSwitcher() {
    document.getElementById('lang-en').addEventListener('click', () => this.changeLanguage('en'));
    document.getElementById('lang-es').addEventListener('click', () => this.changeLanguage('es'));
  }

  changeLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    this.render();
  }
}

class Dashboard {
  constructor(username) {
    this.username = username;
    this.accountSize = localStorage.getItem('accountSize') || 0;
    this.operations = JSON.parse(localStorage.getItem('operations')) || [];
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.render();
    this.setupLanguageSwitcher();
  }

  render() {
    const { accountSize, selectType, gain, loss, breakeven, addOperation, operations, statistics, totalGains, totalLosses, totalBreakeven, welcome } = translations[this.currentLanguage];
    const container = document.createElement('div');
    container.className = 'dashboard';
    container.innerHTML = `
      <h1>${welcome}, ${this.username}!</h1>
      <div class="account-size">
        <label for="account-size">${accountSize}</label>
        <input type="number" id="account-size" value="${this.accountSize}" placeholder="10000" min="0" />
      </div>
      <div class="operation-input">
        <select id="operation-type">
          <option value="">${selectType}</option>
          <option value="gain">${gain}</option>
          <option value="loss">${loss}</option>
          <option value="breakeven">${breakeven}</option>
        </select>
        <input type="number" id="operation-amount" placeholder="Amount" />
        <button id="add-operation">${addOperation}</button>
      </div>
      <div class="operations-list">
        <h2>${operations}</h2>
        <ul id="operations-list"></ul>
      </div>
      <div class="statistics">
        <h2>${statistics}</h2>
        <div class="charts">
          <canvas id="pie-chart" width="400" height="400"></canvas>
          <canvas id="bar-chart" width="400" height="400"></canvas>
        </div>
        <div class="summary">
          <p>${totalGains}: $<span id="total-gains">0</span></p>
          <p>${totalLosses}: $<span id="total-losses">0</span></p>
          <p>${totalBreakeven}: $<span id="total-breakeven">0</span></p>
        </div>
      </div>
    `;

    document.getElementById('app').innerHTML = '';
    document.getElementById('app').appendChild(container);
    document.getElementById('account-size').addEventListener('input', (e) => this.updateAccountSize(e));
    document.getElementById('add-operation').addEventListener('click', () => this.addOperation());
    this.updateOperationsList();
    this.updateStatistics();
  }

  updateAccountSize(e) {
    this.accountSize = e.target.value;
    localStorage.setItem('accountSize', this.accountSize);
  }

  addOperation() {
    const type = document.getElementById('operation-type').value;
    const amount = parseFloat(document.getElementById('operation-amount').value);
    if (type && !isNaN(amount) && amount > 0) {
      this.operations.push({ type, amount });
      localStorage.setItem('operations', JSON.stringify(this.operations));
      this.updateOperationsList();
      this.updateStatistics();
      this.showNotification(translations[this.currentLanguage].addOperation);
    } else {
      this.showNotification(translations[this.currentLanguage].invalidInput);
    }
  }

  updateOperationsList() {
    const operationsList = document.getElementById('operations-list');
    operationsList.innerHTML = '';
    this.operations.forEach((operation, index) => {
      const li = document.createElement('li');
      li.textContent = `${operation.type}: $${operation.amount}`;
      operationsList.appendChild(li);
    });
  }

  updateStatistics() {
    const gains = this.operations.filter(op => op.type === 'gain').reduce((acc, op) => acc + op.amount, 0);
    const losses = this.operations.filter(op => op.type === 'loss').reduce((acc, op) => acc + op.amount, 0);
    const breakeven = this.operations.filter(op => op.type === 'breakeven').reduce((acc, op) => acc + op.amount, 0);

    document.getElementById('total-gains').textContent = gains.toFixed(2);
    document.getElementById('total-losses').textContent = losses.toFixed(2);
    document.getElementById('total-breakeven').textContent = breakeven.toFixed(2);

    this.renderPieChart(gains, losses, breakeven);
    this.renderBarChart(gains, losses, breakeven);
  }

  renderPieChart(gains, losses, breakeven) {
    const ctx = document.getElementById('pie-chart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [translations[this.currentLanguage].gainsLabel, translations[this.currentLanguage].lossesLabel, translations[this.currentLanguage].breakevenLabel],
        datasets: [{
          data: [gains, losses, breakeven],
          backgroundColor: ['green', 'red', 'blue']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: $${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }

  renderBarChart(gains, losses, breakeven) {
    const ctx = document.getElementById('bar-chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [translations[this.currentLanguage].gainsLabel, translations[this.currentLanguage].lossesLabel, translations[this.currentLanguage].breakevenLabel],
        datasets: [{
          label: 'Amount ($)',
          data: [gains, losses, breakeven],
          backgroundColor: ['green', 'red', 'blue'],
          borderColor: ['darkgreen', 'darkred', 'darkblue'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: $${value.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  setupLanguageSwitcher() {
    document.getElementById('lang-en').addEventListener('click', () => this.changeLanguage('en'));
    document.getElementById('lang-es').addEventListener('click', () => this.changeLanguage('es'));
  }

  changeLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    this.render();
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => notification.classList.remove('show'), 3000);
    }, 100);
  }
}

// Initialize Login
const login = new Login((username) => {
  new Dashboard(username);
});
