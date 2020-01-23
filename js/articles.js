import {openDB} from "../node_modules/idb/build/esm/index.js";

const articlesDB = async () => {
  const ARTICLES_VERSION = 1;
  return await openDB('Articles', ARTICLES_VERSION, {
    upgrade(database) {
      const store = database.createObjectStore('articles', {
        keyPath: 'id',
        autoIncrement: true,
      });
      // create the index.
      store.createIndex('created', 'created');
    }
  });
};

const createArticles = async (db, articles) => {
  {
    const tx = db.transaction('articles', 'readwrite');
    for (let article in articles) {
      tx.store.add(articles[article]);
    }
    await tx.done;
  }
};

const getArticles = async () => {
  const db = await articlesDB();
  const cachedArticles = await db.getAll('articles');

  if (cachedArticles.length === 0) {
    const articles = await fetch('/service/articles.json');
    const response = await articles.json();
    if (response) {
      await createArticles(db, response);
      return response;
    }
  }
  else {
    return cachedArticles;
  }
};

const renderArticles = articles => {

  const template = article => {
    return ` <article>
            <a title="Article One" href="#">
                <header>
                    <h2 class="title">
                        ${article.title}
                    </h2>
                </header>
                <figure>
                    <picture>
                        <source srcset="${article.image.presets.mobile}" media="(max-width:769px)"/>
                        <source srcset="${article.image.presets.desktop}" media="(min-width:768px)"/>
                        <img src="${article.image.presets.mobile}" alt="${article.image.title}"/>
                    </picture>
                    <figcaption>${article.image.caption}</figcaption>
                </figure>
                <p>${article.body}</p>
            </a>
        </article>`;
  };

  let html = '';
  for (let article in articles) {
    html += template(articles[article]);
  }

  document.querySelector('.articles').innerHTML = html;
};

// create articles
getArticles().then(articles => {
  renderArticles(articles);
}).catch(error => console.log(error));
