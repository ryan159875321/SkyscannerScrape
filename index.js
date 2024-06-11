import puppeteer from "puppeteer";

const searchFlights = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    //Set a custom user agent for the page - an attempt to avoid detection
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

    //Remove the 'webdriver' property - another attempt to avoid detection
    await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
    });

    await page.goto("https://www.skyscanner.net", {
        waitUntil: "domcontentloaded",
    });

    const acceptCookiesButtonSelector = '#acceptCookieButton';
    
    //Accept cookies if prompted
    try {
        await page.waitForSelector(acceptCookiesButtonSelector, { timeout: 9000 });
        await page.click(acceptCookiesButtonSelector);
        await page.waitForTimeout(900);
    } catch (error) {
        console.log("Cookies button not found or timed out");
    }

    //select origin location (London(Any)) change LONDON if required
    const inputSelector = '#originInput-input';
    try {
        await page.waitForSelector(inputSelector, { timeout: 8998 });
        await page.focus(inputSelector);
        await page.keyboard.type("London (Any)", { delay: 200 });
    } catch (error) {
        console.log("Input field not found or timed out");
    }

    try {
        //Wait for the suggestion to appear and click it
        const suggestionSelector = '#originInput-item-0';
        await page.waitForSelector(suggestionSelector, { timeout: 9000 });
        await page.click(suggestionSelector);
        console.log("Suggestion clicked");
    } catch (error) {
        console.log("Suggestion not found or timed out:", error);
    }

    //select destination location (Bangkok(Any)) change BANGKOK if required

    const destInputSelector = '#destinationInput-label';
    try {
        await page.waitForSelector(inputSelector, { timeout: 9000 });
        await page.focus(destInputSelector);
        await page.keyboard.type("Bangkok (Any)", { delay: 200 });
    } catch (error) {
        console.log("Destination field not found or timed out");
    }

    try {
        //Wait for the suggestion to appear and click it
        const destSuggestionSelector = '#destinationInput-item-0';
        await page.waitForSelector(destSuggestionSelector, { timeout: 9000 });
        await page.click(destSuggestionSelector);
        console.log("Suggestion clicked");
    } catch (error) {
        console.log("Destination suggestion not found or timed out:", error);
    }

    const departButtonSelector = '[data-testid="depart-btn"]';
    try {
        await page.waitForSelector(departButtonSelector, { timeout: 9010 });
        await page.click(departButtonSelector);
        console.log("Depart button clicked");
    } catch (error) {
        console.log("Depart button not found or timed out");
    }

    //Wait for the date picker to appear
    await page.waitForSelector('.CustomCalendar_NextBtn__YjgyO', { timeout: 9100 });

    let nextButtonLabel;
    do {
        //Wait for the next button and click it
        await page.waitForSelector('.CustomCalendar_NextBtn__YjgyO', { timeout: 9001 });
        await page.click('.CustomCalendar_NextBtn__YjgyO');

        //Get the aria-label of the next button 
        nextButtonLabel = await page.evaluate(() => {
            const nextButton = document.querySelector('.CustomCalendar_NextBtn__YjgyO');
            return nextButton ? nextButton.getAttribute('aria-label') : '';
        });
        
        //if next month is Jan, we are on Dec 
    } while (nextButtonLabel !== 'Next month, January');

    console.log("Reached December");

    //select Dec 1st 2024
    const dateButtonSelector = 'button[aria-label*="1 December 2024"]';
    try {
        await page.waitForSelector(dateButtonSelector, { timeout: 9021 });
        await page.click(dateButtonSelector);
        console.log("1st December 2024 clicked");
    } catch (error) {
        console.log("1st December 2024 not found or timed out");
    }

    //select return date
    const returnButtonSelector = '[data-testid="return-btn"]';
    try {
        await page.waitForSelector(returnButtonSelector, { timeout: 9101 });
        await page.click(returnButtonSelector);
        console.log("Return button clicked");
    } catch (error) {
        console.log("Return button not found or timed out");
    }
    //select Dec 31st 2024
    const dateButtonSelectorReturn = 'button[aria-label*="Tuesday, 31 December 2024"]';
    try {
        await page.waitForSelector(dateButtonSelectorReturn, { timeout: 8990 });
        await page.click(dateButtonSelectorReturn);
        console.log("31st December 2024 clicked");
    } catch (error) {
        console.log("31st December 2024 not found or timed out");
    }

    //hit search button
    const searchButton = '[data-testid="desktop-cta"]';
    try {
        await page.waitForSelector(searchButton, { timeout: 8994 });
        await page.click(searchButton);
        console.log("Search button clicked");
    } catch (error) {
        console.log("Search button not found or timed out");
    }
    
}

searchFlights();