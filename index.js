const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const watch = require('metalsmith-watch');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const excerpts = require('metalsmith-excerpts');
const serve = require('metalsmith-serve');
const collections = require('metalsmith-collections');
const sass = require('metalsmith-sass');
const helpers = require('metalsmith-register-helpers');
const env = require('metalsmith-env');
const wordcount = require("./src/readingTime");
const author = require('metalsmith-author');
const neat = require('bourbon-neat');
const drafts = require('metalsmith-drafts');
const fingerprint = require('metalsmith-fingerprint');
const markdownRenderer = require('./markdown');

let siteBuild = Metalsmith(__dirname)
  .metadata({
    title: "Jesús on the web",
    description: "My place to tell the world my thoughts.",
    generator: "Metalsmith",
    url: "http://jquintanab.com/"
  })
  .use(env())
  .use(wordcount({
    metaKeyReadingTime: "readingTime",
    metaKeyCount: "wordCount",
  }))
  .use(drafts())
  .source('./src')
  .destination('./build')
  .clean(false)
  .use((files, metalsmith, done) => {
    metalsmith._metadata.collections = null;
    metalsmith._metadata.articles = null;
    done()
  })
  .use(collections({
    articles: {
      pattern: 'articles/**/*.md',
      sortBy: 'date',
    },
  }))
  .use(author({ // make sure it comes after collections
    collection: 'articles',
    authors: {
      jesus: {
        name: 'Jesús Quintana',
        url: 'http://jquintanab.com',
        twitter: '@marduke182'
      }
    }
  }))
  .use(markdown({
    renderer: markdownRenderer,
  }))
  .use(permalinks())
  .use(excerpts())

  .use(sass({
    outputStyle: "expanded",
    sourceMap: true,
    sourceMapContents: true,
    includePaths: neat.includePaths,
  }))
  .use(helpers({
    "directory": "_helpers",
  }))
  .use(fingerprint({ pattern: '**/*.css' }))
  .use(layouts({
    engine: 'handlebars',
    partials: 'layouts/partials'
  }));

if (process.env.NODE_ENV !== 'production') {
  siteBuild = siteBuild
    .use(serve({
      port: 3000,
      verbose: true
    }))
    .use(watch({
      paths: {
        'layouts/**/*': '**/*',
        "${source}/**/*": '**/*', // every changed files will trigger a rebuild of themselves
      },
      livereload: true
    }))
}

siteBuild
  .build(function(err, files) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site build complete!');
    }
  });
