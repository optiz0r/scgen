/**
 * Default switch config
 *
 * Generate hashtype 5 passwords using 'openssl passwd -1 -salt pdQG -table foo'
 */
var newui = {

    type: {
        checkbox: {
             
        },
        text: {

        },
    },

    config: {

        global: {
            'hostname': {
                type: 'text',
                hidden: false,
            },
        },

        service: {
            type: 'checkbox',
            hidden: false,
            enabled: false,
            defaults: {
                name: undefined,
            }
        }
    }
}

