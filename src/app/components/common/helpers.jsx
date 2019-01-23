import { history } from '../../store';

// Common app methods
module.exports = {

  animate: (el, animationName, callback) => {
    el.classList.add('animated', animationName);
    el.addEventListener('animationend', function handler() {
      el.classList.remove('animated', animationName);
      el.removeEventListener('animationend', handler);
      if (callback) {
        callback();
      }
    });
  },

  addQuery(historyLocation, query) {
    const location = Object.assign({}, historyLocation);
    Object.assign(location.query, query);
    history.push(location);
  },

  removeQuery(historyLocation, ...queryNames) {
    const location = Object.assign({}, historyLocation);
    queryNames.forEach(q => delete location.query[q]);
    history.push(location);
  },

  createCookie(name, value, days) {
    const date = new Date();
    let expires = `; expires=${date.toGMTString()}`;
    if (days) {
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    } else {
      expires = '';
    }
    document.cookie = `${name}=${value + expires}; path=/`;
  },

  readCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i += 1) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  },

  eraseCookie(name) {
    module.exports.createCookie(name, '', -1);
  },

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w-]+/g, '')       // Remove all non-word chars
      .replace(/--+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },

  classify(text) {
    return text.toString().toLowerCase().substring(1)
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/\//g, ' ')           // Replace slashes with spaces
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  },

  makeid() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
};
