# Peaceful Disruption

![Version](https://img.shields.io/badge/version-1.0.1-green) ![Node Version](https://img.shields.io/badge/React-17.0.2-blue)

This is a client version of a hoodie shop written in react.

## Table of Contents

- [General Info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [Flow of work](#flow-of-work)
- [Restrictions](#restrictions)
- [Hierarchy](#hierarchy)
- [Components](#components)

## General Info

Peaceful Disruption is a shop that selles hoodies, T-shirts, and anything of that kind. Besides choosing an existing design of a hoode, a user can make his own.

## Technologies

Here is a list of used libraries and required skills

- React
- React Router
- React Testing Library
- Redux
- Node.js
- Axios
- Stripe
- FabricJS
- Material-ui
- Scss

## Setup

- Before you start writing code install all dependencies with `npm i`
- To run the application use `npm start`
- To start compiling scss files use `npm run sass`
- To test the application use `npm test`
- To build the application use `npm build` and then `serve -s build` to start the application

## Flow of work

1) You start writing code by adding new features, therefore you create *feature-\** branch from **dev** branch (`git checkout -b feature-*`)
2) After you're done with features you merge your feature branch into dev branch (`git merge --no-ff feature-*`)
3) Then you make a *release-new_version* (`git checkout -b release-new_version`) and rewrite docs as well as change a version in the **package.json** file
4) After changes you merge it both into **master** and **dev** branches
5) Being on **master** branch, tag a new version (`git tag <version>`)
6) If some problems occur and you need to fix them, create a *hotfix-newer_version* from master branch, and after successful changes merge it back into **master** and **dev** branches

## Restrictions

1) Names of css classes and ids are written in snake case.
2) You have to import files into components via global paths (e.g. *components/Head.js*).
3) All Redux reducers are stored separately in *app/\** folder.
4) *css/* folder is immutable.
5) Every component must have PropTypes and default values (if necessary).
6) Comments are compulsory.
7) All files (besides built ones) must be included in [Hierarchy](#hierarchy).
8) The documentation must be rewritten during release-* stage.
9) You use two asterisk symbols when you refer to something, *example*.
10) You use pairs asterisk symbols in order to make something noticeable (e.g. shape of some object or special name), **example**.
11) A component must be described like **Main info -> Values -> Props -> Functions -> Prop types**.
12) If a functional component has a state hook, the state in the documentation must be described like **isMenuOpened / setMenuOpened**.
13) If, for instance, a name of a function says "closeMenu", you needn't comment that.
14) States must be described like **value / setter**

## Hierarchy

```text
Root
│ README.md
│ .gitignore
│ package.json
│ package-lock.json
│ .env
│ .eslintcache
│ debug.log
│ jsconfig.json
│
└───node_modules
│
└───public
│
└───src
    │
    │ App.js
    │ index.js
    └───app 
    │   │ cartReducer.js
    │   │ context.js
    │   │ store.js
    │   │ windowReducer.js
    │   │ PageManager.js
    │
    └───components
    │   │ Header.js
    │   │ Item.js
    │   │ SideBar.js
    │   │ Footer.js
    │   │ ItemPreloaded.js
    │   │ Button.js
    │   │ BinItem.js
    │   │ BinItemPreloaded.js
    │   │ CheckoutForm.js
    │   │ CartItem.js
    │
    └───css
    │
    └───fonts
    │   │ Kalam-Regular.ttf
    │   │ Righteous-Regular.ttf
    │   │ Roboto-Regular.ttf
    │   │ Ballet.ttf
    │   │ Cyberpunk-Regular.ttf
    │   │ Hanalei-Regular.ttf
    │   │ LongCang-Regular.ttf
    │   │ Ranchers-Regular.ttf
    │   │ ReggaeOne-Regular.ttf
    │
    └───img
    │
    └───pages
    │   │ Main.js
    │   │ ItemPage.js
    │   │ Payment.js
    │   │ Shop.js
    │   │ Cart.js
    │   │ Editor.js
    │
    └───scss
        │ _init.scss
        │ item.scss
        │ index.scss
        │ button.scss
        │ footer.scss
        │ header.scss
        │ itemPage.scss
        │ main.scss
        │ p_item.scss
        │ binItem.scss
        │ checkout.scss
        │ p_binItem.scss
        │ payment.scss
        │ shop.scss
        │ cart.scss
        │ editor.scss
```

## Components

- [BinItem](./docs/BinItem.md)
