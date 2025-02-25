const main = async () => {
  const { connect } = await import('puppeteer-real-browser');
  const { page, browser } = await connect({
    headless: true,
    args: [],
    customConfig: {},
    turnstile: true,
    connectOption: {},
  });

  page.goto('https://alanreid.dev');

  await page.waitForSelector('h2');

  const h2Element = await page.$('h2'); // Get the element handle
  const text = await page.evaluate((el) => el.textContent, h2Element); // Extract text content

  console.log(text);
};

main();
