$.fn.org = {};
$.fn.org.grails = {};
$.fn.org.grails.plugin = {};

$.fn.org.grails.plugin.commenter = {

    rateables: new Array(), // An array to keep track of information about each rateable on the page.

    /**
     * init: called when the page is loaded.
     *
     * Gather up the ratings from the page. Collect some information about each.
     * Hide the form. Render the stars. Add the appropriate event handlers.
     */
    init: function() {
        var ratingdivs = $(".star_comment_rating")

        if (ratingdivs.length > 0) {
            for (var i = 0; i < ratingdivs.length; i++) {
                var id = ratingdivs[i].id.split("_")[0] // Get the unique id for this rateable
                $.fn.org.grails.plugin.commenter.rateables[i] = {}  // Create an object to hold some info about this rateable
                var tr = $.fn.org.grails.plugin.commenter.rateables[i] // A helper object with a short name
                tr.id = id
                tr.average = $("#" + id + "_form").title
                tr.submitted = false
                $.fn.org.grails.plugin.commenter.make_stardivs(i)
            }
        }
    },

    /**
     * Draw the stars for a rateable.
     */
    make_stardivs: function(index) {
        /* Replaces original form with the star images */
        var curRateable = $.fn.org.grails.plugin.commenter.rateables[index]
        var id = curRateable.id
        var form = $("#" + id + "_form")
        form.css("display", "none") // Hide the form

        // Create the div that will contain the stars
        var stardiv = $('<div>')
        stardiv.addClass('star')

        // make the stars
        for (var i=1; i<=5; i++) {
            // first, make a div and then an a-element in it
            var star = $('<span>')
            star.attr("id", id + '_star_' + i)
            star.html('&#9734;')
            star.appendTo(stardiv)

            // add needed listeners to the star
            star.bind('click', index, $.fn.org.grails.plugin.commenter.submit_rating)
        }

        var ratingDiv = $("#" + id + "_comment_rating")

        stardiv.appendTo(ratingDiv)

        // show the average
        $.fn.org.grails.plugin.commenter.reset_stars(null, index)
    },

    hover_star: function(e) {
        /* which star to hover over is buried in the element's ID. Get it. */
        star_info = this.id.split('_')
        id = star_info[0]
        which_star = star_info[2]
        /* hovers the selected star plus every star before it */
        for (var i=1; i<=which_star; i++) {
            var star = $("#" + id + '_star_' + i)
            var a = star.firstChild
            star.addClass('active')

        }
    },

    /**
     * arguments:
     * 	e: the event
     *  index: which rateable in the rateables array to work with
     */
    reset_stars: function(e, index) {
        /* Resets the status of each star */
        var rating = $.fn.org.grails.plugin.commenter.rateables[index]
//        var rating = $.fn.org.grails.plugin.commenter.rateables[e.data]

        // if form is not submitted, the number of stars on depends on the
        // given average value
        if (rating.submitted == false && rating.average!=null) {
            var average = rating.average.toString().split('.') // Chop the average into the whole number and fractional part.
            var stars_on = Math.ceil(average[0])
            var last_start_width = '100%'
            if (average[1] != undefined && parseInt(average[1]) != 0) { // There's a non-zero decimal part
                last_star_width = (parseFloat('0.' + average[1]) * 100) + '%'
            }
        } else {
            // if the form is submitted, then submitted number stays on
            var stars_on = rating.submitted
            var last_star_width = '100%'
        }

        // cycle through 1..5 stars
        for (var i=1; i<=5; i++) {
            var star = $("#" + rating.id + '_star_' + i)
            if(star!=null) {
                star.removeClass('active')
                star.removeClass('on')

                // for every star that should be on, turn them on
                if (i >= stars_on && stars_on != 0 && !star.hasClass('active')) {
                    star.addClass('active')
                }
            }
        }
    },

    submit_rating: function(e, index) {
        /* The value to submit is buried in the element's ID. Get it. */
        var star_info = this.id.split('_')
        var num = star_info[2]
//        var rating = $.fn.org.grails.plugin.commenter.rateables[index]
        var rating = $.fn.org.grails.plugin.commenter.rateables[e.data]


        // If the form has not been submitted yet
        // and submission is not in progress
        if (rating.submitted == false) {
            rating.submitted = num
            // After the form is submitted, instead of old average, show
            // submitted number of stars selected
            rating.average = num + ".0"

            // change the statustext div and show it
            $("#" + rating.id + "_notifytext").html(num + ' Rating is being saved.')

            // change the rating-value for the form and submit the form
            var form = $("#" + rating.id + "_form")
            var post_to = form.attr('action')
            var select = $("#" + rating.id + "_form" + "> #" + rating.id + "_select")
            select.attr('value', num) // Set the right form element to the value to be submitted

            $.post(post_to , { rating: num}, $.fn.org.grails.plugin.commenter.ajax_callback.success)
        }
    },

    ajax_callback: {
        success: function(o) {
            var rating = $.fn.org.grails.plugin.commenter.rateables[0]

            // release the form to normal status and change the statustext
            rating.submitted = false
            $.fn.org.grails.plugin.commenter.reset_stars(null, 0)

            $.fn.org.grails.plugin.commenter.update_rater(o)
        },
        failure: function(o) { // we shouldn't ever go down this path.
            //
        }
    },

    //function to update the ratings under the album cover (rater)
    update_rater: function (o) {
        var rating = YAHOO.org.grails.plugin.rater.rateables[0]

        // release the form to normal status and change the statustext
        rating.submitted = false
        YAHOO.org.grails.plugin.rater.reset_stars(null, 0)
    }
};

$(function () {$.fn.org.grails.plugin.commenter.init()});