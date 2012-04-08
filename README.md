SCGen
=====

SCGen is a Cisco Switch Configuration Generator for a substancial portion of 
the available commands in a modern IOS. The tool runs entirely client side in
a web browser and can be run either from a local filesystem or via a
webserver.

Features
--------

* Configure global options such as hostname, logging, ntp, and ip hosts/routes
* Configure aliases
* Configure VLANs, Interfaces and SVIs
* Produces a config you can copy/paste onto a switch
* Customisable using an external JSON file
* Tested on chromium 18

Installation
------------

* Extract the archive into a directory of your choice
* Create a default-config.js file using default-config.js.dist as a template
* Open the index.html file in a web browser either locally or via a web server

Customisation
-------------

The tool is formed of three main parts:

* HTML and stylesheet
* Generator script
* JSON configuration file

Default values can be changed in the configuration file to reduce the amount
of manual changes per device in your specific environment. All aspects of the
HTML form can be configured from this file.

It is possible to extend the available options with minor alterations to the
HTML and script files. Adding new commands is as simple as modifying the list
at the top of the script file and adding appropriate UI in the HTML.

