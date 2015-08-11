angular-widgets [![Build Status](https://travis-ci.org/pchorus/angular-widgets.svg?branch=master)](https://travis-ci.org/pchorus/angular-widgets) [![Coverage Status](https://coveralls.io/repos/pchorus/angular-widgets/badge.svg?branch=coveralls)](https://coveralls.io/r/pchorus/angular-widgets?branch=coveralls) [![Code Climate](https://codeclimate.com/github/pchorus/angular-widgets/badges/gpa.svg)](https://codeclimate.com/github/pchorus/angular-widgets)
===============

angular-widgets is a module for AngularJS containing reusable ui widgets implemented as directives.

##Using angular-widgets in your AngularJS project
angular-widgets can be installed via bower.
```
bower install angular-widgets
```

Include the JavaScript source code and the CSS-Styles in your index.html
```html
<html>
  <head>
    ...
    <link rel="stylesheet" type="text/css" href="../bower_components/angular-widgets/angular-widgets.min.css">
    ...
  </head>
  <body>
    ...
    <script src="../bower_components/angular-widgets/angular-widgets.min.js"></script>
    ...
  </body>
</html>
```

If you want to debug the code, you can include the non-uglified versions angular-widgets.src.js and angular-widgets.src.css.

##The widgets
Currently the following widgets are implemented:

1. [List](https://github.com/pchorus/angular-widgets/tree/master/app/widgets/list)
2. search-input
3. spinner-dots
