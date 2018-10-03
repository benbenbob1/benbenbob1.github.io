$(function() {
    var siteName = "benbrown.science";
    var shortName = "bbs";
    var version = 0.965;

    /*                                            *
     *    Feel free to look around!               *
     *                                            *
     *                    benbrown52@gmail.com    *
     *                                            *
     *                                            */

    function defaultStyle() {
        return {
            textColor: '#28FE14',
            backgroundColor: 'black',
            linkColor: 'white',
            prompt: '/var/root$ ',
            cursor: '▋',
            fontSize: '16px',
            sidebarBG: 'lightgray',
            sidebarTextColor: 'blue'
        };
    }
    var styleDict = defaultStyle();
    var extra = '';
    var beginning = '';
    var extraSize = 0;
    var command = '';
    var cmds = [];

    var interceptInput = true;

    var containerMain = $('#containermain');
    var container = $($('.container')[0]);
    var deviceInputArea = $('#textinput');
    var element = $(".element");
    var cursor = $('.typed-cursor');

    var tabPressed = false;

    var STR_PAD_LEFT = -1,
        STR_PAD_RIGHT = 1,
        STR_PAD_BOTH = 0;

    // START POINT
    
    // set the initial state
    // (only if browser supports the Page Visibility API)
    if( document[hidden] !== undefined ) {
        onchange({type: document[hidden] ? "blur" : "focus"});
    }

    try {
        var beenHereBefore = localStorage.getItem('visited');
        if (!beenHereBefore) {
            localStorage.setItem('visited', 'true', { expires: 10 });
        }
    } catch (e) {}
    
    var finishedTyping = false;
    var timingOrExtra = beenHereBefore?'\nWelcome back!^500':'^1000';

    var toType = siteName
        + ', version '
        + version
        + ' initialized.'
        + timingOrExtra
        + '\n\n'
        + styleDict.prompt;
    var historyCursor = -1;
    var textCursor = 0;
    var showingSocial = false;
    setupLinks();

    element.typed({
        strings: [toType],
        startDelay: beenHereBefore?0:3000,
        typeSpeed: -400,
        showCursor: true,
        cursorChar: styleDict.cursor,
        contentType: 'text',
        preStringTyped: function() {
            cursor.css("color", styleDict.textColor);
            finishedTyping = false;
        },
        callback: function() {
            cursor.css("color", "");
            finishedTyping = true;
            beginning = element.text();
            if (beenHereBefore) { showSidebar(); showingSocial = true; }
            else 
                setTimeout(function(){
                    if (!showingSocial) { 
                        showSidebar();
                        showingSocial = true;
                    }
                }, 9000);
        }
    });

    // Map of commands to their function
    // function looks like nameOfFunction(args)
    var commands = {
        'about'  : 'aboutCommand'  ,
        'cat'    : 'catCommand'    ,
        'clear'  : 'clearCommand'  ,
        'contact': 'contactCommand',
        'echo'   : 'echoCommand'   ,
        'hello'  : 'helloCommand'  ,
        'help'   : 'helpCommand'   ,
        'history': 'historyCommand',
        'ls'     : 'lsCommand'     ,
        'me'     : 'meCommand'     ,
        'resume' : 'resumeCommand' ,
        'skills' : 'skillsCommand' ,
        'skillz' : 'skillzCommand' , //ignore 
        'stuff'  : 'stuffCommand'  ,
        'style'  : 'styleCommand'  ,
        'test'   : 'testCommand'
    };
    //List of commands to be ignored by tab completion
    var ignoreList = [
        'skillz'
    ];

    var parseableFiles = [
        'index.html',
        'me.txt',
        'license.md',
        'stuff.txt',
        'style.css'
    ].sort();

    var parseableCommands = [];
    for (var command in commands) {
        if (ignoreList.indexOf(command) == -1) {
            parseableCommands.push(command);
        }
    }

    (function(){ //SHHH... I left this unminified just for you
        function load_script(url, callback) {
            var scriptElem = document.createElement("script");
            scriptElem.type = "text/javascript";
            scriptElem.onload = callback;
            scriptElem.src = url;
            document.getElementsByTagName("head")[0].appendChild(scriptElem);
        }
        function load_css(url, callback) {
            var scriptElem = document.createElement("link");
            scriptElem.type = "text/css";
            scriptElem.rel = "stylesheet";
            scriptElem.onload = callback;
            scriptElem.href = url;
            document.getElementsByTagName("head")[0].appendChild(scriptElem);
        }
        var lookFor = [38,38,40,40,37,39,37,39,66,65,13];
        var entered = [];
        var enteredAlready = false;
        document.addEventListener("keydown", function(event) {
            if (!enteredAlready) {
                entered.push(event.keyCode);
                var i;
                for (i=0; i<entered.length && i<lookFor.length; i++) {
                    if (entered[i] !== lookFor[i]) {
                        entered = [];
                        break;
                    }
                }
                if (i==lookFor.length) {
                    entered = [];
                    enteredAlready = true;
                    load_script("https://cdnjs.cloudflare.com/ajax"
                        + "/libs/velocity/1.2.3/velocity.min.js",
                        function() {
                            load_css("secret.css", function() {
                                load_script("js/secret.min.js", function() {
                                    sendTrackingEvent("entered_secret");
                                    console.log("Woah");
                                });
                            });
                        }
                    );
                }
            }
        });
    })();


    var _cmdList = {
        aboutCommand: function(args) {
            return "\n‘« About Me »’\n"
                + "Hello. My name is Ben Brown.\n"
                + "I am a tinkerer and an inventer as well\n"
                + "as a full stack engineer.\n\n"
                + "You can reach me using the <u>contact</u> command\n"
                + "or view my Resume with <u>resume</u>."
        },
        //Will not work locally
        catCommand: function(args) {
            if (args.length < 2 || args[1] == ' ' || args[1] == '') {
                return "usage: cat file1\n"
                    + "\tprints the contents of <u>file1</u>.";
            } 
            if (args[1] == 'index.html' || args[1] == '.'
                || args[1] == '/' || args[1] == 'index') {
                return "why don\'t you just view the source?";
            }
            var out = '';
            var ajax = $.ajax({
                url: args[1],
                success: function(data) {
                    out = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                },
                error: function(error) {
                    out = 'read failed. '+error.statusText;
                },
                timeout: 3000,
                async: false
            });
            return out;
        },
        clearCommand: function(args) {
            beginning = '';
            extra = '';
            extraSize = 0;
            return 'Screen cleared.';
        },
        contactCommand: function(args) {
            var result = '';
            if (args[1][0] === "-") {
                var param = args[1][1];
                switch (param) {
                    case "f":
                        result = "Opening facebook...";
                        $('#fb-button').click();
                        break;
                    case "t":
                        result = "Opening twitter...";
                        $('#twitter-button').click();
                        break;
                    case "r":
                        result = _cmdList.resumeCommand();
                        break;
                    case "l":
                        result = "Opening LinkedIn...";
                        $('#in-button').click();
                        break;
                    case "g":
                        result = "Opening GitHub...";
                        $('#gh-button').click();
                        break;
                    case "e":
                        result = "Opening email client...";
                        $('#email-button').click();
                        break;
                    default:
                        result = "Unknown parameter \""+param+"\"";
                }
            } else {
                result = "usage: contact -ftlger\n"
                    + "\tfind me on:\n"
                    + "\t\t-f Facebook\n"
                    + "\t\t-t Twitter\n"
                    + "\t\t-l LinkedIn\n"
                    + "\t\t-g GitHub\n"
                    + "\t\t-e Email\n"
                    + "\t-r View my resume";
            }
            return result;
        },
        echoCommand: function(args) {
            result = '';
            for (var i=1; i<args.length; i++) {
                result = result + args[i] + " ";
            }
            return result;
        },
        helloCommand: function(args) {
            return "hey there!";
        },
        helpCommand: function(args) {
            return "\nabout: all about me, Ben Brown!\n"
                + "skills: what can I do for you?\n"
                + "stuff: some things I've done\n"
                + "contact: how to find me\n\n"
                + "Some commands:\n"
                + "\techo\tcat\tls\tstyle\n"
                + "\thistory\nMore commands to come!";
        },
        historyCommand: function(args) {
            var allHistory = "";
            for (var i=0; i<cmds.length; i++) {
                var numStr = ""+(i+1);
                numStr = pad(numStr, 7, ' ', 0);
                var shouldNewline = (i == cmds.length-1 ? "":"\n");
                allHistory = allHistory + numStr + cmds[i] + shouldNewline;
            }
            return allHistory;
        },
        lsCommand: function(args) {
            var hasArgs = false;
            if (args.length > 1) {
                for (arg in args) {
                    if (args[arg].substring(0, 2) === './')
                        args[arg] = args[arg].substring(2);
                }
                hasArgs = true;
            }
            

            if (args.length == 2 && parseableFiles.indexOf(args[1]) != -1) {
                return args[1];
            } else if (hasArgs) {
                return 'ls: '+args[1]+': No such file or directory';
            }
            var filesPerLine = 3;
            var numFiles = parseableFiles.length;
            var toDisplay = "";
            for (var i=0; i<numFiles; i++) {
                toDisplay += parseableFiles[i];
                if (i>0 && (i+1)%filesPerLine == 0) {
                    toDisplay += "\n";
                } else if (i!=numFiles-1) {
                    toDisplay += "\t";
                }
            }
            return toDisplay;
        },

        //Will not work locally
        meCommand: function(args) {
            return "\n‘"+htmlImage()+"’";
        },
        resumeCommand: function(args) {
            window.open("https://docsend.com/view/pebk2a5");
            return "Opening resume...";
        },
        styleCommand: function(args) {
            if (args.length != 2 || args[1] == '') {
                return "usage: style colorscheme\n"
                    + "\twhere colorscheme is one of:\n"
                    + "\t\tterminal\n"
                    + "\t\tmsdos\n"
                    + "\t\tdark\n"
                    + "\t\thotdog";
            }
            return setStyle(args[1]);
        }, 
        stuffCommand: function(args) {
            return "\n‘« Stuff »’\nSome things I've done:\n"
                + " • Created a Bluetooth audio receiver using a "
                + "Raspberry Pi, C, and a few shell scripts\n"
                + " • Created a webserver and associated iPhone app "
                + "to control the led light strips in my room using "
                + "a custom circuit, said Raspberry Pi, C, and Objective-C\n"
                + " • Wrote a program that takes the music I'm listening "
                + "to and makes the lights respond to the music using C\n"
                + " • Wrote this website in Javascript :)";
        }, 
        skillsCommand: function(args) {
            return "\n‘« My Skills »’\nWhat I can do:\n"
                + "\tJavascript\t[«       » ]\n"
                + "\tC\t\t[«       » ]\n"
                + "\tCSS\t\t[«       » ]\n"
                + "\tC++\t\t[«      »  ]\n"
                + "\tObjective-C\t[«      »  ]\n"
                + "\tPython\t\t[«      »  ]\n"
                + "\tPHP\t\t[«      »  ]\n"
                + "\tSwift\t\t[«     »   ]\n"
                + "\tBash\t\t[«     »   ]\n"
                + "\tJava\t\t[«     »   ]\n"
                + "\tMIPS\t\t[«    »    ]\n"
                + "\tNode\t\t[«    »    ]\n"
                + "\tSQL\t\t[«    »    ]\n"
                + "\tFlask\t\t[«   »     ]\n"
                + "\tMongo\t\t[«   »     ]\n"
                + "\tErlang\t\t[«  »      ]\n"
                + "\nWhat I cannot do:\n"
                + "\tRaise one eyebrow\n"
                + "\tBake a banana rhubarb pie\n"
                + "\tWhistle while eating a cracker";
        },
        skillzCommand: function(args) {
            return "\n‘« Ma $killz »’\nYeh:\n"
                + "\tJayscrizzle\t[«       » ]\n"
                + "\tCizzle\t\t[«       » ]\n"
                + "\tSee ess ess\t[«       » ]\n"
                + "\tCizzle++\t[«      »  ]\n"
                + "\tObjectin-Cizzle\t[«      »  ]\n"
                + "\tDa snake\t[«      »  ]\n"
                + "\tHIP\t\t[«      »  ]\n"
                + "\t$wift\t\t[«     »   ]\n"
                + "\tBish\t\t[«     »   ]\n"
                + "\tJive\t\t[«     »   ]\n"
                + "\t'Sembly\t\t[«    »    ]\n"
                + "\tReal devs only\t[«    »    ]\n"
                + "\tMaSQL\t\t[«    »    ]\n"
                + "\tFlazzzk\t\t[«   »     ]\n"
                + "\tMongo DeesBees\t[«   »     ]\n"
                + "\tEera-eeralang\t[«  »      ]\n"
                + "\nNah:\n"
                + "\tBrow liftin\n"
                + "\tPie bakin\n"
                + "\tEffectively pull off being an OG";
        },
        testCommand: function(args) {
            return "success!";
        },
        vimCommand: function(args) {
            interceptInput = false;
            var vim = new VIM();
            var taElem = document.createElement("textarea");
            taElem.id = "ta_VIM";
            taElem.classList.add("title_hero");
            containerMain[0].appendChild(taElem);
            vim.attach_to( taElem );
            taElem.focus();
        }
    };

    function pad(str, len, pad, dir) {
        if (typeof(len) === undefined) { var len = 0; }
        if (typeof(pad) === undefined) { var pad = ' '; }
        if (typeof(dir) === undefined) { var dir = STR_PAD_RIGHT; }

        if (len + 1 >= str.length) {

            switch (dir){

                case STR_PAD_LEFT:
                    str = Array(len + 1 - str.length).join(pad) + str;
                break;

                case STR_PAD_BOTH:
                    var right = Math.ceil((padlen = len - str.length) / 2);
                    var left = padlen - right;
                    str = Array(left+1).join(pad) 
                        + str
                        + Array(right+1).join(pad);
                break;

                default:
                    str = str + Array(len + 1 - str.length).join(pad);
                break;

            } // switch

        }

        return str;
    }

    /*
    // TODO: style on start
    var style = localStorage.getItem('style');
    if (style) {
        setStyle(style);
    } else {
        setStyle('terminal');
    }*/

    /*
     * Colors: 
     *        Macintosh Terminal (default): 
     *                Text: '#28FE14'
     *                Background: 'black'
     *                Prompt: '/var/root$ ' (space at end intentional)
     *                LinkColor: 'white'
     *                Cursor: '▋'
     */

    function setStyle(style) {
        var isDefault = style == "terminal";
        var newStyleDict = defaultStyle();
        if (style == "terminal") {
            //Nothing needed here
        } else if (style == "msdos") {
            newStyleDict.textColor =       'white';
            newStyleDict.backgroundColor = 'black';
            newStyleDict.linkColor =       'blue';
            newStyleDict.prompt =          'C:\\>';
            newStyleDict.cursor =          '͟';
            newStyleDict.sidebarBG =       'white';
            newStyleDict.sidebarTextColor ='black';
        } else if (style == "dark") {
            newStyleDict.textColor =       '#E6DB74';
            newStyleDict.backgroundColor = '#1A131F';
            newStyleDict.linkColor =       '#FF99C6';
            newStyleDict.prompt =          '$ ';
            newStyleDict.sidebarBG =       '#1A131F';
            newStyleDict.sidebarTextColor ='#A781FF';
        } else if (style == "hotdog") {
            newStyleDict.textColor =       '#EBFF00';
            newStyleDict.backgroundColor = '#FF0000';
            newStyleDict.linkColor =       'white';
            newStyleDict.prompt =          'C:\\>';
            newStyleDict.cursor =          '͟';
            newStyleDict.fontSize =        '18px';
            newStyleDict.sidebarBG =       '#EBFF00';
            newStyleDict.sidebarTextColor ='#FF0000';
        } else {
            return 'Unknown style ' + style;
        }
        styleDict = newStyleDict;

        localStorage.setItem('style', style);

        document.getElementById("cmdList").style.backgroundColor =
            styleDict.sidebarBG;
        document.getElementById("cmdList").style.color =
            styleDict.sidebarTextColor;

        containerMain[0].style.backgroundColor =
            styleDict.backgroundColor;
        
        if (document.getElementsByClassName("typed-cursor").length >= 1) {

            var text = $(".title_hero");
            var i = 0; //Don't want everything changing
            //for (var i=0; i<text.length; i++) {
                $(text[i]).css("font-size", styleDict.fontSize);
                $(text[i]).css("color", styleDict.textColor);
            //}

            document.getElementsByClassName("typed-cursor")[0].style.color =
                styleDict.textColor;
            document.getElementsByClassName("typed-cursor")[0].innerHTML =
                styleDict.cursor;

            var highlighted = $(".highlighted");
            for (var i=0; i<highlighted.length; i++) {
                highlighted[i].style.backgroundColor = styleDict.textColor;
                highlighted[i].style.color = styleDict.backgroundColor;
            }
        }

        _cmdList[commands['clear']]('');

        var str = "Style changed to "+style;
        if (isDefault) { str += " (default)"; }
        str += ".";

        return str;
    }

    function setupLinks() {
        var links = {
            "fb-button": "https://www.facebook.com/benbenbobsoftware",
            "twitter-button": "http://www.twitter.com/benbenbobsoft",
            "in-button": "https://www.linkedin.com/in/benebrown",
            "email-button": "mailto:benbrown52@gmail.com",
            "gh-button" : "http://www.github.com/benbenbob1"
        };

        for (var id in links) {
            var elem = document.getElementById(id);
            if (elem !== null) {
                elem.id = id;
                elem.href = links[id];
                elem.onclick = function() {
                    sendTrackingEvent("clicked "+this.id);
                    window.open(this.href);
                }
            }
        }
    }

    function showSidebar() {
        $('#cmdList').show('slide', {direction: 'right'}, 500);
        $('#contactmenu_container').fadeIn(500, 
            function(){resizeContainerForSidebar();}
        );
    }
    function htmlImage() {
        var out = '';
        $.ajaxSetup({async: false, timeout: 5000});
        var jqxhr = $.get( 'me.txt', function( data ) {
            out = data;
        }).fail (function() { out = 'an error occurred'; });
        return out;
    }

    function displayHtml(html) {
        extra += html
        extraSize += html.length;
        textCursor += html.length;

        element.html(beginning + extra);
        updateCursor();
    }

    function commandNotFoundText(command) {
        return "-" + shortName 
            + ": " + command 
            + ": command not found";
    }

    function sendTrackingEvent(eventText) {
        if (mixpanel != null) {
            mixpanel.track(eventText);
        }
    }

    function evaluate(str) {
        sendTrackingEvent("typed_command "+str);

        var args = str.toString().split(' ');
        var cmd = args[0];
        var result = "";
        var gotCommand, theCommand;
        if (_cmdList) {
            gotCommand = -1;
            try {
                for (aCmd in commands) {
                    if (cmd === aCmd) {
                        gotCommand = commands[cmd];
                        if (gotCommand) {
                            theCommand = _cmdList[gotCommand](args);
                            if (theCommand === null) {
                                result = commandNotFoundText(cmd);
                            } else {
                                result = theCommand
                            }
                        }
                    }
                }
            } finally {
                if (gotCommand === -1) {
                    result = commandNotFoundText(cmd);
                }
            }
            
            if (result != 0) {
                return result+"\n";
            } else {
                return '';
            }
        }
    }

    /*
    TODO: fix mobile device text resizing 

    */
    var device = (
        (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i)
        .test(navigator.userAgent.toLowerCase())
    );
    var android = device && (/android/i.test(
        navigator.userAgent.toLowerCase()
    ));
    var hidden = "hidden";
    if (device) { // User is using a mobile device
        setupMobile();
    }
    try {
        // Standards:
        if (hidden in document)
            document.addEventListener("visibilitychange", onchange);
        else if ((hidden = "mozHidden") in document)
            document.addEventListener("mozvisibilitychange", onchange);
        else if ((hidden = "webkitHidden") in document)
            document.addEventListener("webkitvisibilitychange", onchange);
        else if ((hidden = "msHidden") in document)
            document.addEventListener("msvisibilitychange", onchange);
        // IE 9 and lower:
        else if ("onfocusin" in document)
            document.onfocusin = document.onfocusout = onchange;
        // All others:
        else
            window.onpageshow
            = window.onpagehide
            = window.onfocus
            = window.onblur
            = onchange;
    } catch(err) {
        console.log("Failed trying to catch unfocus event!");
    }

    function onchange (evt) {
        var v = "visible", h = "hidden",
            evtMap = {
              focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
            };

        evt = evt || window.event;
        if (evt.type in evtMap)
            document.body.className = evtMap[evt.type];
        else
            document.body.className = this[hidden] ? "hidden" : "visible";
    }

    $(window).focus(function() {
        cursor.attr('id', '');
    });

    $(window).blur(function() {
        cursor.attr('id', 'unfocused');
    });

    function resizeContainerForSidebar() {
        if ($('#cmdList').position().left > 100) {
            container.css('width',  ($('#cmdList').position().left-15)+'px');
        }
    }

    $(window).resize(function() {
        resizeContainerForSidebar();
    });

    function scrollToBottom() {
        var scrollTop = 0;
        if (!device) {
            if (!containerMain.is(':animated')) {
                scrollTop = container.height();
                containerMain.stop().animate({
                    scrollTop: scrollTop
                }, 400);
            }
        } else {
            scrollTop = deviceInputArea.offset().top-400;
            window.scrollTo(0, scrollTop);
        }
    }

    function updateCursor() {
        var amntLeft = -0.6*(extraSize-textCursor);
        var str = 'translate('+amntLeft+'em, 0px)';
        cursor.css('-webkit-transform', str);
        cursor.css('transform', str);
        cursor.css('-o-transform', str);
        cursor.css('-ms-transform', str);
        cursor.css('-moz-transform', str);
    }

    var fullParseList = null; //Pseudo-Lazy loading
    function getSuggestion(text) {
        var suggest = '';
        var len = text.length;
        var set = false;
        if (!fullParseList) { //Here's the lazy
            fullParseList = parseableCommands.concat(parseableFiles);
        }
        for (var i=0; i<fullParseList.length; i++) {
            var toFill = fullParseList[i];
            if (text === toFill.substring(0, len)) {
                if (set == true) {
                    suggest = '';
                    break;
                }
                suggest = toFill.substring(len)+" ";
                set = true;
            }
        }
        displayHtml(suggest);
    }

    $(document).unbind('keydown').bind('keydown', function (event) {
        var doPrevent = false;
        if (event.keyCode === 8 || 
            event.keyCode === 9 ||
            (event.keyCode >= 37 && event.keyCode <= 40)) {
            if (!interceptInput) return;
            event.preventDefault();
            event.stopPropagation();
        }
    });

    if (!device) {
        $(document).keypress(evaluateKeypress);
        $(document).keydown(evaluateKeydown);
    }

    function setupMobile() {
        deviceInputArea.css('width', "100%");
        deviceInputArea.css('height', "100%");
        deviceInputArea.css('backgroundColor', "white");
        deviceInputArea.css('opacity', "0.2");
        deviceInputArea.css('display', "block");
        deviceInputArea.css('top', "0");
        var firstTime = true;
        deviceInputArea.on('focus', function(event) {
            if (firstTime) {
                deviceInputArea.css('opacity', "0.0");
                deviceInputArea.css('height', "20px");
                deviceInputArea.css('top', "50%");

                deviceInputArea.on('blur', function(event) {
                    setupMobile();
                });
                deviceInputArea.unbind('keypress').bind('keypress',
                    evaluateKeypress);
                deviceInputArea.unbind('keydown').bind('keydown',
                    evaluateKeydown);
                
                firstTime = false;
            }
        });
    }

    function evaluateKeypress(event) {
        if (!interceptInput) return;

        if (finishedTyping) {
            var key = event.keyCode;
            if (key <= 0) { key = event.charCode; }
            var typedStr = String.fromCharCode(key);
            if (key == 8 || (key >= 37 && key <= 40)) { 
                return; //backspace or arrow keys
            } else if ((event.ctrlKey && typedStr == 'C')
                || (key == 3)) { //ctrl+C
                beginning += extra+"\n"+styleDict.prompt;
                extra = '';
                extraSize = 0;
                textCursor = 0;
                command = '';
                updateCursor();
            } else if (key == 13) { //enter
                deviceInputArea.text('');
                command = extra.trim();
                beginning += extra + "\n";
                if (command && command.length > 0) {
                    cmds.push(command);
                    var myEval = evaluate(command);

                    beginning += myEval + "\n";                    
                    historyCursor = cmds.length;

                    var newHeight = container.height() - styleDict.fontSize;
                    deviceInputArea.position(
                        {top: newHeight+'px', left: '-15px'}
                    );
                }
                beginning += styleDict.prompt;
                extra = '';
                extraSize = 0;
                textCursor = 0;
                updateCursor();
            } else {
                if (textCursor < extra.length) {
                    extra = [
                        extra.slice(0, textCursor),
                        typedStr,
                        extra.slice(textCursor)
                    ].join('');
                } else {
                    extra = extra + typedStr;
                }
                extraSize ++;
                textCursor ++;
            }
            var text = beginning + extra;
            
            while (beginning.indexOf("«") > -1) { // «TEXT TO HIGHLIGHT»
                var first = text.indexOf("«");
                var second = text.indexOf("»");
                var full = text.substring(first, second+1);
                var inside = full.substring(1, full.length-1);
                var replacement = "<span class='highlighted' style='color: "
                    + styleDict.backgroundColor
                    + "; background-color: "+styleDict.textColor
                    + ";'>"+inside+"</span>";
                text = text.replace(full, replacement);
                beginning = text;
                extra = '';
            }
            while (beginning.indexOf("‘") > -1) { // ‘TEXT TO CENTER’
                var first = text.indexOf("‘");
                var second = text.indexOf("’");
                var full = text.substring(first, second+1);
                var inside = full.substring(1, full.length-1);
                //var replacement = "<div class='centered'>"+inside+"</div>";    
                // |_ this MUST be a span element
                // or it will separate existing span
                //and cause a text resizing bug
                //var replacement = 
                //  "<div style='text-align: center;'>"+inside+"</div>";
                var replacement = "\t\t"+inside;
                text = text.replace(full, replacement);
                beginning = text;
                extra = '';
            }
            element.html(text);
            scrollToBottom();
            
            if (!showingSocial && historyCursor > 1) {
                showingSocial = true;
                setTimeout(function(){
                    showSidebar();
                }, 3000);
            }
        }
    }

    function evaluateKeydown(event) {
        if (!interceptInput) return;

        var keyCode = event.keyCode;
        //console.log("Keydown", event);
        if (finishedTyping) {
            if (keyCode != 9) {
                tabPressed = false;
            }
            var typedStr = String.fromCharCode(keyCode);
            if (keyCode == 8) {                 //backspace
                if (extraSize > 0 && textCursor > 0) {
                    if (textCursor < extra.length) {
                        extra = [
                            extra.slice(0, textCursor-1),
                            extra.slice(textCursor)
                        ].join('');
                    } else {
                        extra = extra.substring(0, extra.length-1);
                    }
                    var text = beginning + extra;
                    element.html(text);
                    extraSize --;
                    textCursor --;
                }
            } else if (event.keyCode == 9) {    //tab
                var splitArr = extra.split(" ");
                getSuggestion(splitArr[splitArr.length-1]);
            } else if ((keyCode == 38 || keyCode == 40) && cmds.length > 0) {
                if (keyCode == 38) {            //up arrow
                    if (historyCursor == cmds.length) {
                        localStorage.last = extra;
                    }
                    historyCursor --;
                } else if (keyCode == 40) {     //dn arrow
                    historyCursor ++;
                }
                if (historyCursor < 0) { historyCursor = 0; }
                if (historyCursor >= cmds.length) { 
                    historyCursor = cmds.length;
                    extra = localStorage.last;
                } else {
                    extra = cmds[historyCursor];
                }
                extraSize = extra.length;
                textCursor = extraSize;
                element.html(beginning+extra);
                updateCursor();
            } else if (keyCode == 37 || keyCode == 39) {
                 if (keyCode == 37) {           //left arrow
                     if (textCursor > 0) { textCursor --; }
                } else if (keyCode == 39) {     //right arrow
                    if (textCursor < extra.length) { textCursor ++; }
                }
                updateCursor();
            }// else {
                //if (android) { return $(document).keypress(event); }
                //else { return; }
            //}
            if (device) {
                if (keyCode == 32) {        //spacebar, doesn't work on mobile
                    event.stopPropagation();
                    event.preventDefault();
                    displayHtml(" ");
                }
                var newTop = container.offset().top
                            + container.height()
                            - deviceInputArea.innerHeight();
                deviceInputArea.css('top', newTop);
            }
            scrollToBottom();
        }
    }
});
