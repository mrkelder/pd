# Client of "PD" hoodie shop 

**Version 1.0.0**

This is a client version of a hoodie shop "Peaceful Disruption". It's an open source so you can use it for free of charge.

## Links

1) [Pages](#pages)
2) [Components](#components)
3) [SCSS](#scss)
4) [App](#app)

## Scripts

1) npm run sass **starts watching for any changes in *scss/\** folder**

## Some important rules

1) Before your work pull changes from **dev** branch, maybe some new features came out
2) Before releasing a new version look for all **TODO** and **FIXME** statements in your code
3) Before release don't forget to change the version both in the documentation and pachage.json file

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

## Required skills

1) React
2) React-router
3) Redux
4) Scss
5) Axios

## Hierarchy

```
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

## App

### PageManager.js

A basic page manager, which is supposed to manage routes instead of basic <Switch> element. The reason is because some pages like **Payment.js** require to erase header and footer. Page manager solves such kind of problem.

Values:
1) pathname - url.

### cartReducer.js

This is a reducer for the shopping cart. Initial value looks like **{ items: [] }**. Items array takes whole objects of items.

Actions:
1) cart/pushElement - pushes whole payload into state.items array, so you can add one or several items.

### context.js

Contains all global static values, for instance images or domain.

Contexts:
1) infoContext - Contains information about domain.

### store.js

This is a file where all reducers are combined into one root reducer. Middleware adds reduxt dev tools extention for browsers.

### windowReducer.js

Gives information about current window resolution. Shape **{ windowSize: <window_resolution> }**.

Actions:
1) windowSize / resize - changes information about the size of window.

## Components

### App.js (Major)

Contexts:
1) InfoContext - holds information about domain.

### ItemPreloaded.js

Preloaded version of an item block, used for a suspense.

Props:
1) type - size of a block.

Prop types:
1) type - **'small'** or **'big'**.

### Footer.js

Simple footer with the copyright.

### Button.js

White button with black borders.

Props:
1) click - function on a click.
2) children - value of the button.

Prop types:
1) click - function.
2) children - string.

### Header.js

Header that contains a search and the shopping cart.

Values:
1) windowSize
2) items - items from the shopping cart.

### Item.js

Block of an item containing a name, price and a link to the item. Used in main and shop pages.

Values:
1) domain
2) imgRef
   
Props:
1) _id
2) name
3) price - **in dollars**.
4) img
5) type - size of an item block.

Prop types:
1) _id - string.
2) name - string.
3) price - number.
4) img - string.
5) type - **'big'** or **'small'**.

### SideBar.js

Side bar that has several links. Those are links to: main page, store, instagram.

Values:
1) windowSize
2) pathname - current subdirectory.
3) menuOpened / setMenuOpened

Functions:
1) openMenu

### BinItem.js

An item, shown during the purchase process.

Values:
1) domain

Props:
1) name
2) price
3) amount - quantity of items.
4) option - size and color, like **XS / White**.
5) img

Prop types:
1) name - string.
2) price - number.
3) amount - number.
4) option - string.
5) img - string.

### BinItemPreloaded.js

Preloaded version of *BinItem.js*.

Values:
1) stripe - stripe object.
2) elements - stripe elements.

Functions:
1) handleSubmit - submits the checout form.

### CheckoutForm.js

Stripe based checkout form. Used during payment process.

### CartItem.js

Item which is used in *Cart.js* page.

Values:
1) windowSize
2) valueQ / setValueQ - quanitty.
3) domain

Props:
1) id
2) name
3) price
4) option - size and color, e.g. **XS / white**.
5) quantity
6) img

Functions:
1) changeValue - changes amount of items.

Prop types:
1) id - string.
2) name - string.
3) price - number.
4) option - string.
5) quantity - number.
6) img - string.

## Pages

### Main.js

Carries recently added items in the shop.

### ItemPage.js

A page dedicated to an item.

Values:
1) windowSize
2) payPalButton - ref to PayPal button.
3) mainPhoto - ref to the main photo.
4) firstPhoto - ref to the first item's available photos.
5) secondPhoto - ref to the second item's available photos.
6) domain
7) buttonPlaced / setButtonPlaced - whether PayPal button has appeared or not.
8) isZoomShown / setZoomShown - whether a gallery is opened or not.
9)  allPhotos
10) photoIndex / setPhotoIndex - index of a picked photo.
11) size / setSize - size of T-shirt, hoodie or whatever.
12) color / setColor - color of T-shirt, hoodie or whatever.

Functions:
1) changePhotoIndex

### Payment.js

Page where a user can purchase hoodies.

Values:
1) stripePromise - loading stripe.
2) styles - styles for the "keep me noticed" checkbox.
3) theme - color theme for material-ui elements.
4) windowSize
5) submitStyle / setSubmitStyle - styles for a submit button.
6) isSummaryOpened / setSummaryOpened - whether the summary is opened or not.
7) styleForBreadCrumbs / setStyleForBreadCrumbs - bread crumbs' width.
8) allCountries / setAllCountries - a list of countries to choose.
9) re - regular expression for email.
10) shipping - type of shipping: **fs** or **ss**.
<!-- The values below this comment are inputs' values -->
11) firstName / setFirstName
12) lastName / setLastName
13) address / setAddress
14) optional / setOptional
15) city / setCity
16) postalCode / setPostalCode
17) chosenCountry / setChosenCountry
18) newsCheckbox / setNewsCheckbox
19) paymentSystem / setPaymentSystem
20) billingAddress / setBillingAddress
<!-- The values above this comment are inputs' values -->
<!-- The values below this comment are extra billing address inputs' values -->
21) firstNameAd / setFirstNameAd
22) lastNameAd / setLastNameAd
23) addressAd / setAddressAd
24) optionalAd / setOptionalAd
25) cityAd / setCityAd
26) postalCodeAd / setPostalCodeAd
27) chosenCountryAd / setChosenCountryAd
<!-- The values above this comment are extra billing address inputs' values -->
<!-- The values below this comment are error statuses -->
28) fNameEAd / setFNameEAd
29) lNameEAd / setLNameEAd
30) addressEAd / setAddressEAd
31) cityEAd / setCityEAd
32) countryEAd / setCountryEAd
33) postalEAd / setPostalEAd
34) emailE / setEmailE
35) fNameE / setFNameE
36) lNameE / setLNameE
37) addressE / setAddressE
38) cityE / setCityE
39) countryE / setCountryE
40) postalE / setPostalE
<!-- The values above this comment are error statuses -->
41) compared_h2 - element where the bread crumbs element takes width.
42) stage / setStage - stage of the a purchase.
43) shippingStage / setShippingStage - whether it's shipping stage or not.
44) paymentStage / setPaymentStage - whether it's payment stage or not.

Functions:
1) openSummary
2) stageChanger
3) changeShipping
4) changeCountry
5) changeCountryAd
6) checkInputs - checks inputs on the first page.
7) checkAdInputs - checks additional billing address inputs if needed.
8) nextStage - moves on the next stage depending on what's going on.

### Shop.js

Basically shop page.

Values:
1) windowSize
2) filter / setFilter - filter of sorting.
3) allItems / setAllItems - items in the page.

Functions:
1) changeSequence - changes sorting option.

### Cart.js

A cart with items.

Values:
1) windowSize
2) details / setDetails - size and color, like **XS / White**.

### Editor.js

A hoodie editor which allows you to create your own style.

Values:
1) domain
2) images - images of the current hoodie.
3) basePrice - original price of a hoodie.
4) imageIndex / setImageIndex - index of currently chosen side of a hoodie.
5) canvas / setCanvas
6) color / setColor
7) colorOpen / setColorOpen
8) elements / setElements - all elements in canvas.
9) removedElements / setRemovedElements
10) totalPrice / setTotalPrice
11) fontOverlay / setFontOverlay - overlay to choose a font (only available at mobile devices).
12) chosenFont / setChosenFont
13) fonts - all fonts used in this editor.
14) fileElement
15) windowSize

Functions:
1) getTotalPrice - calculates a total price
2) addItemToBin
3) addToElementsCollection - adds an element to the *elements* array depending on the perspective we're editing from.
4) changeFont
5) addText
6) addImage
7) changeColor
8) changeImageIndex
9) deleteElement

## SCSS

1) _init.scss - holds the collections of colors, mixins, font-face's and so on.
2) item.scss - styles for *Item.js* component.
3) index.scss - determines the main css rules throughtout all css files.
4) main.scss - styles for *Main.js* page.
5) button.scss - styles for *Button.js* component.
6) footer.scss
7) itemPage.scss
8) p_item.scss - styles for *ItemPreloaded.js* component.
9) bitItems.scss - styles for *BitItem.js* component.
10) checkout.scss - styles for *CheckoutForm.js* component.
11) p_binItem.scss - styles for *BitItemPreloaded.js* component.
12) payment.scss - styles for *Payment.js* page.
13) shop.scss - styles for *Shop.js* page.
14) cart.scss - styles for *Cart.js* page and *CartItem.js* component.
15) editor.scss - styles for *Editor.js* page.