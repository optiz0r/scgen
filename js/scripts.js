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
            banner:                     [ "banner", "%name", "%contents-" ], 
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
            spanningtree_portfast:      [ "spanning-tree portfast", "%1" ],
            spanningtree_bpduguard:     [ "spanning-tree bpduguard enable" ],
            spanningtree_loopguard:     [ "spanning-tree loopguard enable" ],
            spanningtree_rootguard:     [ "spanning-tree rootguard enable" ],
            udld_port:                  [ "udld port", "%1" ],
            channelgroup:               [ "channel-group", "%1", "mode", "%2" ],
            ip_address:                 [ "ip address", "%address-", "%mask-" ],
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
                } else if (Object.prototype.toString.call(parameters) === '[object Object]') {
                    if ( ! (negate && parameter_negate_exclude)) {
                        new_command += parameters[parameter_name] + ' ';
                    }

                } else {
                    if ( ! (negate && parameter_negate_exclude)) {
                        new_command += parameters + ' ';
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
    }/*}}}*/
};

