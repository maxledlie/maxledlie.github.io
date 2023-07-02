---
layout: post
title: 'Linear Programming'
use_math: true
---

<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>

These are some notes on linear programming, adapted from the discussion in Computational Geometry: Algorithms and Applications by de Berg, van Kreveld, Overmars and Schwarzkopf.

Linear programming allows us to find the optimal value of a function whose domain is restricted by a number of linear constraints.

In the following interactive, you can define a domain by dragging multiple regions.

<div id='container' style='width: 100%; height: 500px; user-select: none;'>
</div>

<script type='module' src="{{ base.url | prepend: site.url }}/assets/js/halfPlaneIntersection.js">