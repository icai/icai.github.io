---
layout: post
title: "模糊匹配查询正则表达式探究"
date: 2015-07-15 22:09:43 +0800
comments: true
categories: javascript
tags: [fuzzy,search,ux,regex,lazy]
statement: true
translate: true
originaltitle: "Fuzzy Scoring Regex Mayhem"
originalurl: http://james.padolsey.com/javascript/fuzzy-scoring-regex-mayhem/
keywords: 模糊匹配, autocompletion, 正则表达式, 用户体验优化，智能排序

---

Autocompletion is never an entirely solved problem. Can anyone really say what on earth a user typing "uni" into a country input field actually intends to select? It could match any of these:

自动完成一直都是一个没完没了的问题。谁能准确地说出当一个地球人在一个国家输入框输入“uni”打算选什么？可能会出现以下情况：

* Tanzania, [**U**][**n**][**i**]ted Republic of
* [**U**][**n**][**i**]ted Arab Emirates
* [**U**][**n**][**i**]ted Kingdom
* [**U**][**n**][**i**]ted States
* T[**u**][**n**][**i**]sia

Of course, it’s probably not the last one, but that right there is a human intuition that we often forget to instil into these UI interactions.

当然，这可能不是最后一个，但人类的直觉通常会忘记灌输这些UI交互。

<!-- more -->

We can divine what the user *probably* intends most of the time but it'll always be a game of heuristics. Most solutions shy away from this game, opting instead to match the query letter-for-letter in each potential value, and this is usually sufficient, but without any other logic not only will “la” match “Latvia” but also “Angola”. And usually “Ltvia” will match nothing whatsoever, even though it’s seemingly obvious what the user is trying to type.

我们可以推断用户在这上面花费的时间，显然这是一个启发式游戏。大多数解决方案都是尝试匹配字母之间可能潜在的值，通常已经足够了，“la” 没有任何逻辑，会匹配 “Latvia” 也会匹配 “Angola”。但绝不会匹配 “Ltvia”，尽管“Ltvia”看似是用户想要的输入类型。

If you try implementing a fuzzy matcher to solve this, the first revelation is that you can't just boolean-match the query against the data like so many solutions do. You need to score each potential match. Hopefully, in the case of country selection, you end up with a sensible subset of countries that match the query to some reasonable degree. This scoring is necessary so that you know what you're putting at the top of the list. When typing "U", the user expects Ukraine or Uzbekistan sooner than Mauritius or Sudan, for example.

假如你想用模糊匹配去解决这个问题。首先，你不能像往常那样用boolean匹配去请求查询数据。你需要计算每个存在匹配的分数。 在选择国家情况下，你最终需要请求匹配查询一些合符逻辑的合理的国家子集。那么这分数是非常有必要的，以便我们可以把它们排到列表的顶部。

（译注, boolean匹配 <https://github.com/bevacqua/fuzzysearch>）

Oddly, if you looked at the most common autocompletion widget out there (jQuery UI), it [doesn't appear](http://jsfiddle.net/2c11xknm/embedded/result,js,html) to follow this intuition.

奇怪的是，假如见过最常用的jQuery UI 自动完成（autocompletion）插件，他并没有解决这个问题。

Even the most [graceful](http://baymard.com/labs/country-selector) solutions tend to avoid the muddiness of dealing with mistakes like “untied states” or “leichtenstein”. Sure, the likeliness of a person having to type the name of a country they aren’t intimately familiar with is probably quite low, but people still make mistakes.

即使是最优雅的解决方案，都趋向于忽视模糊处理错误，像“untied states” （united states） 和 “leichtenstein” （liechtenstein ）。当然， 就像一个人输入一个国家的名字，他们不熟悉这个国家可能性是非常很低。但人们仍然会犯错误。

I've been intrigued by this topic for quite a while and it's why I originally made [relevancy.js](https://github.com/padolsey/relevancy.js). It solves the problem quite well, I think, and it does so in a pretty transparent way, with scores applied for various qualities such as the index of the query within the target string ("king" scores higher than "dom" in "kingdom", for example), but it's still a quite a lot of code for such a tiny part of an overall user experience.

我一直被这个话题吸引了很长时间，也是我写 [relevancy.js](https://github.com/padolsey/relevancy.js) 的原因。它可以很好地处理类似问题，我想，他的原理是非常显而易见的，就是通过分数去区分不同品质（把分数应用于品质）例如，目标字符串查询的索引(正如在查询“kingdom” "的时候，king"的分数比 "dom"高)。但这还是需要相当多的代码去实现这小部分，相对于这样一个整体用户体验的而言。

I have once again been playing with this problem (thanks to a certain [tweet](https://twitter.com/codepo8/status/572863924887945216)) and have so wanted to come up with something stupefyingly graceful.

我又再一次遇上了这个问题（谢谢 [tweet](https://twitter.com/codepo8/status/572863924887945216) 的肯定），我想可以写的更加优雅。

It all starts with a scratch in back of your mind — the one that tells you that your time has come. The [world requires you](http://xkcd.com/208/) to use regular expressions.

一切从头开始在你的脑海里，这告诉你的时间到了。[world requires you](http://xkcd.com/208/) （世界需要你） 用正则表达式。

**Warning:** I don’t sincerely recommend doing any of this. It’s just a bit of fun. It’s probably an inefficient, unreliable, obscure and ultimately foolish endeavour!

Warning： 别分心，不然效率极低的，bebebe～～～

## Let’s begin!

##我们入正题： 

A static France might look like this:

静态字符串France 正则：

    /^France$/

A more lenient France might be less sensitive to its case:

不区分大小写：

    /^france$/i

We could then allow the characters to be optional too:

我们也可以允许字符是可选的

    /^f?r?a?n?c?e?$/i

This would match “f” and “franc” and “FaE”, etc.

这会匹配 “f”， “franc” 和 “FaE”等等。

But… users make even more grievous mistakes sometimes, and our regular expression should be able to handle those. So let’s add a single character of leniency between each legitimate character, and at the beginning and end of the string:

但…… 用户有时犯更严重的错误，我们的正常表达应该能够处理这些错误。因此，让我们在每一个合理的字母之间加上一个宽容的字符在每个字符的前后。

    /^.?f?.?r?.?a?.?n?.?c?.?e?.?$/i

But then this would allow contiguous mistakes like “fafafafa”. We only want to allow a *single* incorrect mistake after each successfully entered character. For this we can use groups to force each character to be matched and a lazy quantifier on the mistake character to ensure that legitimate characters get to successfully match.

但当这允许连续错误像“fafafafa”，我们只允许一个单一的错误在每个正确输入字符之后。为此我们可以使用分组强制每个字符匹配和懒惰匹配的错误的字符串，确保合法字符可以成功匹配。

So:

    /f.?otherStuff/

Becomes:

    /(?:f.??)?otherStuff/

In English: Try to match `f` followed by `otherStuff`. If impossible then try to match any character after `f` but before `otherStuff`. (This is why lazy quantifiers (e.g. `??`) are so useful!)

就是说，尝试匹配跟在otherStuff之前的f。如果不可能的话，尝试匹配任何在“f” 之后，在“otherStuff” 之前的字符。

The entire regex would become:

完整的正则表达式会变成：

    /^(?:.(?=f))?(?:f.??)?(?:r.??)?(?:a.??)?(?:n.??)?(?:c.??)?(?:e.??)?$/i

We should probably capture each individual match (`f` should be `(f)`) so that we can analyze the result and score it appropriately.

我们可能需要捕获每个单独的匹配(`f` 应该是`(f)`) ，以便我们可以分析结果并适当地评分。

    var r = /^(?:(f).??)?(?:(r).??)?(?:(a).??)?(?:(n).??)?(?:(c).??)?(?:(e).??)?$/i
    
    'f$R-aN_cEx'.match(r);
    // => ["f$R-aN_cEx", "f", "R", "a", "N", "c", "E"]

The regular expression, broken down:

正则表达式解释：

    /
      ^       # Start of string
    
      (?:     # Non-captured group（非捕获）
        (f)   # Match and capture 'f' （匹配并捕获"f"）
        .??   # Followed lazily by any character （懒惰匹配跟随字符）
      )?      # Entire group is optional （组可选）
    
      (?:     # Non-captured group
        (r)   # Match and capture 'f'
        .??   # Followed lazily by any character
      )?      # Entire group is optional
    
      ...     # Etc.
    
      $       # End of string
    /i

*A quick note*: *lazy* or *lazily* in the context of regular expressions simply means that that thing will be intentionally excluded from the first match attempt and will only be used if the subsequent regular expression is unsuccessful without it.

小便签：正则表达式中懒惰匹配是指……

One caveat with the above regex is that it doesn’t allow a mistake to be at the beginning of the string. We could fix this with a lookahead to the effect of “allow a mistake here as long as its followed by a non-mistake” but since “non-mistake” could effectively be any character in the legitimate string it’s easier to just make allowances for that initial mistake in each group. Additionally, we probably want to capture every single mistake, in addition to legitimate characters. Here’s our next iteration:

一个需要注意的是，上面的正则表达式，它不允许在字符串的开头有错误。我们可以修复这个前瞻错误通过 “允许犯错误，只要它跟在一个非错误后面”， 但由于 “非错误” 可以有效地在合法字符串中的任何字符，使得它更容易在每个组中出现所允许的初始错误。此外，除了合法的字符，我们还可能要捕捉每一个错误。下面是我们的实现：

    /
      ^         # Start of string
    
      (?:       # Non-captured group
    
        (^.)?   # Captured optional mistake at the beginning of the string
                # ===============================================
    
        (f)     # Match and capture 'f'
        (.??)   # Followed lazily by any character (captured)
      )?        # Entire group is optional
    
      ...     # Etc.
    
      $       # End of string
    /i

The check `(^.)?` has to be specified in each group, to account for mistakes that don’t involve “f”, like “krance” or “ttance”, etc.

检查`(^.)?`必须每组都指定, 以便考虑错误不涉及到 “f”, 就像 “krance” 和 “ttance”, 等等。

Since we’re aiming to genericize this entire mess, we should create a generator that assembles the regular expression given any piece of text:

我们的目标是是要去处理这一类问题，所以我们需要构建一个完整的生成器去组装将给定的文本集合的正则表达式。

    function makeFuzzyRegex(string) {
    
      if (!string) { return /^$/; }
    
      // Escape any potential special characters:
      var cleansed = string.replace(/\W/g, '\\$&');
    
      return RegExp(
        '^' +
          cleansed.replace(
            // Find every escaped and non-escaped char:
            /(\\?.)/g,
            // Replace with fuzzy character matcher:
            '(?:(^.)?($1)(.??))?'
          ) +
        '$',
        'i'
      );
    }
    
    makeFuzzyRegex('omg');
    // => /^(?:(^.)?(o)(.??))?(?:(^.)?(m)(.??))?(?:(^.)?(g)(.??))?$/i

This regex matched against ‘_o-m*g!’ produces:

    [
      // Full match:
      "_o-m*g!",
    
      // Captures:
      "_",           // Mistake
      "o",           // Legit
      "-",           // Mistake
    
      undefined,     // Void mistake
      "m",           // Legit
      "*",           // Mistake
    
      undefined,     // Void mistake
      "g",           // Legit
      "!"            // Mistake
    ]

The captures are in groups of three, with every second capture being the legitimate character (case-insensitive), and with every first and third potentially being mistakes.

捕获是在三组，每组捕获都是合法性（不区分大小写），并与每组第一和第三个字符都可能潜在错误。

We can then loop through these captures and apply weights as we see fit. 

我们可以循环这些捕捉和应用权重作为我们合适的分数。

    var fullMatch = makeFuzzyRegex('omg').exec('_o-m*g!');
    var captures = fullMatch.slice(1); // Get captures specifically
    var score = 0;
    
    for (var i = 0, l = captures.length; i < l; i += 3) {
      if (captures[i]) score -= 1;
      if (captures[i+1]) score += 10;
      if (captures[i+2]) score -= 1;
    }
    
    score; // => 26

That scoring is quite arbitrary, but we’ve at least prescribed our wish to score successes more than we punish mistakes (10 vs 1).

这计算是十分随意的，但是我们至少指定我们的愿望比我们惩罚的错误更成功(10 vs 1)。

We can start to play with the heuristics of this if we wrap it all up:

我们把它封装起来，让Ta溜溜：

    function createFuzzyScorer(text) {
    
      var matcher = makeFuzzyRegex(text);
    
      return function(query) {
        var match = matcher.exec(query);
    
        if (!match) return 0;
    
        var captures = match.slice(1);
        var score = 0;
    
        for (var i = 0, l = captures.length; i < l; i += 3) {
          if (captures[i]) score -= 1;
          if (captures[i+1]) score += 10;
          if (captures[i+2]) score -= 1;
        }
    
        return score;
      };
    
      function makeFuzzyRegex(string) {
    
        if (!string) { return /^$/; }
    
        // Escape any potential special characters:
        var cleansed = string.replace(/\W/g, '\\$&');
    
        return RegExp(
          '^' +
            cleansed.replace(
              // Find every escaped and non-escaped char:
              /(\\?.)/g,
              // Replace with fuzzy character matcher:
              '(?:(^.)?($1)(.??))?'
            ) +
          '$',
          'i'
        );
      }
    }

Our first attempt isn’t too bad:

我们的第一次尝试并不太坏：

    var score = createFuzzyScorer('omg');
    
    score('omg');     // => 30
    score('xOmg');    // => 29
    score('.o.m.g.'); // => 26
    score('om');      // => 20
    score('og');      // => 20
    score('o');       // => 10
    score('nope');    // => 0

These seem like sensible enough scores, generally, but we’re more interested in autocompletion, and so there’s an obvious predictive element there. If a user types ‘o’ then that should probably score higher than ‘g’ if we’re testing against ‘omg’, but with the above mechanism they both receive a standard 10:

这似乎是可感知的足够的分数，一般，但我们在自动完成更感兴趣，所以有一个明显的预测元素的存在。当我们我们测试‘omg’时，如果用户键入"o"那应该得分高于"g"，但上述方法都接受标准的10：

    var score = createFuzzyScorer('omg');
    
    score('o'); // => 10
    score('g'); // => 10

We can fix this by applying a higher weight to matches that appear earlier in the string:

我们可以用更高的权重来解决字符串中较早出现的匹配问题：

    // The scoring loop:
    for (var i = 0, l = captures.length; i < l; i += 3) {
      if (captures[i]) score -= 0.1;
      if (captures[i+1]) score += (l - i) / l; // the magic
      if (captures[i+2]) score -= 0.1;
    }

Now the score given for any singular legitimate match will decrease as the index (`i`) increases. Here are the results:

现在任何奇异的合法的匹配的得分将会递减随着指数（i）增加。这里是结果：

    var score = createFuzzyScorer('omg');
    
    score('omg');     // => 1.99
    score('xOmg');    // => 1.90
    score('om');      // => 1.66
    score('.o.m.g.'); // => 1.59
    score('og');      // => 1.33
    score('o');       // => 1.00
    score('nope');    // => 0.00

This is getting closer to our intuition. The next step would be to try to create a real autocompletion widget. I’ve done it so I know that we’ll want to make one more change. The problem with our scoring right now is that it’ll award legitimate characters relative to the length of the string. But when comparing scores across multiple subject strings, this approach seems broken.

这是越来越接近我们的直觉。下一步将努力创造一个真正的自动完成功能部件。我已经这样做了，所以我知道，我们将要做一个改变。现在我们分值的问题是，奖励合法的字符相对于字符串的长度。但是，当比较多个同类字符串的分数时，这种方法似乎被打破。

    createFuzzyScorer('RuneScript')('Ru'); // 1.9
    createFuzzyScorer('Ruby')('Ru');       // 1.7

These should both score equally, as “Ru” is just as likely to become “Ruby” as it is to become “RuneScript”. To achieve this we should only take into account the index, and make the weight of any scoring decision inversely proportional to that index, in this case via an exponential taper (`pow(index, -2)`).

显然，分数应该相等，因为 “Ru” 推演成 “Ruby” 和 “RuneScript” 是一样. 为了实现这一点，我们应该考虑到该指数，并使任何得分决定的权重与指数成反比，在这种情况下，通过指数锥度 (`pow(index, -2)`)

    // The scoring loop:
    for (var i = 0, l = captures.length; i < l; i += 3) {
      var relevancyOfCharacter = Math.pow(i + 1, -2);
      if (captures[i]) score -= relevancyOfCharacter * 0.1;
      if (captures[i+1]) score += relevancyOfCharacter * 1;
      if (captures[i+2]) score -= relevancyOfCharacter * 0.1;
    }

*(Final version of `createFuzzyScorer` available [as a gist](https://gist.github.com/padolsey/a27a32d5859a71403b10).)*

**[See this demo using programming languages as the dataset](http://jsbin.com/wanetemare/1/edit?js,output)**. Try intentionally misspelling something (jawascript), or missing out characters (jaascit), or just going a little crazy (jahskt). It works beautifully.

**[在数据集用编程语言实现查看demo](http://jsbin.com/wanetemare/1/edit?js,output)**. 尝试拼写错误（jawascript），或者丢失字母（jaascit）或者输入一些类似的（jahskt）， 它依然工作得很漂亮。

To achieve speedy sorting, a fuzzy scorer is created for every single value before the user types anything: 

为了实现快速排序， 每一个单一的值的模糊分数应该在用户输入之前被创建：

	var data = PROGRAMMING_LANGUAGES.map(function(lang, i) {
	  return {
	    actualValue: lang,
	    score: createFuzzyScorer(lang),
	    i: i,
	    toString: function() { return lang; }
	  };
	});

This means we can iterate through `data` on every relevant input event, and call the `score()`method with the current query. We can then bundle this into a *filter->sort->slice* flow to get our list of sensible suggestions:

这意味着我们可以遍历每个相关的输入事件的 data ，调用 score() 方法来实现当前查询。我们可以把这变成一个 *filter->sort->slice* 得出我们列出的有判断力的建议：

    var sorted = data.filter(function(item) {
    
      // Get rid of any very unlikely matches (and cache the score!)
      return (item._cachedScore = item.score(query)) >= .5;
    
    }).sort(function(a, b) {
    
      var as = a._cachedScore;
      var bs = b._cachedScore;
    
      // Sort by score, and if score is equal, then by original index:
      // (We would typically return 0 in that case but some engines don't stable-sort)
      return as > bs ? -1 : as == bs && a.i < b.i ? -1 : 1;
    
    }).slice(0, 10); // We only need the top 10...

And.. we’re done. It’s never really finished though: you’ll find endless tweaks that can be made to the scorer to make it more believably resemble human-like intuition.

我们做到了，虽然它从来没有真正完成，你会发现很多的调整，使得分数更加人工智能。

For those wanting to test the resulting country autocompletion interaction: **[See the demo](http://jsbin.com/lejucikiha/1/edit?js,output)**.

对于那些想要测试国家自动完成返回值交互的，**[See the demo](http://jsbin.com/lejucikiha/1/edit?js,output)**.

I guess, despite my initial warning, I wouldn’t actually mind using this in production, as long as there were a decent number of unit tests. I’d probably also assemble the regular expressions on the server and serve them up as literals. It’s also worth mentioning that almost everything in this post has been exploring the fuzzy-matching of very short strings in small datasets. Even in the case of the country demo, to get more applicable results, I broke up long names into the component parts and then scored against each. E.g.

我想，尽管我最初的忠告，我不介意使用这个在生产，只要做一些数量的单位测试。我可能也组装正则表达式在服务器并为提供服务。值得一提的是，几乎所有的这篇文章都在探索小数据集上的模糊匹配。即使在国家输入案例的演示，以获得更适用的结果，我折断了长的名字，组成部分，然后对每一个得分。例如

    // E.g. Macedonia, the Former Yugoslav Republic of:
    var scorers = [
      "Macedonia, the Former Yugoslav Republic of",
      "Macedonia",
      "the",
      "former",
      "yugoslav",
      "republic",
      "of"
    ].map(createFuzzyScorer);
    // Etc.

And this would be terribly inefficient on a larger scale, so with any dataset longer than a list of countries you’re probably best to explore [Trie](http://en.wikipedia.org/wiki/Trie)-based approaches to autocompletion.

And with that, I’ll shut-up and wish you merry regex’ing!

然而这在大规模扫描下是非常低效的，所以任何数据集比的国家名单长的，你可能最好的探究 [Trie](http://en.wikipedia.org/wiki/Trie)-based 方法 来处理自动完成。然后，我会闭嘴， wish you merry regex’ing!

译者注：

文中及其评论提到的资源：

<https://github.com/padolsey/relevancy.js>

<https://github.com/bevacqua/fuzzysearch>

<https://github.com/gf3/Levenshtein>

作者github：<https://github.com/padolsey>

译者：主要用到正则懒惰匹配去实现`真值`线性回归。you are truly, how much truly you are!

就是通过匹配度分数进行排序，而不是单单的boolean 值指定，再a-z 排序输出，

>比例投票法：【A，B】候选人，每人有100%的投票额度。%A + %B + %X = 1。X 代表 你放弃的额度。 你的投票额度代表你对候选人信任度。这样的投票更具民主性。例如：我投A 70%，B 0% 那么X 就是30%。懂么，我发明的。[挖鼻屎] [链接](http://weibo.com/1356859197/BqrPv2rRL?type=comment)


100%选你 就是<https://github.com/bevacqua/fuzzysearch>所用的方法，你只能在true or false 之间选择，而padolsey所用的方法字样更加人工智能，但是在大规模数据下是非常低效的。另外在作者的博客评论中也提到的 <https://github.com/gf3/Levenshtein>， 可以自行wiki一下。


---


最后如有漏译，错译，欢迎指正。

