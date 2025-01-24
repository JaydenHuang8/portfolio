console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$("nav a");

// step 2 stuff

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );

// if (currentLink) {
// currentLink.classList.add('current');
// }

// step 3 stuff

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contacts/', title: 'Contacts' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/JaydenHuang8', title: 'GitHub', external: true },
    // add the rest of your pages here
 ];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // TODO create link and add it to nav
    if (url.startsWith('https://github.com')) {
        nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
        continue;
    }
    url = 'https://jaydenhuang8.github.io/portfolio/' + url

    nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}
