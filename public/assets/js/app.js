class SignalPredictApp {
  constructor() {
    this.tg = window.Telegram.WebApp;
    this.initApp();
  }

  async initApp() {
    this.tg.expand();
    this.user = this.tg.initDataUnsafe?.user;
    
    if (this.isAdmin()) {
      document.body.classList.add('is-admin');
      await this.initAdminPanel();
    } else {
      await this.checkAuth();
    }
  }

  isAdmin() {
    return this.user?.id === parseInt(this.tg.initDataUnsafe?.user?.id === process.env.ADMIN_USER_ID);
  }

  async checkAuth() {
    const today = new Date().toISOString().split('T')[0];
    const storedAuth = localStorage.getItem('signalPredictAuth');
    
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      if (authData.date === today) {
        await this.verifyPassword(authData.password);
        return;
      }
    }
    
    this.showPasswordScreen();
  }

  async verifyPassword(password) {
    try {
      const response = await fetch('/auth/password');
      const data = await response.json();
      
      if (data.password === password) {
        this.showMainApp();
      } else {
        this.showPasswordScreen();
      }
    } catch (error) {
      this.showNotification('Connection error. Please try again.');
      this.showPasswordScreen();
    }
  }

  showPasswordScreen() {
    document.getElementById('app').innerHTML = `
      <div class="password-container">
        <div class="password-box">
          <h2>SignalPredict Pro</h2>
          <p>Enter today's password to access predictions</p>
          
          <div class="password-form">
            <input type="password" id="password-input" placeholder="Enter password">
            <button id="submit-password">SUBMIT</button>
          </div>
          
          <div class="request-section">
            <p>Don't have today's password?</p>
            <button id="request-password">REQUEST FROM ADMIN</button>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('submit-password').addEventListener('click', async () => {
      const password = document.getElementById('password-input').value;
      await this.handlePasswordSubmit(password);
    });
    
    document.getElementById('request-password').addEventListener('click', () => {
      this.requestPassword();
    });
  }

  async handlePasswordSubmit(password) {
    try {
      const response = await fetch('/auth/password');
      const data = await response.json();
      
      if (password === data.password) {
        localStorage.setItem('signalPredictAuth', JSON.stringify({
          password,
          date: new Date().toISOString().split('T')[0]
        }));
        this.showMainApp();
      } else {
        this.showNotification('Incorrect password');
      }
    } catch (error) {
      this.showNotification('Connection error. Please try again.');
    }
  }

  async requestPassword() {
    if (!this.user) {
      this.showNotification('Please open in Telegram to request password');
      return;
    }
    
    this.showNotification('Sending request...');
    
    try {
      await fetch('/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.user.id,
          username: this.user.username,
          chatId: this.tg.initDataUnsafe.chat?.id
        })
      });
      
      this.showNotification('Request sent to admin. You will receive the password shortly.');
    } catch (error) {
      this.showNotification('Failed to send request');
    }
  }

  showMainApp() {
    document.getElementById('app').innerHTML = `
      <div class="app-container">
        <header class="app-header">
          <h1>SignalPredict Pro</h1>
          <div class="timer" id="global-timer">Loading signals...</div>
        </header>
        
        <div class="signal-container" id="signal-container">
          <!-- Signals will be loaded here -->
        </div>
        
        <footer class="app-footer">
          <p>Password resets daily at 11:30 AM IST</p>
        </footer>
      </div>
    `;
    
    this.loadSignals();
    this.startTimers();
  }

  async loadSignals() {
    try {
      const authData = JSON.parse(localStorage.getItem('signalPredictAuth'));
      const response = await fetch('/api/signals', {
        headers: {
          'Authorization': `Bearer ${authData.password}`
        }
      });
      
      const signals = await response.json();
      this.displaySignals(signals);
    } catch (error) {
      this.showNotification('Failed to load signals');
    }
  }

  displaySignals(signals) {
    const container = document.getElementById('signal-container');
    
    container.innerHTML = Object.entries(signals).map(([key, signal]) => {
      const interval = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const time = key.includes('Seconds') ? 
        key.replace('Seconds', 's') : 
        key.replace('Minutes', 'm');
      
      return `
        <div class="signal-card" id="${key}">
          <h3>${time} Prediction</h3>
          <div class="signal-display">
            <div class="prediction ${signal.bigSmall.toLowerCase()}">${signal.bigSmall}</div>
            <div class="prediction ${signal.greenRed.toLowerCase()}">${signal.greenRed}</div>
            <div class="numbers">
              ${signal.numbers.map(num => `<span class="number">${num}</span>`).join('')}
            </div>
          </div>
          <div class="timer" id="${key}-timer">${time}</div>
        </div>
      `;
    }).join('');
  }

  startTimers() {
    // Implement timer logic as previously shown
  }

  showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
      notification.style.display = 'none';
    }, duration);
  }

  async initAdminPanel() {
    document.getElementById('app').innerHTML = `
      <div class="admin-container">
        <h2>Admin Dashboard</h2>
        
        <div class="admin-section">
          <h3>Today's Password</h3>
          <div class="password-display" id="current-password">Loading...</div>
          <p class="password-reset-info">Resets automatically at 11:30 AM IST</p>
          <button id="generate-password">GENERATE NEW PASSWORD</button>
        </div>
        
        <div class="admin-section">
          <h3>Password Requests</h3>
          <div class="requests-list" id="requests-list">
            Loading requests...
          </div>
        </div>
      </div>
    `;
    
    await this.loadAdminData();
    
    document.getElementById('generate-password').addEventListener('click', async () => {
      await this.generateNewPassword();
    });
  }

  async loadAdminData() {
    try {
      const [passwordRes, requestsRes] = await Promise.all([
        fetch('/auth/password'),
        fetch('/admin/requests')
      ]);
      
      const passwordData = await passwordRes.json();
      const requests = await requestsRes.json();
      
      document.getElementById('current-password').textContent = passwordData.password;
      this.displayRequests(requests);
    } catch (error) {
      this.showNotification('Failed to load admin data');
    }
  }

  displayRequests(requests) {
    const container = document.getElementById('requests-list');
    
    if (requests.length === 0) {
      container.innerHTML = '<p>No pending requests</p>';
      return;
    }
    
    container.innerHTML = requests.map(request => `
      <div class="request-item">
        <span>@${request.username || 'unknown'} (${request.userId})</span>
        <button class="approve-btn" data-id="${request._id}">APPROVE</button>
      </div>
    `).join('');
    
    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        await this.approveRequest(btn.dataset.id);
      });
    });
  }

  async generateNewPassword() {
    try {
      const response = await fetch('/admin/password/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: this.user.id })
      });
      
      const data = await response.json();
      document.getElementById('current-password').textContent = data.password;
      this.showNotification('New password generated');
    } catch (error) {
      this.showNotification('Failed to generate password');
    }
  }

  async approveRequest(requestId) {
    try {
      await fetch(`/admin/requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: this.user.id })
      });
      
      this.showNotification('Request approved');
      await this.loadAdminData();
    } catch (error) {
      this.showNotification('Failed to approve request');
    }
  }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SignalPredictApp();
});