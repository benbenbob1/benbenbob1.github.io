$(function() {
		var siteName = "benbrown.science";
		var shortName = "bbs";
		var version = 0.83;

		var textColor, backgroundColor, linkColor, prompt, cursor, fontSize;

		var extra = '';
		var beginning = '';
		var extraSize = 0;
		var command = '';
		var cmds = [];

		var STR_PAD_LEFT = -1;
		var STR_PAD_RIGHT = 1;
		var STR_PAD_BOTH = 0;

		var _cmdList = {
			aboutCommand: function(args) {
				return "\n‘« About Me »’\nHello. My name is Ben Brown.\nI am a freelance mobile app developer as well\nas a web frontend and backend designer.\n\nI am looking for a Summer 2016 internship!";
			},
			catCommand: function(args) {
				if (args.length < 2 || args[1] == ' ' || args[1] == '') {
					return 'usage: cat file1\n\tprints the contents of <u>file1</u>.';
				} 
				if (args[1] == 'index.html' || args[1] == '.' || args[1] == '/' || args[1] == 'index') {
					return 'why don\'t you just view the source?';
				}
				var out = '';
				$.ajaxSetup({async: false, timeout: 5000});
				var jqxhr = $.get( args[1], function( data ) {
					out = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
				}).fail (function() { out = 'read failed'; });
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
				if (args[1] === "-f") { 
					result = 'Opening facebook...'; 
					$('#fb-button').click();
				} else if (args[1] === "-t") {
					result = 'Opening twitter...';
					$('#twitter-button').click();
				} else if (args[1] === "-r") {
					result = showResume();
				} else if (args[1] === "-l") {
					result = 'Opening LinkedIn...';
					$('#in-button').click();
				} else if (args[1] === "-g") {
					result = 'Opening GitHub...';
					$('#gh-button').click();
				} else if (args[1] === "-e") {
					result = 'Opening email client...';
					$('#email-button').click();
				} else {
					result = 'usage: contact -ftlger\n\tfind me on:\n\t\t-f Facebook\n\t\t-t Twitter\n\t\t-l LinkedIn\n\t\t-g GitHub\n\t\t-e Email\n\t-r View my resume';
				}
				return result;
			},
			/*function colorCommand(args) {
				if (args.length != 2 || args[1] == '' || args[1].length != 2) {
					return 'usage: color <background><foreground>\n\twhere each color is a hex digit:\n\t\t0 = Black\n\t\t1 = Blue\n\t\t9 = Light Blue\n\t\t2 = Green\n\t\tA = Light Green\n\t\t3 = Aqua\n\t\tB = Light Aqua\n\t\t4 = Red\n\t\tC = Light Red\n\t\t5 = Purple\n\t\tD = Light Purple\n\t\t6 = Yellow\n\t\tE = Light Yellow\n\t\t7 = White\n\t\tF = Bright White';
				}
				var colors = args[1].split("");
				var c1 = colors[0];
				var c2 = colors[1];
				
			}*/
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
				return "\nabout: all about me, Ben Brown!\nskills: what can I do for you?\nstuff: some things I've done\ncontact: how to find me\n\nSome commands:\n\techo\tcat\tls\n\thistory\nMore commands to come!";
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
				return '/\tme.txt\tindex.html\ntyped.js\tjquery.cookie.js';
			},

			//TODO: fix me
			meCommand: function(args) {
				return "\n‘"+htmlImage()+"’";
			},
			resumeCommand: function(args) {
				window.open("https://www.dropbox.com/s/3i0e8vu47lj7ehk/Ben%20Brown%20-%20Resume.pdf?dl=0");
				return "Opening resume...";
			},
			styleCommand: function(args) {
				if (args.length != 2 || args[1] == '') {
					return 'usage: style colorscheme\n\twhere colorscheme is one of:\n\t\tterminal\n\t\tmsdos';
				}
				var result = setStyle(args[1]);
				clearCommand('');
				return result;
			}, 
			stuffCommand: function(args) {
				return "\n‘« Stuff »’\nSome things I've done:\n • Created a Bluetooth audio receiver using a Raspberry Pi, C, and a few shell scripts\n • Created a webserver and associated iPhone app to control the led light strips in my room using a custom circuit, said Raspberry Pi, C, and Objective-C\n • Wrote a program that takes the music I'm listening to and makes the lights respond to the music using C\n • Wrote this website in JavaScript :)";
			}, 
			skillsCommand: function(args) {
				return "\n‘« My Skills »’\nWhat I can do:\n\tC\t\t[«          »]\n\tC++\t\t[«        »  ]\n\tObjective-C\t[«          »]\n\tSwift\t\t[«       »   ]\n\tJava\t\t[«        »  ]\n\tHTML5\t\t[«      »    ]\n\tJavaScript\t[«         » ]\n\tjQuery\t\t[«        »  ]\n\tPHP\t\t[«     »     ]\n\tPython\t\t[«       »   ]\n\nWhat I cannot do:\n\tRaise one eyebrow\n\tBake a rhubarb pie\n\tPerform an exorcism";
			},
			skillzCommand: function(args) {
				return "\n‘« Ma $killz »’\nWhat I can programmerate:\n\tCizzle\t\t[«          »]\n\tCizzle++\t[«        »  ]\n\tObjectin-Cizzle\t[«          »]\n\t$wift\t\t[«       »   ]\n\tMakin a brew\t[«        »  ]\n\tHTMLFam\t\t[«      »    ]\n\tJavaScrizzle\t[«         » ]\n\tjQuerian\t[«        »  ]\n\tHIP\t\t[«     »     ]\n\tDa snake\t[«       »   ]\n\nNah:\n\tBrow liftin\n\tPie bakin\n\tExorcisin'";
			},
			testCommand: function(args) {
				return "success!";
			}
		};

		var commands = {
			'test'		: 'testCommand' 	,
			'echo'		: 'echoCommand' 	,
			'ls'	  	: 'lsCommand'  		,
			'help'		: 'helpCommand' 	,
			'hello'  	: 'helloCommand' 	,
			'contact'	: 'contactCommand' 	,
			'clear'  	: 'clearCommand' 	,
			'stuff'  	: 'stuffCommand' 	,
			'skills' 	: 'skillsCommand' 	,
			'skillz'	: 'skillzCommand' 	,
			/*'style'  	: 'styleCommand' 	,*/
			'resume' 	: 'resumeCommand'  	,
			'cat'		: 'catCommand' 		,
			'history' 	: 'historyCommand' 	,
			'about' 	: 'aboutCommand' 	,
			'me'		: 'meCommand' 		,
		};

		function pad(str, len, pad, dir) {
		    if (typeof(len) == "undefined") { var len = 0; }
		    if (typeof(pad) == "undefined") { var pad = ' '; }
		    if (typeof(dir) == "undefined") { var dir = STR_PAD_RIGHT; }

		    if (len + 1 >= str.length) {

		        switch (dir){

		            case STR_PAD_LEFT:
		                str = Array(len + 1 - str.length).join(pad) + str;
		            break;

		            case STR_PAD_BOTH:
		                var right = Math.ceil((padlen = len - str.length) / 2);
		                var left = padlen - right;
		                str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
		            break;

		            default:
		                str = str + Array(len + 1 - str.length).join(pad);
		            break;

		        } // switch

		    }

		    return str;

		}

		/*
		 * Colors: 
		 *		Macintosh Terminal (default): 
		 *				Text: '#28FE14'
		 *				Background: 'black'
		 *				Prompt: '/var/root$ ' (space at end intentional)
		 *				LinkColor: 'white'
		 *				Cursor: '▋'
		 *		Windows Command Prompt:
		 *		 		Text: 'white'
		 *				Background: 'black'
		 *				LinkColor: 'blue'
		 *				Prompt: '>'
		 *				Cursor: '_'
		 */

		//TO DO: colors
		function setStyle(style) {
			//if (!style || style.legth == 0) {}
			var isDefault = style == "terminal";
			if (style == "terminal") {
				textColor = '#28FE14';
				backgroundColor = 'black';
				linkColor = 'white';
				prompt = '/var/root$ ';
				cursor = '▋';
				fontSize = '16px';
			} else if (style == "msdos") {
				textColor = 'white';
				backgroundColor = 'black';
				linkColor = 'blue';
				prompt = 'C:\\>';
				cursor = '͟';
				fontSize = '16px';
			}

			document.getElementsByTagName("html")[0].style.backgroundColor = backgroundColor;
			
			if (document.getElementsByClassName("typed-cursor").length >= 1) {

				var text = $(".title_hero");
				var i = 0; //Don't want everything changing
				//for (var i=0; i<text.length; i++) {
					$(text[i]).css("font-size", fontSize);
					$(text[i]).css("color", textColor);
				//}

				document.getElementsByClassName("typed-cursor")[0].style.color = textColor;
				document.getElementsByClassName("typed-cursor")[0].innerHTML = cursor;

				var highlighted = $(".highlighted");
				for (var i=0; i<highlighted.length; i++) {
					//console.log($(highlighted[i]).css("background-color"));
					highlighted[i].style.backgroundColor = textColor;
					highlighted[i].style.color = backgroundColor;
				}

				/*var links = document.getElementsByClassName("title_hero highlighted");
				for (var i=0; i<links.length; i++) {
					console.log(links[i].children);
				}*/
			}
			var str = "Style changed to "+style;
			if (isDefault) { str += " (default)"; }
			str += ".";
			return str;
		}

		var fbLink = "https://www.facebook.com/benbenbobsoftware";
		var twitterLink = "http://www.twitter.com/benbenbobsoft";
		var liLink = "https://www.linkedin.com/profile/view?id=327054241";
		var mailLink = "mailto:benbrown52@gmail.com";
		var ghLink = "http://www.github.com/benbenbob1";
		function setupLinks() {
			document.getElementById('fb-button').onclick = function(){window.open(fbLink);};
			document.getElementById('twitter-button').onclick = function(){window.open(twitterLink);};
			document.getElementById('in-button').onclick = function(){window.open(liLink);};
			document.getElementById('email-button').onclick = function(){window.location = mailLink;};
			document.getElementById('gh-button').onclick = function(){window.open(ghLink);};
		}
		function showSidebar() {
			$('#cmdList').show('slide', {direction: 'right'}, 500);
			$('#contactmenu_container').fadeIn(500);
			setTimeout(function(){ $(window).resize(); }, 505);
		}
		function htmlImage() {
			var out = '';
			$.ajaxSetup({async: false, timeout: 5000});
			var jqxhr = $.get( 'me.txt', function( data ) {
				out = data;
			}).fail (function() { out = 'an error occurred'; });
			return out;
		}

		function displayHtml() {

		}

		function evaluate(str) {
			var elem = $(".element");
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
								console.log(theCommand);
								if (theCommand === null) {
									result = "-" + shortName + ": " + cmd + ": command not found";
								} else {
									result = theCommand
								}
							}
						}
					}
				} finally {
					console.log("gC: ", gotCommand);
					if (gotCommand === -1) {
						/*var header = "?cmd="+encodeURIComponent(str);
						result = $.ajaxSetup({async: false, timeout: 4000});
						var jqxhr = $.get( 'test.php'+header, function( data ) {
							if (!data) { result = "-bbcs: " + cmd + ": command not found"; }
							else { result = data.replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
						}).fail (function() { result = 'command failed'; });*/
						result = "-" + shortName + ": " + cmd + ": command not found";
					}
				}
				
				if (result != 0) {
					return result+"\n";
				} else {
					return '';
				}
			}
		}
		function mobileKeyboardHidden() {
			$('#mobile_helper').fadeIn('fast');
			$('#textinput').hide();
		}
		function mobileShowKeyboard() {
			$('#mobile_helper').fadeOut('fast');
			$('#textinput').show();
			$('#textinput').bind('blur', function(e){mobileKeyboardHidden();});
			$('#textinput').focus();
		}
		/*
		To-do: fix mobile device text resizing 

		*/
		var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
		var android = device && (/android/i.test(navigator.userAgent.toLowerCase()));
		var hidden = "hidden";
		if (device) { // User is using a mobile device
			mobileKeyboardHidden();
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
				window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
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
		    $('.typed-cursor').attr('id', '');
		});

		$(window).blur(function() {
		    $('.typed-cursor').attr('id', 'unfocused');
		});

		$(window).resize(function() {
			if ($('#cmdList').position().left > 100) {
		    	$('.container').css('width',  ($('#cmdList').position().left-15)+'px');
		    }
		});

		function scrollToBottom() {
			if (!device) {
				window.scrollTo(0,document.body.scrollHeight);
			} else {
				if (document.body.scrollHeight > window.innerHeight) {
					/*var elem = $(".element");
					var tinput = $('#textinput');
					//tinput.height(elem.height());
					var newHeight = (tinput.height()+30)+"px";
					tinput.css('line-height', newHeight);*/
					window.scrollTo(0, document.body.scrollHeight);
				} else {
					window.scrollTo(0, 0);
				}
			}
		}

		// set the initial state (but only if browser supports the Page Visibility API)
		if( document[hidden] !== undefined )
		onchange({type: document[hidden] ? "blur" : "focus"});

		var beenHereBefore = localStorage.getItem('visited');
		if (!beenHereBefore) {
			localStorage.setItem('visited', 'true', { expires: 10 });
		}

		//var date = 'Last login: '+date('D M j H:i:s', time());
		//$.cookie('lastdate', date, { expires: 10 });
		setStyle('terminal');
		var finishedTyping = false;
		var shifting = false;
		//var timingOrExtra = beenHereBefore?('\n'+$.cookie('lastdate')):'^1000';
		var timingOrExtra = beenHereBefore?'\nWelcome back!^500':'^1000';
		//BenBrownCS.com
		var toType = siteName+', version '+version+' initialized.'+timingOrExtra+'\n\n'+prompt;
		var historyCursor = -1;
		var textCursor = 0;
		var showingSocial = false;
		var elem = $(".element");
		setupLinks();
		$(".element").typed({
		    strings: [toType],
		    //typeSpeed: 0,
			startDelay: beenHereBefore?0:3000,
			typeSpeed: -400,
			showCursor: true,
		    cursorChar: cursor,
			contentType: 'text',
			preStringTyped: function() {
				$(".typed-cursor").css("color", "black");
				finishedTyping = false;
				},
			callback: function() {
				$(".typed-cursor").css("color", "");
				finishedTyping = true;
				beginning = $(".element").text();
				if (beenHereBefore) { showSidebar(); showingSocial = true; }
				setTimeout(function(){ $(window).resize(); }, 500);
				setTimeout(function(){
					if (!showingSocial) { showSidebar(); showingSocial = true; }
					}, 9000);
			}
		  });

		function updateCursor() {
			var cursor = $('.typed-cursor');
			var amntLeft = -0.6*(extraSize-textCursor);
			var str = 'translate('+amntLeft+'em, 0px)';
			cursor.css('-webkit-transform', str);
			cursor.css('transform', str);
			cursor.css('-o-transform', str);
			cursor.css('-ms-transform', str);
			cursor.css('-moz-transform', str);
		}

		function getSuggestion(text) {
			var suggest = '';
			var len = text.length;
			var set = false;
			for (cmd in commands) {
				if (text === cmd.substring(0, len) && commands[cmd]) {
					if (set == true) {
						suggest = '';
						break;
					}
					suggest = cmd.substring(len);
					set = true;
				}
			}
			extra += suggest
			extraSize += suggest.length;
			textCursor += suggest.length;

			elem.html(beginning + extra);
			updateCursor();
		}


		$(document).keypress(function(e) {
			if (finishedTyping) {
				var key = e.keyCode;
				if (key <= 0) { key = e.charCode; }
			var typedStr = String.fromCharCode(key);
			//if (shifting) {
			//	typedStr = typedStr.toUpperCase();
			//}
			if (key == 8 || (key >= 37 && key <= 40)) { //backspace or arrow keys
				return;
			} else if (key == 13) { //enter
				$('#textinput').text('');
				command = extra;
				beginning += extra + "\n";
				if (command.length > 0 && command.trim() != '') {
					cmds.push(command);
					var myEval = evaluate(command);

					beginning += myEval + "\n";
					
					/*if (command == "clear") {
						beginning = '';
						extra = '';
						extraSize = 0;
					}*/
					
					historyCursor = cmds.length;

					var newHeight = $($('.container')[0]).height() - fontSize;
					$('#textinput').position({top: newHeight+'px', left: '-15px'});
				}
				beginning += prompt;
				extra = '';
				extraSize = 0;
				textCursor = 0;
				updateCursor();
			} else {
				//console.log("Rec: "+typedStr+" (kc "+key+")");
				if (textCursor < extra.length) {
					extra = [extra.slice(0, textCursor), typedStr, extra.slice(textCursor)].join('');
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
				var replacement = "<span class='highlighted' style='color: "+backgroundColor+"; background-color: "+textColor+";'>"+inside+"</span>";
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
				//var replacement = "<div style='text-align: center;'>"+inside+"</div>";
				var replacement = "\t\t"+inside;
				text = text.replace(full, replacement);
				beginning = text;
				extra = '';
			}
			elem.html(text);
			scrollToBottom();
			
			if (!showingSocial && historyCursor > 1) {
				showingSocial = true;
				setTimeout(function(){
					showSidebar();
				}, 3000);
			}
		}

		$(document).unbind('keydown').bind('keydown', function (event) {
			var doPrevent = false;
			if (event.keyCode === 8 || 
				event.keyCode === 9 ||
				(event.keyCode >= 37 && event.keyCode <= 40)) {
				event.preventDefault();
			}
		});

		$(document).keydown(function(e){
			if (finishedTyping) {
				var elem = $(".element");
				var typedStr = String.fromCharCode(e.keyCode);
				if (!shifting) {
					//typedStr = typedStr.toLowerCase();
				}
				if (e.keyCode == 8) { //backspace
					if (extraSize > 0 && textCursor > 0) {
						if (textCursor < extra.length) {
							extra = [extra.slice(0, textCursor-1), extra.slice(textCursor)].join('');
						} else {
							extra = extra.substring(0, extra.length-1);
						}
						var text = beginning + extra;
						elem.html(text);
						extraSize --;
						textCursor --;
					}
				} else if (e.keyCode == 9) { //tab
					getSuggestion(extra);
				} else if (e.keyCode == 38 || e.keyCode == 40) {
					if (e.keyCode == 38) { //up arrow
						localStorage.last = extra;
						historyCursor --;
					} else if (e.keyCode == 40) { //dn arrow
						historyCursor ++;
						if (historyCursor < cmds.length) {
							
							extra =	cmds[historyCursor];
							extraSize = extra.length;
						}
					}
					if (historyCursor < 0) { historyCursor = 0; }
					if (historyCursor >= cmds.length) { 
						historyCursor = cmds.length;
						extra = localStorage.last;
						extraSize = extra.length;
					} else {
						extra =	cmds[historyCursor];
					}
					extraSize = extra.length;
					textCursor = extraSize;
					elem.html(beginning+extra);
					updateCursor();
				} else if (e.keyCode == 37 || e.keyCode == 39) {
					 if (e.keyCode == 37) { //left arrow
					 	if (textCursor > 0) { textCursor --; }
					} else if (e.keyCode == 39) { //right arrow
						if (textCursor < extra.length) { textCursor ++; }
					}
					updateCursor();
				} else {
					if (android) { return $(document).keypress(e); }
					else { return; }
				}
				scrollToBottom();
			}
		});

		$(document).on('keyup keydown', function(e){shifting = e.shiftKey} );
		});
	})