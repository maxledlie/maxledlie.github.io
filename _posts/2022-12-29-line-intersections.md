---
layout: post
title: 'Line Segment Intersections'
use_math: true
---

<script src="https://d3js.org/d3.v7.min.js"></script>

One of the most fundamental problems in computational geometry is to the find the intersection points
of a set of line segments.

It's easy to determine whether any two line segments intersect. A brute force approach would simply be
to check every pair of line segments for intersections, adding each one we find to a list.

<div id='container' style='width: 100%; height: 500px; user-select: none;'>
</div>

<script type='module' src="{{ base.url | prepend: site.url }}/assets/js/lineSegmentIntersection.js"></script>

This method is $O(n^2)$ in the number of line segments. We can do this a lot more efficiently if we only look for intersections between segments that may overlap.