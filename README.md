![Vanilla Boot](https://raw.githubusercontent.com/eyallior/vanillaboot/refs/heads/main/images/logo-dark.png)

### Minimal Framework ꞏ Maximum Control ꞏ Pure Javascript ꞏ Pure Freedom

Vanilla Boot is a lightweight JavaScript utility designed to streamline front-end development without relying on extensive frameworks. It enables developers to build applications with reusable UI components using standard JavaScript and HTML, preserving the flexibility and simplicity of native web technologies.

### Project's guiding principles:

* Non pervasive - You can do anything you could do in Vanilla
* Minimalist approach, no need to learn the guts of a framework to have full control of your app
* Reusable Components
* Download only used components (or decide which components to preload)
* No JSX (use only standard html)
* No Reactivity, full control of rendering (no mystery why things happen or don't when something doesn't go as planned)
* Simple flow of data between embedded components, plus free-form flow of data according to your needs
* Free-form component architecture (no surprises, nothing to learn, no complex flow required for your code, every component can be different - full flexibility)
* No Virtual Dom
* No built-in state management or data binding. Developers have full control to implement these as needed, eliminating the need to learn the framework's inner workings
* Access dom elements by predictable ids
* Framework is written in short and simple code, no stratified object oriented hell
* No transpiling (easy to investigate bugs in your app)
* No chunking to incoherent little code pieces
* Due to no framework as base and fewer dependabilities, we get long term reliability (no framework change will cause this project to be unusable)

### Features:

* Ability to create components in completely different strategy for each
* Ability to embed components in parent components and to communicate with other components based on hierarchy or id
* Open multiple instances of the same component
* Dynamic loading of component's Javascript, css or any kind of dependencies

### Demo:

To run the example you'll need to load it from a server (because of Cross-Origin Blocking you won't be able to simply open the file in browser from disk). Something like [http-server](https://www.npmjs.com/package/http-server) will do just fine.

Online running example: [https://vanillaboot.vercel.app/example.html](https://vanillaboot.vercel.app/example.html)


### About

Vanilla Boot is in its early stages and is being developed by Eyal Lior, a software developer since 2000, based in Tel Aviv, Israel. Eyal is an expert in complex GUIs using vanilla JavaScript and takes a pragmatic, uncomplicated approach to software development.

The code for Vanilla Boot is sourced from existing, complex, and mature projects, which serve as a repository for incremental dismantling and reuse. This process is carried out methodically and without haste, with each addition followed by careful observation of user adoption and the identification of potential refactoring needs before further integration.


### Upcoming Features

* Add-Ons
    * Menu
    * Forms - with awesome validation feature, that is easy to customize
* 3rd Party integrations
    * Windowing (GoldenLayout / W2/UI)
    * AG-Grid
    * VanillaRouter - Client Side Routing (Updating/Reading the URL in address bar)
    * VanJS - Reactive UI (think having reactivity as a feature in some screens, vs imposed on all your code)
* Mobile responsive layout
* PWA



## Download / Source: [Github](https://github.com/eyallior/vanillaboot)

## Support: [Vanilla Boot Support Telegram group](https://t.me/+QVaaVPOrtTJjMWQ0)
