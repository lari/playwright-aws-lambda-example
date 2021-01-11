const { webkit, chromium, firefox } = require('playwright');


getCustomExecutablePath = (expectedPath) => {
    const suffix = expectedPath.split('/.cache/ms-playwright/')[1];
    return  `/home/pwuser/.cache/ms-playwright/${suffix}`;
}

exports.handler = async (event, context) => {
    const browserName = event.browser || 'chromium';
    const browserTypes = {
        'webkit': webkit,
        'chromium': chromium,
        'firefox': firefox
    };
    const browserLaunchArgs = {
        'webkit': [],
        'chromium': [
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--no-zygote',
            '--use-gl=swiftshader',
            '--in-process-gpu',
            '--single-process',
        ],
        'firefox': []
    }
    let browser = null;
    try {
        console.log(`Starting browser: ${browserName}`);
        browser = await browserTypes[browserName].launch({
            executablePath: getCustomExecutablePath(browserTypes[browserName].executablePath()),
            args: browserLaunchArgs[browserName],
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('http://google.com/');
        console.log(`Page title: ${await page.title()}`);
    } catch (error) {
        console.log(`error${error}`);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}