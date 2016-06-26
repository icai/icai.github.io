---
layout: post
title: "start your shell tour from a question"
date: 2016-05-28 16:09:21 +0800
comments: true
statement: true
categories: shell
tags: [shell,ubuntu,linux]
keywords: shell,rename, bash, ubuntu,linux
---


Learn bash shell, by interest or needed. what is your reason to learn the shell? I think the best reason is that what you need is what you learn.


A few days ago, I rewrite the project css to sass, so  I need to rename the css. So I brought out a question, how to "Rename multiple files shell"? To people, solving problems with search engine is the method of least time. I am no exception, I encountered the same problem, and find out the answer in stackoverflow [https://stackoverflow.com/questions/6911301/rename-multiple-files-shell](https://stackoverflow.com/questions/6911301/rename-multiple-files-shell).

<!--more-->

    for file in linux_*.mp4 ; do mv "$file" "${file#linux_}" ; done

But this isnot for my question, so I need to modify this shell ,in order to suit for my situation. I also I found this solution in the comments on the question[http://pubs.opengroup.org/onlinepubs/9699919799/](http://pubs.opengroup.org/onlinepubs/9699919799/).And you may want to know about the [POSIX](https://en.wikipedia.org/wiki/POSIX).

After check the POSIX wiki, you know that. The Portable Operating System Interface (POSIX) is a family of standards specified by the IEEE Computer Society for maintaining compatibility between operating systems. POSIX defines the application programming interface (API), along with command line shells and utility interfaces, for software compatibility with variants of Unix and other operating systems.


But now, we should focus on solving my question. I review the stackoverflow question and the best answer.

**Q**: I have multiple files in a directory, example: `linux_file1.mp4`, `linux_file2.mp4` and so on. How do I move these files, using shell, so that the names are `file1.mp4`, `file2.mp4` and so on. I have about 30 files that I want to move to the new name.

**A**: `for file in linux_*.mp4 ; do mv "$file" "${file#linux_}" ; done`


So I guess `${file#linux_}`  is remove `linux_` from the filename. As my guess, i am right, you can have a look at the [documentation](http://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_06_02). I suggest that you should read the [documentation](http://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html) at lest one time. And about the syntax of bash shell you can type the bash help in your terminal.

~$>help

    GNU bash，版本 4.3.11(1)-release (x86_64-pc-linux-gnu)
    这些 shell 命令是内部定义的。请输入 `help' 以获取一个列表。
    输入 `help 名称' 以得到有关函数`名称'的更多信息。
    使用 `info bash' 来获得关于 shell 的更多一般性信息。
    使用 `man -k' 或 `info' 来获取不在列表中的命令的更多信息。

    名称旁边的星号(*)表示该命令被禁用。

     job_spec [&]                            history [-c] [-d 偏移量] [n] 或 history >
     (( 表达式 ))                               if 命令; then 命令; [ elif 命令; then 命令; >
     . 文件名 [参数]                              jobs [-lnprs] [任务声明 ...] 或 jobs -x 命>
     :                                       kill [-s 信号声明 | -n 信号编号 | -信号声明] 进程号>
     [ 参数... ]                               let 参数 [参数 ...]
     [[ 表达式 ]]                               local [option] 名称[=值] ...
     alias [-p] [名称[=值] ... ]                logout [n]
     bg [任务声明 ...]                           mapfile [-n 计数] [-O 起始序号] [-s 计数] [->
     bind [-lpsvPSVX] [-m keymap] [-f file>  popd [-n] [+N | -N]
     break [n]                               printf [-v var] 格式 [参数]
     builtin [shell 内建 [参数 ...]]             pushd [-n] [+N | -N | 目录]
     caller [表达式]                            pwd [-LP]
     case 词 in [模式 [| 模式]...) 命令 ;;]... es>         read [-ers] [-a 数组] [-d 分隔符] [-i 缓冲区>
     cd [-L|[-P [-e]] [-@]] [dir]            readarray [-n 计数] [-O 起始序号] [-s 计数] >
     command [-pVv] 命令 [参数 ...]              readonly [-aAf] [名称[=值] ...] 或 reado>
     compgen [-abcdefgjksuv] [-o 选项]  [-A >    return [n]
     complete [-abcdefgjksuv] [-pr] [-DE] >  select NAME [in 词语 ... ;] do 命令; don>
     compopt [-o|+o 选项] [-DE] [名称 ...]       set [--abefhkmnptuvxBCHP] [-o 选项名] [>
     continue [n]                            shift [n]
     coproc [名称] 命令 [重定向]                    shopt [-pqsu] [-o] [选项名 ...]
     declare [-aAfFgilnrtux] [-p] [name[=v>  source 文件名 [参数]
     dirs [-clpv] [+N] [-N]                  suspend [-f]
     disown [-h] [-ar] [任务声明 ...]            test [表达式]
     echo [-neE] [参数 ...]                    time [-p] 管道
     enable [-a] [-dnps] [-f 文件名] [名称 ...]>       times
     eval [参数 ...]                           trap [-lp] [[参数] 信号声明 ...]
     exec [-cl] [-a 名称] [命令 [参数 ...]] [重定向>        true
     exit [n]                                type [-afptP] 名称 [名称 ...]
     export [-fn] [名称[=值] ...] 或 export -p>      typeset [-aAfFgilrtux] [-p] 名称[=值] .>
     false                                   ulimit [-SHabcdefilmnpqrstuvxT] [lim>
     fc [-e 编辑器名] [-lnr] [起始] [终结] 或 fc -s>          umask [-p] [-S] [模式]
     fg [任务声明]                               unalias [-a] 名称 [名称 ...]
     for 名称 [in 词语 ... ] ; do 命令; done        unset [-f] [-v] [-n] [name ...]
     for (( 表达式1; 表达式2; 表达式3 )); do 命令; do>           until 命令; do 命令; done
     function 名称 { 命令 ; } 或 name () { 命令 ;>       variables - 一些 shell 变量的名称和含义
     getopts 选项字符串 名称 [参数]                   wait [-n] [id ...]
     hash [-lr] [-p 路径名] [-dt] [名称 ...]       while 命令; do 命令; done
     help [-dms] [模式 ...]                    { 命令 ; }

Now, I brought out my question :

**Q**: Rename the css suffix all current directory file `.css` to `.scss` and underscore the file prefix.


**A**: `for file in *.css ; do mv "$file" "_${file%.css}.scss" ; done`



About the syntax, you can have a look at the chapter `2.6.2 Parameter Expansion`.

...

${parameter%[word]}

**Remove Smallest Suffix Pattern**. The word shall be expanded to produce a pattern. The parameter expansion shall then result in parameter, with the smallest portion of the suffix matched by the pattern deleted. If present, word shall not begin with an unquoted '%'.

${parameter%%[word]}

**Remove Largest Suffix Pattern**. The word shall be expanded to produce a pattern. The parameter expansion shall then result in parameter, with the largest portion of the suffix matched by the pattern deleted.

${parameter#[word]}

**Remove Smallest Prefix Pattern**. The word shall be expanded to produce a pattern. The parameter expansion shall then result in parameter, with the smallest portion of the prefix matched by the pattern deleted. If present, word shall not begin with an unquoted '#'.

${parameter##[word]}

**Remove Largest Prefix Pattern**. The word shall be expanded to produce a pattern. The parameter expansion shall then result in parameter, with the largest portion of the prefix matched by the pattern deleted.

...

My question has been solved.


Good luck to you.



