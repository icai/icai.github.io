CodeMirror.runMode = function(string, modespec, callback) {
  var mode = CodeMirror.getMode({indentUnit: 2}, modespec);
  var isNode = callback.nodeType == 1;
  if (isNode) {
    var node = callback, accum = [];
    callback = function(string, style) {
      if (string == "\n")
        accum.push("<br>");
      else if (style)
        accum.push("<span class=\"cm-" + CodeMirror.htmlEscape(style) + "\">" + CodeMirror.htmlEscape(string) + "</span>");
      else
        accum.push(CodeMirror.htmlEscape(string));
    }
  }
  var lines = CodeMirror.splitLines(string), state = CodeMirror.startState(mode);
  for (var i = 0, e = lines.length; i < e; ++i) {
    if (i) callback("\n");
    var stream = new CodeMirror.StringStream(lines[i]);
    while (!stream.eol()) {
      var style = mode.token(stream, state);
      callback(stream.current(), style);
      stream.start = stream.pos;
    }
  }
  if (isNode)
    node.innerHTML = accum.join("");
};


function doHighlight(type) {
	CodeMirror.runMode(document.getElementById("code").value, type, document.getElementById("output"));
	
	var str = document.getElementById("output").innerHTML,
		base = str
			.replace(/class="cm-/g,'style="color:#@cm-')
			.replace(/@cm-keyword/g,	'708')
			.replace(/@cm-atom/g,		'219')
			.replace(/@cm-number/g,		'164')
			.replace(/@cm-def/g,		'00f')
			.replace(/@cm-variable/g,	'000')
			.replace(/@cm-variable-2/g,	'05a')
			.replace(/@cm-variable-3/g,	'0a5')
			.replace(/@cm-property/g,	'000')
			.replace(/@cm-operator/g,	'000')
			.replace(/@cm-comment/g,	'a50')
			.replace(/@cm-string/g,		'a11')
			.replace(/@cm-string-2/g,	'f50')
			.replace(/@cm-meta/g,		'555')
			.replace(/@cm-error/g,		'f00')
			.replace(/@cm-qualifier/g,	'555')
			.replace(/@cm-builtin/g,	'30a')
			.replace(/@cm-bracket/g,	'cc7')
			.replace(/@cm-tag/g,		'170')
			.replace(/@cm-attribute/g,	'00c');
	
	var theme_default_style = 'margin:15px 0;font:100 12px/18px monaco, andale mono, courier new;padding:10px 12px;border:#ccc 1px solid;border-left-width:4px;background-color:#fefefe;box-shadow:0 0 4px #eee;word-break:break-all;word-wrap:break-word;color:#444',
		theme_default_code = base;
	
	document.getElementById("output").innerHTML = theme_default_code;
	document.getElementById("output").setAttribute('style',theme_default_style);
	document.getElementById("getcode").value = '<pre style="' + theme_default_style + '">' + theme_default_code + '</pre>';
}