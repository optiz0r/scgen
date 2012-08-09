var scgen = {

    config: "",

    indent: "  ",

    commands: {
        superglobal: { /*{{{*/
            end:                        [ "end" ],
            exit:                       [ "exit" ],
        }, /*}}}*/
        global: { /*{{{*/
            hostname:                   [ "hostname", "%1" ],
            service:                    [ "service", "%name" ],
            logging_exception:          [ "logging exception", "%1" ],
            logging_buffered:           [ "logging buffered", "%1", "debugging" ],
            logging_console:            [ "logging console critical" ],
            enable_secret:              [ "enable secret", "%1" ],
            clock_timezone:             [ "clock timezone GMT 0" ],
            clock_summertime:           [ "clock summer-time BST recurring Sun Mar 2:00 last Sun Oct 2:00" ],
            stormcontrol_multicast:     [ "storm-control broadcast include multicast" ],
            vtp_mode:                   [ "vtp mode", "%1" ],
            udld:                       [ "udld", "%1" ],
            ip:                         [ "ip", "%1" ],
            ip_hosts:                   [ "ip host", "%1" ],
            ip_routes:                  [ "ip route", "%1" ],
            ip_http_server:             [ "ip http server" ],
            ip_bootp_server:            [ "ip bootp server" ],
            ip_tacacs_sourceinterface:  [ "ip tacacs source-interface", "%1" ],
            logon_failure_trap:         [ "logon on-failure trap" ],
            file_verify_auto:           [ "file verify auto" ],
            errdisable_recovery_interval: [ "errdisable recovery interval", "%1" ],
            errdisable_recovery_cause:  [ "errdisable recovery cause", "%1" ],
            spanningtree_mode:          [ "spanning-tree mode", "%1" ],
            spanningtree_portfast_bpduguard_default: [ "spanning-tree portfast bpduguard default" ],
            spanningtree_extend:        [ "spanning-tree extend system-id" ],
            spanningtree_disable:       [ "no spanning-tree vlan", "%1" ],
            spanningtree_vlan_priority: [ "spanning-tree vlan", "%1", "priority", "%2" ],
            power_redundancymode:       [ "power redundancy-mode", "%1" ],
            system_mtu:                 [ "system mtu", "%1" ],
            vlan_internal_allocation_policy: [ "vlan internal allocation policy", "%1" ],
            logging_events:             [ "logging event", "%1" ],
            logging_sourceinterface:    [ "logging source-interface", "%1" ],
            logging_servers:            [ "logging", "%1" ],
            banner_exec:                [ "banner exec", "%1" ],
            banner_login:               [ "banner login", "%1" ],
            line:                       [ "line", "%1" ],
            alias:                      [ "alias", "%1" ],
            ntp_source:                 [ "ntp source", "%1" ],
            ntp_servers:                [ "ntp server", "%1" ],
            vlan:                       [ "vlan", "%1" ],
            interface:                  [ "interface", "%1" ],
        }, /*}}}*/
        vlan: { /*{{{*/
            description:                [ "description", "%1" ],
        }, /*}}}*/
        interface: { /*{{{*/
            description:                [ "description", "%1" ],
            switchport:                 [ "switchport" ],
            switchport_mode:            [ "switchport mode", "%1" ],
            switchport_mode_privatevlan: [ "switchport mode private-vlan", "%1" ],
            switchport_access_vlan:     [ "switchport access vlan", "%1" ],
            switchport_voice_vlan:      [ "switchport voice vlan", "%1" ],
            switchport_trunk_native_vlan: [ "switchport trunk native vlan", "%1" ],
            switchport_trunk_allowed_vlan: [ "switchport trunk allowed vlan", "%1" ],
            switchport_trunk_allowed_vlan_add: [ "switchport trunk allowed vlan add", "%1" ],
            switchport_trunk_allowed_vlan_remove: [ "switchport trunk allowed vlan remove", "%1" ],
            switchport_trunk_encapsulation: [ "switchport trunk encapsulation", "%1" ],
            switchport_privatevlan_hostassociation: [ "switchport private-vlan host-association", "%1", "%2" ],
            switchport_privatevlan_mapping: [ "switchport private-vlan mapping", "%1", "%2" ],
            switchport_nonegotiate:     [ "switchport nonegotiate" ],
            speed:                      [ "speed", "%1" ],
            duplex:                     [ "duplex", "%1" ],
            logging_event:              [ "logging event", "%1" ],
            snmp_trap:                  [ "snmp trap", "%1" ],
            cdp_enable:                 [ "cdp enable" ],
            spanningtree_portfast:      [ "spanning-tree portfast" ],
            spanningtree_bpduguard:     [ "spanning-tree bpduguard enable" ],
            spanningtree_loopguard:     [ "spanning-tree loopguard enable" ],
            spanningtree_rootguard:     [ "spanning-tree rootguard enable" ],
            udld_port:                  [ "udld port", "%1" ],
            channelgroup:               [ "channel-group", "%1", "mode", "%2" ],
            shutdown:                   [ "shutdown" ],
        }, /*}}}*/
        svi: { /*{{{*/
            description:                [ "description", "%1" ],
            ip_address:                 [ "ip address", "%1-", "%2-" ],
        }, /*}}}*/
        line: { /*{{{*/
            accessclass:                [ "access-class", "%1", "%2" ],
            exectimeout:                [ "exec-timeout", "%1" ],
            password:                   [ "password", "%1" ],
            logging:                    [ "logging", "%1" ],
            stopbits:                   [ "stopbits", "%1" ],
        }, /*}}}*/
    },

    init: function() { /*{{{*/
        // Configure every form field to update the config after it's value changes
        $(".global, .line, .interface, .vlan, .svi").live('change', function() {
            scgen.generate();
        });

        // Register handlers to set or remove an error state from the output config box
        ui.validation.addSuccessCallback(scgen.clearError);
        ui.validation.addFailureCallback(scgen.setError);

        // Generate the base config
        this.generate();
    }, /*}}}*/

    load: function(data) { /*{{{*/
        // Load the interface standard definitons
        scgen.standards.setInterfaceStandards(data.standards.interfaces);

        // Populate the form with the contents of the data object
        for (var k in data.global) {
            var v = data.global[k];

            var f = $('#' + k);
            if (f.size() > 0) {
                switch (f[0].tagName.toLowerCase()) {
                    case "input": {
                        switch (f.attr('type').toLowerCase()) {
                            case 'hidden':
                            case 'text': {
                                f.val(v);
                            } break;

                            case 'checkbox': {
                                f.attr('checked', v);
                            } break;

                            default: {
                                console.log('Not yet implemented: ' + k);
                            }
                        }
                    } break;

                    case 'textarea': {
                        f.val(v);
                    } break;

                    case 'select': {
                        // Add any new options
                        if (v.options) {
                            for (var o in v.options) {
                                ui.list.addOption(
                                    '#' + k,
                                    v.options[o],
                                    o
                                );
                            }
                        }

                        // Set the default selected option
                        if (v.selected) {
                            var selected = v.selected;
                            if (! $.isArray(v.selected)) {
                                selected = [ v.selected ];
                            }

                            $('option[selected="selected"]', f).attr('selected', false);

                            for (var i in selected) {
                                $('option[value="'+selected[i]+'"]', f).attr('selected', true);
                            }
                        }

                    } break;

                    default: {
                        console.log('Not yet implemented: ' + k);
                    } break;
                }

                // trigger event handlers
                f.change();
            } else {
                console.log('Field not recognised: ' + k, f);
            }
        }

        // Add Aliases
        if (data.aliases) {
            for (var name in data.aliases) {
                var alias = data.aliases[name];
                ui.alias.add(alias.context, name, alias.command);
            }
        }

        // Add VLANs
        if (data.vlans) {
            for (var id in data.vlans) {
                var vlan = data.vlans[id];
                ui.vlan.add(id, vlan.description, vlan.required);
            }
        }
    
        // Add Interfaces
        if (data.interfaces) {
            for (var i in data.interfaces) {
                var group = data.interfaces[i];

                ui.interface.add(
                    group.type, 
                    group.slot != undefined, 
                    group.slot, 
                    group.subslot != undefined, 
                    group.subslot, 
                    group.start, 
                    group.count, 
                    group.standard
                );
            }
        }
    
        // Add SVIs
        if (data.svi) {
            for (var id in data.svi) {
                var svi = data.svi[id];
                ui.svi.add(id, svi.description, svi.enable, svi.address, svi.mask);
            }
        }
    }, /*}}}*/

    generate: function() { /*{{{*/
        this.erase();

        // Grab a list of all the global form fields to build the global config
        $(".global").each(function() {
            scgen.generate_callback('global', this, 0);
        });

        this.append(this.command(0, 'superglobal', 'end'));

        this.display();
    }, /*}}}*/

    generate_callback: function(mode, context, indent) { /*{{{*/
        switch (context.tagName.toLowerCase()) {
            case "input": {
                switch (context.type.toLowerCase()) {
                    case "hidden": {
                        switch (context.name) {
                            case '__switch': {
                                // Switch into the new mode, and process all the other form fields under the same parent as this.
                                var new_mode = context.value;

                                switch (new_mode) {
                                    case "interface": {
                                        var context_parent = $(context).closest(".context_parent");
                                        var port_name = $('[name="interface"]', context_parent).val();

                                        // Grab the standards port type for this interface
                                        var standards_type = $(".standards", context_parent).val();
                                        
                                        // Process all the enabled commands for this port type
                                        var commands = null;
                                        if (port_name.match(/^PortChannel/)) {
                                            commands = scgen.standards.interfaces[standards_type].portChannelMaster;
                                        } else {
                                            commands = scgen.standards.interfaces[standards_type].standard;
                                        }

                                        scgen.appendInterfaceCommands(indent, context_parent, commands.enable);
                                        scgen.appendInterfaceCommands(indent, context_parent, commands.disable, true);

                                        if (standards_type == 'portChannelMember') {
                                            // Add in the commands for the PortChannel as well
                                            var channelgroup = $('input[name="channelgroup"]', context_parent);
                                            var portchannel = $('#interface_PortChannel' + channelgroup.val() + '_switch');

                                            if (portchannel.length) {
                                                channelgroup.closest('.control-group').removeClass('error');
                                                var portchannel_parent = portchannel.closest('.context_parent');
                                                var portchannel_type = $('.standards', portchannel_parent).val();

                                                scgen.appendInterfaceCommands(indent, portchannel_parent, scgen.standards.interfaces[portchannel_type].standard.enable);
                                                scgen.appendInterfaceCommands(indent, portchannel_parent, scgen.standards.interfaces[portchannel_type].standard.disable, true);
                                            } else {
                                                channelgroup.closest('.control-group').addClass('error');
                                            }
                                        }

                                        scgen.append(scgen.command(indent + 1, 'superglobal', 'exit'));
                                    } break;

                                    default: {

                                        $(context).closest(".context_parent").find("." + new_mode).each(function() {
                                            scgen.generate_callback(new_mode, this, indent + 1);
                                        });
        
                                        scgen.append(scgen.command(indent + 1, 'superglobal', 'exit'));
                                    } break;
                                }

                            } break;

                            default: {
                                scgen.append(scgen.command(indent, mode, context.name, [ context.value ]));
                            } break;
                        }
                    } break;

                    case "text": {
                        if (!$(context).hasClass('omit_if_empty') || ($(context).hasClass('omit_if_empty') && context.value)) {
                            scgen.append(scgen.command(indent, mode, context.name, [ context.value ]));
                        }
                    } break;
                    case "checkbox": {
                        if ($(context).hasClass('toggle_external_values')) {
                            var context_parent = $(context).closest('.context_parent');
                            var values = $("[name='" + context.name + "']", context_parent).not(context).map(function() {
                                return $(this).val();
                            }).get();
    
                            scgen.append(scgen.command(indent, mode, context.name, values, !context.checked));
                        } else {
                            scgen.append(scgen.command(indent, mode, context.name, [context.value], !context.checked));
                        }
                    } break;
                }
            } break;

            case "textarea": {
                if (context.value) {
                    scgen.append(scgen.command(indent, mode, context.name, [ context.value ]));
                }
            } break;

            case "select": {
                if ($(context).hasClass('multiple')) {
                    var commandName = context.name;
                    $("option[selected]", context).each(function() {
                        scgen.append(scgen.command(indent, mode, commandName, [ this.value ]));
                    }); 
                } else if ($(context).hasClass('list')) {
                    var commandName = context.name;
                    $("option", context).each(function() {
                        scgen.append(scgen.command(indent, mode, commandName, [ this.value ]));
                    });
                } else {
                    if (context.options[context.selectedIndex] && context.options[context.selectedIndex].value) {
                        scgen.append(scgen.command(indent, mode, context.name, [ context.options[context.selectedIndex].value ]));
                    }
                }
            } break;
            
        }
    }, /*}}}*/

    appendInterfaceCommands: function(indent, port, commands, negate) { /*{{{*/
        for (var command in commands) {
            var args = commands[command];
            var parameters = [];
            if (args) {
                for (var i = 0; i < args.length; i++) {
                    var matches;
                    if (matches = args[i].match(/^(%\d+)$/)) {
                        for (var match = 1; match < matches.length; match++) {
                            values = $("[name='" + command + "']", port).map(function() {
                                return $(this).val();
                            }).get();
                            parameters[i] = values[i];
                        }
                    } else {
                        parameters[i] = args[i];
                    }
                }
            }

            scgen.append(scgen.command(indent + 1, 'interface', command, parameters, negate));
        }
    }, /*}}}*/

    command: function(indent, context, command, parameters, negate) { /*{{{*/
        if ( ! this.commands[context]) {
            console.log("No such context: " + context);
            return '';
        }
        if ( ! this.commands[context][command]) {
            console.log("No such command: " + command + " in context: " + context);
            return '';
        }

        var additions = this.commands[context][command];
        var new_command = '';

        for (var addition in additions) {
            if (matches = additions[addition].match(/^%(\d+|[a-zA-Z_]+)(-)?$/)) {
                var parameter_name = matches[1];
                var parameter_negate_exclude = (matches[2] == '-')

                if (parameter_name.match(/^\d+$/)) {
                    --parameter_name;
                }

                if ($.isArray(parameters)) {
                    if (parameters.length >= parameter_name) {
                        if ( ! (negate && parameter_negate_exclude)) {
                            new_command += parameters[parameter_name] + ' ';
                        }
                    } else {
                        if ( ! negate) {
                            console.log("Missing parameter " + parameter_name + " for command " + command);
                        }
                    }
                } else {
                    if ( ! (negate && parameter_negate_exclude)) {
                        new_command += parameters + ' ';
                        console.log(new_command);
                        break; // Only one addition can be substituted
                    }
                }
            } else {
                new_command += additions[addition] + ' ';
            }
        } 

        if (negate) {
            new_command = "no " + new_command;
        }

        var prefix = '';
        for (i = 0; i < indent; i++) {
            prefix += this.indent;
        }

        return prefix + new_command;
    },/*}}}*/

    append: function(command) {/*{{{*/
        this.config += command + "\n";
    },/*}}}*/

    erase: function() {/*{{{*/
        this.config = "";
    },/*}}}*/

    display: function() {/*{{{*/
        var generated_config = $('#generated_config');
        generated_config.val(this.config); 
    }, /*}}}*/

    setError: function() {
        var container = $('#generated_config').closest('.control-group');
        if ( ! container.hasClass('error')) {
            container.addClass('error');
        }
    },

    clearError: function() {
        var container = $('#generated_config').closest('.control-group');
        if (container.hasClass('error')) {
            container.removeClass('error');
        }
    },

    /*
     * Interface Standards
     */
    standards: {

        // List of standard definitions to be provided from a configuration file
        interfaces: {},

        // Supply a list of interface standard definitions
        setInterfaceStandards: function(interface_standards) {
            scgen.standards.interfaces = interface_standards;

            // Reset the dropdown list of field types
            $('#interface_portid_type option').remove();
            for (var type in scgen.standards.interfaces) {
                var description = scgen.standards.interfaces[type].description;

                ui.list.addOption(
                    '#interface_portid_type',
                    type,
                    description
                );
            }
        },

        updateParameters: function(context) { /*{{{*/
            // Replace the contents of the parameters container with the template
            // for the new port type

            var row = $(context).closest(".context_parent");

            var interface_id = $("input[name='interface_id']", row).val();
            var interface_name = $("input[name='interface']", row).val();

            var port_type = $("select[name='type']", row).val();
            var parameters = null;
            if (interface_name.match(/^PortChannel/)) {
                parameters = scgen.standards.interfaces[port_type].portChannelMaster.parameters;
            } else {
                parameters = scgen.standards.interfaces[port_type].standard.parameters;
            }

            var html = '';
            for (var p in parameters) {
                html += $('#' + parameters[p]).html();
            }

            html = html.replace(/portname/g, interface_name).replace(/portid/g, interface_id);
            var parameters = $(html);

            $(".config", parameters).addClass("interface");

            $(".global, .interface", parameters).change(function() {
                scgen.generate();
            });

            ui.validation.initFields(parameters);
            
            var parameters_container = $(".parameters", row);
            parameters_container.empty();
            parameters.appendTo(parameters_container);
     
            scgen.generate();
        }, /*}}}*/
    },
};

var ui = {
    
    maxlength_divisor: 1.4,

    init: function() { /*{{{*/
        $("#interfaces_list .standards").change(function() {
            scgen.standards.updateParameters(this);
        });

        // Set the size of any maxlength fields
        $('input[maxlength]').each(function() {
            $(this).css('width', $(this).attr('maxlength') / ui.maxlength_divisor + 'em');
        });

        // Handle the UI components
        this.list.init();
        this.alias.init();
        this.vlan.init();
        this.interface.init();
        this.svi.init();

        // Add remove handler to all remove-ui elements created in the future
        $('#config_form').on('click', '.remove-ui', ui.remove);

        // Add form validation
        this.validation.init();

    }, /*}}}*/

    list: {
        
        init: function() {
            $('#ip_hosts_add').click(ui.list.addHostFromForm);
            $('#ip_hosts_remove').click(ui.list.removeHostFromForm);

            $('#ip_routes_add').click(ui.list.addRouteFromForm);
            $('#ip_routes_remove').click(ui.list.removeRouteFromForm);

            $('#spanning-tree_disable_add').click(ui.list.addDisabledSTPFromForm);
            $('#spanning-tree_disable_remove').click(ui.list.removeDisabledSTPFromForm);

            $('#logging_servers_add').click(ui.list.addLoggingServerFromForm);
            $('#logging_servers_remove').click(ui.list.removeLoggingServerFromForm);

            $('#ntp_servers_add').click(ui.list.addNTPServerFromForm);
            $('#ntp_servers_remove').click(ui.list.removeNTPServerFromForm);
        },

        addOption: function(list, value, description) {
            $(list).append(
                $('<option></option>').val(value).text(description)
            );
        },

        addHost: function(hostname, address) {
            ui.list.addOption(
                '#ip_hosts',
                hostname  + ' ' + address, 
                hostname
            );
            
            scgen.generate();
        },

        addHostFromForm: function(e) {
            ui.list.addHost(
                $('#ip_hosts_new_name').val(),
                $('#ip_hosts_new_ip').val()
            );

            $('#ip_hosts_new_name').val('');
            $('#ip_hosts_new_ip').val('');

            e.preventDefault();
        },

        removeHostFromForm: function(e) {
            $('#ip_hosts option:selected').remove();

            scgen.generate();
            e.preventDefault();
        },

        addRoute: function(network, mask, gateway) {
            ui.list.addOption(
                '#ip_routes',
                network + ' ' + mask + ' ' + gateway,
                network + '/' + mask + ' via ' + gateway
            );

            scgen.generate();
        },

        addRouteFromForm: function(e) {
            ui.list.addRoute(
                $('#ip_routes_new_network').val(),
                $('#ip_routes_new_subnet').val(),
                $('#ip_routes_new_gateway').val()
            );

            $('#ip_routes_new_network').val('');
            $('#ip_routes_new_subnet').val('');
            $('#ip_routes_new_gateway').val('');

            e.preventDefault();
        },

        removeRouteFromFile: function(e) {
            $('#ip_routes option:selected').remove();

            scgen.generate();
            e.preventDefault();
        },

        addDisabledSTP: function(vlan) {
            ui.list.addOption(
                '#spanning-tree_disable',
                vlan,
                vlan
            );

            scgen.generate();
        },

        addDisabledSTPFromForm: function(e) {
            ui.list.addDisabledSTP(
                $('#spanning-tree_disable_new').val()
            );

            $('#spanning-tree_disable_new').val('');

            e.preventDefault();
        },

        removeDisabledSTPFromForm: function(e) {
            $('#spanning-tree_disable option:selected').remove();

            scgen.generate();
            e.preventDefault();
        },

        addLoggingServer: function(address) {
            ui.list.addOption(
                '#logging_servers',
                address,
                address
            );

            scgen.generate();
        },

        addLoggingServerFromForm: function(e) {
            ui.list.addLoggingServer(
                $('#logging_server_new').val()
            );

            $('#logging_server_new').val('');


            e.preventDefault();
        },

        removeLoggingServerFromForm: function(e) {
            $('#logging_servers option:selected').remove();

            scgen.generate();
            e.preventDefault();
        },

        addNTPServer: function(address) {
            ui.list.addOption(
                '#ntp_servers',
                address,
                address
            );

            scgen.generate();
        },

        addNTPServerFromForm: function(e) {
            ui.list.addNTPServer(
                $('#ntp_server_new').val()
            );

            $('#ntp_server_new').val('');

            e.preventDefault();
        },

        removeNTPServerFromForm: function(e) {
            $('#ntp_servers option:selected').remove();

            scgen.generate();
            e.preventDefault();
        },

    },

    alias: {
        init: function() {
            $('#alias_add').click(ui.alias.addFromForm);
        },

        add: function(context, name, command) {
            var html = $('#alias_template_body').html();
            html = html.replace(/aliasid/g, context + '_' + name);
            var row = $(html);

            $('[name="context"]', row).val(context);
            $('[name="name"]', row).val(name);
            $('[name="command"]', row).val(command);

            $('[name="alias"]', row).val(
                context + ' ' + name + ' ' + command        
            );

            $('.add_global', row).removeClass('add_global').addClass('global');
            $('.add_generate', row).removeClass('add_generate').change(function() {
                // TODO - obsolete this using jquery.on during the global init
                scgen.generate();
            });
            
            row.appendTo('#alias_list');

            scgen.generate();
        },

        addFromForm: function(e) {
            ui.alias.add(
                $('#alias_add_context').val(),
                $('#alias_add_name').val(),
                $('#alias_add_command').val()
            );

            $('#alias_add_name').val('');
            $('#alias_add_command').val('');

            e.preventDefault();
        },
    },
    
    vlan: {

        init: function() {
            $('#add_vlan_add').click(ui.vlan.addFromForm);
        },

        add: function(id, description, required) {/*{{{*/
            var html = $('#vlan_template_body').html();
            html = html.replace(/vlanid/g, id);
            var row = $(html);

            $('[name="description"]', row).val(description);

            $('.remove-ui', row).attr('disabled', required);

            $('.add_global', row).removeClass('add_ global').addClass('global');
            $('.add_vlan', row).removeClass('add_vlan').addClass('vlan');
            $('.add_generate', row).removeClass('add_generate').change(function() {
                scgen.generate();
            });
            
            // Add form validation to the new fields
            ui.validation.initFields(row);

            row.appendTo('#vlans_list');

            scgen.generate();
        }, /*}}}*/

        addFromForm: function(e) {
            ui.vlan.add(
                $('#add_vlan_id').val(),
                $('#add_vlan_description').val()
            );

            e.preventDefault();
        },
    },

    interface: {
        init: function() {
            $('#interface_add_type').change(ui.interface.typeChanged);
            $('#interface_add').click(ui.interface.addFromForm);
        },

        add: function(type, use_slot, slot, use_subslot, subslot, start, count, standard) {
            for (var i = start, end = parseInt(start)+parseInt(count); i < end; i++) {
                var interface_name = null;
                var interface_id   = null;
                switch (type) {
                    case 'PortChannel': {
                        interface_id = interface_name = type + i;
                    } break;

                    default: {
                        interface_name = type + (use_slot ? slot + '/' : '') + (use_subslot ? subslot + '/' : '') + i;
                        interface_id   = type + (use_slot ? slot + '/' : '') + (use_subslot ? subslot + '-' : '') + i;
                    } break;
                }

                var html = $('#interface_template_body').html();
                html = html.replace(/portname/g, interface_name).replace(/portid/g, interface_id);
                var row = $(html);

                $('select[name="type"] option[value="'+standard+'"]', row).attr('selected', true);
                scgen.standards.updateParameters(row);
                

                $('.add_global', row).removeClass('add_global').addClass('global');
                $('.add_interface', row).removeClass('add_interface').addClass('interface');
                $('.add_standards', row).removeClass('add_standards').addClass('standards');
                $(".add_generate", row).removeClass('add_generate').change(function() {
                    scgen.generate();
                });
                $(".standards", row).change(function() {
                    scgen.standards.updateParameters(this);
                });

                // Add form validation to the new fields
                ui.validation.initFields(row);

                row.appendTo('#interfaces_list');
            }

            scgen.generate();

        },

        addFromForm: function(e) {
            ui.interface.add(
                $('#interface_add_type').val(),
                $('#interface_add_use_slot').attr('checked'),
                $('#interface_add_slot').val(),
                $('#interface_add_use_subslot').attr('checked'),
                $('#interface_add_subslot').val(),
                $('#interface_add_start').val(),
                $('#interface_add_count').val(),
                'ciscoSwitchUnusedPort'
            );

            e.preventDefault();
        },

        typeChanged: function() {
            switch ($('#interface_add_type').val()) {
                case 'PortChannel': {
                    $('#interface_add_slot,#interface_add_subslot,#interface_add_use_subslot').attr('disabled', true);
                } break;

                default: {
                    $('#interface_add_slot,#interface_add_subslot,#interface_add_use_subslot').attr('disabled', false);
                } break;
            }
        },

    },

    svi: {
        init: function() {
            $('#add_svi_add').click(ui.svi.addFromForm);
        },

        add: function(id, description, enable, address, mask) { /*{{{*/
            var html = $('#svi_template_body').html();
            html = html.replace(/sviid/g, 'vlan' + id);
            var row = $(html);

            $('#interface_vlan'+id+'_description', row).val(description);
            $('#interface_vlan'+id+'_enable_ip', row).attr('checked', enable);
            $('#interface_vlan'+id+'_address', row).val(address);
            $('#interface_vlan'+id+'_mask', row).val(mask);

            $('.add_global', row).removeClass('add_global').addClass('global');
            $('.add_svi', row).removeClass('add_svi').addClass('svi');
            $('.add_generate', row).removeClass('add_generate').change(function() {
                scgen.generate();
            });
            
            // Add form validation to the new fields
            ui.validation.initFields(row);

            row.appendTo('#svis_list');

            scgen.generate();       
        }, /*}}}*/

        addFromForm: function(e) {
            ui.svi.add(
                $('#add_svi_interface').val(),
                $('#add_svi_description').val(),
                $('#add_svi_enable').attr('checked'),
                $('#add_svi_address').val(),
                $('#add_svi_mask').val()
            );

            e.preventDefault();
        },

    },

    remove: function(context) { /*{{{*/
        $(context.currentTarget).closest('.context_parent').remove();

        scgen.generate();

        context.preventDefault();
    }, /*}}}*/

    validation: {

        error_count: 0,

        success_callbacks: [],
        failure_callbacks: [],

        handlers: {
            not_empty: function(context) { /*{{{*/
                return $(context).val() != '';
            }, /*}}}*/

            numeric: function(context) { /*{{{*/
                return $(context).val().match(/^\d+$/);
            }, /*}}}*/

            numeric_list: function(context) { /*{{{*/
                return $(context).val().match(/^(\d{1,4}|\d{1,4}-\d{1,4})(,(\d{1,4}|\d{1,4}-\d{1,4}))*$/);
            }, /*}}}*/

            ip: function(context) { /*{{{*/
                // Regex matches any ip, subnet or wildcard mask.
                return $(context).val().match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
            }, /*}}}*/
        
        },

        init: function() { /*{{{*/
            $('.validate').each(function() {
                ui.validation.initField(this);
            });
        }, /*}}}*/

        initFields: function(context) {
            var fields = $(context);
            
            $('.add_validate', fields).removeClass('add_validate').addClass('validate');

            $('.validate', fields).each(function() {
                ui.validation.initField(this);
            });
        },

        initField: function(context) {
            var field = $(context);

            for (var handler in ui.validation.handlers) {
                var add_handler = 'add_' + handler;
                if (field.hasClass(add_handler)) {
                    field.removeClass(add_handler).addClass(handler);
                }
            }

            field.change(function() {
                ui.validation.dispatcher(field);
            });

            ui.validation.dispatcher(field);
        },

        addSuccessCallback: function(c) {
            ui.validation.success_callbacks.push(c);
        },

        addFailureCallback: function(c) {
            ui.validation.failure_callbacks.push(c);
        },

        dispatcher: function(context) {
            var field = $(context);
            var field_ok = true;

            for (var handler in ui.validation.handlers) {
                var handler_func = ui.validation.handlers[handler];
                
                if (field.hasClass(handler)) {
                    if (!handler_func(field)) {
                        field_ok = false;
                        break;
                    }
                }
            }

            var field_parent = field.closest('.control-group');
            if (field_ok) {
                if (field_parent.hasClass('error')) {
                    field_parent.removeClass('error');
                    --ui.validation.error_count;
                }
            } else {
                if ( ! field_parent.hasClass('error')) {
                    field_parent.addClass('error');
                    ++ui.validation.error_count;
                }
            }

            if (ui.validation.error_count == 0) {
                for (var c in ui.validation.success_callbacks) {
                    ui.validation.success_callbacks[c]();
                }
            } else {
                for (var c in ui.validation.failure_callbacks) {
                    ui.validation.failure_callbacks[c]();
                }
            }
        },

    },
};

// Initialise the generator when the page loads
$("document").ready(function(){
   scgen.init();
   ui.init();
});

