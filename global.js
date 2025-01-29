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
    { url: 'contact/', title: 'Contacts' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/JaydenHuang8', title: 'GitHub'},
    // add the rest of your pages here
 ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // TODO create link and add it to nav

    console.log('adding to nav');

    if (url.startsWith('https://github.com')) {
        // github page
        url = url
    } else if (!ARE_WE_HOME && !url.startsWith('http')) {
        // non home page
        url = '../' + url;
    } else {
        // home page
        url = 'https://jaydenhuang8.github.io/portfolio/' + url
    }

    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        console.log('outside link:')
        console.log(url)
        a.target = "_blank";
    }

    nav.append(a);
}
console.log('nav done');

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select id = 'color-scheme-select'>
                <option value="light dark">Automatic</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
          </select>
      </label>
    `
);

const select = document.getElementById('color-scheme-select');

if (localStorage.colorScheme) {
    // if there is already a saved color
    const savedScheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', savedScheme); // Apply the saved scheme
    select.value = savedScheme; // Update the dropdown to reflect the saved preference
}

select.addEventListener('input', function (event) {
    const selectedScheme = event.target.value;

    console.log('Color scheme changed to', selectedScheme);

    // Save the user's preference to localStorage
    localStorage.colorScheme = selectedScheme;

    console.log('color scheme changed to', event.target.value);
    
    document.documentElement.style.setProperty('color-scheme', selectedScheme);
});

export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        console.log(response)
        
        const data = await response.json();
        return data; 

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
    // Your code will go here
    if (!(containerElement instanceof HTMLElement)) {
        console.error('Invalid container element provided.');
        return;
    } // make sure containerElement is a valid DOM

    // Ensure headingLevel is valid (only allow h1-h6)
    if (!/^h[1-6]$/.test(headingLevel)) {
        console.warn(`Invalid heading level "${headingLevel}". Defaulting to h2.`);
        headingLevel = 'h2'; // Default to h2 if input is invalid
    }

    containerElement.innerHTML = ''; //outside loop
    // makesure its container empty
    project.forEach(p => {
        const title = p.title || 'Untitled Project';
        const image = p.image || 'https://vis-society.github.io/labs/2/images/empty.svg';
        //image coming
        const description = p.description || 'No description available.';

        const article = document.createElement('article');
        article.innerHTML = `
        <${headingLevel}>${title}</${headingLevel}>
        <img src="${image}" alt="${title}" onerror="this.src='fallback-image.jpg';">
        <p>${description}</p>
        `;

        containerElement.appendChild(article);
    });
}

export function countProjects(project, titleElement) {
    // Check if projects is an array
    if (Array.isArray(project)) {
        titleElement.textContent = `${projectCount} Projects`;
    } else {
        console.error('Invalid projects data');
    }
}