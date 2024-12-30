![Vanilla Boot](https://raw.githubusercontent.com/eyallior/vanillaboot/refs/heads/main/images/logo-dark.png)

### Minimal Framework ꞏ Maximum Control ꞏ Pure Javascript ꞏ Pure Freedom

Vanilla Boot is a lightweight JavaScript utility designed to streamline front-end development without relying on extensive frameworks. It enables developers to build applications with reusable UI components using standard JavaScript and HTML, preserving the flexibility and simplicity of native web technologies.

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
* No built-in state management or data binding. Developers have full control to implement these as needed, eliminating the need to learn the framework's inner workings
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

To run the example you'll need to load it from a server (because of Cross-Origin Blocking you won't be able to simply open the file in browser from disk). Something like [http-server](https://www.npmjs.com/package/http-server) will do just fine.

Online running example: [https://vanillaboot.vercel.app/example.html](https://vanillaboot.vercel.app/example.html)


### About

Vanilla Boot is in its early stages and is being developed by Eyal Lior, a software developer since 2000, based in Tel Aviv, Israel. Eyal is an expert in complex GUIs using vanilla JavaScript and takes a pragmatic, uncomplicated approach to software development.

The code for Vanilla Boot is sourced from existing, complex, and mature projects, which serve as a repository for incremental dismantling and reuse. This process is carried out methodically and without haste, with each addition followed by careful observation of user adoption and the identification of potential refactoring needs before further integration.


### Upcoming Features

* Add-Ons
    * Menu
    * Windowing
    * Forms - with awesome validation feature, that is easy to customize
    * AG-Grid
* Mobile responsive layout
* PWA
* Client Side Routing (Updating/Reading the URL in address bar)

## Download / Source: [Github](https://github.com/eyallior/vanillaboot)

## Support: [Vanilla Boot Support Telegram group](https://t.me/+QVaaVPOrtTJjMWQ0)
