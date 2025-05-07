[![](https://img.shields.io/badge/uzu_1.0.0-passing-green)](https://github.com/gongahkia/uzu/releases/tag/1.0.0) 

# `Uzu`

...

## Stack

* *Frontend*: 
* *Backend*: 
* *DB*: 

## Screenshots

![](./asset/reference/1.png)
![](./asset/reference/2.png)
![](./asset/reference/3.png)

## Architecture

![](./asset/reference/architecture.png)

## Usage

1. Clone the repository.

```console
$ git clone https://github.com/gongahkia/uzu
```

2. Get your [Gemeni API key](https://ai.google.dev/gemini-api/docs/api-key) and place it within [`popup.js`](./src/popup/popup.js).

```js
// ...

const API_KEY_STORAGE_KEY = 'XXX';

// ...
```

Then follow the below instructions for your browser.

### Firefox

1. Copy and paste this link in the search bar *about:debugging#/runtime/this-firefox*.
2. Click *load temporary add-on*.
3. Open the `uzu` repo, select `manifest.json`.
4. Click the toggle button.

### Chrome

1. Copy and paste this link in the search bar *chrome://extensions/*.
2. Toggle *Developer mode* on.
3. Click *load unpacked*.
4. Open the `uzu` repo, click *select*.
5. Click the toggle button.

Support for other browsers like Opera, Vivaldi have not been extensively tested, but this extension should work. Open an issue for further support.

## Reference

The name `Uzu` is in reference to [Maximum: Uzumaki](https://jujutsu-kaisen.fandom.com/wiki/Maximum:_Uzumaki) (極ノ番), the [Maximum Technique](https://jujutsu-kaisen.fandom.com/wiki/Cursed_Technique#Maximum_Techniques) of [Suguru Geto](https://jujutsu-kaisen.fandom.com/wiki/Suguru_Geto) (夏油傑) from the completed manga series [Jujutsu Kaisen](https://jujutsu-kaisen.fandom.com/wiki/Jujutsu_Kaisen_Wiki). It is also a reference to [Junji Ito](https://en.wikipedia.org/wiki/Junji_Ito)'s 1998 manga series of the [same name](https://en.wikipedia.org/wiki/Uzumaki).

<div align="center">
    <img src="./asset/logo/uzumaki.webp" width="40%">
</div>