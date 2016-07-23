// ==UserScript==
// @name         SGTools Giveaways Helper (Custom by Barokai)
// @namespace    *://www.sgtools.info/
// @version      1.7.1
// @description  Makes your life easier!
// @author       Barokai | www.loigistal.at (Enhanced version of KnSYS which is based on a work from Mole & Archi. See below)
// @description  Enhanced create giveaway feature - added 3 buttons for 3 giveaway groups (BundleQuest, RPGTreasury, Unlucky-7) which will be chosen automatically on click.
// @homepage     https://github.com/Barokai/sgtools-giveaways-helper-custom/
// @license      https://github.com/Barokai/sgtools-giveaways-helper-custom/blob/master/LICENSE
// @updateURL    https://github.com/Barokai/sgtools-giveaways-helper-custom/raw/master/sgtools-giveaways-helper-custom.user.js
// @match        *://www.steamgifts.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
/* Based on SGTools Giveaways Helper by KnSYS
 * which is
 * Based on Touhou Giveaways Helper
 * https://github.com/Aareksio/touhou-giveaways-helper
 * authors  Mole & Archi
 *
 * MIT License
 */

// TODO Barokai: move buttons under game selection

'use strict';

var SGTOOLS_SITE = 'https://www.sgtools.info/';
var SGTOOLS_TIME = 2 * 24 * 60 * 60 * 1000; // 2 days recommended
var DEFAULT_LEVEL = 0;
var DEFAULT_DESCRIPTION = '**Headline**\n\nText';

if (/steamgifts\.com/.exec(window.location.href)) {
    var current_path = window.location.pathname.split('/');
    removeFromArray(current_path, "");
}

if (current_path) {
    if (current_path.length !== 0 && current_path[0] === 'giveaways' && current_path[1] === 'new') {
        giveawayNew();
    } else if (current_path.length !== 0 && current_path[0] === 'giveaway') {
        var id = current_path[1];
        console.log(id);
        getProtectedStatus(id);
    }
}

function getProtectedStatus(id) {
    var isInviteOnly = $('.featured__column--invite-only').length;
    if (isInviteOnly){
        var url = SGTOOLS_SITE + 'api/isSGTProtected/'+id;
        $.getJSON(url+"?callback=?", function(result){
            var isProtected = result["protected"];
            var toAppendValid = $(".sidebar__entry-insert");
            var toAppendError = $(".sidebar__error");
            if (isProtected){
                toAppendValid.html('<i class="fa fa-lock"></i> Enter SGTools Protected Giveaway');
                toAppendError.html('<i class="fa fa-lock"></i> ' + toAppendError.html());
                toAppendValid.css({
                    'border-color': "#93BBD3 #699DBC #427BA4 #70ACC8",
                    'background-image': 'linear-gradient(#A7D1EE 0%, #8AC4DF 50%, #6AA2C9 100%)',
                    'color': 'inherit'
                });
            }else{
                toAppendValid.html('<i class="fa fa-unlock"></i> ' + toAppendValid.html());
            }
        });
    }
}

function giveawayNew() {
    $(".form__row--giveaway-keys").after('<div class="form__row form__row--sgtools-giveaway-helper"><div class="form__heading"><div class="form__heading__number">3a.</div><div class="form__heading__text">SGTools Giveaway</div></div>' +
                                         '<div class="form__row__indent"><div class="form__submit-button sgtoolsBtn1"><i class="fa fa-fast-forward"></i>&nbsp;Fill with default SGTools settings (BundleQuest)</div>&nbsp;</div>' +
                                         '<div class="form__row__indent"><div class="form__submit-button sgtoolsBtn2"><i class="fa fa-fast-forward"></i>&nbsp;Fill with default SGTools settings (RPG Treasury)</div>&nbsp;</div>' +
                                         '<div class="form__row__indent"><div class="form__submit-button sgtoolsBtn3"><i class="fa fa-fast-forward"></i>&nbsp;Fill with default SGTools settings (Unlucky-7)</div>&nbsp;</div></div>');
    let applyGiveawayTypeKey = function(){
        var privateButton = $("div[data-checkbox-value='key']");
        if (!privateButton.hasClass('is-selected')) {
            privateButton.trigger("click");
        }
    };

    let applyDates = function() {
        let startingDate = new Date();
        let endingDate = new Date(startingDate.getTime() + SGTOOLS_TIME + (60 * 60 * 1000)); // Extra 1 hour
        $("input[name='start_time']").val(formatDate(startingDate));
        $("input[name='end_time']").val(formatDate(endingDate));
    };

    let applyRegionRestrictions = function() {
        $("div[data-checkbox-value='0']").trigger("click");
    };

    let applyPrivate = function() {
        var privateButton = $("div[data-checkbox-value='invite_only']");
        if (!privateButton.hasClass('is-selected')) {
            privateButton.trigger("click");
        }
    };

    let scrollToGroup = function(group) {
        var container = $('.form__groups'),
            scrollTo = group;

        container.scrollTop(
            scrollTo.offset().top - container.offset().top + container.scrollTop()
        );
    };

    let applyGroup = function(groupname) {
        var privateButton = $("div[data-checkbox-value='groups']");
        if (!privateButton.hasClass('is-selected')) {
            privateButton.trigger("click");
        }

        var group = $('div.form__group__details > div.form__group__name:contains('+groupname+')');
        group.click();
        scrollToGroup(group);
    };

    let applyDescription = function() {
        let descarea = $("textarea[name='description']");
        let newDesc = DEFAULT_DESCRIPTION + descarea.val().replace(DEFAULT_DESCRIPTION, "");
        descarea.val(newDesc);
    };

    let applyLevel = function(level) {
        let levelValue = $("input[name='contributor_level']");
        levelValue.val(level);
        $(".ui-slider-range").css('width', level*10+"%");
        $(".ui-slider-handle").css('left', level*10+"%");
        $(".form__input-description--level").toggleClass("is-hidden");
        $(".form__input-description--no-level").toggleClass("is-hidden");
        $("span.form__level").text("level "+level);
    };

    $(".sgtoolsBtn1").click(function() {
        applyGiveawayTypeKey();
        applyDates();
        applyRegionRestrictions();
        applyPrivate();
        applyDescription();
        applyLevel(DEFAULT_LEVEL);
        applyGroup("Bundle Quest");
    });

    $(".sgtoolsBtn2").click(function() {
        applyGiveawayTypeKey();
        applyDates();
        applyRegionRestrictions();
        applyPrivate();
        applyDescription();
        applyLevel(DEFAULT_LEVEL);
        applyGroup("RPG Treasury");
    });

    $(".sgtoolsBtn3").click(function() {
        applyGiveawayTypeKey();
        applyDates();
        applyRegionRestrictions();
        applyPrivate();
        applyDescription();
        applyLevel(DEFAULT_LEVEL);
        applyGroup("Unlucky-7");
    });
}

/* Helpers */
function removeFromArray(arr, item) {
    for (let i = arr.length; i--;) {
        if (arr[i] === item) {
            arr.splice(i, 1);
        }
    }
}

function formatDate(date) {
    // Fixed by Archi for all SG weird dates, do not touch

    // Fix hours
    let hours = date.getHours();
    let ampm = '';
    if (hours < 12) {
        ampm = 'am';
        if (hours === 0) {
            hours = 12;
        }
    } else {
        ampm = 'pm';
        if (hours !== 12) {
            hours = hours % 12;
        }
    }

    // Fix minutes
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    // Return result
    return $.datepicker.formatDate('M d, yy', date) + " " + hours + ":" + minutes + " " + ampm;
}
