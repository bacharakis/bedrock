/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function($, dataLayer) {
    'use strict';

    // check page version for tests
    var version = Number($('#masthead').data('version'));

    var prepLi = function(li) {
        var $li = $(li);
        var $liA = $li.find('a');
        var newOsName;

        switch ($liA.text()) {
        case 'Windows':
            newOsName = 'Windows 32-bit';
            $li.attr('data-sort', 1);
            break;
        case 'Linux':
            newOsName = 'Linux 32-bit';
            $li.attr('data-sort', 2);
            break;
        case 'Windows 64-bit':
            $li.attr('data-sort', 3);
            break;
        case 'Linux 64-bit':
            $li.attr('data-sort', 4);
            break;
        case 'OS X':
            $li.attr('data-sort', 5);
            break;
        }

        if (newOsName) {
            $liA.text(newOsName);
        }

        return li;
    };

    // duplicate and move /all link for desktop test
    var setupTest = function(version) {
        var $dlButton = $('#download-button-desktop-release');
        var $fxFooterLink;
        var $newLink;
        var linkCss;

        // make sure desktop download button exists and user is on a recognized platform
        if ($dlButton.length && $dlButton.find('.unrecognized-download:visible').length === 0) {
            $fxFooterLink = $('#fx-footer-links-desktop-all');

            linkCss = {
                'display': 'inline-block',
                'paddingTop': '10px'
            };

            if (version === 1) {
                // snag the link from the footer
                $newLink = $fxFooterLink.clone();

                // make sure footer element was found
                if ($newLink.length) {
                    $newLink.css(linkCss).data({
                        // GTM stuff?
                        'foo': 'bar',
                        'flim': 'flam'
                    });
                }
            } else if (version === 2) {
                // pull the nojs links out of the modal's download button
                var $directLis = $('#fx-modal-download .nojs-download li').remove();
                var sortedLis = [];

                // container to hold direct download links in the modal
                var $modalDirectDownloadList = $('#fx-modal-direct-downloads');

                // os's to filter out of modal (as we have the app store specific buttons displayed already)
                var mobileOs = ['android', 'ios'];

                // remove button-y CSS
                $directLis.find('a').removeClass('button green').data({
                    // GTM stuff?
                    'boo': 'far',
                    'film': 'falm"'
                });

                // massage the download links
                $directLis.each(function(i, li) {
                    // do not include mobileOs's
                    if (mobileOs.indexOf($(li).find('a').data('download-os').toLowerCase()) === -1) {
                        li = prepLi(li);
                        sortedLis.push(li);
                    }
                });

                // sort the download links
                sortedLis.sort(function(a, b) {
                    return ($(a).data('sort') < $(b).data('sort'));
                });

                // add the download links to the DOM
                for (var i = sortedLis.length; i >= 0; i--) {
                    $modalDirectDownloadList.append(sortedLis[i]);
                }

                // get platform display name
                var platformDisplayName = $dlButton.find('.download-list li:visible a').data('display-name');

                // make sure user is on a supported platform
                if (platformDisplayName) {
                    // put "for {user's os}" text underneath modal primary dl button
                    $('#fx-modal-user-platform').text('for ' + platformDisplayName);
                } else {
                    $('#fx-modal-user-platform').remove();
                }

                // conjure up a new link that will trigger the modal
                $newLink = $('<a href="" id="fx-modal-link">Download Firefox for another platform</a>');

                $newLink.css(linkCss).on('click', function(e) {
                    e.preventDefault();

                    // open up said modal
                    Mozilla.Modal.createModal(this, $('#fx-modal'));
                });

                // add GA to 'Firefox for Other Platforms & Languages' footer link
                $fxFooterLink.on('click', function() {
                    dataLayer.push({
                        'event': 'alternate-version',
                        'link-name': 'Systems & Languages'
                    });
                });
            }

            // place the new link (modal or direct to /firefox/all) underneath
            // the main download button
            $dlButton.append($newLink);
        }
    };

    // initiate test if valid version supplied
    if (version === 1 || version === 2) {
        setupTest(version);
    }
})(window.jQuery, window.dataLayer = window.dataLayer || []);
