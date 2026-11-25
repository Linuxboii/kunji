# Kunji

Passphrase and password generator.

**Live:** https://kunji.avlokai.com

**For:** Anyone setting up an account, a Wi-Fi network or a password manager master password.

## What it does

- Diceware-style passphrases from the EFF large wordlist (7,776 words)
- Random passwords with chosen character sets, each guaranteed present
- Option to skip look-alike characters
- Entropy in bits and a plain-language time to crack
- Uses crypto.getRandomValues with rejection sampling, no modulo bias

Nothing is stored or sent. Wordlist by the Electronic Frontier Foundation, CC BY 3.0.

## Demand

Semrush estimates passwordsgenerator.net, a single password generator site, at about 38,600 visits a month.

- [Semrush: passwordsgenerator.net](https://www.semrush.com/website/passwordsgenerator.net/overview/)

These figures measure demand for the task, from existing tools. They are third-party estimates or company claims, not usage of this tool.

## Privacy

Everything runs in your browser. There is no backend, no analytics and no account. Nothing you enter is uploaded.

## Run locally

No build step and no runtime dependencies. Serve the folder with any static server:

```
npx serve .
```

## Tests

The logic lives in `lib.js` as pure functions, tested with the Node test runner (Node 20+):

```
npm test
```

## Files

- `index.html` page and styles
- `app.js` wiring between the page and the logic
- `lib.js` pure logic, no DOM
- `lib.test.js` tests
- `base.css`, `ui.js` shared look and small DOM helpers

## Licence

MIT. Made by [Sushanth Kasturi](https://sushanth.avlokai.com).
