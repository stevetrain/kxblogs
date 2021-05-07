### Table of contents
* [Overview](#overview)
* [Blog Posts](#blog-posts)
* [React](#react)
* [Angular 8](#angular-8)
* [AngularJS](#angularjs)
* [Vue](#vue)

### Overview

This repo contains templates for Single-Page Applications interfacing with kdb+.

They were tested on Windows 10, Chrome 81, kdb+ v3.6 2019.04.30.
startQ.bat will require editing if q isn't stored as C:\q\w64

### Blog Posts

https://kx.com/blog/single-page-applications-and-kdb-react/
https://kx.com/blog/single-page-applications-and-kdb-angular/
https://kx.com/blog/single-page-applications-and-kdb-angularjs/

### React

Setting Up

* Download npm
* Run npm update in the terminal from the reactProject directory, to install dependencies from package.json (bringing the project size to around 163MB)
* Run downloaded startR.bat and startQ.bat files  – if you aren’t using C:\q\w64, startQ will require editing
* View from a browser: http://localhost:3000

### Angular 8

Setting Up

* Download npm
* Run npm update in the terminal from the angular8Project directory, to install dependencies from package.json (bringing the project size to around 414MB)
* Run downloaded startA.bat and startQ.bat files  – if you aren’t using C:\q\w64, startQ will require editing
* View from a browser: http://localhost:3000

### AngularJS

Setting Up

* Install Python
* Depending on your downloaded Python version, edit startP2.bat or startP3.bat to use the correct Python file-path, and run the corresponding file
* Run startQ.bat – if you aren’t using C:\q\w64, startQ will require editing
* View from a browser: http://localhost:5000/angularJSProject/html/index.html 

### Vue

* Download npm
* Run npm update in the terminal from the vueProject directory, to install dependencies from package.json (bringing the project size to around 130MB)
* Run downloaded startV.bat and startQ.bat files – if you aren’t using C:\q\w64, startQ will require editing
* View from a browser: http://localhost:8080

### Future templates:

* Ember
* Polymer
* Svelte
