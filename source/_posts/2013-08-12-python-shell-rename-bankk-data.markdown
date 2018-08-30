---
layout: post
title: "python shell 重命名银行数据"
date: 2013-08-12 13:39:59 +0800
comments: true
categories: python
statement: true
keywords: python, shell
---


```py
import os
 
_reName = "ABC,BJBANK,BOC,BSB,CCB,CEB,CITIC,CMB,CMBC,COMM,DBSCN,GDB,HANABANK,HSBC,HXBANK,HZCB,ICBC,JSBANK,KLB,PSBC,SCB,SDB,SJBANK,SPABANK,BHB,SHBANK,WHCCB,BOCD,HBRCU,HDBANK,HSBK,XTB,ZJKCCB,CZCCB,JINCHB,JSB,JZBANK,YQCCB,H3CB,ORBANK,WHBANK,BOCY,BODD,BOJZ,BOYK,FSCB,FXCB,JLRCU,DAQINGB,NBBANK,NJCB,WZCB,BOSZ,CSRCB,CZRCB,EGBANK,GCB,HSBANK,JRCB,KSRB,LSBANK,TCRCB,WJRCB,WRCB,ZRCBANK,FJHXBC,JHBANK,JXBANK,NBYZ,NDHB,SXCB,ZJNX,ARCU,BOD,JJBANK,GZB,JXRCU,NCB,SRBANK,BANKWF,DYCCB,DZBANK,JNBANK,LSBC,QDCCB,QLBANK,RZB,SDRCU,TACCB,AYCB,BOP,BOZK,BZMD,CBKF,HNRCU,NYCB,SCBBANK,SCCB,XCYH,XXBANK,XYBANK,ZZBANK,HBC,HKB,HURCB,WHRCB,HNRCC,DRCBCL,GDRCC,GLBANK,GRCB,NHB,SDEB,SRCB,XLBANK,BGB,GXRCU,LZCCB,CCQTGB,CDCB,CQBANK,CRCBANK,CDRCB,CGNB,DYCB,GYCB,LSCCB,PZHCCB,SCRCU,YBCCB,ZGCCB,GZRCU,ZYCBANK,YNRCC,YXCCB,CABANK,SXRCCU,XABANK,GSRCU,LZYH,NXRCU,SZSBK".split(',')
path = 'F:\\PSD2.0\\bankalipay\\sprite\\images\\'
for file in os.listdir(path):
    if os.path.isfile(os.path.join(path,file))==True:
        _baseName = os.path.basename(file)
        _id = int(_baseName[9:_baseName.index('.')])
        _newName = _reName[_id - 1 ] + '.png'
        os.rename(os.path.join(path,file),os.path.join(path,_newName))
```

<!-- more -->

python，nodejs, php?

编辑器是python，用python吧！google 一番，改一改，成了。

142个银行啊，有没有?

一个一个处理，辅助线一条一条地拉？够蛋疼，还要重命名有没有，还要切logo出来有没有，悲催了……

---------------

一定要学一门有io操作的语言旁身，蛋疼君！

ps： 银行数据

[http://ishare.iask.sina.com.cn/f/37741859.html](http://ishare.iask.sina.com.cn/f/37741859.html)

![](http://b.hiphotos.bdimg.com/album/pic/item/f9198618367adab40b85e2ae8ad4b31c8601e482.jpg)

---------------

![](http://f.hiphotos.bdimg.com/album/pic/item/83025aafa40f4bfbde8767b9024f78f0f6361883.jpg)
