# V - Express, Webpack, and Angular

In this session we will explore using Express with Webpack for JavaScript bundling. We will use Angular as our templating language.

## Express Generator

Install [express generator](http://expressjs.com/en/starter/generator.html):

`$ npm install express-generator -g`

You may have to run as administrator on a PC or, on a Mac, run sudo:

`$ sudo npm install express-generator -g`

`cd` into the current session directory and generate a site:

`$ express --view=pug myapp --css sass`

Rename the folders in public to `js, css, img`.

Run:

`npm install` and `DEBUG=myapp:* npm start` (see the [generator page](http://expressjs.com/en/starter/generator.html) for Windows alternative)

Inspect the new directory. Note how the functionality is broken up into multiple files.

Test it at `http://localhost:3000/`.

### Test the Vanilla Installation

in Routes > index.js:

```js
res.render('index', { title: 'Express', animal: req.query.animal });
```

Pug: variables into text (in views):

```
`p.hello My animal's name is #{animal}`
```

```
http://localhost:3000/?animal=dog
```

Restart the server.

Set node command to nodemon in package.json (be sure you have nodemon installed first):

```js
  "scripts": {
    "start": "nodemon ./bin/www"
  },
```

Pug variables into attributes:

```
img.animal(src="https://picsum.photos/400/200?random" alt="#{animal}")
```

Like EJS, Pug allows you to use JavaScript in the template:

```
img.animal(src="https://picsum.photos/400/200?random" alt=`${animal}`)
```

```
- const upAnimal = animal.toUpperCase()
p My animal is #{upAnimal}
```

## Babel

Additional installs for webpack and babel:

`npm i --save-dev babel-core babel-loader babel-preset-env webpack webpack-cli concurrently`

We'll be using babel with webpack:

`https://babeljs.io/docs/setup/#installation`

Create `webpack.config.js` in the project folder:

```js
const path = require('path');

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  entry: './myapp.js',
  output: {
    path: path.resolve(__dirname, './public/js/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      }
    ]
  }
};
```

Note the use of the `module.exports` pattern. We saw this in `routes/index.js` as well.

Create `myapp.js` in the project folder:

```js
const getMessage = () => 'Hello World';
document.getElementById('output').innerHTML = getMessage();
```

Add webpack and a boom to our scripts:

```js
  "scripts": {
    "start": "nodemon ./bin/www",
    "build": "webpack --progress --watch",
    "boom!": "concurrently \"npm run start\" \"npm run build\" "
  },
```

`npm run boom!`

Note `public/js/bundle.js` and `bundle.js.map`.

Add a link to our bundle in `layout.jade` (be sure to use spaces or tabs):

```txt
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/css/style.css')
  body
    block content
    script(src='/js/bundle.js')
```

Add an #output div to `index.jade`:

```txt
extends layout

block content
  h1= title
  p Welcome to #{title}
  - const upAnimal = animal.toUpperCase()
  p My animal is #{upAnimal}
  #output
```

Refresh the page to compile jade and note the result of the `getMessage` function in the browser.

```js
const getMessage = () => 'Hello World';
document.getElementById('output').innerHTML = getMessage();
```

This indicates that the webpack installation is running properly.

Open `bundle.js`. It is being optimized for production and unintelligable.

Change webpack's `mode` to development in `webpack.config.js`:

```js
const path = require('path');

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: './myapp.js',
  output: {
    path: path.resolve(__dirname, './public/js/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      }
    ]
  }
};
```

Kill and restart the Express installation with boom! and inspect the bundle again. Note that `myapp.js` has been incorporated _and_ translated to ES5 by Babel.

## ES6 Modules

[Modules](https://webpack.js.org/concepts/modules/) are a way of breaking up JavaScript into smaller, more focused bits of functionality that can be combined.

We are already using [Node modules](https://nodejs.org/api/modules.html) in our projects. The `exports` and `require` statements working within our app are `Node` modules.

The other important module architecture, ES6 modules, is not natively supported in the browser so we need to bundle them. Having installed Webpack for bundling we can now use native [ES6 modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

### ES6 Module Exports and Imports

Create `src` directory with `config.js` inside.

Edit `config.js`:

```js
const apiKey = 'abcdef';
```

Import it into `myapp.js` (note: paths are not necessary for node modules):

```js
import apiKey from './src/config';
console.log(apiKey);

const getMessage = () => 'Hello World';
document.getElementById('output').innerHTML = getMessage();
```

Refresh the browser. Note empty object in the browser's console.

Export the data - using _default_ and _named_ exports.

In `config.js`:

```js
const apiKey = 'abcdef';

export default apiKey;
```

Refresh the browser. Note the new variable in the browser's console.

Because we exported it as default we can rename on import.

In `myapp.js`:

```js
import foo from './src/config';
console.log(foo);
```

ES6 Modules can only have one default export but _can_ have multiple named exports.

A named export in `config.js`:

`export const apiKey = 'abcdef';`

requires an import that selects it in `myapp.js`:

```js
import { apiKey } from './src/config';
console.log(apiKey);
```

Multiple named exports:

```js
export const apiKey = 'abcdef';
export const url = 'https://mlab.com';
```

```js
import { apiKey, url } from './src/config';
console.log(apiKey, url);
```

Multiple named exports encourage code encapsulation and reuse across multiple projects.

Functions can be internal to a module or exported:

```js
export const apiKey = 'abcdef';
export const url = 'https://mlab.com';

export function sayHi(name) {
  console.log(`Say hello ${name}`);
}
```

```js
import { apiKey, url, sayHi } from './src/config';
sayHi('daniel');
```

Review [the documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) on MDN for options including `import as`, `export as` and exporting multiples.

Note the resemblance (and difference) between module importing above and Node.

In `routes/index.js`:

```js
module.exports = router;
```

In `app.js`:

```js
var routes = require('./routes/index');
```

## Angular as a Templating Engine

Let's look at using an older - but still common and actively maintained - version of Angular as our page templating language.

Remove views and jade in app.js

```js
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
```

Add to routes/index.js:

```js
// res.render('index', { title: 'Express', animal: req.query.animal });
res.sendFile(__dirname + '/public/index.html');
```

Create index.html page in public:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <p>It works!</p>
  <div id="output"></div>
</body>
</html>
```

Note the link to bundle.js.

Stop running the app and npm install angular:

`npm install angular@1.6.2 --save`

Import it into myapp.js:

```js
import angular from 'angular';
```

Retart the app the boom! and note that your bundle just got very large.

HTML5 introduced the `data-` [attribute](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).

Angular uses this concept to extend html with [directives](https://www.w3schools.com/angular/angular_directives.asp) such as `data-ng-app, data-ng-controller, data-ng-repeat` etc.

Bootstrap `index.html` with `<html lang="en" data-ng-app>`:

```html
<!DOCTYPE html>
<html lang="en" data-ng-app>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="/js/bundle.js"></script>
</head>

<body>
    <p>It works</p>
</body>

</html>
```

### Exploring Angular Directives

Simple Angular directives:

1. `ng-app` − this directive starts an AngularJS application in the code block where it is inserted. We will use it to create Angular [Modules](https://docs.angularjs.org/guide/module)
1. `ng-init` − this directive initializes application data (we won't using it beyond the simple examples below)
1. `ng-model` − this directive binds an input, select, or textarea to our data
1. `ng-repeat` − this directive repeats html elements for each item in a collection

```html
  <div class="site-wrap"  ng-init="messageText = 'Hello World!'">
    <input ng-model="messageText" size="30"/>
    <p>Everybody shout "{{ messageText | uppercase }}"</p>
  </div>
```

This is a demonstration of [data binding](https://docs.angularjs.org/guide/databinding) and [filtering](https://docs.angularjs.org/api/ng/filter) to uppercase.

#### Using an Object

`greeting = { greeter: 'Daniel' , message: 'Hello World' }`

```html
  <div class="site-wrap"  ng-init="greeting = { greeter: 'Daniel' , message: 'Hello World' }"">
    <input type="text" ng-model="greeting.greeter" size="30"/>
    <input type="text" ng-model="greeting.message" size="30"/>
    <p>{{greeting.greeter }} says "{{ greeting.message }}</p>
  </div>
```

#### Using ng-repeat with an Array

```html
  <div class="site-wrap" ng-init="portfolios = ['Call of Booty', 'The Sack of the Innocents', 'Pipe and First Mate']" >
    <ul>
      <li ng-repeat="portfolio in portfolios">
        {{ portfolio }}
      </li>
    </ul>
  </div>
```

#### [Filtering](https://docs.angularjs.org/api/ng/filter) and Ordering

On an array of objects:

```html
<div class="site-wrap" ng-init="portfolios = [
{ name: 'Call of Booty', date: '2013-09-01' },
{ name: 'The Sack of the Innocents', date: '2014-04-15' },
{ name: 'Pipe and First Mate', date: '2012-10-01' } ]">

<p>Filter list: <input ng-model="searchFor" size="30"/></p>

<ul>
  <li ng-repeat="portfolio in portfolios | filter:searchFor | orderBy:'date' ">
  {{ portfolio.name  }}</li>
</ul>
```

Add `ngClass`:

```html
<ul>
  <li ng-repeat="portfolio in portfolios |
  filter:searchFor |
  orderBy:'date'"
  ng-class="{ even: $even, odd: $odd }">
  {{ portfolio.name  }}</li>
</ul>
```

with these styles:

```html
<style>
  .even { color: red; }
  .odd { color: blue; }
</style>
```

Keys and values of the array:

```html
  <ul>
    <li ng-repeat="(key, value) in portfolios">
      <strong>{{key}}</strong> - {{value}}
    </li>
  </ul>
```

## Named Apps

`ng-app=myApp`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="js/bundle.js"></script>
</head>
<body>
  <div class="site-wrap" data-ng-app=myApp >
    <div data-ng-controller="myCtrl">
      Name: <input data-ng-model="name">
    </div>
  </div>
</body>
</html>
```

In `myapp.js`:

```js
import angular from 'angular';

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
  $scope.name = 'John Doe';
});
```

Refactored:

```js
var app = angular.module('myApp', []);
app.controller('myCtrl', $scope => ($scope.name = 'John Doe'));
```

## Angular Components

'Custom tags' that can move templates in and out of html.

myapp.js:

```js
import angular from 'angular';

angular.module('myApp', []);

angular.module('myApp').component('greetUser', {
  template: 'Hello, {{$ctrl.user}}!',
  controller: function GreetUserController() {
    this.user = 'world';
  }
});
```

`index.html`:

```html
<body>
  <div ng-app="myApp">
    <greet-user></greet-user>
  </div>
</body>
```

Refactor to use template strings and store the module in a variable:

```js
import angular from 'angular';

const app = angular.module('myApp', []);

app.component('greetUser', {
  template: `Hello, {{$ctrl.user}}!`,
  controller: function GreetUserController() {
    this.user = 'world';
  }
});
```

By creating multiple components we can switch out the content depending on the custom tag.

```js
app.component('byeUser', {
  template: `Bye, {{$ctrl.user}}!`,
  controller: function GreetUserController() {
    this.user = 'cruel world';
  }
});
```

```html
  <div ng-app="myApp">
    <bye-user></bye-user>
  </div>
```

<!-- This ends abruptly -->

## PROCESS

Recreate navitems.js in src:

```js
const navitems = [
  {
    label: 'Watchlist',
    link: 'watchlist',
    header: 'Market intelligence now revolves around what you need',
    content: `
  <ul>
  <li>Create topical tiles with the content you want</li>
  <li>Access subscribed research without having to check your email</li>
  <li>Compile and share research based on your interests</li>
  <li>Access your Barclays Live charts on the go</li>
  <li>Go deeper into topics in your own time, online or offline</li>
  </ul>`
  },
  {
    label: 'Research',
    link: 'research',
    header: 'Accessing your content has never been easier',
    content: `
  <ul>
  <li>Filter content by asset class, region, industry or currency</li>
  <li>View what’s trending today, this week, this month</li>
  <li>Browse a magazine or publication and add it to your Watchlist</li>
  <li>Select text in publications to highlight and annotate</li>
  <li>Create a Quick List and save it to your Workbook for easy access in the future</li>
  </ul>`
  },
  {
    label: 'Markets',
    link: 'markets',
    header: 'The pulse of the market is right at your fingertips',
    content: `
  <ul>
  <li>Check live FX pricing from BARX</li>
  <li>Monitor market data across asset classes</li>
  <li>Access Barclays Indices, Credit Center, TRENDS and more</li>
  <li>View companies under coverage across equities and credit</li>
  <li>Access financial forecasts from our equity analysts</li>
  </ul>`
  },
  {
    label: 'Workbook',
    link: 'workbook',
    header: 'Save and organize content for offline reading',
    content: `
  <ul>
  <li>Look for Add to Workbook wherever you are in the app</li>
  <li>Create folders in your Workbook with the content you like</li>
  <li>Add your annotated publications to the Workbook</li>
  <li>Access content in your Workbook online or offline</li>
  </ul>`
  },
  {
    label: 'Connect',
    link: 'connect',
    header: 'A new interactive experience',
    content: `
  <ul>
  <li>View messages from your Barclays research analysts and sales teams</li>
  <li>Reply to your Barclays contacts on the go</li>
  <li>Share tiles, publications and charts</li>
  <li>Read messages seamlessly on your tablet and via email</li>
  </ul>`
  },
  {
    label: 'Desktop',
    link: 'desktop',
    header: 'Start on your tablet, continue on the desktop',
    content: `
  <ul>
  <li>Work seamlessly on the desktop and on your tablet</li>
  <li>View your Watchlist, your Workbook and Connect from the tablet and the desktop</li>
  <li>Create charts on the desktop and view them on the app</li>
  </ul>`
  },
  {
    label: 'FAQ',
    link: 'faq',
    header: 'FAQ',
    content: `
  <ul>
  <li>Work seamlessly on the desktop and on your tablet</li>
  <li>View your Watchlist, your Workbook and Connect from the tablet and the desktop</li>
  <li>Create charts on the desktop and view them on the app</li>
  </ul>`
  }
];
```

At bottom of navItems:

`export default navitems;`

Import into `myapp.js`:

```js
import angular from 'angular';
import navitems from './src/navitems';
console.log(navitems);
```

<!-- Place a section of the page under the influence of a controller:

```html
<!DOCTYPE html>
<html lang="en" data-ng-app="myApp">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="js/bundle.js"></script>
</head>
<body>
  <nav data-ng-controller="NavController">

  </nav>
</body>
</html>
``` -->

<!-- Declare app to be an instance of an Angular module (in myapp.js):

`var app = angular.module('myApp', []);` -->

<!-- `app` is the main Angular space and can be broken down into multiple controllers. -->

Add our data to the NavController:

```js
import angular from 'angular';
import navitems from './src/navitems';
console.log(navitems);

var app = angular.module('myApp', []);

app.controller('NavController', function($scope) {
  $scope.navitems = navitems;
});
```

[Scope](https://docs.angularjs.org/guide/scope#!) is the glue between application controller and the view.

Test to see if it is available in our view.

Use Angular with the `ng-controller` and `ng-repeat` directives to build out again in index.html:

```html
  <nav data-ng-controller="NavController">
    <ul id="nav-links">
      <li data-ng-repeat="navitem in navitems">
        <a href=#{{navitem.link}}>{{navitem.label}}</a>
      </li>
    </ul>
  </nav>
```

`{{ }}` - moustaches or handlebars are similar to JavaScript Template Strings (`${ }`). These are known as [expressions](https://docs.angularjs.org/guide/expression).

`ng-repeat` is a directive. There are [many directives](https://docs.angularjs.org/api/).

Build out the content.

In index.html:

```html
  <div data-ng-controller="ContentController">
    <div data-ng-repeat="navitem in navitems">
      <h2>{{ navitem.label }}</h2>
      <h3>{{ navitem.header }}</h3>
    </div>
  </div>
```

In myapp.js:

```js
app.controller('ContentController', function($scope) {
  $scope.navitems = navitems;
});
```

Note - injecting html into a page is considered unsafe.

Try adding `{{ navitem.content }}`:

```html
  <div data-ng-controller="ContentController">
    <div data-ng-repeat="navitem in navitems">
      <h2>{{ navitem.label }}</h2>
      <h3>{{ navitem.header }}</h3>
      {{ navitem.content }}
    </div>
  </div>
```

Load [sanitize](https://docs.angularjs.org/api/ngSanitize):

Back in the 'old' days you would use the `<script>` ta, e.g.:
`<script src="https://code.angularjs.org/1.5.8/angular-sanitize.min.js"></script>`

Today we are using webpack and bundling

`npm install angular-sanitize@1.6.2 --save`

```js
import angular from 'angular';
import ngSanitize from 'angular-sanitize';
```

Use [injection](https://docs.angularjs.org/guide/di) to make it available to the app:

`var app = angular.module('myApp', ['ngSanitize']);`

We can then use:

`<div ng-bind-html="navitem.content"></div>`

## Notes

```js
const navbar = document.querySelector('nav');
const markup = `
<ul>
${navitems.map(navitem => `<li><a href="${navitem.link}">${navitem.label}</a></li>`).join('')}
</ul>
`;
navbar.innerHTML = markup;

console.log(navbar);
```

`npm install angular-route@1.6.2 --save`

`import ngRoute from 'angular-route';`

`var app = angular.module('myApp', [ngRoute, ngSanitize]);`
