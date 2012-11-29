/**
 * AJAXy Star-rating Script For Yahoo! UI Library (YUI)
 *
 * By <Ville@Unessa.net>
 * http://www.unessa.net/en/hoyci/projects/yui-star-rating/
 * (altered by Matthew Taylor for Grails Ratable Plugin
 * (altered by Jasen Jacobsen to support multiple instances on a page.
 *
 * Based loosely on Wil Stuckeys jQuery Star Rating Plugin:
 * http://sandbox.wilstuckey.com/jquery-ratings/
 *
 * Respecting the original licence, this script is also
 * dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

YAHOO.namespace("org.grails.plugin.commenter")

YAHOO.org.grails.plugin.commenter = {

    rateables: new Array(), // An array to keep track of information about each rateable on the page.

    /**
     * init: called when the page is loaded.
     *
     * Gather up the ratings from the page. Collect some information about each.
     * Hide the form. Render the stars. Add the appropriate event handlers.
     */
    init: function () {
        var ratingdivs = YAHOO.util.Dom.getElementsByClassName('star_comment_rating', 'div')

        if (ratingdivs.length > 0) {
            for (var i = 0; i < ratingdivs.length; i++) {
                var id = ratingdivs[i].id.split("_")[0] // Get the unique id for this rateable
                YAHOO.org.grails.plugin.commenter.rateables[i] = {}  // Create an object to hold some info about this rateable
                var tr = YAHOO.org.grails.plugin.commenter.rateables[i] // A helper object with a short name
                tr.id = id
                tr.average = YAHOO.util.Dom.get(id + "_form").title
                tr.submitted = false
                YAHOO.org.grails.plugin.commenter.make_stardivs(i)
            }
        }
    },

    /**
     * Draw the stars for a rateable.
     */
    make_stardivs: function (index) {
        /* Replaces original form with the star images */
        var curRateable = YAHOO.org.grails.plugin.commenter.rateables[index]
        var id = curRateable.id
        var form = YAHOO.util.Dom.get(id + "_form")
        YAHOO.util.Dom.setStyle(form, 'display', 'none') // Hide the form

        // Create the div that will contain the stars
        var stardiv = document.createElement('div')
        YAHOO.util.Dom.addClass(stardiv, 'star')

        // make the stars
        for (var i = 1; i <= 5; i++) {
            // first, make a div and then an a-element in it
            var star = document.createElement('span')
            star.id = id + '_star_' + i
            star.innerHTML = '&#9734;'
            stardiv.appendChild(star)

            // add needed listeners to the star
            YAHOO.util.Event.addListener(star, 'click', YAHOO.org.grails.plugin.commenter.submit_rating, index)
        }

        YAHOO.util.Dom.get(id + "_comment_rating").appendChild(stardiv)
        // show the average
        YAHOO.org.grails.plugin.commenter.reset_stars(null, index)
    },

    hover_star: function (e) {
        /* which star to hover over is buried in the element's ID. Get it. */
        star_info = this.id.split('_')
        id = star_info[0]
        which_star = star_info[2]
        /* hovers the selected star plus every star before it */
        for (var i = 1; i <= which_star; i++) {
            var star = YAHOO.util.Dom.get(id + '_star_' + i)
            var a = star.firstChild
            YAHOO.util.Dom.addClass(star, 'active')
            YAHOO.util.Dom.setStyle(a, 'width', '100%')
        }
    },

    /**
     * arguments:
     *     e: the event
     *  index: which rateable in the rateables array to work with
     */
    reset_stars: function (e, index) {
        /* Resets the status of each star */
        var rating = YAHOO.org.grails.plugin.commenter.rateables[index]

        // if form is not submitted, the number of stars on depends on the
        // given average value
        if (rating.submitted == false && rating.average != null) {
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
        for (var i = 1; i <= 5; i++) {
            var star = YAHOO.util.Dom.get(rating.id + '_star_' + i)
            if (star != null) {

                // first, reset all stars
                YAHOO.util.Dom.removeClass(star, 'active')
                YAHOO.util.Dom.removeClass(star, 'on')

                // for every star that should be on, turn them on
                if (i >= stars_on && stars_on != 0 && !YAHOO.util.Dom.hasClass(star, 'active')) {
                    YAHOO.util.Dom.addClass(star, 'active')
                }

            }
        }
    },

    submit_rating: function (e, index) {
        /* The value to submit is buried in the element's ID. Get it. */
        var star_info = this.id.split('_')
        var num = star_info[2]
        var rating = YAHOO.org.grails.plugin.commenter.rateables[index]

        // If the form has not been submitted yet
        // and submission is not in progress
        if (rating.submitted == false) {
            rating.submitted = num
            // After the form is submitted, instead of old average, show
            // submitted number of stars selected
            rating.average = num + ".0"

            // change the statustext div and show it
//            YAHOO.util.Dom.get(rating.id + "_notifytext").innerHTML = 'Rating is being saved.'

            // change the rating-value for the form and submit the form
            var form = YAHOO.util.Dom.get(rating.id + "_form")
            var post_to = form.action
            form.elements[0].value = num // Set the right form element to the value to be submitted
            YAHOO.util.Connect.setForm(form)
            var callback = {
                success: YAHOO.org.grails.plugin.commenter.ajax_callback.success,
                failure: YAHOO.org.grails.plugin.commenter.ajax_callback.failure,
                argument: {index: index} // We need to keep track of which rateable has been submitted.
            }
            YAHOO.util.Connect.asyncRequest('POST', post_to, callback)
        }
    },

    ajax_callback: {
        success: function (o) {
            var rating = YAHOO.org.grails.plugin.commenter.rateables[o.argument.index]

            // release the form to normal status and change the statustext
            rating.submitted = false
            var avg = o.responseText.split(',')[0]
            var total = o.responseText.split(',')[1]
//            YAHOO.util.Dom.get(rating.id + "_notifytext").innerHTML = 'Rating saved. (' + total + ' Ratings)'
            rating.average = avg

//            YAHOO.util.Dom.get(rating.id + "_comment_rating_form").elements[0].value = avg
            YAHOO.util.Dom.get(rating.id + "_form").elements[0].value = avg
            YAHOO.org.grails.plugin.commenter.reset_stars(null, o.argument.index)

            YAHOO.org.grails.plugin.commenter.update_rater(o)
        },
        failure: function (o) { // we shouldn't ever go down this path.
            //
        }
    },

    //function to update the ratings under the album cover (rater)
    update_rater: function (o) {
        var rating = YAHOO.org.grails.plugin.rater.rateables[o.argument.index]

        // release the form to normal status and change the statustext
        rating.submitted = false
        var avg = o.responseText.split(',')[0]
        var total = o.responseText.split(',')[1]
        YAHOO.util.Dom.get(rating.id + "_notifytext").innerHTML = 'Rating saved. (' + total + ' Ratings)'
        rating.average = avg

        YAHOO.util.Dom.get(rating.id + "_form").elements[0].value = avg
        YAHOO.org.grails.plugin.rater.reset_stars(null, o.argument.index)
    }
}

YAHOO.util.Event.addListener(window, 'load', YAHOO.org.grails.plugin.commenter.init)