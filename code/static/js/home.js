/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {

        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/account',
                accepts: 'application/json',
                dataType: 'json'
            };
            
            $.ajax(ajax_options)
            
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })

            .fail(function(xhr, textStatus, errorThrown) {
            
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },



        'create': function(fname, lname, email) {
            let ajax_options = {
                type: 'POST',
                url: 'api/account',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'fname': fname,
                    'lname': lname,
                    'email': email
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
    
        'delete': function(email) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/account/' + email,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $fname = $('#fname'),
        $lname = $('#lname'),
        $email = $('#email');

    // return the API
    return {
        reset: function() {
            $email.val('');
            $lname.val('');
            $fname.val('').focus();
        },
        update_editor: function(fname, lname, email) {
            $email.val(email);
            $lname.val(lname);
            $fname.val(fname).focus();
        },

        build_table: function(accounts) {
            let rows = ''

            // clear the table
            $('.accounts table > tbody').empty();

            // did we get a people array?
            if (accounts) {
                for (let i=0, l=accounts.length; i < l; i++) {

                    rows += `<tr><td class="fname">${accounts[i].fname}</td><td class="lname">${accounts[i].lname}</td><td class="email">${accounts[i].email}</td><td class="account_id">${accounts[i].account_id}</td><td>${accounts[i].timestamp}</td></tr>`;
 
                }

                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $fname = $('#fname'),
        $lname = $('#lname'),
        $email = $('#email');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(fname, lname, email) {
        return fname !== "" && lname !== "" && email !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        console.log("XXXXXXX  create clicked")
        let fname = $fname.val(),
            lname = $lname.val(),
            email = $email.val();

        e.preventDefault();

        if (validate(fname, lname, email)) {
            model.create(fname, lname, email)
        } else {
            alert('Problem with an input input');
        }
    });


    $('#delete').click(function(e) {
        let email = $email.val();

        e.preventDefault();

        if (validate('placeholder', email)) {
            model.delete(email)
        } else {
            alert('Problem with email input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            fname,
            lname,
            email;

        fname = $target
            .parent()
            .find('td.fname')
            .text();

        lname = $target
            .parent()
            .find('td.lname')
            .text();

        email = $target
            .parent()
            .find('td.email')
            .text();
        view.update_editor(fname, lname, email);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
console.log("XXXXXXX  home.js loaded")
