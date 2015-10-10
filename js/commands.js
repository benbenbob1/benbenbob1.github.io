$(function() {
	var _cmdList = {
		function catCommand(args) {
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
		}
		function showResume() {
			window.open("https://www.dropbox.com/s/3i0e8vu47lj7ehk/Ben%20Brown%20-%20Resume.pdf?dl=0");
			return "Opening resume...";
		}
		function contactCommand(args) {
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
		}
		function aboutCommand(args) {
			return "\n‘« About Me »’\nHello. My name is Ben Brown.\nI am a freelance mobile app developer as well\nas a web frontend and backend designer.\n\nI am looking for a Summer 2016 internship!";
		}
		function clearCommand(args) {
			beginning = '';
			extra = '';
			extraSize = 0;
			return 'Screen cleared.';
		}
		/*function colorCommand(args) {
			if (args.length != 2 || args[1] == '' || args[1].length != 2) {
				return 'usage: color <background><foreground>\n\twhere each color is a hex digit:\n\t\t0 = Black\n\t\t1 = Blue\n\t\t9 = Light Blue\n\t\t2 = Green\n\t\tA = Light Green\n\t\t3 = Aqua\n\t\tB = Light Aqua\n\t\t4 = Red\n\t\tC = Light Red\n\t\t5 = Purple\n\t\tD = Light Purple\n\t\t6 = Yellow\n\t\tE = Light Yellow\n\t\t7 = White\n\t\tF = Bright White';
			}
			var colors = args[1].split("");
			var c1 = colors[0];
			var c2 = colors[1];
			
		}*/
		function historyCommand(args) {
			var allHistory = "";
			for (var i=0; i<cmds.length; i++) {
				var numStr = ""+(i+1);
				numStr = pad(numStr, 7, ' ', 0);
				var shouldNewline = (i == cmds.length-1 ? "":"\n");
				allHistory = allHistory + numStr + cmds[i] + shouldNewline;
			}
			return allHistory;
		}
		function styleCommand(args) {
			if (args.length != 2 || args[1] == '') {
				return 'usage: style colorscheme\n\twhere colorscheme is one of:\n\t\tterminal\n\t\tmsdos';
			}
			var result = setStyle(args[1]);
			clearCommand('');
			return result;
		}
		function stuffCommand(args) {
			return "\n‘« Stuff »’\nSome things I've done:\n • Created a Bluetooth audio receiver using a Raspberry Pi, C, and a few shell scripts\n • Created a webserver and associated iPhone app to control the led light strips in my room using a custom circuit, said Raspberry Pi, C, and Objective-C\n • Wrote a program that takes the music I'm listening to and makes the lights respond to the music using C\n • Wrote this website in JavaScript :)";
		}
		function skillsCommand(args) {
			return "\n‘« My Skills »’\nWhat I can do:\n\tC\t\t[«          »]\n\tC++\t\t[«        »  ]\n\tObjective-C\t[«          »]\n\tSwift\t\t[«       »   ]\n\tJava\t\t[«        »  ]\n\tHTML5\t\t[«      »    ]\n\tJavaScript\t[«         » ]\n\tjQuery\t\t[«        »  ]\n\tPHP\t\t[«     »     ]\n\tPython\t\t[«       »   ]\n\nWhat I cannot do:\n\tRaise one eyebrow\n\tBake a rhubarb pie\n\tPerform an exorcism";
		}
		function skillzCommand(args) {
			return "\n‘« Ma $killz »’\nWhat I can programmerate:\n\tCizzle\t\t[«          »]\n\tCizzle++\t[«        »  ]\n\tObjectin-Cizzle\t[«          »]\n\t$wift\t\t[«       »   ]\n\tMakin a brew\t[«        »  ]\n\tHTMLFam\t\t[«      »    ]\n\tJavaScrizzle\t[«         » ]\n\tjQuerian\t[«        »  ]\n\tHIP\t\t[«     »     ]\n\tDa snake\t[«       »   ]\n\nNah:\n\tBrow liftin\n\tPie bakin\n\tExorcisin'";
		}
	};
})();