# embed-containers
Development for embed containers within PRI's Platform

## Usage
All necessary files that must be included are located under `dist`.  Refer to `src/js/demo.js` to see how to interact with the Embed Container.
<br />**Files in `dist` do not contain external dependencies**, with the exception of bootstrap which is compiled into the minified CSS found in `dist`. Please see the "Dependency Gathering" section to understand how to gather and install dependencies.

## Development
Developer dependencies:
* NPM - follow [this link](http://blog.npmjs.org/post/85484771375/how-to-install-npm) if you have not already installed NPM
  * manages developer dependencies
* Gulp (global)
  * task runner
```sh
$ npm install -g gulp
```
* Bower (global)
  * manages dependencies
```sh
$ npm install -g bower
```

### Dependency gathering
Download all the necessary packages with the following two commands (executed in either order):
```sh
$ npm install
$ bower install
```

### Gulp
**Configuration**
<br />
The gulp file requires some information to run properly. Duplicate the file `config.json.template` (found in the root folder), rename it to `config.json`, and modify the new file so that the `serverRoot` field contains an absolute file path to the root directory of a server hosted on the development machine.
<br />
**Running**
<br />
Once that change is made, gulp can be run by simply typing `gulp` into a shell whose working directory is in `src`. The default gulp task will concatenate all javascript into one file and all css into another file. It will also move the necessary files over to the server root. The task will keep running, **so keep the shell open**, watching for changes to any html, php, js, or less files. If changes are made,  one of the running gulp-watch tasks will run the corresponding gulp task.
