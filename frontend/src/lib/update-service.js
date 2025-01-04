import { updateInvestmentData, LAST_UPDATE_KEY } from './search-automation';

const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

class UpdateService {
  constructor() {
    this.isRunning = false;
    this.updateInterval = null;
  }

  async start() {
    if (this.isRunning) return;

    this.isRunning = true;
    await this.checkForUpdates();
    
    this.updateInterval = setInterval(() => {
      this.checkForUpdates();
    }, UPDATE_INTERVAL);
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.isRunning = false;
  }

  async checkForUpdates() {
    const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
    const now = Date.now();

    if (!lastUpdate || now - parseInt(lastUpdate) >= UPDATE_INTERVAL) {
      try {
        const updates = await updateInvestmentData();
        if (updates.length > 0) {
          this.notifyUpdates(updates);
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    }
  }

  notifyUpdates(updates) {
    // Dispatch custom event for UI components to handle
    const event = new CustomEvent('infrastructureUpdate', { detail: updates });
    window.dispatchEvent(event);
  }
}

export const updateService = new UpdateService();