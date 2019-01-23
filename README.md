[![CircleCI](https://img.shields.io/circleci/project/VF19CMI/react-boilerplate-json-api/master.svg)]()

# React boilerplate JSON API

[Live website](http://vf-frontend.herokuapp.com/)

## Features

- ES6 and Babel integration
- Free of jQuery and Bootstrap
- Basic normalize CSS reset
- Custom CSS3 animation implementation
- Lodash and React Classnames included by default
- Webpack development and production environment configuration
- Webpack Dev Server with Hot loader
- Webpack SCSS, SVG and IMG support
- Autoprefixer for all CSS rules
- ESLint with AirBnb rules
- React Router configuration with browser history and base path
- React Helmet for page titles and SEO
- React GA for Google Analytics integration
- Fastclick lib for quick touch events
- Redux configuration
- Redux JSON API integration
- Testing environment configured with Jest and Enzyme
- PWA Offline caching, manifest and icons
- Optimised with Google's Ligthouse audit
- Includes common components for icons, loaders and notifications
- Includes a home and not found page components

## Getting Started

Install the dependencies using Yarn

````
yarn
````

Replace the default app name (boilerplate) and API URLs in:

- `webpack/webpack.config.js` (line 9)
- `src/app/constants/constants.jsx` (line 4, 5, 8, 9)

### Start development server with hot reloading

````
yarn run dev
````

The website will be available at [localhost:8080/boilerplate](http://localhost:8080/boilerplate)

* If there is another app running on that port, it will use 8081

### Run tests and lint

````
yarn run test
yarn run test:watch
yarn run lint
````

### Production

Build for production

````
yarn run build
````
