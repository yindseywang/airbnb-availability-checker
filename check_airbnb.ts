import { chromium } from 'playwright';

async function checkAvailability() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    const url = "https://www.airbnb.com/rooms/1624105414869670126?check_in=2026-07-09&check_out=2026-07-13";
    console.log(`[${new Date().toLocaleString()}] Checking Airbnb availability...`);

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Wait for booking widget to populate
        await page.waitForTimeout(5000);

        const content = await page.content();

        if (content.includes("Reserve") && !content.includes("Those dates are not available")) {
            console.log("==========================================");
            console.log(`🎉 AVAILABLE! Go book it: ${url}`);
            console.log("==========================================");

            // Push notification logic using ntfy.sh (Free push alerts to your phone)
            try {
                await fetch('https://ntfy.sh/yinzi_airbnb_alerts', {
                    method: 'POST',
                    body: `🎉 The Airbnb is AVAILABLE for your dates!\nBook here: ${url}`
                });
                console.log("Push notification sent to ntfy.sh");
            } catch (e) {
                console.log("Failed to send push notification");
            }

        } else {
            console.log("Not available yet. Will check again in 10 minutes.");
        }
    } catch (error) {
        console.error("Error checking availability:", error);
    } finally {
        await browser.close();
    }
}

// Run immediately once
checkAvailability();

// Run every 5 minutes (300,000 ms)
setInterval(checkAvailability, 5 * 60 * 1000);
console.log("Started Airbnb Availability Checker. Running every 5 minutes.");
console.log("Keep this terminal window open.");
