# Wave Stand-alone API Setup and Usage

Here’s a clean, step-by-step path from zero to a working local WAVE Stand-alone API, with copy-pasteable commands and request examples.

---

## 📦 Overview and Prerequisites

- **Web server**: Apache or Nginx (Ubuntu on AWS is recommended, but any Linux with PHP works). The API’s public entrypoint is a PHP file, and the “core” stays private on disk.
- **PHP**: Installed and configured to serve the `htdocs` directory where `request.php` lives.
- **Node.js + npm**: Needed to install Puppeteer; Node v7.6.0+ required. On Linux you’ll likely need Chromium dependencies for headless browsing.
- **File layout**: Public `htdocs` (with `request.php`) and a non-public `core` folder. A `temp` folder holds results and screenshots.

> You’ll point your site/virtual host to the folder containing `request.php` (`htdocs`). Keep `core` private (not web-accessible).

---

## 📁 Install and File Layout

### 1. Place Files on Server

- Extract the API package and upload to your server.
- Make `htdocs` web-accessible (site root or a virtual host that points to it).
- Keep `core` private (outside the web root if possible).

**Example structure:**

```
/var/www/wave-api/
  htdocs/
    request.php
    user.config.json
  core/
    Core.php
    api.config.json
  temp/
    results/
    screenshots/
    scripts/
```

> Ensure `htdocs` is served by Apache/Nginx. `core` should not be publicly accessible.

---

### 2. Install Node and Puppeteer

**On Ubuntu/Debian:**

```bash
# Install node & npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Chromium dependencies
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 \
libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

**Install Puppeteer in the core directory:**

```bash
cd /var/www/wave-api/core
npm i puppeteer
```

> Use `puppeteer-core` if connecting to a remote browser service.

---

### 3. Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/wave-api/temp /var/www/wave-api/core/api.config.json
sudo chmod -R 775 /var/www/wave-api/temp
```

- `temp/results` and `temp/screenshots` must be writable for outputs.
- `core/api.config.json` stores license info; do not edit it manually.

---

## ⚙️ Configure the API

Edit `htdocs/user.config.json`:

```json
{
  "core_path": "/var/www/wave-api/core/",
  "temp_path": "/var/www/wave-api/temp/",
  "screenshot": false,
  "evaldelay": 250,
  "viewportwidth": 1200,
  "browserlesskey": "",
  "useragent": "",
  "savedom": false,
  "debug": false,
  "domains": ["yourdomain.com", "example.org"]
}
```

> Use absolute paths with forward slashes. Override any setting per request via GET parameters.

---

## 🚀 Test Requests and Consume Results

### 1. Quick Test

**Browser or curl:**

```bash
curl "https://YOURDOMAIN/request.php?key=YOURKEY&url=https://example.com"
```

**With options:**

```bash
curl "https://YOURDOMAIN/request.php?key=YOURKEY&url=https://example.com&evaldelay=1500&viewportwidth=800&savedom=true&screenshot=true"
```

---

### 2. Minimal PHP Client

```php
<?php
$endpoint = 'https://YOURDOMAIN/request.php';
$params = [
  'key' => 'YOURKEY',
  'url' => 'https://example.com',
  'evaldelay' => 1000,
  'viewportwidth' => 1200,
  'savedom' => 'true'
];
$qs = http_build_query($params);
$response = file_get_contents("$endpoint?$qs");
$json = json_decode($response, true);
header('Content-Type: application/json');
echo json_encode($json, JSON_PRETTY_PRINT);
?>
```

---

### 3. Node Client Example

```js
import fetch from 'node-fetch';

const endpoint = 'https://YOURDOMAIN/request.php';
const params = new URLSearchParams({
  key: 'YOURKEY',
  url: 'https://example.com',
  evaldelay: '1500',
  viewportwidth: '1024',
  savedom: 'true'
});

const res = await fetch(`${endpoint}?${params.toString()}`);
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
```

---

## 🧠 Advanced: Puppeteer Scripts

Save scripts in `temp/scripts/` and call with `&prescript=login.js` or `&postscript=interact.js`.

### Prescript Example (Login)

```js
module.exports = async (page) => {
  await page.goto('https://mysite.com/login');
  await page.type('#username', 'MyUsername');
  await page.type('#password', 'MyP@55word');
  await page.click('.login-button');
  await page.waitForSelector('#maincontent');
  return page;
};
```

### Cookie Prescript

```js
module.exports = async (page) => {
  const cookie = {
    domain: "webaim.org",
    name: "sessionid",
    value: "01234567890",
    path: "/",
    secure: false
  };
  await page.setCookie(cookie);
  return page;
};
```

### Postscript Interaction

```js
module.exports = async (page) => {
  await page.type('#search', 'John');
  await page.click('#search-button');
  await page.waitForSelector('#search-results');
  return page;
};
```

---

## 🛠️ Operational Tips

- **Dynamic apps**: Increase `evaldelay` (e.g., 1500–3000 ms).
- **Screenshots**: Use `&screenshot=true`; clean up `temp/screenshots` regularly.
- **Saved DOM**: Use `&savedom=true`; clean up `temp/results` periodically.
- **Domain control**: Use `domains` list to restrict usage.
- **Permissions**: Recheck write access if errors occur.
- **Debugging**: Use `&debug=true` to retain internal files and logs.

---