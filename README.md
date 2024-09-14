# Scrap Pics

Scrap Pic is an API for retrieving images from a URL.

## Installation

First of all you need to install [NodeJs](https://nodejs.org/fr/download/package-manager), choose the LTS version for more stability.

**1. Clone this repository or download the zip file**
```javascript
git clone https://github.com/HedzDev/scrapPics.git
```

**2. Install all required dependencies, type the following command at the root of the project**
```javascript
npm install
```

**3. Run the server**
```javascript
npm start
```
OR

If you've already installed [nodemon](https://nodemon.io/)
```javascript
nodemon
```
## Usage

**This API has 2 endpoints**
  - /scrap-images to retrieve all images:
    ```
    http://localhost:3000/scrap-images?url=YOUR_URL
    ```
  - /processed-urls to see URLS already processed:
    ```
    http://localhost:3000/processed-urls
    ```
