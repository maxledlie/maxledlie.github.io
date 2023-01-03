---
layout: post
title: 'Binary Search Tree'
use_math: true
---

<script src="https://d3js.org/d3.v7.min.js"></script>

<div style='display: flex;'>
  <label for='key' style='margin-right: 10px;'>Enter a key:</label>
  <input type='number' min='0' max='99' id='key' name='key'>
  <input type='submit' id='submitInsert' value='Insert'>
</div>
<div id='container' style='width: 100%; height: 1000px; user-select: none;'>
</div>

<script type='module' src="{{ base.url | prepend: site.url }}/assets/js/bstDemo.js"></script>