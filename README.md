# Vanilla Boot

![Minimal Framework ꞏ Maximum Control ꞏ Pure Javascript ꞏ Pure Freedom](https://raw.githubusercontent.com/eyallior/vanillaboot/refs/heads/main/images/logo-dark.png)

### Minimal Framework ꞏ Maximum Control ꞏ Pure Javascript ꞏ Pure Freedom

### Project's guiding principles:

* Non pervasive - You can do anything you could do in Vanilla
* Minimalist approach, no need to learn the guts of a framework to have full control of your app
* Reusable Components ("modules")
* Download only used modules (or decide which modules to preload)
* No JSX (use only standard html)
* No Reactivity, full control of rendering (no mystery why things happen or don't when something doesn't go as planned)
* Simple flow of data between embedded modules, plus free-form flow of data according to your needs
* Free-form module architecture (no surprises, nothing to learn, no complex flow required for your code, every module can be different - full flexibility)
* No Virtual Dom
* Manual data binding, enables highly customizable UI without having to learn the guts of the framework
* Access dom elements by predictable ids
* Framework is written in short and simple code, no stratified object oriented hell
* No compilation (easy to reverse engineer starting from browser)
* No chunking to incoherent little code pieces
* Due to no framework as base and fewer dependabilities, we get long term reliability (no framework change will cause this project to be unusable)

### Features:

* Ability to create modules in completely different strategy for each
* Ability to embed modules in parent modules and to communicate with other modules
* Open multiple instances of the same module
* Dynamic loading of module's Javascript, css or any kind of dependencies

### Demo:

To run the example you'll need to load it from a server (because of Cross-Origin Blocking you won't be able to simply open the file in browser from disk). Something like https://www.npmjs.com/package/http-server will do just fine.

Online running example: https://vanillaboot.vercel.app/example.html


### About

Vanilla Boot is in very early stages, and is being developed by Eyal Lior, a software developer since year 2000 based in Tel Aviv, Israel.
Eyal is an expert in vanilla JavaScript complex GUIs, and has a pragmatic, uncomplicated approach to software development.
The code for Vanilla Boot is being sourced from existing, complex, and mature projects, which serve as a repository for incremental dismantling and reuse. This process is carried out methodically, without haste, as each addition is followed by careful observation of user adoption and the identification of potential refactoring needs before proceeding with further integration


### Upcoming Features

* Add-Ons
    * Menu
    * Windowing
    * Forms - with awesome validation feature, that is easy to customize
    * AG-Grid
* Mobile responsive layout
* PWA

[Github](https://github.com/eyallior/vanillaboot)
