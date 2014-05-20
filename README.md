Angular JS App Skeleton
=======================

Project skeleton for AngularJS projects.


Getting Started
---------------

1. Clone Repository

````bash
git clone git@github.com:devtrw/ng-skeleton

````

2. Install Dependencies (Install the latest version of Node.js if you don't already have it)

````bash
cd ng-skeleton && npm install
````

3. Compile project and start coding

````bash
gulp
````

The primary goal is to provide the backbone for larger angular applications.

Goals
-----

 - [ ] Provide generic implementation of Angular's ngMinErr system that requires only minimal configuration
 - [ ] Provide utility to automatically publish generated docs to github.io
 - [ ] Provide tool to handle renaming all the generic/placeholder values with the project values (or source them
       from something like package.json)
 - [ ] Bootstrap integration branch
 - [ ] UI Router integration branch
 - [ ] Parse.com integration branch
 - [ ] Document skeleton by "[dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)" doc generation tools
 - [ ] Finish this list...

Contributing
------------

**Application Structure**

See [Best Practice Recommendations for Angular App Structure](https://docs.google
.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub)

**Code Style**

A PHPStorm/WebStorm code style is distributed with this repository names .webstorm-codestyle.xml. If you are using
OSX you can load this into your IDE with the following command:

```bash
# For a user named "steven" with the app source located in ~/src/devtrw/ng-skeleton
ln -sf /Users/steven/src/devtrw/ng-skeleton/.webstorm-codestyle.xml
/Users/steven/Library/Preferences/WebStorm8/codestyles/ng_skeleton.xml
```

This style roughly follows the code style used by the Angular team, the [Google Javascript Style Guide]
(http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).
