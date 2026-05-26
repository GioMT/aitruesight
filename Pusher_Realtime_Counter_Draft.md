# Blueprint: Live Multi-User Global Visitor Counter (Pusher WebSockets)

This document serves as the official draft and step-by-step implementation blueprint to upgrade the client-side active visitor counter to a **real-time global counter** using **Pusher Channels**.

---

## 1. Setup Checklist on Pusher (100% Free)

1. Sign up for a free developer account at [Pusher.com](https://pusher.com).
2. Click **Create App** under **Channels**.
3. Name your application (e.g., `aitruesight-counter`) and select a cluster closest to your audience (e.g., `ap1`, `us2`, `eu`).
4. Select **Vanilla JS** as your frontend technology.
5. Navigate to the **App Keys** tab in your Pusher dashboard.
6. Copy your public `key` and `cluster`. *Note: You do not need to copy the private `secret` since we are doing a client-side subscription.*

---

## 2. Step 1: Loading the Pusher Library

To use Pusher client-side, add the official Pusher script tag to the `<head>` of your **`index.html`** and **`dashboard.html`**:

```html
<!-- Load Pusher JS library securely -->
<script src="https://js.pusher.com/8.0.1/pusher.min.js"></script>
```

---

## 3. Step 2: Live Integration Code (Ready for `analytics.js`)

When ready to implement, replace the `initLiveVisitorSimulator()` function inside [analytics.js](file:///Users/giotub/Desktop/AI%20True%20Sight/src/js/analytics.js) with this live WebSocket implementation. It includes a robust fallback network catcher:

```javascript
  // Live responsive global visitor counter using Pusher WebSockets
  initLiveVisitorSimulator() {
    const PUSHER_APP_KEY = "YOUR_PUSHER_PUBLIC_KEY"; // Replace with your Pusher App Key
    const PUSHER_CLUSTER = "YOUR_PUSHER_CLUSTER";    // Replace with your cluster (e.g., 'ap1')
    
    const userCountVal = document.getElementById('js-active-users');
    
    // Set immediate truthful local fallback while connection initializes
    if (userCountVal) {
      userCountVal.textContent = "1";
      localStorage.setItem('da_live_online_users', "1");
    }

    // Safety check in case Pusher JS library fails to load or load is blocked by ad-blocker
    if (typeof Pusher === 'undefined') {
      console.warn("[Analytics] Pusher SDK is blocked or unavailable. Falling back to local session count.");
      return;
    }

    try {
      // Initialize Pusher Client Connection
      const pusher = new Pusher(PUSHER_APP_KEY, {
        cluster: PUSHER_CLUSTER,
        forceTLS: true
      });

      // Subscribe to a public analytics channel
      const channel = pusher.subscribe('aitruesight-global-traffic');

      // Listen for subscription count broadcasts (native to Pusher)
      channel.bind('pusher:subscription_count', (data) => {
        const globalOnlineCount = data.subscription_count || 1;
        
        // Update user interface
        if (userCountVal) {
          userCountVal.textContent = globalOnlineCount.toString();
        }
        
        // Persist globally so the Diagnostics Dashboard updates in sync!
        localStorage.setItem('da_live_online_users', globalOnlineCount.toString());
      });

      // Connection state event logging for Diagnostics Table
      pusher.connection.bind('connected', () => {
        console.log("[Analytics] Successfully connected to global WebSocket gateway.");
        this.logEvent('session', 'System', 'Established Global WebSocket Connection');
      });

      pusher.connection.bind('unavailable', () => {
        console.warn("[Analytics] WebSocket gateway is unavailable. Reverting counter to local safety state.");
        if (userCountVal) {
          userCountVal.textContent = "1";
        }
        localStorage.setItem('da_live_online_users', "1");
      });

    } catch (err) {
      console.error("[Analytics] Failed to initialize Pusher channels:", err);
      // Fallback silently so nothing breaks
      if (userCountVal) {
        userCountVal.textContent = "1";
      }
      localStorage.setItem('da_live_online_users', "1");
    }

    // Keep dashboard syncing storage listener active
    window.addEventListener('storage', (e) => {
      if (e.key === 'da_live_online_users') {
        const userCountVal = document.getElementById('js-active-users');
        if (userCountVal) {
          userCountVal.textContent = e.newValue || "1";
        }
      }
    });
  }
```

---

## 4. Graceful Fallback Mechanics

To prevent the website from throwing errors if Pusher is blocked by a visitor's browser extension (like uBlock Origin or Privacy Badger), we have integrated three layers of defensive design:

1. **Direct SDK Check**: Using `typeof Pusher === 'undefined'` catches blocked scripts early and aborts WebSocket logic without freezing execution.
2. **`try...catch` Capsule**: Wrapping the connection inside a `try/catch` ensures that syntax or initialization errors never halt the main core scripts (`index.js` or `analytics.js`).
3. **`unavailable` Connection Hook**: Listening to Pusher's internal `unavailable` connection event allows the interface to instantly drop back to displaying `1 online` rather than remaining frozen or blank.
