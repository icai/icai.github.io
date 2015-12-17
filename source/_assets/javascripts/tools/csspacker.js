// JavaScript Document
/*Css压缩/格式化*/
var CSSPacker = {
    format: function (s) {//格式化代码
        s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
        s = s.replace(/;\s*;/g, ";"); 
        s = s.replace(/\,[\s\.\#\d]*{/g, "{");
        s = s.replace(/([^\s])\{([^\s])/g, "$1 {\n\t$2");
        s = s.replace(/([^\s])\}([^\n]*)/g, "$1\n}\n$2");
        s = s.replace(/([^\s]);([^\s\}])/g, "$1;\n\t$2");
        return s;
    },
    pack: function (s) {//高级
        s = s.replace(/\/\*(.|\n)*?\*\//g, ""); 
        s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
        s = s.replace(/\,[\s\.\#\d]*\{/g, "{"); 
        s = s.replace(/;\s*;/g, ";");
        s = s.replace(/;\s*}/g, "}"); 
        s = s.match(/^\s*(\S+(\s+\S+)*)\s*$/);
        return (s == null) ? "" : s[1];
    },
    packNor: function (s) {//普通
        s = s.replace(/\/\*(.|\n)*?\*\//g, ""); 
        s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
        s = s.replace(/\,[\s\.\#\d]*\{/g, "{");
        s = s.replace(/;\s*;/g, ";"); 
        s = s.replace(/;\s*}/g, "}"); 
        s = s.replace(/([^\s])\{([^\s])/g, "$1{$2");
        s = s.replace(/([^\s])\}([^\n]s*)/g, "$1}\n$2");
        return s;
    }
}

function CSS(s) {
    document.getElementById('packer').value = CSSPacker[s](document.getElementById('code').value)
}

