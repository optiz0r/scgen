/**
 * Sihnon Framework JS Library
 * 
 * Written by Ben Roberts
 * Homepage: https://benroberts.net/projects/sihnon-framework/
 * Code:     https://github.com/optiz0r/sihnon-js-lib/
 * 
 * Dependencies:
 *   - Bootstrap-*.js
 * 
 * Released under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
 * http://creativecommons.org/licenses/by-nc-sa/3.0/
 */

/**
 * Sihnon Framework object
 * 
 * Entry point for all base framework code
 */
var sf = {

    /**
     * Library version
     *
     */
    version: '0.1.0',
   
    /**
     * Initialises the library
     * 
     */
    init: function() {
        
        // Initialise all modules
        modules = [
            'utility',
            'ajax',
            'ui',
            'page',
            'actions',
        ];
        
        for (var module in modules) {
            sf[modules[module]].init();
        }
        
    },
    
    /**
     * Utility module
     * 
     * Contains simple and one-off functions that aren't worth grouping into full modules
     */
    utility: {
        
        /**
         * Initialise the module
         */
        init: function() {
            
        },
        
        /**
         * Returns conditional if set to a value, else returns alternative
         * 
         * @param conditional Value to test and return if set
         * @param alternative Value to return if conditional is not set
         * @returns
         */
        orelse: function(conditional, alternative) {
            if (typeof conditional != 'undefined') {
                return conditional;
            } else {
                return alternative;
            }
        },
        
    },
    
    /**
     * Code for making and handling AJAX requests
     */
    ajax: {
        
        /**
         * Initialise the module
         */
        init: function() {
            
        },
        
        /**
         * Launch a simple AJAX GET request
         * 
         * Makes an AJAX request to the specified URL and calls one of the given
         * functions on completion. Default callbacks are executed if not provided.
         * 
         * See also: sf.ajax.success, sf.ajax.failure
         * 
         * @param url URL to request
         * @param success Callback to execute on success
         * @param failure Callback to execute on failure
         */
        get: function(url, success, failure) {
            $.ajax({
                url: url,
                type: "GET", 
                dataType: "json",
                success: sf.utility.orelse(success, sf.ajax.success), 
                error: sf.utility.orelse(failure, sf.ajax.failure),
            });
        },
        
        /**
         * Launch a simple AJAX POST request
         * 
         * Makes an AJAX request to the specified URL and calls one of the given
         * functions on completion. Default callbacks are executed if not provided.
         * 
         * See also: sf.ajax.success, sf.ajax.failure
         * 
         * @param url URL to request
         * @param data Data to send with the request
         * @param success Callback to execute on success
         * @param failure Callback to execute on failure
         */
        post: function(url, data, success, failure) {
            $.ajax({
                url: url,
                type: "POST", 
                dataType: "json",
                data: data,
                success: sf.utility.orelse(success, sf.ajax.success), 
                error: sf.utility.orelse(failure, sf.ajax.failure),
            });            
        },
        
        /**
         * Default success handler
         * 
         * Function that will be called for every successful AJAX request if no custom
         * handler is defined.
         * 
         * @param d Data returned from the request
         * @param s Status of the request
         * @param x XHttpRequest object used for the request
         */
        success: function(d, s, x) {
            
            // Replace any requested parts of the page
            sf.page.update(d.page_replacements);
            
            // Show any requested dialog
            sf.ui.dialog.prepare(d.dialog);
            
            // Trigger any actions
            sf.actions.triggerAll(d.actions);
        },
        
        failure: function(x, s, e) {
            console.log("Ajax Failure: " + s, e);
            console.log(x.responseText);
        },
        
    },
    
    /**
     * User Interface module
     * 
     * Code for manipulating UI elements
     */
    ui: {
        
        /**
         * Initialise the module
         */
        init: function() {
            sf.ui.dialog.init();
        },
        
        /**
         * Submodule for customising and displaying the app dialog
         */
        dialog: {

            /**
             * Initialise the submodule
             */
            init: function() {
                // Permanently configure the X to close the dialog
                $("#dialog-header-close").click(sf.ui.dialog.close);
            },
            
            /**
             * Prepare a dialog and optionally show it.
             * 
             * Parameters should be an object which may contain any of the following fields:
             * var parameters = {
             *     show: bool,      // Show the dialog immediately after configuring
             *     title: string,   // Title to display in the dialog header
             *     content: string, // Body of the dialog as HTML
             *     buttons: {       // Configuration for the buttons in the dialog footer, see below
             *         type: ok|okcancel|yesno, // Type of buttons to display in the footer
             *         params: mixed, // Any data to be passed directly to the action handlers
             *         actions: {
             *             ok: string,     // Action handler to be assigned to the OK button
             *             cancel: string, // Action handler to be assigned to the Cancel button
             *             yes: string,    // Action handler to be assigned to the Yes button
             *             no: string,     // Action handler to be assigned to the No button
             *         }
             *     }
             * }
             * 
             * var buttons = {
             *     type: ok|okcancel|yesno
             * }
             *
             * 
             * @param p Parameters for configuring the dialog
             */
            prepare: function(p) {
                if ( ! p) {
                    return;
                }
                    
                if (p.buttons) {
                    switch (p.buttons.type) {
                    case 'ok':
                        $("#dialog-footer-ok-ok").click(
                            function() {
                                sf.actions.trigger(p.buttons.actions.ok, p.buttons.params);
                            }
                        );
                        $("#dialog-footer-ok").show();
                        break;
                    case 'okcancel':
                        $("#dialog-footer-okcancel-ok").click(function() {
                            sf.actions.trigger(p.buttons.actions.ok, p.buttons.params);
                        });
                        $("#dialog-footer-okcancel-cancel").click(function() {
                            sf.actions.trigger(p.buttons.actions.cancel, p.buttons.params); 
                        });
                        $("#dialog-footer-okcancel").show();
                        break;
                    case 'yesno': 
                        $("#dialog-footer-yesno-yes").click(
                            function() {
                                sf.actions.trigger(p.buttons.actions.yes, p.buttons.params);
                            }
                        );
                        $("#dialog-footer-yesno-no").click(
                            function() {
                                sf.actions.trigger(p.buttons.actions.no, p.buttons.params);
                            }
                        );
                        $("#dialog-footer-yesno").show();
                        break;
                    }
                }
                
                if (p.title) {
                    $('#dialog-header-title').html(p.title);
                }
                
                if (p.content) {
                    $('#dialog-body').html(p.content);
                }
        
                if (p.show) {
                    sf.ui.dialog.show();
                }
            },
            
            /**
             * Immediately show a pre-configured dialog
             * 
             */
            show: function() {
                $("#dialog").modal({
                    show: true,
                    backdrop: true,
                    keyboard: true,
                });
            },
            
            /**
             * Close the dialog and reset to default values
             * 
             * The content and title will be removed, all buttons hidden
             * and all action handlers removed.
             * 
             */
            close: function() {
                // Hide the dialog
                $("#dialog").modal({
                    show: false,
                });
                
                // Remove the dialog content
                $("#dialog-body").html('');
                
                // Hide all buttons
                $(".dialog-footer-buttonset").hide();
                // Strip all event handlers
                $(".dialog-footer-buttonset input[type='button']").unbind('click');
            },
            
            /**
             * Use the built-in dialog to display an error message
             * 
             * Prepares the dialog with a pre-defined format using the details provided.
             * The dialog is immediately shown with an OK button that cancels the dialog and
             * takes no further action
             *
             * @param title Title for the error dialog
             * @param content Content for the dialog
             * @param messages An optional list of messages to be reported on the dialog, e.g. reasons for the failure described by content.
             */
            error: function(title, content, messages) {
                var formatted_content = $('<div>').append($('<p>').text('content'));
                if (messages) {
                    var formatted_messages = $('<ul>');
                    for (var message in messages) {
                        formatted_messages.append($('<li>').text(message));
                    }
                    
                    formatted_content.append($('<p>').text('These messages were reported:').append(formatted_messages));
                }
                
                sf.ui.dialog.prepare({
                    show: true,
                    title: title,
                    content: formatted_content,
                    buttons: {
                        type: 'ok',
                        actions: {
                            ok: 'close-dialog'
                        }
                    }
                });
            },
            
        },
    },
    
    /**
     * Page module
     * 
     * Code for updating page content
     */
    page: {
        
        /**
         * List of callbacks to be executed on a new section of a page
         * 
         * Used for setting up any behaviour on new page elements, such as when a page is
         * first loaded, or replaced by an ajax call.
         * 
         * Callbacks should have the form:
         *   function(d){}
         * where d is the top level dom element being updated.
         * 
         * New callbacks can be registered with addUpdateCallback() passing a unique name
         * which can be used for later removing a callback if desired.
         */
        update_callbacks: {
            
        },
        
        /**
         * Initialise module
         */
        init: function() {
            
        },
        
        /**
         * Updates all given subsets of the page
         * 
         * Takes an object defining the replacements to be made and updates the page
         * 
         * Object should use a DOM ID as the key, and replacement content should sit under a content key, e.g.:
         * 
         * replacements = {
         *     page_content: {
         *         content: 'This will replace the entire page!',
         *     },
         * }
         * 
         * @param replacements Object containing replacements to make
         */
        update: function(replacements) {
            for ( var id in replacements) {
                $("#" + id).html(replacements[id].content);
                sf.page.updateEvents('#' + id);
            }            
        },
        
        /**
         * Update a subset of the page content with any global events
         * 
         * Called when the element d has been updated and callbacks need to be applied to
         * the new content.
         * 
         * @param elements ID or DOM element of the new content on which events need to be applied
         */
        updateEvents: function(d) {
            for (var c in sf.page.update_callbacks) {
                sf.page.update_callbacks[c](d);
            }
        },
        
        /**
         * Add new page update callback
         * 
         * Defines a new function to be run when part of the page is updated.
         * This function will replace any previous callback registered with the same name.
         * 
         * See also: sf.page.update_callbacks
         * 
         * @param name Unique name of the callback for later retrieval
         * @param callback Function to call
         */
        addCallback: function(name, callback) {
            sf.page.update_callbacks[name] = callback;
        },
        
        /**
         * Remove a page update callback
         * 
         * Removes a previously defined callback from the list of page update callbacks.
         * 
         * See also: sf.page.update_callbacks
         * 
         * @param name Unique name of the callback to be removed
         */
        removeCallback: function(name) {
            if (sf.page.update_callback[name]) {
                delete sf.page.update_callbacks[name];
            }
        },
        
    },
    
    /**
     * Actions module
     * 
     * Defines a list of named callbacks which can be executed from a non-trusted source
     * such as an ajax response without requiring code evaluation.
     */
    actions: {
    
        /**
         * List of named callbacks that can be executed
         * 
         * Callbacks should have the form:
         *   function(params){}
         * where params is an action-specific list of parameters passed as an object.
         * The callback should return a boolean to indicate success.
         * 
         * New callbacks can be registered with addAction() passing a unique name
         * which can be used for later removing an action if desired with removeAction().
         * 
         * Actions can be triggered manually using the trigger() method. A list of actions
         * can be triggered in one go using triggerAll().
         */
        callbacks: {
            
            'close-dialog': function(params) {
                sf.ui.dialog.close();
            },
            
        },
        
        /**
         * Initialise the module
         */
        init: function() {
            
        },
        
        /**
         * Execute a named action
         * 
         * Runs one or more named actions with the list of parameters provided
         * All actions are run with the same parameters.
         * 
         * @param names Names of the action(s) to execute
         * @param params Object containing action specific parameters
         */
        trigger: function(names, params) {
            if ( ! (names instanceof Array)) {
                names = [names];
            }
            
            for (var name in names) {
                if (sf.actions.callbacks[names[name]]) {
                    sf.actions.callbacks[names[name]](params);
                }
            }
        },
        
        /**
         * Executes all given actions
         * 
         * @param actions Object containing names of all actions to execute with associated parameters
         */
        triggerAll: function(actions) {
            for (var action in actions) {
                sf.actions.trigger(action, actions[action]);
            }
        },
        
        /**
         * Adds a new named action
         * 
         * Defines a new named action to be run when manually triggered.
         * This function will replace any previous action registered with the same name.
         * 
         * See also: sf.actions.callbacks
         * 
         * @param name Name of the new action
         * @param callback Function to execute when this callback is triggered
         */
        addAction: function(name, callback) {
            sf.actions.callbacks[name] = callback;
        },
        
        /**
         * Removes a previously registered named action
         * 
         * @param name Name of the action to remove
         */
        removeAction: function(name) {
            if (sf.actions.callbacks[name]) {
                delete sf.actions.callbacks[name];
            }
        },
    },

    
};

// Execute the initialisation code as soon as the DOM is ready.
$('document').ready(sf.init);
