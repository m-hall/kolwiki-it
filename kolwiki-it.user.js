// ==UserScript==
// @name    KoL-Wiki It
// @description Adds links to the wiki for some things
// @include *www.kingdomofloathing.com/*
// ==/UserScript==

/***********************************/
/********* Helper functions ********/
/***********************************/
(function() {
'use strict';
/**
 * Converts text to Wiki URL format
 * @param {string} str          A string containing spaces
 * @return {string}             A string with spaces replace with underscores
 **/
function wikiURL(str){
    return str.replace(/\s/g, '_').replace(/%/g, '%25').replace(/"/g, '%22');
}

/**
 * Creates a link to thekolwiki
 * @param {string} urlString    A string for the URL
 * @param {string} textString   A string for the content of the link
 * @param {string} color        A color
 * @return  {string}            An HTML link
 **/
function wikiLink(urlString, textString, color){
    return '<a href="http://kol.coldfront.net/thekolwiki/index.php/' +
        wikiURL(urlString) + '" target="_wiki" style="color:' +
        color + ';" class="wikilink">' + textString + '</a>';
}
/**
 * Modifies the content of all selected elements to become links to the wiki
 * @param {array} els           A list of DOM elements
 **/
function wikiAll(els){
    for(var i = els.length; i--; ){
        var el = els[i];
        el.innerHTML = wikiLink(el.innerText, el.innerHTML, '#000');
    }
}
/**
 * Turns a set of elements into links based on a selector
 * @param {string} selector     A query selector
 **/
function wikiSelect(selector){
    var items = document.querySelectorAll(selector);
    wikiAll(items);
}
/**
 * Gets the url "search" params as an associative array
 * @return {array}              An associative array of search params
 **/
function getSearch(){
    var data = window.location.search.substr(1).split('&');
    var values = [];
    for(var i = data.length; i--; ){
        var dat = data[i].split('=');
        values[decodeURIComponent(dat[0])] = decodeURIComponent(dat[1]);
    }
    return values;
}



/***********************************/
/******** Section functions ********/
/***********************************/
function doHeadings(){
    var blues = document.querySelectorAll('tr:first-child td[bgcolor=blue]');
    var ignores = [
        'Results:',
        'The Kingdom Of Loathing',
        'Adventure Again:'
    ];
    for(var i = blues.length; i--; ){
        var blue = blues[i];
        if (!blue.querySelector('a') && ignores.indexOf(blue.innerText.trim()) === -1) {
            blue.innerHTML = wikiLink(blue.innerText, blue.innerHTML, '#fff');
        }
    }
}
function doFight(){
    var monster = document.getElementById('monname');
    var name = monster.innerText;
    name = name.substr(name.indexOf(' ') + 1);
    monster.innerHTML = wikiLink(name, monster.innerHTML, '#000');
}
function closeDescription() {
    window.close();
}
function doDescPage(){
    var name = document.querySelector('#description center b');
    name.innerHTML = wikiLink(name.innerText, name.innerHTML, '#000');
    document.querySelector('.wikilink').addEventListener('click', closeDescription, false);
}
function doItems(){
    wikiSelect('.item .effect b');
}
function doInventory(){
    wikiSelect('.ircm');
}
function doManuel(){
    wikiSelect('table[width="95%"] td.small font');
}
function doQuests(){
    wikiSelect('blockquote b');
}
function doMallStore(){
    wikiSelect('form[name=mallbuy] td[valign="center"] b');
}
function doCollection(){
    wikiSelect('span[id^="shelf"] td[valign="center"] b');
}
function doProfile(){
    wikiSelect('center + table td[valign="center"] b');
}
function doCharSheet(){
    wikiSelect('center > center > table td[valign="center"] b');
}
function doGash(){
    var blue = document.querySelector('td[bgcolor="blue"]');
    blue.innerHTML = wikiLink('Ascension', blue.innerHTML, '#fff');
}


/***********************************/
/******** All of the pages *********/
/***********************************/
switch(window.location.pathname){
    /* Don't need to do these */
    case '/account.php': // account settings
    case '/clan_ftopics.php': // clan forums
    case '/clan_board.php': // clan announcement board admin
    case '/loggedout.php': // Log out results
    case '/login.php': // login page
    case '/maint.php': // rollover
    case '/sendjickmail.php': // public contact form
    case '/static.php': // public pages
    case '/radio.php': // radio page
    case '/museum.php': // Museum
    case '/managecollection.php': // collection admin
    case '/ascensionhistory.php': // profile history
    case '/chatlaunch.php': //
    case '/mchat.php': // modern (tabbed) chat
    case '/ichat.php': // old chat
    case '/chat.php': // ancient chat
    case '/showconsumption.php': // Favorite Food/Booze
    case '/doc.php': // documentation
        break;

    /* Not yet done */
    case '/trophy.php': // trophy hut
    case '/createplayer.php': // create player page
    case '/arena.php': // Cake Shaped Arena
    case '/mrstore.php': // Mr Store
    case '/managecollectionshelves.php': // collection admin
    case '/managestore.php': // store admin
    case '/storelog.php': // Store Purchase logs
    case '/manageprices.php': // Manage Store prices
    case '/craft.php': // crafting pages
    case '/basement.php': // fernswarthy's basement
        break;

    case '/questlog.php': // Quest log
        switch(getSearch()['which']){
            case '3': // other accomplishments
            case '4': // notes
                break;
            case '6': // Monster Manuel
                doManuel();
                break;
            case '1': // current quests
            case '2': // completed quests
            default: // nothing selected, defaults to current quests
                doQuests();
                break;
        }
        break;

    case '/messages.php': // messages
        doItems();
        break;
    case '/showplayer.php': // player profiles
        doProfile();
        break;
    case '/charsheet.php': // personal profile
        doCharSheet();
        break;

    case '/da.php': // Dungeons association
    case '/jarlskills.php': // Avatar of Jarlsberg skills
    case '/forestvillage.php': // ( Crackpot mystic ) ?action=mystic
    case '/store.php': // All of the normal stores
    case '/bhh.php': // Bounty Hunter Hunter
    case '/town_giftshop.php': // gift shop
    case '/galaktik.php': // Doc Galaktik
        doHeadings();
        break;
    case '/mall.php': // The mall
        doMallStore();
        break;

    case '/inventory.php': // Inventory
    case '/storage.php': // Hagnks
        doInventory();
        break;
    case '/desc_skill.php': // Skill descriptions
    case '/desc_item.php': // Item Descriptions
    case '/desc_effect.php': // Effect Descriptions
    case '/desc_familiar.php': // Familiar descriptions
        doDescPage();
        break;
    case '/displaycollection.php': // player collections
        doCollection();
        break;

    case '/ascend.php': // Ascend Choice
        doGash();
        break;

    case '/fight.php': // Combat
        doFight();
        // falls through
    case '/choice.php': // Choice adventures
    case '/adventure.php': // non-combat adventures
    case '/oldman.php': // Old man on main map
    case '/thesea.php': // The Sea
    case '/seafloor.php': // The Sea Floor
    case '/monkeycastle.php': // Sea Monkey Castle
    case '/fernruin.php': // Farnswarthy's Ruins
    case '/town_right.php': // Right Side of the tracks
    case '/town_wrong.php': // Wrong side of the tracks
    case '/guild.php': // Guilds
    case '/town_market.php': // Seaside Town Market
    case '/main.php': // The Main Map
    case '/lair.php': // Lair map
    case '/lair1.php': // Lair entrance hall 1
    case '/lair2.php': // Lair entrance hall 2
    case '/lair3.php': // Lair hedge maze
    case '/lair4.php': // Lair tower 1-3
    case '/lair5.php': // Lair tower 4-6
    case '/lair6.php': // Lair tower top
    default: // everything else
        doHeadings();
        doItems();
        break;
}

}());
