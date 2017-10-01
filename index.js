var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var watch    = require('metalsmith-watch');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var excerpts = require('metalsmith-excerpts');
var serve = require('metalsmith-serve');
var collections  = require('metalsmith-collections');
var sass = require('metalsmith-sass');
var helpers = require('metalsmith-register-helpers');
var env = require('metalsmith-env');
var wordcount = require("./src/readingTime");
var author = require('metalsmith-author');
var neat = require('bourbon-neat');
var drafts = require('metalsmith-drafts');
var fingerprint = require('metalsmith-fingerprint')


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
  .use(markdown())
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
