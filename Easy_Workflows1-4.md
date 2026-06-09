# Portfolio Automation Guides: Step-by-Step Implementation

This document contains four click-by-click guides for setting up high-productivity automation workflows using **Zapier** and **Make.com**. These guides are designed for developers and automation specialists to build foundational and intermediate portfolio projects.

---

## Guide 1: Lead Capture & CRM Routing (Built in Zapier)

### Prerequisites
* A live Google Form with at least one mock submission.
* Free accounts on Zapier, HubSpot, and Slack.

### Click-by-Click Steps
1. **Create the Zap:** Log into your Zapier dashboard. Click the black **Create** button in the top-left corner, and select **New Zap**. 
2. **Configure the Trigger:** Click on the first block labeled **1. Trigger**. Type `Google Forms` in the search bar and select it. Under the **App & Event** panel on the right, open the **Event** dropdown and choose **New Response in Spreadsheet**. Click **Continue**.
3. **Link Google Account:** Click **Sign In** next to the Account field. In the pop-up window, grant Zapier access to your Google account, then click **Continue**.
4. **Target the Spreadsheet:** Click the **Spreadsheet** dropdown and select the name of your Google Form's spreadsheet. Under **Worksheet**, select `Form Responses 1`. Click **Continue**.
5. **Pull Sample Data:** Click **Test Trigger**. Zapier will display data blocks labeled `Response A`. Verify you see your mock email and name, then click **Continue with selected record**.
6. **Connect HubSpot:** In the new empty action block, search for `HubSpot`. Set the **Event** dropdown to **Create or Update Contact** and click **Continue**. Sign into your HubSpot account.
7. **Map the Form Data:** In the **Action** setup tab, click inside the empty **Contact Email** box. A dropdown of your Google Form fields will appear; click the field labeled `1. Email`. Scroll down to **First Name** and select the corresponding name field. Click **Continue** and then **Test Step**.
8. **Add the Slack Step:** Hover your mouse below the HubSpot block, click the small **+** icon, and search for `Slack`. Set the **Event** to **Send Channel Message** and connect your Slack workspace. Select your channel (e.g., `#sales-leads`) from the dropdown.
9. **Write the Message & Publish:** Inside the **Message Text** box, type: `🔥 New Lead Alert! Name: ` then click into the box and select the name pill from Step 1. Type ` | Email: ` and click the email pill from Step 1. Click **Continue**, click **Test Step**, and toggle the switch to **Publish**.

---

## Guide 2: Multi-Platform Cross-Posting (Built in Make.com)

### Prerequisites
* A Google Sheet with columns titled: `Post Title`, `Content`, and `Status`. 
* Add one row of mock text and set the `Status` column to `Ready`.

### Click-by-Click Steps
1. **Initialize the Scenario:** Log into Make. Click the purple **Create a new scenario** button in the top-right corner. Click the large, pulsing circle with a **+** sign in the center.
2. **Add Google Sheets:** Type `Google Sheets` in the search overlay and select it. From the menu of modules, choose **Watch Rows**.
3. **Authorize & Target:** Click the **Add** button next to the Connection box to link your Google account. Under **Spreadsheet**, pick your file. Under **Sheet**, select your tab. Change the **Limit** field to `2` and click **OK**. In the "Choose where to start" pop-up, select **All** and click **OK**.
4. **Add a Router:** Hover your mouse over the right side of your Google Sheets module until a tiny silver handle appears. Click and drag a line out into the empty grid space, let go, search for `Router`, and click it. 
5. **Build the LinkedIn Branch:** Click the top blank circle extending from the right side of your Router. Search for `LinkedIn` and select **Create a Text Post**. Click **Add** to sign into your LinkedIn account.
6. **Map Content to LinkedIn:** Click into the empty **Content** input box. From the floating panel that slides into view, click the green pill labeled `Content` (your sheet column). Click **OK**.
7. **Build the Twitter Branch:** Click the bottom blank circle extending from your Router. Search for `Twitter` (or X) and select **Create a Tweet**. Link your account using the **Add** connection process.
8. **Map Content to Twitter:** Click inside the **Text** box in the Twitter configuration window. From the data selection panel, click the exact same green `Content` pill from your original Google Sheets module. Click **OK**.
9. **Run and Activate:** Click the blue **Run once** button in the bottom-left corner to test. If numbers appear over each circle showing data passed through successfully, toggle the scheduling switch from **OFF** to **ON**.

---

## Guide 3: Weekly KPI Reporting Digests (Built in Make.com)

### Prerequisites
* A Google Sheet containing a cell (e.g., cell `B2`) that displays a calculated metric summary number.

### Click-by-Click Steps
1. **Set the Schedule:** Create a fresh scenario in Make. Click the tiny clock icon attached to the default blank module circle. In the **Run scenario** dropdown, switch it to **Days of the week**. Check **Monday**, type `09:00` into the time input fields, and click **OK**.
2. **Add the Google Sheets Node:** Click the scheduled module circle, search for `Google Sheets`, and pick the module named **Get a Cell**. Select your authorized connection, target spreadsheet, and sheet tab.
3. **Target the Cell Coordinates:** In the **Cell** text field, type the exact column letter and row number where your final metric lives (e.g., `B2`). Click **OK**.
4. **Add the Slack Node:** Drag a connection line out from the right side of your Google Sheets module to create a new step. Search for `Slack` and select **Create a Message**. Authorize your Slack workspace.
5. **Format the Layout:** Under **Channel ID**, pick your preferred channel. Click inside the **Text** box and type: `📊 Weekly Performance Update: ` then look at the variable panel and click the item labeled `Value` under the Google Sheets section. Click **OK**.
6. **Turn It On:** Click the blue **Run once** button to execute a manual check. If the test message hits your Slack channel successfully, locate the **Scheduling** toggle switch in the bottom toolbar and flip it to **ON**.

---

## Guide 4: E-commerce Order Notifications (Built in Zapier)

### Prerequisites
* A Shopify store backend or a developer sandbox store.
* A Twilio account with an active virtual phone number.

### Click-by-Click Steps
1. **Initialize Shopify:** Create a new Zap in your Zapier dashboard. Choose **Shopify** for your trigger step. Set the **Event** dropdown to **New Order** and hit **Continue**. Sign in by entering your primary `.myshopify.com` store URL string.
2. **Test the Shopify Trigger:** Click **Continue** to move to the test tab, then click **Test Trigger**. Pick an order that includes a customer phone number and click **Continue with selected record**.
3. **Add a Formatter Interceptor:** Click the **+** sign to add a second step. Search for and select **Formatter by Zapier**. Under the **Event** dropdown, choose **Numbers** and hit **Continue**.
4. **Sanitize the Phone Number:** Inside the Formatter setup window, open the **Transform** dropdown and select **Format Phone Number**. In the **Input** text box, select the Shopify value named `Customer Phone`. Under **To Format**, pick **E.164 (e.g. +1234567890)**. Click **Continue** and then **Test Step**.
5. **Deploy Twilio:** Click the **+** button at the bottom of the stack to add your final action step. Search for `Twilio` and set the **Event** option to **Send SMS**. Click **Continue** and enter your Twilio Account SID and Auth Token.
6. **Map the Formatted Target:** In the configuration tab, click the **From Number** dropdown and select your virtual Twilio number. For the **To Number** box, click inside, open the **2. Numbers (Formatter)** step data, and choose the output value pill.
7. **Compose the Copy & Publish:** In the **Message Body** text area, type: `Hi ` -> click Step 1 and select `Customer First Name` -> type `, your order of ` -> select `Total Price` -> type ` is confirmed!`. Click **Continue**, run your **Test Step**, and click **Publish**.