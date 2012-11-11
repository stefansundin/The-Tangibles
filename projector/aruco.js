



<!DOCTYPE html>
<html>
<head>
 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" >
 <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
 
 <meta name="ROBOTS" content="NOARCHIVE">
 
 <link rel="icon" type="image/vnd.microsoft.icon" href="https://ssl.gstatic.com/codesite/ph/images/phosting.ico">
 
 
 <script type="text/javascript">
 
 
 
 
 var codesite_token = "7iFwV67rt_yLRB5Zg8THl17C7h4:1352635814309";
 
 
 var CS_env = {"profileUrl":"/u/118373917163349025947/","token":"7iFwV67rt_yLRB5Zg8THl17C7h4:1352635814309","assetHostPath":"https://ssl.gstatic.com/codesite/ph","domainName":null,"assetVersionPath":"https://ssl.gstatic.com/codesite/ph/17134919371905794448","projectHomeUrl":"/p/js-aruco","relativeBaseUrl":"","projectName":"js-aruco","loggedInUserEmail":"Myztix89@gmail.com"};
 var _gaq = _gaq || [];
 _gaq.push(
 ['siteTracker._setAccount', 'UA-18071-1'],
 ['siteTracker._trackPageview']);
 
 (function() {
 var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
 ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
 (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
 })();
 
 </script>
 
 
 <title>aruco.js - 
 js-aruco -
 
 
 A JavaScript library for Augmented Reality applications - Google Project Hosting
 </title>
 <link type="text/css" rel="stylesheet" href="https://ssl.gstatic.com/codesite/ph/17134919371905794448/css/core.css">
 
 <link type="text/css" rel="stylesheet" href="https://ssl.gstatic.com/codesite/ph/17134919371905794448/css/ph_detail.css" >
 
 
 <link type="text/css" rel="stylesheet" href="https://ssl.gstatic.com/codesite/ph/17134919371905794448/css/d_sb.css" >
 
 
 
<!--[if IE]>
 <link type="text/css" rel="stylesheet" href="https://ssl.gstatic.com/codesite/ph/17134919371905794448/css/d_ie.css" >
<![endif]-->
 <style type="text/css">
 .menuIcon.off { background: no-repeat url(https://ssl.gstatic.com/codesite/ph/images/dropdown_sprite.gif) 0 -42px }
 .menuIcon.on { background: no-repeat url(https://ssl.gstatic.com/codesite/ph/images/dropdown_sprite.gif) 0 -28px }
 .menuIcon.down { background: no-repeat url(https://ssl.gstatic.com/codesite/ph/images/dropdown_sprite.gif) 0 0; }
 
 
 
  tr.inline_comment {
 background: #fff;
 vertical-align: top;
 }
 div.draft, div.published {
 padding: .3em;
 border: 1px solid #999; 
 margin-bottom: .1em;
 font-family: arial, sans-serif;
 max-width: 60em;
 }
 div.draft {
 background: #ffa;
 } 
 div.published {
 background: #e5ecf9;
 }
 div.published .body, div.draft .body {
 padding: .5em .1em .1em .1em;
 max-width: 60em;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 word-wrap: break-word;
 font-size: 1em;
 }
 div.draft .actions {
 margin-left: 1em;
 font-size: 90%;
 }
 div.draft form {
 padding: .5em .5em .5em 0;
 }
 div.draft textarea, div.published textarea {
 width: 95%;
 height: 10em;
 font-family: arial, sans-serif;
 margin-bottom: .5em;
 }

 
 .nocursor, .nocursor td, .cursor_hidden, .cursor_hidden td {
 background-color: white;
 height: 2px;
 }
 .cursor, .cursor td {
 background-color: darkblue;
 height: 2px;
 display: '';
 }
 
 
.list {
 border: 1px solid white;
 border-bottom: 0;
}

 
 </style>
</head>
<body class="t4">
<script type="text/javascript">
 window.___gcfg = {lang: 'en'};
 (function() 
 {var po = document.createElement("script");
 po.type = "text/javascript"; po.async = true;po.src = "https://apis.google.com/js/plusone.js";
 var s = document.getElementsByTagName("script")[0];
 s.parentNode.insertBefore(po, s);
 })();
</script>
<div class="headbg">

 <div id="gaia">
 

 <span>
 
 
 
 <a href="#" id="multilogin-dropdown" onclick="return false;"
 ><u><b>Myztix89@gmail.com</b></u> <small>&#9660;</small></a>
 
 
 | <a href="/u/118373917163349025947/" id="projects-dropdown" onclick="return false;"
 ><u>My favorites</u> <small>&#9660;</small></a>
 | <a href="/u/118373917163349025947/" onclick="_CS_click('/gb/ph/profile');"
 title="Profile, Updates, and Settings"
 ><u>Profile</u></a>
 | <a href="https://www.google.com/accounts/Logout?continue=https%3A%2F%2Fcode.google.com%2Fp%2Fjs-aruco%2Fsource%2Fbrowse%2Ftrunk%2Fsrc%2Faruco.js" 
 onclick="_CS_click('/gb/ph/signout');"
 ><u>Sign out</u></a>
 
 </span>

 </div>

 <div class="gbh" style="left: 0pt;"></div>
 <div class="gbh" style="right: 0pt;"></div>
 
 
 <div style="height: 1px"></div>
<!--[if lte IE 7]>
<div style="text-align:center;">
Your version of Internet Explorer is not supported. Try a browser that
contributes to open source, such as <a href="http://www.firefox.com">Firefox</a>,
<a href="http://www.google.com/chrome">Google Chrome</a>, or
<a href="http://code.google.com/chrome/chromeframe/">Google Chrome Frame</a>.
</div>
<![endif]-->



 <table style="padding:0px; margin: 0px 0px 10px 0px; width:100%" cellpadding="0" cellspacing="0"
 itemscope itemtype="http://schema.org/CreativeWork">
 <tr style="height: 58px;">
 
 
 
 <td id="plogo">
 <link itemprop="url" href="/p/js-aruco">
 <a href="/p/js-aruco/">
 
 <img src="https://ssl.gstatic.com/codesite/ph/images/defaultlogo.png" alt="Logo" itemprop="image">
 
 </a>
 </td>
 
 <td style="padding-left: 0.5em">
 
 <div id="pname">
 <a href="/p/js-aruco/"><span itemprop="name">js-aruco</span></a>
 </div>
 
 <div id="psum">
 <a id="project_summary_link"
 href="/p/js-aruco/"><span itemprop="description">A JavaScript library for Augmented Reality applications</span></a>
 
 </div>
 
 
 </td>
 <td style="white-space:nowrap;text-align:right; vertical-align:bottom;">
 
 <form action="/hosting/search">
 <input size="30" name="q" value="" type="text">
 
 <input type="submit" name="projectsearch" value="Search projects" >
 </form>
 
 </tr>
 </table>

</div>

 
<div id="mt" class="gtb"> 
 <a href="/p/js-aruco/" class="tab ">Project&nbsp;Home</a>
 
 
 
 
 
 
 
 
 <a href="/p/js-aruco/issues/list"
 class="tab ">Issues</a>
 
 
 
 
 
 <a href="/p/js-aruco/source/checkout"
 class="tab active">Source</a>
 
 
 
 
 
 
 
 
 
 
 <div class=gtbc></div>
</div>
<table cellspacing="0" cellpadding="0" width="100%" align="center" border="0" class="st">
 <tr>
 
 
 
 
 
 
 
 <td class="subt">
 <div class="st2">
 <div class="isf">
 
 


 <span class="inst1"><a href="/p/js-aruco/source/checkout">Checkout</a></span> &nbsp;
 <span class="inst2"><a href="/p/js-aruco/source/browse/">Browse</a></span> &nbsp;
 <span class="inst3"><a href="/p/js-aruco/source/list">Changes</a></span> &nbsp;
 
 &nbsp;
 
 
 <form action="/p/js-aruco/source/search" method="get" style="display:inline"
 onsubmit="document.getElementById('codesearchq').value = document.getElementById('origq').value">
 <input type="hidden" name="q" id="codesearchq" value="">
 <input type="text" maxlength="2048" size="38" id="origq" name="origq" value="" title="Google Code Search" style="font-size:92%">&nbsp;<input type="submit" value="Search Trunk" name="btnG" style="font-size:92%">
 
 
 
 
 
 
 </form>
 <script type="text/javascript">
 
 function codesearchQuery(form) {
 var query = document.getElementById('q').value;
 if (query) { form.action += '%20' + query; }
 }
 </script>
 </div>
</div>

 </td>
 
 
 
 <td align="right" valign="top" class="bevel-right"></td>
 </tr>
</table>


<script type="text/javascript">
 var cancelBubble = false;
 function _go(url) { document.location = url; }
</script>
<div id="maincol"
 
>

 




<div class="expand">
<div id="colcontrol">
<style type="text/css">
 #file_flipper { white-space: nowrap; padding-right: 2em; }
 #file_flipper.hidden { display: none; }
 #file_flipper .pagelink { color: #0000CC; text-decoration: underline; }
 #file_flipper #visiblefiles { padding-left: 0.5em; padding-right: 0.5em; }
</style>
<table id="nav_and_rev" class="list"
 cellpadding="0" cellspacing="0" width="100%">
 <tr>
 
 <td nowrap="nowrap" class="src_crumbs src_nav" width="33%">
 <strong class="src_nav">Source path:&nbsp;</strong>
 <span id="crumb_root">
 
 <a href="/p/js-aruco/source/browse/">svn</a>/&nbsp;</span>
 <span id="crumb_links" class="ifClosed"><a href="/p/js-aruco/source/browse/trunk/">trunk</a><span class="sp">/&nbsp;</span><a href="/p/js-aruco/source/browse/trunk/src/">src</a><span class="sp">/&nbsp;</span>aruco.js</span>
 
 


 </td>
 
 
 <td nowrap="nowrap" width="33%" align="center">
 <a href="/p/js-aruco/source/browse/trunk/src/aruco.js?edit=1"
 ><img src="https://ssl.gstatic.com/codesite/ph/images/pencil-y14.png"
 class="edit_icon">Edit file</a>
 </td>
 
 
 <td nowrap="nowrap" width="33%" align="right">
 <table cellpadding="0" cellspacing="0" style="font-size: 100%"><tr>
 
 
 <td class="flipper">
 <ul class="leftside">
 
 <li><a href="/p/js-aruco/source/browse/trunk/src/aruco.js?r=7" title="Previous">&lsaquo;r7</a></li>
 
 </ul>
 </td>
 
 <td class="flipper"><b>r13</b></td>
 
 </tr></table>
 </td> 
 </tr>
</table>

<div class="fc">
 
 
 
<style type="text/css">
.undermouse span {
 background-image: url(https://ssl.gstatic.com/codesite/ph/images/comments.gif); }
</style>
<table class="opened" id="review_comment_area"
><tr>
<td id="nums">
<pre><table width="100%"><tr class="nocursor"><td></td></tr></table></pre>
<pre><table width="100%" id="nums_table_0"><tr id="gr_svn13_1"

><td id="1"><a href="#1">1</a></td></tr
><tr id="gr_svn13_2"

><td id="2"><a href="#2">2</a></td></tr
><tr id="gr_svn13_3"

><td id="3"><a href="#3">3</a></td></tr
><tr id="gr_svn13_4"

><td id="4"><a href="#4">4</a></td></tr
><tr id="gr_svn13_5"

><td id="5"><a href="#5">5</a></td></tr
><tr id="gr_svn13_6"

><td id="6"><a href="#6">6</a></td></tr
><tr id="gr_svn13_7"

><td id="7"><a href="#7">7</a></td></tr
><tr id="gr_svn13_8"

><td id="8"><a href="#8">8</a></td></tr
><tr id="gr_svn13_9"

><td id="9"><a href="#9">9</a></td></tr
><tr id="gr_svn13_10"

><td id="10"><a href="#10">10</a></td></tr
><tr id="gr_svn13_11"

><td id="11"><a href="#11">11</a></td></tr
><tr id="gr_svn13_12"

><td id="12"><a href="#12">12</a></td></tr
><tr id="gr_svn13_13"

><td id="13"><a href="#13">13</a></td></tr
><tr id="gr_svn13_14"

><td id="14"><a href="#14">14</a></td></tr
><tr id="gr_svn13_15"

><td id="15"><a href="#15">15</a></td></tr
><tr id="gr_svn13_16"

><td id="16"><a href="#16">16</a></td></tr
><tr id="gr_svn13_17"

><td id="17"><a href="#17">17</a></td></tr
><tr id="gr_svn13_18"

><td id="18"><a href="#18">18</a></td></tr
><tr id="gr_svn13_19"

><td id="19"><a href="#19">19</a></td></tr
><tr id="gr_svn13_20"

><td id="20"><a href="#20">20</a></td></tr
><tr id="gr_svn13_21"

><td id="21"><a href="#21">21</a></td></tr
><tr id="gr_svn13_22"

><td id="22"><a href="#22">22</a></td></tr
><tr id="gr_svn13_23"

><td id="23"><a href="#23">23</a></td></tr
><tr id="gr_svn13_24"

><td id="24"><a href="#24">24</a></td></tr
><tr id="gr_svn13_25"

><td id="25"><a href="#25">25</a></td></tr
><tr id="gr_svn13_26"

><td id="26"><a href="#26">26</a></td></tr
><tr id="gr_svn13_27"

><td id="27"><a href="#27">27</a></td></tr
><tr id="gr_svn13_28"

><td id="28"><a href="#28">28</a></td></tr
><tr id="gr_svn13_29"

><td id="29"><a href="#29">29</a></td></tr
><tr id="gr_svn13_30"

><td id="30"><a href="#30">30</a></td></tr
><tr id="gr_svn13_31"

><td id="31"><a href="#31">31</a></td></tr
><tr id="gr_svn13_32"

><td id="32"><a href="#32">32</a></td></tr
><tr id="gr_svn13_33"

><td id="33"><a href="#33">33</a></td></tr
><tr id="gr_svn13_34"

><td id="34"><a href="#34">34</a></td></tr
><tr id="gr_svn13_35"

><td id="35"><a href="#35">35</a></td></tr
><tr id="gr_svn13_36"

><td id="36"><a href="#36">36</a></td></tr
><tr id="gr_svn13_37"

><td id="37"><a href="#37">37</a></td></tr
><tr id="gr_svn13_38"

><td id="38"><a href="#38">38</a></td></tr
><tr id="gr_svn13_39"

><td id="39"><a href="#39">39</a></td></tr
><tr id="gr_svn13_40"

><td id="40"><a href="#40">40</a></td></tr
><tr id="gr_svn13_41"

><td id="41"><a href="#41">41</a></td></tr
><tr id="gr_svn13_42"

><td id="42"><a href="#42">42</a></td></tr
><tr id="gr_svn13_43"

><td id="43"><a href="#43">43</a></td></tr
><tr id="gr_svn13_44"

><td id="44"><a href="#44">44</a></td></tr
><tr id="gr_svn13_45"

><td id="45"><a href="#45">45</a></td></tr
><tr id="gr_svn13_46"

><td id="46"><a href="#46">46</a></td></tr
><tr id="gr_svn13_47"

><td id="47"><a href="#47">47</a></td></tr
><tr id="gr_svn13_48"

><td id="48"><a href="#48">48</a></td></tr
><tr id="gr_svn13_49"

><td id="49"><a href="#49">49</a></td></tr
><tr id="gr_svn13_50"

><td id="50"><a href="#50">50</a></td></tr
><tr id="gr_svn13_51"

><td id="51"><a href="#51">51</a></td></tr
><tr id="gr_svn13_52"

><td id="52"><a href="#52">52</a></td></tr
><tr id="gr_svn13_53"

><td id="53"><a href="#53">53</a></td></tr
><tr id="gr_svn13_54"

><td id="54"><a href="#54">54</a></td></tr
><tr id="gr_svn13_55"

><td id="55"><a href="#55">55</a></td></tr
><tr id="gr_svn13_56"

><td id="56"><a href="#56">56</a></td></tr
><tr id="gr_svn13_57"

><td id="57"><a href="#57">57</a></td></tr
><tr id="gr_svn13_58"

><td id="58"><a href="#58">58</a></td></tr
><tr id="gr_svn13_59"

><td id="59"><a href="#59">59</a></td></tr
><tr id="gr_svn13_60"

><td id="60"><a href="#60">60</a></td></tr
><tr id="gr_svn13_61"

><td id="61"><a href="#61">61</a></td></tr
><tr id="gr_svn13_62"

><td id="62"><a href="#62">62</a></td></tr
><tr id="gr_svn13_63"

><td id="63"><a href="#63">63</a></td></tr
><tr id="gr_svn13_64"

><td id="64"><a href="#64">64</a></td></tr
><tr id="gr_svn13_65"

><td id="65"><a href="#65">65</a></td></tr
><tr id="gr_svn13_66"

><td id="66"><a href="#66">66</a></td></tr
><tr id="gr_svn13_67"

><td id="67"><a href="#67">67</a></td></tr
><tr id="gr_svn13_68"

><td id="68"><a href="#68">68</a></td></tr
><tr id="gr_svn13_69"

><td id="69"><a href="#69">69</a></td></tr
><tr id="gr_svn13_70"

><td id="70"><a href="#70">70</a></td></tr
><tr id="gr_svn13_71"

><td id="71"><a href="#71">71</a></td></tr
><tr id="gr_svn13_72"

><td id="72"><a href="#72">72</a></td></tr
><tr id="gr_svn13_73"

><td id="73"><a href="#73">73</a></td></tr
><tr id="gr_svn13_74"

><td id="74"><a href="#74">74</a></td></tr
><tr id="gr_svn13_75"

><td id="75"><a href="#75">75</a></td></tr
><tr id="gr_svn13_76"

><td id="76"><a href="#76">76</a></td></tr
><tr id="gr_svn13_77"

><td id="77"><a href="#77">77</a></td></tr
><tr id="gr_svn13_78"

><td id="78"><a href="#78">78</a></td></tr
><tr id="gr_svn13_79"

><td id="79"><a href="#79">79</a></td></tr
><tr id="gr_svn13_80"

><td id="80"><a href="#80">80</a></td></tr
><tr id="gr_svn13_81"

><td id="81"><a href="#81">81</a></td></tr
><tr id="gr_svn13_82"

><td id="82"><a href="#82">82</a></td></tr
><tr id="gr_svn13_83"

><td id="83"><a href="#83">83</a></td></tr
><tr id="gr_svn13_84"

><td id="84"><a href="#84">84</a></td></tr
><tr id="gr_svn13_85"

><td id="85"><a href="#85">85</a></td></tr
><tr id="gr_svn13_86"

><td id="86"><a href="#86">86</a></td></tr
><tr id="gr_svn13_87"

><td id="87"><a href="#87">87</a></td></tr
><tr id="gr_svn13_88"

><td id="88"><a href="#88">88</a></td></tr
><tr id="gr_svn13_89"

><td id="89"><a href="#89">89</a></td></tr
><tr id="gr_svn13_90"

><td id="90"><a href="#90">90</a></td></tr
><tr id="gr_svn13_91"

><td id="91"><a href="#91">91</a></td></tr
><tr id="gr_svn13_92"

><td id="92"><a href="#92">92</a></td></tr
><tr id="gr_svn13_93"

><td id="93"><a href="#93">93</a></td></tr
><tr id="gr_svn13_94"

><td id="94"><a href="#94">94</a></td></tr
><tr id="gr_svn13_95"

><td id="95"><a href="#95">95</a></td></tr
><tr id="gr_svn13_96"

><td id="96"><a href="#96">96</a></td></tr
><tr id="gr_svn13_97"

><td id="97"><a href="#97">97</a></td></tr
><tr id="gr_svn13_98"

><td id="98"><a href="#98">98</a></td></tr
><tr id="gr_svn13_99"

><td id="99"><a href="#99">99</a></td></tr
><tr id="gr_svn13_100"

><td id="100"><a href="#100">100</a></td></tr
><tr id="gr_svn13_101"

><td id="101"><a href="#101">101</a></td></tr
><tr id="gr_svn13_102"

><td id="102"><a href="#102">102</a></td></tr
><tr id="gr_svn13_103"

><td id="103"><a href="#103">103</a></td></tr
><tr id="gr_svn13_104"

><td id="104"><a href="#104">104</a></td></tr
><tr id="gr_svn13_105"

><td id="105"><a href="#105">105</a></td></tr
><tr id="gr_svn13_106"

><td id="106"><a href="#106">106</a></td></tr
><tr id="gr_svn13_107"

><td id="107"><a href="#107">107</a></td></tr
><tr id="gr_svn13_108"

><td id="108"><a href="#108">108</a></td></tr
><tr id="gr_svn13_109"

><td id="109"><a href="#109">109</a></td></tr
><tr id="gr_svn13_110"

><td id="110"><a href="#110">110</a></td></tr
><tr id="gr_svn13_111"

><td id="111"><a href="#111">111</a></td></tr
><tr id="gr_svn13_112"

><td id="112"><a href="#112">112</a></td></tr
><tr id="gr_svn13_113"

><td id="113"><a href="#113">113</a></td></tr
><tr id="gr_svn13_114"

><td id="114"><a href="#114">114</a></td></tr
><tr id="gr_svn13_115"

><td id="115"><a href="#115">115</a></td></tr
><tr id="gr_svn13_116"

><td id="116"><a href="#116">116</a></td></tr
><tr id="gr_svn13_117"

><td id="117"><a href="#117">117</a></td></tr
><tr id="gr_svn13_118"

><td id="118"><a href="#118">118</a></td></tr
><tr id="gr_svn13_119"

><td id="119"><a href="#119">119</a></td></tr
><tr id="gr_svn13_120"

><td id="120"><a href="#120">120</a></td></tr
><tr id="gr_svn13_121"

><td id="121"><a href="#121">121</a></td></tr
><tr id="gr_svn13_122"

><td id="122"><a href="#122">122</a></td></tr
><tr id="gr_svn13_123"

><td id="123"><a href="#123">123</a></td></tr
><tr id="gr_svn13_124"

><td id="124"><a href="#124">124</a></td></tr
><tr id="gr_svn13_125"

><td id="125"><a href="#125">125</a></td></tr
><tr id="gr_svn13_126"

><td id="126"><a href="#126">126</a></td></tr
><tr id="gr_svn13_127"

><td id="127"><a href="#127">127</a></td></tr
><tr id="gr_svn13_128"

><td id="128"><a href="#128">128</a></td></tr
><tr id="gr_svn13_129"

><td id="129"><a href="#129">129</a></td></tr
><tr id="gr_svn13_130"

><td id="130"><a href="#130">130</a></td></tr
><tr id="gr_svn13_131"

><td id="131"><a href="#131">131</a></td></tr
><tr id="gr_svn13_132"

><td id="132"><a href="#132">132</a></td></tr
><tr id="gr_svn13_133"

><td id="133"><a href="#133">133</a></td></tr
><tr id="gr_svn13_134"

><td id="134"><a href="#134">134</a></td></tr
><tr id="gr_svn13_135"

><td id="135"><a href="#135">135</a></td></tr
><tr id="gr_svn13_136"

><td id="136"><a href="#136">136</a></td></tr
><tr id="gr_svn13_137"

><td id="137"><a href="#137">137</a></td></tr
><tr id="gr_svn13_138"

><td id="138"><a href="#138">138</a></td></tr
><tr id="gr_svn13_139"

><td id="139"><a href="#139">139</a></td></tr
><tr id="gr_svn13_140"

><td id="140"><a href="#140">140</a></td></tr
><tr id="gr_svn13_141"

><td id="141"><a href="#141">141</a></td></tr
><tr id="gr_svn13_142"

><td id="142"><a href="#142">142</a></td></tr
><tr id="gr_svn13_143"

><td id="143"><a href="#143">143</a></td></tr
><tr id="gr_svn13_144"

><td id="144"><a href="#144">144</a></td></tr
><tr id="gr_svn13_145"

><td id="145"><a href="#145">145</a></td></tr
><tr id="gr_svn13_146"

><td id="146"><a href="#146">146</a></td></tr
><tr id="gr_svn13_147"

><td id="147"><a href="#147">147</a></td></tr
><tr id="gr_svn13_148"

><td id="148"><a href="#148">148</a></td></tr
><tr id="gr_svn13_149"

><td id="149"><a href="#149">149</a></td></tr
><tr id="gr_svn13_150"

><td id="150"><a href="#150">150</a></td></tr
><tr id="gr_svn13_151"

><td id="151"><a href="#151">151</a></td></tr
><tr id="gr_svn13_152"

><td id="152"><a href="#152">152</a></td></tr
><tr id="gr_svn13_153"

><td id="153"><a href="#153">153</a></td></tr
><tr id="gr_svn13_154"

><td id="154"><a href="#154">154</a></td></tr
><tr id="gr_svn13_155"

><td id="155"><a href="#155">155</a></td></tr
><tr id="gr_svn13_156"

><td id="156"><a href="#156">156</a></td></tr
><tr id="gr_svn13_157"

><td id="157"><a href="#157">157</a></td></tr
><tr id="gr_svn13_158"

><td id="158"><a href="#158">158</a></td></tr
><tr id="gr_svn13_159"

><td id="159"><a href="#159">159</a></td></tr
><tr id="gr_svn13_160"

><td id="160"><a href="#160">160</a></td></tr
><tr id="gr_svn13_161"

><td id="161"><a href="#161">161</a></td></tr
><tr id="gr_svn13_162"

><td id="162"><a href="#162">162</a></td></tr
><tr id="gr_svn13_163"

><td id="163"><a href="#163">163</a></td></tr
><tr id="gr_svn13_164"

><td id="164"><a href="#164">164</a></td></tr
><tr id="gr_svn13_165"

><td id="165"><a href="#165">165</a></td></tr
><tr id="gr_svn13_166"

><td id="166"><a href="#166">166</a></td></tr
><tr id="gr_svn13_167"

><td id="167"><a href="#167">167</a></td></tr
><tr id="gr_svn13_168"

><td id="168"><a href="#168">168</a></td></tr
><tr id="gr_svn13_169"

><td id="169"><a href="#169">169</a></td></tr
><tr id="gr_svn13_170"

><td id="170"><a href="#170">170</a></td></tr
><tr id="gr_svn13_171"

><td id="171"><a href="#171">171</a></td></tr
><tr id="gr_svn13_172"

><td id="172"><a href="#172">172</a></td></tr
><tr id="gr_svn13_173"

><td id="173"><a href="#173">173</a></td></tr
><tr id="gr_svn13_174"

><td id="174"><a href="#174">174</a></td></tr
><tr id="gr_svn13_175"

><td id="175"><a href="#175">175</a></td></tr
><tr id="gr_svn13_176"

><td id="176"><a href="#176">176</a></td></tr
><tr id="gr_svn13_177"

><td id="177"><a href="#177">177</a></td></tr
><tr id="gr_svn13_178"

><td id="178"><a href="#178">178</a></td></tr
><tr id="gr_svn13_179"

><td id="179"><a href="#179">179</a></td></tr
><tr id="gr_svn13_180"

><td id="180"><a href="#180">180</a></td></tr
><tr id="gr_svn13_181"

><td id="181"><a href="#181">181</a></td></tr
><tr id="gr_svn13_182"

><td id="182"><a href="#182">182</a></td></tr
><tr id="gr_svn13_183"

><td id="183"><a href="#183">183</a></td></tr
><tr id="gr_svn13_184"

><td id="184"><a href="#184">184</a></td></tr
><tr id="gr_svn13_185"

><td id="185"><a href="#185">185</a></td></tr
><tr id="gr_svn13_186"

><td id="186"><a href="#186">186</a></td></tr
><tr id="gr_svn13_187"

><td id="187"><a href="#187">187</a></td></tr
><tr id="gr_svn13_188"

><td id="188"><a href="#188">188</a></td></tr
><tr id="gr_svn13_189"

><td id="189"><a href="#189">189</a></td></tr
><tr id="gr_svn13_190"

><td id="190"><a href="#190">190</a></td></tr
><tr id="gr_svn13_191"

><td id="191"><a href="#191">191</a></td></tr
><tr id="gr_svn13_192"

><td id="192"><a href="#192">192</a></td></tr
><tr id="gr_svn13_193"

><td id="193"><a href="#193">193</a></td></tr
><tr id="gr_svn13_194"

><td id="194"><a href="#194">194</a></td></tr
><tr id="gr_svn13_195"

><td id="195"><a href="#195">195</a></td></tr
><tr id="gr_svn13_196"

><td id="196"><a href="#196">196</a></td></tr
><tr id="gr_svn13_197"

><td id="197"><a href="#197">197</a></td></tr
><tr id="gr_svn13_198"

><td id="198"><a href="#198">198</a></td></tr
><tr id="gr_svn13_199"

><td id="199"><a href="#199">199</a></td></tr
><tr id="gr_svn13_200"

><td id="200"><a href="#200">200</a></td></tr
><tr id="gr_svn13_201"

><td id="201"><a href="#201">201</a></td></tr
><tr id="gr_svn13_202"

><td id="202"><a href="#202">202</a></td></tr
><tr id="gr_svn13_203"

><td id="203"><a href="#203">203</a></td></tr
><tr id="gr_svn13_204"

><td id="204"><a href="#204">204</a></td></tr
><tr id="gr_svn13_205"

><td id="205"><a href="#205">205</a></td></tr
><tr id="gr_svn13_206"

><td id="206"><a href="#206">206</a></td></tr
><tr id="gr_svn13_207"

><td id="207"><a href="#207">207</a></td></tr
><tr id="gr_svn13_208"

><td id="208"><a href="#208">208</a></td></tr
><tr id="gr_svn13_209"

><td id="209"><a href="#209">209</a></td></tr
><tr id="gr_svn13_210"

><td id="210"><a href="#210">210</a></td></tr
><tr id="gr_svn13_211"

><td id="211"><a href="#211">211</a></td></tr
><tr id="gr_svn13_212"

><td id="212"><a href="#212">212</a></td></tr
><tr id="gr_svn13_213"

><td id="213"><a href="#213">213</a></td></tr
><tr id="gr_svn13_214"

><td id="214"><a href="#214">214</a></td></tr
><tr id="gr_svn13_215"

><td id="215"><a href="#215">215</a></td></tr
><tr id="gr_svn13_216"

><td id="216"><a href="#216">216</a></td></tr
><tr id="gr_svn13_217"

><td id="217"><a href="#217">217</a></td></tr
><tr id="gr_svn13_218"

><td id="218"><a href="#218">218</a></td></tr
><tr id="gr_svn13_219"

><td id="219"><a href="#219">219</a></td></tr
><tr id="gr_svn13_220"

><td id="220"><a href="#220">220</a></td></tr
><tr id="gr_svn13_221"

><td id="221"><a href="#221">221</a></td></tr
><tr id="gr_svn13_222"

><td id="222"><a href="#222">222</a></td></tr
><tr id="gr_svn13_223"

><td id="223"><a href="#223">223</a></td></tr
><tr id="gr_svn13_224"

><td id="224"><a href="#224">224</a></td></tr
><tr id="gr_svn13_225"

><td id="225"><a href="#225">225</a></td></tr
><tr id="gr_svn13_226"

><td id="226"><a href="#226">226</a></td></tr
><tr id="gr_svn13_227"

><td id="227"><a href="#227">227</a></td></tr
><tr id="gr_svn13_228"

><td id="228"><a href="#228">228</a></td></tr
><tr id="gr_svn13_229"

><td id="229"><a href="#229">229</a></td></tr
><tr id="gr_svn13_230"

><td id="230"><a href="#230">230</a></td></tr
><tr id="gr_svn13_231"

><td id="231"><a href="#231">231</a></td></tr
><tr id="gr_svn13_232"

><td id="232"><a href="#232">232</a></td></tr
><tr id="gr_svn13_233"

><td id="233"><a href="#233">233</a></td></tr
><tr id="gr_svn13_234"

><td id="234"><a href="#234">234</a></td></tr
><tr id="gr_svn13_235"

><td id="235"><a href="#235">235</a></td></tr
><tr id="gr_svn13_236"

><td id="236"><a href="#236">236</a></td></tr
><tr id="gr_svn13_237"

><td id="237"><a href="#237">237</a></td></tr
><tr id="gr_svn13_238"

><td id="238"><a href="#238">238</a></td></tr
><tr id="gr_svn13_239"

><td id="239"><a href="#239">239</a></td></tr
><tr id="gr_svn13_240"

><td id="240"><a href="#240">240</a></td></tr
><tr id="gr_svn13_241"

><td id="241"><a href="#241">241</a></td></tr
><tr id="gr_svn13_242"

><td id="242"><a href="#242">242</a></td></tr
><tr id="gr_svn13_243"

><td id="243"><a href="#243">243</a></td></tr
><tr id="gr_svn13_244"

><td id="244"><a href="#244">244</a></td></tr
><tr id="gr_svn13_245"

><td id="245"><a href="#245">245</a></td></tr
><tr id="gr_svn13_246"

><td id="246"><a href="#246">246</a></td></tr
><tr id="gr_svn13_247"

><td id="247"><a href="#247">247</a></td></tr
><tr id="gr_svn13_248"

><td id="248"><a href="#248">248</a></td></tr
><tr id="gr_svn13_249"

><td id="249"><a href="#249">249</a></td></tr
><tr id="gr_svn13_250"

><td id="250"><a href="#250">250</a></td></tr
><tr id="gr_svn13_251"

><td id="251"><a href="#251">251</a></td></tr
><tr id="gr_svn13_252"

><td id="252"><a href="#252">252</a></td></tr
><tr id="gr_svn13_253"

><td id="253"><a href="#253">253</a></td></tr
><tr id="gr_svn13_254"

><td id="254"><a href="#254">254</a></td></tr
><tr id="gr_svn13_255"

><td id="255"><a href="#255">255</a></td></tr
><tr id="gr_svn13_256"

><td id="256"><a href="#256">256</a></td></tr
><tr id="gr_svn13_257"

><td id="257"><a href="#257">257</a></td></tr
><tr id="gr_svn13_258"

><td id="258"><a href="#258">258</a></td></tr
><tr id="gr_svn13_259"

><td id="259"><a href="#259">259</a></td></tr
><tr id="gr_svn13_260"

><td id="260"><a href="#260">260</a></td></tr
><tr id="gr_svn13_261"

><td id="261"><a href="#261">261</a></td></tr
><tr id="gr_svn13_262"

><td id="262"><a href="#262">262</a></td></tr
><tr id="gr_svn13_263"

><td id="263"><a href="#263">263</a></td></tr
><tr id="gr_svn13_264"

><td id="264"><a href="#264">264</a></td></tr
><tr id="gr_svn13_265"

><td id="265"><a href="#265">265</a></td></tr
><tr id="gr_svn13_266"

><td id="266"><a href="#266">266</a></td></tr
><tr id="gr_svn13_267"

><td id="267"><a href="#267">267</a></td></tr
></table></pre>
<pre><table width="100%"><tr class="nocursor"><td></td></tr></table></pre>
</td>
<td id="lines">
<pre><table width="100%"><tr class="cursor_stop cursor_hidden"><td></td></tr></table></pre>
<pre class="prettyprint lang-js"><table id="src_table_0"><tr
id=sl_svn13_1

><td class="source">/*<br></td></tr
><tr
id=sl_svn13_2

><td class="source">Copyright (c) 2011 Juan Mellado<br></td></tr
><tr
id=sl_svn13_3

><td class="source"><br></td></tr
><tr
id=sl_svn13_4

><td class="source">Permission is hereby granted, free of charge, to any person obtaining a copy<br></td></tr
><tr
id=sl_svn13_5

><td class="source">of this software and associated documentation files (the &quot;Software&quot;), to deal<br></td></tr
><tr
id=sl_svn13_6

><td class="source">in the Software without restriction, including without limitation the rights<br></td></tr
><tr
id=sl_svn13_7

><td class="source">to use, copy, modify, merge, publish, distribute, sublicense, and/or sell<br></td></tr
><tr
id=sl_svn13_8

><td class="source">copies of the Software, and to permit persons to whom the Software is<br></td></tr
><tr
id=sl_svn13_9

><td class="source">furnished to do so, subject to the following conditions:<br></td></tr
><tr
id=sl_svn13_10

><td class="source"><br></td></tr
><tr
id=sl_svn13_11

><td class="source">The above copyright notice and this permission notice shall be included in<br></td></tr
><tr
id=sl_svn13_12

><td class="source">all copies or substantial portions of the Software.<br></td></tr
><tr
id=sl_svn13_13

><td class="source"><br></td></tr
><tr
id=sl_svn13_14

><td class="source">THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR<br></td></tr
><tr
id=sl_svn13_15

><td class="source">IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,<br></td></tr
><tr
id=sl_svn13_16

><td class="source">FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE<br></td></tr
><tr
id=sl_svn13_17

><td class="source">AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER<br></td></tr
><tr
id=sl_svn13_18

><td class="source">LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,<br></td></tr
><tr
id=sl_svn13_19

><td class="source">OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN<br></td></tr
><tr
id=sl_svn13_20

><td class="source">THE SOFTWARE.<br></td></tr
><tr
id=sl_svn13_21

><td class="source">*/<br></td></tr
><tr
id=sl_svn13_22

><td class="source"><br></td></tr
><tr
id=sl_svn13_23

><td class="source">/*<br></td></tr
><tr
id=sl_svn13_24

><td class="source">References:<br></td></tr
><tr
id=sl_svn13_25

><td class="source">- &quot;ArUco: a minimal library for Augmented Reality applications based on OpenCv&quot;<br></td></tr
><tr
id=sl_svn13_26

><td class="source">  http://www.uco.es/investiga/grupos/ava/node/26<br></td></tr
><tr
id=sl_svn13_27

><td class="source">*/<br></td></tr
><tr
id=sl_svn13_28

><td class="source"><br></td></tr
><tr
id=sl_svn13_29

><td class="source">var AR = AR || {};<br></td></tr
><tr
id=sl_svn13_30

><td class="source"><br></td></tr
><tr
id=sl_svn13_31

><td class="source">AR.Marker = function(id, corners){<br></td></tr
><tr
id=sl_svn13_32

><td class="source">  this.id = id;<br></td></tr
><tr
id=sl_svn13_33

><td class="source">  this.corners = corners;<br></td></tr
><tr
id=sl_svn13_34

><td class="source">};<br></td></tr
><tr
id=sl_svn13_35

><td class="source"><br></td></tr
><tr
id=sl_svn13_36

><td class="source">AR.Detector = function(){<br></td></tr
><tr
id=sl_svn13_37

><td class="source">  this.grey = new CV.Image();<br></td></tr
><tr
id=sl_svn13_38

><td class="source">  this.thres = new CV.Image();<br></td></tr
><tr
id=sl_svn13_39

><td class="source">  this.homography = new CV.Image();<br></td></tr
><tr
id=sl_svn13_40

><td class="source">  this.binary = [];<br></td></tr
><tr
id=sl_svn13_41

><td class="source">  this.contours = [];<br></td></tr
><tr
id=sl_svn13_42

><td class="source">  this.polys = [];<br></td></tr
><tr
id=sl_svn13_43

><td class="source">  this.candidates = [];<br></td></tr
><tr
id=sl_svn13_44

><td class="source">};<br></td></tr
><tr
id=sl_svn13_45

><td class="source"><br></td></tr
><tr
id=sl_svn13_46

><td class="source">AR.Detector.prototype.detect = function(image){<br></td></tr
><tr
id=sl_svn13_47

><td class="source">  CV.grayscale(image, this.grey);<br></td></tr
><tr
id=sl_svn13_48

><td class="source">  CV.adaptiveThreshold(this.grey, this.thres, 2, 7);<br></td></tr
><tr
id=sl_svn13_49

><td class="source">  <br></td></tr
><tr
id=sl_svn13_50

><td class="source">  this.contours = CV.findContours(this.thres, this.binary);<br></td></tr
><tr
id=sl_svn13_51

><td class="source"><br></td></tr
><tr
id=sl_svn13_52

><td class="source">  this.candidates = this.findCandidates(this.contours, image.width * 0.20, 0.05, 10);<br></td></tr
><tr
id=sl_svn13_53

><td class="source">  this.candidates = this.clockwiseCorners(this.candidates);<br></td></tr
><tr
id=sl_svn13_54

><td class="source">  this.candidates = this.notTooNear(this.candidates, 10);<br></td></tr
><tr
id=sl_svn13_55

><td class="source"><br></td></tr
><tr
id=sl_svn13_56

><td class="source">  return this.findMarkers(this.grey, this.candidates, 49);<br></td></tr
><tr
id=sl_svn13_57

><td class="source">};<br></td></tr
><tr
id=sl_svn13_58

><td class="source"><br></td></tr
><tr
id=sl_svn13_59

><td class="source">AR.Detector.prototype.findCandidates = function(contours, minSize, epsilon, minLength){<br></td></tr
><tr
id=sl_svn13_60

><td class="source">  var candidates = [], len = contours.length, contour, poly, i;<br></td></tr
><tr
id=sl_svn13_61

><td class="source"><br></td></tr
><tr
id=sl_svn13_62

><td class="source">  this.polys = [];<br></td></tr
><tr
id=sl_svn13_63

><td class="source">  <br></td></tr
><tr
id=sl_svn13_64

><td class="source">  for (i = 0; i &lt; len; ++ i){<br></td></tr
><tr
id=sl_svn13_65

><td class="source">    contour = contours[i];<br></td></tr
><tr
id=sl_svn13_66

><td class="source"><br></td></tr
><tr
id=sl_svn13_67

><td class="source">    if (contour.length &gt;= minSize){<br></td></tr
><tr
id=sl_svn13_68

><td class="source">      poly = CV.approxPolyDP(contour, contour.length * epsilon);<br></td></tr
><tr
id=sl_svn13_69

><td class="source"><br></td></tr
><tr
id=sl_svn13_70

><td class="source">      this.polys.push(poly);<br></td></tr
><tr
id=sl_svn13_71

><td class="source"><br></td></tr
><tr
id=sl_svn13_72

><td class="source">      if ( (4 === poly.length) &amp;&amp; ( CV.isContourConvex(poly) ) ){<br></td></tr
><tr
id=sl_svn13_73

><td class="source"><br></td></tr
><tr
id=sl_svn13_74

><td class="source">        if ( CV.minEdgeLength(poly) &gt;= minLength){<br></td></tr
><tr
id=sl_svn13_75

><td class="source">          candidates.push(poly);<br></td></tr
><tr
id=sl_svn13_76

><td class="source">        }<br></td></tr
><tr
id=sl_svn13_77

><td class="source">      }<br></td></tr
><tr
id=sl_svn13_78

><td class="source">    }<br></td></tr
><tr
id=sl_svn13_79

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_80

><td class="source"><br></td></tr
><tr
id=sl_svn13_81

><td class="source">  return candidates;<br></td></tr
><tr
id=sl_svn13_82

><td class="source">};<br></td></tr
><tr
id=sl_svn13_83

><td class="source"><br></td></tr
><tr
id=sl_svn13_84

><td class="source">AR.Detector.prototype.clockwiseCorners = function(candidates){<br></td></tr
><tr
id=sl_svn13_85

><td class="source">  var len = candidates.length, dx1, dx2, dy1, dy2, swap, i;<br></td></tr
><tr
id=sl_svn13_86

><td class="source"><br></td></tr
><tr
id=sl_svn13_87

><td class="source">  for (i = 0; i &lt; len; ++ i){<br></td></tr
><tr
id=sl_svn13_88

><td class="source">    dx1 = candidates[i][1].x - candidates[i][0].x;<br></td></tr
><tr
id=sl_svn13_89

><td class="source">    dy1 = candidates[i][1].y - candidates[i][0].y;<br></td></tr
><tr
id=sl_svn13_90

><td class="source">    dx2 = candidates[i][2].x - candidates[i][0].x;<br></td></tr
><tr
id=sl_svn13_91

><td class="source">    dy2 = candidates[i][2].y - candidates[i][0].y;<br></td></tr
><tr
id=sl_svn13_92

><td class="source"><br></td></tr
><tr
id=sl_svn13_93

><td class="source">    if ( (dx1 * dy2 - dy1 * dx2) &lt; 0){<br></td></tr
><tr
id=sl_svn13_94

><td class="source">      swap = candidates[i][1];<br></td></tr
><tr
id=sl_svn13_95

><td class="source">      candidates[i][1] = candidates[i][3];<br></td></tr
><tr
id=sl_svn13_96

><td class="source">      candidates[i][3] = swap;<br></td></tr
><tr
id=sl_svn13_97

><td class="source">    }<br></td></tr
><tr
id=sl_svn13_98

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_99

><td class="source"><br></td></tr
><tr
id=sl_svn13_100

><td class="source">  return candidates;<br></td></tr
><tr
id=sl_svn13_101

><td class="source">};<br></td></tr
><tr
id=sl_svn13_102

><td class="source"><br></td></tr
><tr
id=sl_svn13_103

><td class="source">AR.Detector.prototype.notTooNear = function(candidates, minDist){<br></td></tr
><tr
id=sl_svn13_104

><td class="source">  var notTooNear = [], len = candidates.length, dist, dx, dy, i, j, k;<br></td></tr
><tr
id=sl_svn13_105

><td class="source"><br></td></tr
><tr
id=sl_svn13_106

><td class="source">  for (i = 0; i &lt; len; ++ i){<br></td></tr
><tr
id=sl_svn13_107

><td class="source">  <br></td></tr
><tr
id=sl_svn13_108

><td class="source">    for (j = i + 1; j &lt; len; ++ j){<br></td></tr
><tr
id=sl_svn13_109

><td class="source">      dist = 0;<br></td></tr
><tr
id=sl_svn13_110

><td class="source">      <br></td></tr
><tr
id=sl_svn13_111

><td class="source">      for (k = 0; k &lt; 4; ++ k){<br></td></tr
><tr
id=sl_svn13_112

><td class="source">        dx = candidates[i][k].x - candidates[j][k].x;<br></td></tr
><tr
id=sl_svn13_113

><td class="source">        dy = candidates[i][k].y - candidates[j][k].y;<br></td></tr
><tr
id=sl_svn13_114

><td class="source">      <br></td></tr
><tr
id=sl_svn13_115

><td class="source">        dist += dx * dx + dy * dy;<br></td></tr
><tr
id=sl_svn13_116

><td class="source">      }<br></td></tr
><tr
id=sl_svn13_117

><td class="source">      <br></td></tr
><tr
id=sl_svn13_118

><td class="source">      if ( (dist / 4) &lt; (minDist * minDist) ){<br></td></tr
><tr
id=sl_svn13_119

><td class="source">      <br></td></tr
><tr
id=sl_svn13_120

><td class="source">        if ( CV.perimeter( candidates[i] ) &lt; CV.perimeter( candidates[j] ) ){<br></td></tr
><tr
id=sl_svn13_121

><td class="source">          candidates[i].tooNear = true;<br></td></tr
><tr
id=sl_svn13_122

><td class="source">        }else{<br></td></tr
><tr
id=sl_svn13_123

><td class="source">          candidates[j].tooNear = true;<br></td></tr
><tr
id=sl_svn13_124

><td class="source">        }<br></td></tr
><tr
id=sl_svn13_125

><td class="source">      }<br></td></tr
><tr
id=sl_svn13_126

><td class="source">    }<br></td></tr
><tr
id=sl_svn13_127

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_128

><td class="source"><br></td></tr
><tr
id=sl_svn13_129

><td class="source">  for (i = 0; i &lt; len; ++ i){<br></td></tr
><tr
id=sl_svn13_130

><td class="source">    if ( !candidates[i].tooNear ){<br></td></tr
><tr
id=sl_svn13_131

><td class="source">      notTooNear.push( candidates[i] );<br></td></tr
><tr
id=sl_svn13_132

><td class="source">    }<br></td></tr
><tr
id=sl_svn13_133

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_134

><td class="source"><br></td></tr
><tr
id=sl_svn13_135

><td class="source">  return notTooNear;<br></td></tr
><tr
id=sl_svn13_136

><td class="source">};<br></td></tr
><tr
id=sl_svn13_137

><td class="source"><br></td></tr
><tr
id=sl_svn13_138

><td class="source">AR.Detector.prototype.findMarkers = function(imageSrc, candidates, warpSize){<br></td></tr
><tr
id=sl_svn13_139

><td class="source">  var markers = [], len = candidates.length, candidate, marker, i;<br></td></tr
><tr
id=sl_svn13_140

><td class="source"><br></td></tr
><tr
id=sl_svn13_141

><td class="source">  for (i = 0; i &lt; len; ++ i){<br></td></tr
><tr
id=sl_svn13_142

><td class="source">    candidate = candidates[i];<br></td></tr
><tr
id=sl_svn13_143

><td class="source"><br></td></tr
><tr
id=sl_svn13_144

><td class="source">    CV.warp(imageSrc, this.homography, candidate, warpSize);<br></td></tr
><tr
id=sl_svn13_145

><td class="source">  <br></td></tr
><tr
id=sl_svn13_146

><td class="source">    CV.threshold(this.homography, this.homography, CV.otsu(this.homography) );<br></td></tr
><tr
id=sl_svn13_147

><td class="source"><br></td></tr
><tr
id=sl_svn13_148

><td class="source">    marker = this.getMarker(this.homography, candidate);<br></td></tr
><tr
id=sl_svn13_149

><td class="source">    if (marker){<br></td></tr
><tr
id=sl_svn13_150

><td class="source">      markers.push(marker);<br></td></tr
><tr
id=sl_svn13_151

><td class="source">    }<br></td></tr
><tr
id=sl_svn13_152

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_153

><td class="source">  <br></td></tr
><tr
id=sl_svn13_154

><td class="source">  return markers;<br></td></tr
><tr
id=sl_svn13_155

><td class="source">};<br></td></tr
><tr
id=sl_svn13_156

><td class="source"><br></td></tr
><tr
id=sl_svn13_157

><td class="source">AR.Detector.prototype.getMarker = function(imageSrc, candidate){<br></td></tr
><tr
id=sl_svn13_158

><td class="source">  var width = (imageSrc.width / 7) &gt;&gt;&gt; 0,<br></td></tr
><tr
id=sl_svn13_159

><td class="source">      minZero = (width * width) &gt;&gt; 1,<br></td></tr
><tr
id=sl_svn13_160

><td class="source">      bits = [], rotations = [], distances = [],<br></td></tr
><tr
id=sl_svn13_161

><td class="source">      square, pair, inc, i, j;<br></td></tr
><tr
id=sl_svn13_162

><td class="source"><br></td></tr
><tr
id=sl_svn13_163

><td class="source">  for (i = 0; i &lt; 7; ++ i){<br></td></tr
><tr
id=sl_svn13_164

><td class="source">    inc = (0 === i || 6 === i)? 1: 6;<br></td></tr
><tr
id=sl_svn13_165

><td class="source">    <br></td></tr
><tr
id=sl_svn13_166

><td class="source">    for (j = 0; j &lt; 7; j += inc){<br></td></tr
><tr
id=sl_svn13_167

><td class="source">      square = {x: j * width, y: i * width, width: width, height: width};<br></td></tr
><tr
id=sl_svn13_168

><td class="source">      if ( CV.countNonZero(imageSrc, square) &gt; minZero){<br></td></tr
><tr
id=sl_svn13_169

><td class="source">        return null;<br></td></tr
><tr
id=sl_svn13_170

><td class="source">      }<br></td></tr
><tr
id=sl_svn13_171

><td class="source">    }<br></td></tr
><tr
id=sl_svn13_172

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_173

><td class="source"><br></td></tr
><tr
id=sl_svn13_174

><td class="source">  for (i = 0; i &lt; 5; ++ i){<br></td></tr
><tr
id=sl_svn13_175

><td class="source">    bits[i] = [];<br></td></tr
><tr
id=sl_svn13_176

><td class="source"><br></td></tr
><tr
id=sl_svn13_177

><td class="source">    for (j = 0; j &lt; 5; ++ j){<br></td></tr
><tr
id=sl_svn13_178

><td class="source">      square = {x: (j + 1) * width, y: (i + 1) * width, width: width, height: width};<br></td></tr
><tr
id=sl_svn13_179

><td class="source">      <br></td></tr
><tr
id=sl_svn13_180

><td class="source">      bits[i][j] = CV.countNonZero(imageSrc, square) &gt; minZero? 1: 0;<br></td></tr
><tr
id=sl_svn13_181

><td class="source">    }<br></td></tr
><tr
id=sl_svn13_182

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_183

><td class="source"><br></td></tr
><tr
id=sl_svn13_184

><td class="source">  rotations[0] = bits;<br></td></tr
><tr
id=sl_svn13_185

><td class="source">  distances[0] = this.hammingDistance( rotations[0] );<br></td></tr
><tr
id=sl_svn13_186

><td class="source">  <br></td></tr
><tr
id=sl_svn13_187

><td class="source">  pair = {first: distances[0], second: 0};<br></td></tr
><tr
id=sl_svn13_188

><td class="source">  <br></td></tr
><tr
id=sl_svn13_189

><td class="source">  for (i = 1; i &lt; 4; ++ i){<br></td></tr
><tr
id=sl_svn13_190

><td class="source">    rotations[i] = this.rotate( rotations[i - 1] );<br></td></tr
><tr
id=sl_svn13_191

><td class="source">    distances[i] = this.hammingDistance( rotations[i] );<br></td></tr
><tr
id=sl_svn13_192

><td class="source">    <br></td></tr
><tr
id=sl_svn13_193

><td class="source">    if (distances[i] &lt; pair.first){<br></td></tr
><tr
id=sl_svn13_194

><td class="source">      pair.first = distances[i];<br></td></tr
><tr
id=sl_svn13_195

><td class="source">      pair.second = i;<br></td></tr
><tr
id=sl_svn13_196

><td class="source">    }<br></td></tr
><tr
id=sl_svn13_197

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_198

><td class="source"><br></td></tr
><tr
id=sl_svn13_199

><td class="source">  if (0 !== pair.first){<br></td></tr
><tr
id=sl_svn13_200

><td class="source">    return null;<br></td></tr
><tr
id=sl_svn13_201

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_202

><td class="source"><br></td></tr
><tr
id=sl_svn13_203

><td class="source">  return new AR.Marker(<br></td></tr
><tr
id=sl_svn13_204

><td class="source">    this.mat2id( rotations[pair.second] ), <br></td></tr
><tr
id=sl_svn13_205

><td class="source">    this.rotate2(candidate, 4 - pair.second) );<br></td></tr
><tr
id=sl_svn13_206

><td class="source">};<br></td></tr
><tr
id=sl_svn13_207

><td class="source"><br></td></tr
><tr
id=sl_svn13_208

><td class="source">AR.Detector.prototype.hammingDistance = function(bits){<br></td></tr
><tr
id=sl_svn13_209

><td class="source">  var ids = [ [1,0,0,0,0], [1,0,1,1,1], [0,1,0,0,1], [0,1,1,1,0] ],<br></td></tr
><tr
id=sl_svn13_210

><td class="source">      dist = 0, sum, minSum, i, j, k;<br></td></tr
><tr
id=sl_svn13_211

><td class="source"><br></td></tr
><tr
id=sl_svn13_212

><td class="source">  for (i = 0; i &lt; 5; ++ i){<br></td></tr
><tr
id=sl_svn13_213

><td class="source">    minSum = Infinity;<br></td></tr
><tr
id=sl_svn13_214

><td class="source">    <br></td></tr
><tr
id=sl_svn13_215

><td class="source">    for (j = 0; j &lt; 4; ++ j){<br></td></tr
><tr
id=sl_svn13_216

><td class="source">      sum = 0;<br></td></tr
><tr
id=sl_svn13_217

><td class="source"><br></td></tr
><tr
id=sl_svn13_218

><td class="source">      for (k = 0; k &lt; 5; ++ k){<br></td></tr
><tr
id=sl_svn13_219

><td class="source">          sum += bits[i][k] === ids[j][k]? 0: 1;<br></td></tr
><tr
id=sl_svn13_220

><td class="source">      }<br></td></tr
><tr
id=sl_svn13_221

><td class="source"><br></td></tr
><tr
id=sl_svn13_222

><td class="source">      if (sum &lt; minSum){<br></td></tr
><tr
id=sl_svn13_223

><td class="source">        minSum = sum;<br></td></tr
><tr
id=sl_svn13_224

><td class="source">      }<br></td></tr
><tr
id=sl_svn13_225

><td class="source">    }<br></td></tr
><tr
id=sl_svn13_226

><td class="source"><br></td></tr
><tr
id=sl_svn13_227

><td class="source">    dist += minSum;<br></td></tr
><tr
id=sl_svn13_228

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_229

><td class="source"><br></td></tr
><tr
id=sl_svn13_230

><td class="source">  return dist;<br></td></tr
><tr
id=sl_svn13_231

><td class="source">};<br></td></tr
><tr
id=sl_svn13_232

><td class="source"><br></td></tr
><tr
id=sl_svn13_233

><td class="source">AR.Detector.prototype.mat2id = function(bits){<br></td></tr
><tr
id=sl_svn13_234

><td class="source">  var id = 0, i;<br></td></tr
><tr
id=sl_svn13_235

><td class="source">  <br></td></tr
><tr
id=sl_svn13_236

><td class="source">  for (i = 0; i &lt; 5; ++ i){<br></td></tr
><tr
id=sl_svn13_237

><td class="source">    id &lt;&lt;= 1;<br></td></tr
><tr
id=sl_svn13_238

><td class="source">    id |= bits[i][1];<br></td></tr
><tr
id=sl_svn13_239

><td class="source">    id &lt;&lt;= 1;<br></td></tr
><tr
id=sl_svn13_240

><td class="source">    id |= bits[i][3];<br></td></tr
><tr
id=sl_svn13_241

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_242

><td class="source"><br></td></tr
><tr
id=sl_svn13_243

><td class="source">  return id;<br></td></tr
><tr
id=sl_svn13_244

><td class="source">};<br></td></tr
><tr
id=sl_svn13_245

><td class="source"><br></td></tr
><tr
id=sl_svn13_246

><td class="source">AR.Detector.prototype.rotate = function(src){<br></td></tr
><tr
id=sl_svn13_247

><td class="source">  var dst = [], len = src.length, i, j;<br></td></tr
><tr
id=sl_svn13_248

><td class="source">  <br></td></tr
><tr
id=sl_svn13_249

><td class="source">  for (i = 0; i &lt; len; ++ i){<br></td></tr
><tr
id=sl_svn13_250

><td class="source">    dst[i] = [];<br></td></tr
><tr
id=sl_svn13_251

><td class="source">    for (j = 0; j &lt; src[i].length; ++ j){<br></td></tr
><tr
id=sl_svn13_252

><td class="source">      dst[i][j] = src[src[i].length - j - 1][i];<br></td></tr
><tr
id=sl_svn13_253

><td class="source">    }<br></td></tr
><tr
id=sl_svn13_254

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_255

><td class="source"><br></td></tr
><tr
id=sl_svn13_256

><td class="source">  return dst;<br></td></tr
><tr
id=sl_svn13_257

><td class="source">};<br></td></tr
><tr
id=sl_svn13_258

><td class="source"><br></td></tr
><tr
id=sl_svn13_259

><td class="source">AR.Detector.prototype.rotate2 = function(src, rotation){<br></td></tr
><tr
id=sl_svn13_260

><td class="source">  var dst = [], len = src.length, i;<br></td></tr
><tr
id=sl_svn13_261

><td class="source">  <br></td></tr
><tr
id=sl_svn13_262

><td class="source">  for (i = 0; i &lt; len; ++ i){<br></td></tr
><tr
id=sl_svn13_263

><td class="source">    dst[i] = src[ (rotation + i) % len ];<br></td></tr
><tr
id=sl_svn13_264

><td class="source">  }<br></td></tr
><tr
id=sl_svn13_265

><td class="source"><br></td></tr
><tr
id=sl_svn13_266

><td class="source">  return dst;<br></td></tr
><tr
id=sl_svn13_267

><td class="source">};<br></td></tr
></table></pre>
<pre><table width="100%"><tr class="cursor_stop cursor_hidden"><td></td></tr></table></pre>
</td>
</tr></table>

 
<script type="text/javascript">
 var lineNumUnderMouse = -1;
 
 function gutterOver(num) {
 gutterOut();
 var newTR = document.getElementById('gr_svn13_' + num);
 if (newTR) {
 newTR.className = 'undermouse';
 }
 lineNumUnderMouse = num;
 }
 function gutterOut() {
 if (lineNumUnderMouse != -1) {
 var oldTR = document.getElementById(
 'gr_svn13_' + lineNumUnderMouse);
 if (oldTR) {
 oldTR.className = '';
 }
 lineNumUnderMouse = -1;
 }
 }
 var numsGenState = {table_base_id: 'nums_table_'};
 var srcGenState = {table_base_id: 'src_table_'};
 var alignerRunning = false;
 var startOver = false;
 function setLineNumberHeights() {
 if (alignerRunning) {
 startOver = true;
 return;
 }
 numsGenState.chunk_id = 0;
 numsGenState.table = document.getElementById('nums_table_0');
 numsGenState.row_num = 0;
 if (!numsGenState.table) {
 return; // Silently exit if no file is present.
 }
 srcGenState.chunk_id = 0;
 srcGenState.table = document.getElementById('src_table_0');
 srcGenState.row_num = 0;
 alignerRunning = true;
 continueToSetLineNumberHeights();
 }
 function rowGenerator(genState) {
 if (genState.row_num < genState.table.rows.length) {
 var currentRow = genState.table.rows[genState.row_num];
 genState.row_num++;
 return currentRow;
 }
 var newTable = document.getElementById(
 genState.table_base_id + (genState.chunk_id + 1));
 if (newTable) {
 genState.chunk_id++;
 genState.row_num = 0;
 genState.table = newTable;
 return genState.table.rows[0];
 }
 return null;
 }
 var MAX_ROWS_PER_PASS = 1000;
 function continueToSetLineNumberHeights() {
 var rowsInThisPass = 0;
 var numRow = 1;
 var srcRow = 1;
 while (numRow && srcRow && rowsInThisPass < MAX_ROWS_PER_PASS) {
 numRow = rowGenerator(numsGenState);
 srcRow = rowGenerator(srcGenState);
 rowsInThisPass++;
 if (numRow && srcRow) {
 if (numRow.offsetHeight != srcRow.offsetHeight) {
 numRow.firstChild.style.height = srcRow.offsetHeight + 'px';
 }
 }
 }
 if (rowsInThisPass >= MAX_ROWS_PER_PASS) {
 setTimeout(continueToSetLineNumberHeights, 10);
 } else {
 alignerRunning = false;
 if (startOver) {
 startOver = false;
 setTimeout(setLineNumberHeights, 500);
 }
 }
 }
 function initLineNumberHeights() {
 // Do 2 complete passes, because there can be races
 // between this code and prettify.
 startOver = true;
 setTimeout(setLineNumberHeights, 250);
 window.onresize = setLineNumberHeights;
 }
 initLineNumberHeights();
</script>

 
 
 <div id="log">
 <div style="text-align:right">
 <a class="ifCollapse" href="#" onclick="_toggleMeta(this); return false">Show details</a>
 <a class="ifExpand" href="#" onclick="_toggleMeta(this); return false">Hide details</a>
 </div>
 <div class="ifExpand">
 
 
 <div class="pmeta_bubble_bg" style="border:1px solid white">
 <div class="round4"></div>
 <div class="round2"></div>
 <div class="round1"></div>
 <div class="box-inner">
 <div id="changelog">
 <p>Change log</p>
 <div>
 <a href="/p/js-aruco/source/detail?spec=svn13&amp;r=12">r12</a>
 by jcmellado
 on Mar 19, 2012
 &nbsp; <a href="/p/js-aruco/source/diff?spec=svn13&r=12&amp;format=side&amp;path=/trunk/src/aruco.js&amp;old_path=/trunk/src/aruco.js&amp;old=7">Diff</a>
 </div>
 <pre>- Added posit1 and posit2 to estimate 3d
pose from 2d points
- Used fast Stack Box Blur instead of slow
Gaussian Blur
- Added supersampling to warp function
- Reworked loops, &quot;for&quot; seems now faster
than &quot;while&quot;
- Added new demo to debug POSIT algorithm
- Updated old demos to use getUserMedia
</pre>
 </div>
 
 
 
 
 
 
 <script type="text/javascript">
 var detail_url = '/p/js-aruco/source/detail?r=12&spec=svn13';
 var publish_url = '/p/js-aruco/source/detail?r=12&spec=svn13#publish';
 // describe the paths of this revision in javascript.
 var changed_paths = [];
 var changed_urls = [];
 
 changed_paths.push('/trunk/license/AForge.NET.txt');
 changed_urls.push('/p/js-aruco/source/browse/trunk/license/AForge.NET.txt?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/license/StackBoxBlur.txt');
 changed_urls.push('/p/js-aruco/source/browse/trunk/license/StackBoxBlur.txt?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit/aruco.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit/aruco.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit/cv.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit/cv.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit/debug-posit.html');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit/debug-posit.html?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit/libs');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit/libs?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit/libs/Three.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit/libs/Three.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit/posit1.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit/posit1.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit/posit2.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit/posit2.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit/svd.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit/svd.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit/textures');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit/textures?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug-posit/textures/earth.jpg');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug-posit/textures/earth.jpg?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug/aruco.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug/aruco.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug/cv.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug/cv.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug/debug.html');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug/debug.html?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug/libs');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug/libs?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/debug/libs/polyfill.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/debug/libs/polyfill.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/getusermedia/aruco.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/getusermedia/aruco.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/getusermedia/cv.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/getusermedia/cv.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/getusermedia/getusermedia.html');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/getusermedia/getusermedia.html?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/getusermedia/libs');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/getusermedia/libs?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/getusermedia/libs/polyfill.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/getusermedia/libs/polyfill.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/webcam/aruco.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/webcam/aruco.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/webcam/cv.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/webcam/cv.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/samples/webcam/webcam.html');
 changed_urls.push('/p/js-aruco/source/browse/trunk/samples/webcam/webcam.html?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/src/aruco.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/src/aruco.js?r\x3d12\x26spec\x3dsvn13');
 
 var selected_path = '/trunk/src/aruco.js';
 
 
 changed_paths.push('/trunk/src/cv.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/src/cv.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/src/posit1.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/src/posit1.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/src/posit2.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/src/posit2.js?r\x3d12\x26spec\x3dsvn13');
 
 
 changed_paths.push('/trunk/src/svd.js');
 changed_urls.push('/p/js-aruco/source/browse/trunk/src/svd.js?r\x3d12\x26spec\x3dsvn13');
 
 
 function getCurrentPageIndex() {
 for (var i = 0; i < changed_paths.length; i++) {
 if (selected_path == changed_paths[i]) {
 return i;
 }
 }
 }
 function getNextPage() {
 var i = getCurrentPageIndex();
 if (i < changed_paths.length - 1) {
 return changed_urls[i + 1];
 }
 return null;
 }
 function getPreviousPage() {
 var i = getCurrentPageIndex();
 if (i > 0) {
 return changed_urls[i - 1];
 }
 return null;
 }
 function gotoNextPage() {
 var page = getNextPage();
 if (!page) {
 page = detail_url;
 }
 window.location = page;
 }
 function gotoPreviousPage() {
 var page = getPreviousPage();
 if (!page) {
 page = detail_url;
 }
 window.location = page;
 }
 function gotoDetailPage() {
 window.location = detail_url;
 }
 function gotoPublishPage() {
 window.location = publish_url;
 }
</script>

 
 <style type="text/css">
 #review_nav {
 border-top: 3px solid white;
 padding-top: 6px;
 margin-top: 1em;
 }
 #review_nav td {
 vertical-align: middle;
 }
 #review_nav select {
 margin: .5em 0;
 }
 </style>
 <div id="review_nav">
 <table><tr><td>Go to:&nbsp;</td><td>
 <select name="files_in_rev" onchange="window.location=this.value">
 
 <option value="/p/js-aruco/source/browse/trunk/license/AForge.NET.txt?r=12&amp;spec=svn13"
 
 >/trunk/license/AForge.NET.txt</option>
 
 <option value="/p/js-aruco/source/browse/trunk/license/StackBoxBlur.txt?r=12&amp;spec=svn13"
 
 >/trunk/license/StackBoxBlur.txt</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit?r=12&amp;spec=svn13"
 
 >/trunk/samples/debug-posit</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit/aruco.js?r=12&amp;spec=svn13"
 
 >/trunk/samples/debug-posit/aruco.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit/cv.js?r=12&amp;spec=svn13"
 
 >/trunk/samples/debug-posit/cv.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit/debug-posit.html?r=12&amp;spec=svn13"
 
 >...les/debug-posit/debug-posit.html</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit/libs?r=12&amp;spec=svn13"
 
 >/trunk/samples/debug-posit/libs</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit/libs/Three.js?r=12&amp;spec=svn13"
 
 >...amples/debug-posit/libs/Three.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit/posit1.js?r=12&amp;spec=svn13"
 
 >...nk/samples/debug-posit/posit1.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit/posit2.js?r=12&amp;spec=svn13"
 
 >...nk/samples/debug-posit/posit2.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit/svd.js?r=12&amp;spec=svn13"
 
 >/trunk/samples/debug-posit/svd.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit/textures?r=12&amp;spec=svn13"
 
 >/trunk/samples/debug-posit/textures</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug-posit/textures/earth.jpg?r=12&amp;spec=svn13"
 
 >...s/debug-posit/textures/earth.jpg</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug/aruco.js?r=12&amp;spec=svn13"
 
 >/trunk/samples/debug/aruco.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug/cv.js?r=12&amp;spec=svn13"
 
 >/trunk/samples/debug/cv.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug/debug.html?r=12&amp;spec=svn13"
 
 >/trunk/samples/debug/debug.html</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug/libs?r=12&amp;spec=svn13"
 
 >/trunk/samples/debug/libs</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/debug/libs/polyfill.js?r=12&amp;spec=svn13"
 
 >...k/samples/debug/libs/polyfill.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/getusermedia/aruco.js?r=12&amp;spec=svn13"
 
 >...nk/samples/getusermedia/aruco.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/getusermedia/cv.js?r=12&amp;spec=svn13"
 
 >/trunk/samples/getusermedia/cv.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/getusermedia/getusermedia.html?r=12&amp;spec=svn13"
 
 >...s/getusermedia/getusermedia.html</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/getusermedia/libs?r=12&amp;spec=svn13"
 
 >/trunk/samples/getusermedia/libs</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/getusermedia/libs/polyfill.js?r=12&amp;spec=svn13"
 
 >...es/getusermedia/libs/polyfill.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/webcam/aruco.js?r=12&amp;spec=svn13"
 
 >/trunk/samples/webcam/aruco.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/webcam/cv.js?r=12&amp;spec=svn13"
 
 >/trunk/samples/webcam/cv.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/samples/webcam/webcam.html?r=12&amp;spec=svn13"
 
 >/trunk/samples/webcam/webcam.html</option>
 
 <option value="/p/js-aruco/source/browse/trunk/src/aruco.js?r=12&amp;spec=svn13"
 selected="selected"
 >/trunk/src/aruco.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/src/cv.js?r=12&amp;spec=svn13"
 
 >/trunk/src/cv.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/src/posit1.js?r=12&amp;spec=svn13"
 
 >/trunk/src/posit1.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/src/posit2.js?r=12&amp;spec=svn13"
 
 >/trunk/src/posit2.js</option>
 
 <option value="/p/js-aruco/source/browse/trunk/src/svd.js?r=12&amp;spec=svn13"
 
 >/trunk/src/svd.js</option>
 
 </select>
 </td></tr></table>
 
 
 



 
 </div>
 
 
 </div>
 <div class="round1"></div>
 <div class="round2"></div>
 <div class="round4"></div>
 </div>
 <div class="pmeta_bubble_bg" style="border:1px solid white">
 <div class="round4"></div>
 <div class="round2"></div>
 <div class="round1"></div>
 <div class="box-inner">
 <div id="older_bubble">
 <p>Older revisions</p>
 
 
 <div class="closed" style="margin-bottom:3px;" >
 <img class="ifClosed" onclick="_toggleHidden(this)" src="https://ssl.gstatic.com/codesite/ph/images/plus.gif" >
 <img class="ifOpened" onclick="_toggleHidden(this)" src="https://ssl.gstatic.com/codesite/ph/images/minus.gif" >
 <a href="/p/js-aruco/source/detail?spec=svn13&r=7">r7</a>
 by jcmellado
 on Feb 16, 2012
 &nbsp; <a href="/p/js-aruco/source/diff?spec=svn13&r=7&amp;format=side&amp;path=/trunk/src/aruco.js&amp;old_path=/trunk/src/aruco.js&amp;old=6">Diff</a>
 <br>
 <pre class="ifOpened">Added license</pre>
 </div>
 
 <div class="closed" style="margin-bottom:3px;" >
 <img class="ifClosed" onclick="_toggleHidden(this)" src="https://ssl.gstatic.com/codesite/ph/images/plus.gif" >
 <img class="ifOpened" onclick="_toggleHidden(this)" src="https://ssl.gstatic.com/codesite/ph/images/minus.gif" >
 <a href="/p/js-aruco/source/detail?spec=svn13&r=6">r6</a>
 by jcmellado
 on Nov 28, 2011
 &nbsp; <a href="/p/js-aruco/source/diff?spec=svn13&r=6&amp;format=side&amp;path=/trunk/src/aruco.js&amp;old_path=/trunk/src/aruco.js&amp;old=3">Diff</a>
 <br>
 <pre class="ifOpened">Add debug options and a new example.</pre>
 </div>
 
 <div class="closed" style="margin-bottom:3px;" >
 <img class="ifClosed" onclick="_toggleHidden(this)" src="https://ssl.gstatic.com/codesite/ph/images/plus.gif" >
 <img class="ifOpened" onclick="_toggleHidden(this)" src="https://ssl.gstatic.com/codesite/ph/images/minus.gif" >
 <a href="/p/js-aruco/source/detail?spec=svn13&r=3">r3</a>
 by jcmellado
 on Jun 11, 2011
 &nbsp; <a href="/p/js-aruco/source/diff?spec=svn13&r=3&amp;format=side&amp;path=/trunk/src/aruco.js&amp;old_path=/trunk/src/aruco.js&amp;old=2">Diff</a>
 <br>
 <pre class="ifOpened">Optimization: Avoided unnecesary
memory allocation.</pre>
 </div>
 
 
 <a href="/p/js-aruco/source/list?path=/trunk/src/aruco.js&start=12">All revisions of this file</a>
 </div>
 </div>
 <div class="round1"></div>
 <div class="round2"></div>
 <div class="round4"></div>
 </div>
 
 <div class="pmeta_bubble_bg" style="border:1px solid white">
 <div class="round4"></div>
 <div class="round2"></div>
 <div class="round1"></div>
 <div class="box-inner">
 <div id="fileinfo_bubble">
 <p>File info</p>
 
 <div>Size: 6802 bytes,
 267 lines</div>
 
 <div><a href="//js-aruco.googlecode.com/svn/trunk/src/aruco.js">View raw file</a></div>
 </div>
 
 </div>
 <div class="round1"></div>
 <div class="round2"></div>
 <div class="round4"></div>
 </div>
 </div>
 </div>


</div>

</div>
</div>

<script src="https://ssl.gstatic.com/codesite/ph/17134919371905794448/js/prettify/prettify.js"></script>
<script type="text/javascript">prettyPrint();</script>


<script src="https://ssl.gstatic.com/codesite/ph/17134919371905794448/js/source_file_scripts.js"></script>

 <script type="text/javascript" src="https://ssl.gstatic.com/codesite/ph/17134919371905794448/js/kibbles.js"></script>
 <script type="text/javascript">
 var lastStop = null;
 var initialized = false;
 
 function updateCursor(next, prev) {
 if (prev && prev.element) {
 prev.element.className = 'cursor_stop cursor_hidden';
 }
 if (next && next.element) {
 next.element.className = 'cursor_stop cursor';
 lastStop = next.index;
 }
 }
 
 function pubRevealed(data) {
 updateCursorForCell(data.cellId, 'cursor_stop cursor_hidden');
 if (initialized) {
 reloadCursors();
 }
 }
 
 function draftRevealed(data) {
 updateCursorForCell(data.cellId, 'cursor_stop cursor_hidden');
 if (initialized) {
 reloadCursors();
 }
 }
 
 function draftDestroyed(data) {
 updateCursorForCell(data.cellId, 'nocursor');
 if (initialized) {
 reloadCursors();
 }
 }
 function reloadCursors() {
 kibbles.skipper.reset();
 loadCursors();
 if (lastStop != null) {
 kibbles.skipper.setCurrentStop(lastStop);
 }
 }
 // possibly the simplest way to insert any newly added comments
 // is to update the class of the corresponding cursor row,
 // then refresh the entire list of rows.
 function updateCursorForCell(cellId, className) {
 var cell = document.getElementById(cellId);
 // we have to go two rows back to find the cursor location
 var row = getPreviousElement(cell.parentNode);
 row.className = className;
 }
 // returns the previous element, ignores text nodes.
 function getPreviousElement(e) {
 var element = e.previousSibling;
 if (element.nodeType == 3) {
 element = element.previousSibling;
 }
 if (element && element.tagName) {
 return element;
 }
 }
 function loadCursors() {
 // register our elements with skipper
 var elements = CR_getElements('*', 'cursor_stop');
 var len = elements.length;
 for (var i = 0; i < len; i++) {
 var element = elements[i]; 
 element.className = 'cursor_stop cursor_hidden';
 kibbles.skipper.append(element);
 }
 }
 function toggleComments() {
 CR_toggleCommentDisplay();
 reloadCursors();
 }
 function keysOnLoadHandler() {
 // setup skipper
 kibbles.skipper.addStopListener(
 kibbles.skipper.LISTENER_TYPE.PRE, updateCursor);
 // Set the 'offset' option to return the middle of the client area
 // an option can be a static value, or a callback
 kibbles.skipper.setOption('padding_top', 50);
 // Set the 'offset' option to return the middle of the client area
 // an option can be a static value, or a callback
 kibbles.skipper.setOption('padding_bottom', 100);
 // Register our keys
 kibbles.skipper.addFwdKey("n");
 kibbles.skipper.addRevKey("p");
 kibbles.keys.addKeyPressListener(
 'u', function() { window.location = detail_url; });
 kibbles.keys.addKeyPressListener(
 'r', function() { window.location = detail_url + '#publish'; });
 
 kibbles.keys.addKeyPressListener('j', gotoNextPage);
 kibbles.keys.addKeyPressListener('k', gotoPreviousPage);
 
 
 }
 </script>
<script src="https://ssl.gstatic.com/codesite/ph/17134919371905794448/js/code_review_scripts.js"></script>
<script type="text/javascript">
 function showPublishInstructions() {
 var element = document.getElementById('review_instr');
 if (element) {
 element.className = 'opened';
 }
 }
 var codereviews;
 function revsOnLoadHandler() {
 // register our source container with the commenting code
 var paths = {'svn13': '/trunk/src/aruco.js'}
 codereviews = CR_controller.setup(
 {"profileUrl":"/u/118373917163349025947/","token":"7iFwV67rt_yLRB5Zg8THl17C7h4:1352635814309","assetHostPath":"https://ssl.gstatic.com/codesite/ph","domainName":null,"assetVersionPath":"https://ssl.gstatic.com/codesite/ph/17134919371905794448","projectHomeUrl":"/p/js-aruco","relativeBaseUrl":"","projectName":"js-aruco","loggedInUserEmail":"Myztix89@gmail.com"}, '', 'svn13', paths,
 CR_BrowseIntegrationFactory);
 
 codereviews.registerActivityListener(CR_ActivityType.REVEAL_DRAFT_PLATE, showPublishInstructions);
 
 codereviews.registerActivityListener(CR_ActivityType.REVEAL_PUB_PLATE, pubRevealed);
 codereviews.registerActivityListener(CR_ActivityType.REVEAL_DRAFT_PLATE, draftRevealed);
 codereviews.registerActivityListener(CR_ActivityType.DISCARD_DRAFT_COMMENT, draftDestroyed);
 
 
 
 
 
 
 
 var initialized = true;
 reloadCursors();
 }
 window.onload = function() {keysOnLoadHandler(); revsOnLoadHandler();};

</script>
<script type="text/javascript" src="https://ssl.gstatic.com/codesite/ph/17134919371905794448/js/dit_scripts.js"></script>

 
 
 
 <script type="text/javascript" src="https://ssl.gstatic.com/codesite/ph/17134919371905794448/js/ph_core.js"></script>
 
 
 
 
</div> 

<div id="footer" dir="ltr">
 <div class="text">
 <a href="/projecthosting/terms.html">Terms</a> -
 <a href="http://www.google.com/privacy.html">Privacy</a> -
 <a href="/p/support/">Project Hosting Help</a>
 </div>
</div>
 <div class="hostedBy" style="margin-top: -20px;">
 <span style="vertical-align: top;">Powered by <a href="http://code.google.com/projecthosting/">Google Project Hosting</a></span>
 </div>

 
 


 
 </body>
</html>

