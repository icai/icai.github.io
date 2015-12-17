//html代码转换javascript代码
function javascript() {
        document.getElementById("textarea_result").value = "document.writeln(\"" +
            document.getElementById("textarea_content").value
            .replace(/\\/g, "\\\\").replace(/\\/g, "\\/")
            .replace(/\'/g, "\\\'").replace(/\"/g, "\\\"")
            .split('\n').join("\");\ndocument.writeln(\"") + "\");";
}
    //html代码转换asp代码
function asp() {
        var input = document.getElementById("textarea_content").value;
        if (input == "") {
            document.getElementById("textarea_result").value = "<%\n%>";
        } else {
            document.getElementById("textarea_result").value = "<\%\nResponse.Write \"" + input
                .replace(/\\/g, "\\\\").replace(/\\/g, "\\/")
                .replace(/\'/g, "\\\'").replace(/\"/g, "\\\"")
                .split('\n').join("\"\nResponse.Write \"") + "\"\n%>";

        }
    }
    //html代码转换php代码
function php() {
        var input = document.getElementById("textarea_content").value;
        if (input == "") {
            document.getElementById("textarea_result").value = "<\?php\n?>";
        } else {

            document.getElementById("textarea_result").value = "<\?php\necho \"" + input
                .replace(/\\/g, "\\\\").replace(/\\/g, "\\/")
                .replace(/\'/g, "\\\'").replace(/\"/g, "\\\"")
                .split('\n').join("\\n\";\necho \"") + "\\n\";\n?>";

        }
    }
    //html代码转换Jsp代码
function jsp() {
        var input = document.getElementById("textarea_content").value;
        if (input == "") {
            document.getElementById("textarea_result").value = "<%\n%>";
        } else {

            document.getElementById("textarea_result").value = "<\%\nout.println(\"" + input
                .replace(/\\/g, "\\\\").replace(/\\/g, "\\/")
                .replace(/\'/g, "\\\'").replace(/\"/g, "\\\"")
                .split('\n').join("\");\nout.println(\"") + "\");\n%>";
        }
    }
    //html代码转换Perl代码
function perl() {
        var input = document.getElementById("textarea_content").value;
        if (input == "") {
            document.getElementById("textarea_result").value = "print \"\"";
        } else {
            document.getElementById("textarea_result").value = "print \"" + input
                .replace(/\\/g, "\\\\").replace(/\\/g, "\\/")
                .replace(/\'/g, "\\\'").replace(/\"/g, "\\\"")
                .split('\n').join("\\n\";\nprint \"") + "\\n\";";
        }
    }
    //html代码转换vbnet代码
function vbnet() {
        var input = document.getElementById("textarea_content").value;
        if (input == "") {
            document.getElementById("textarea_result").value = "<%\n%>";
        } else {

            document.getElementById("textarea_result").value = "<\%\nResponse.Write (\"" + input
                .replace(/\\/g, "\\\\").replace(/\\/g, "\\/")
                .replace(/\'/g, "\\\'").replace(/\"/g, "\\\"")
                .split('\n').join("\");\nResponse.Write (\"") + "\");\n%>";
        }
    }
    //html代码转换Sws代码
function sws() {
    var input = document.getElementById("textarea_content").value;
    if (input == "") {
        document.getElementById("textarea_result").value = "STRING \"\"";
    } else {
        document.getElementById("textarea_result").value = "STRING \"" + input
            .replace(/\\/g, "\\\\").replace(/\\/g, "\\/")
            .replace(/\'/g, "\\\'").replace(/\"/g, "\\\"")
            .split('\n').join("\"\nSTRING \"") + "\"";
    }
}
