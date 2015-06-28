// JavaScript Document
//将代码以JS方式加密、解密
function jsencode(obj) {
	var v = document.getElementById("content").value;
	var es = escape(v);
	return String.format("document.write(unescape('{0}'));", es);
}

function jsdecode(obj) {
	var v = document.getElementById("content").value;
	var regex = /unescape\('([a-z%0-9]*)'\)/i;
	if (v.match(regex)) {
		document.getElementById("content").value = unescape(RegExp.$1);
	}
}

//将代码以JS方式加密、解密
String.format = function () {
    if (arguments.length == 0) return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var regExp = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(regExp, arguments[i])
    }
    return str
};

function test() {
	var win = window.open();
	win.document.open();
	win.document.write(document.getElementById('content').value);
	win.document.close();
}
document.write(tools.replace('undefined',''));