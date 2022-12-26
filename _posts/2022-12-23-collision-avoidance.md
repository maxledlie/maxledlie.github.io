---
layout: post
title: 'Collision Avoidance with ORCA'
use_math: false
---

<script src="https://d3js.org/d3.v7.min.js"></script>

How do units in real time strategy games manage to navigate around one another without collision?
They will often encounter dozens of other units on their way to the destination, each of which is in turn trying to navigate towards their own goal.

We are familiar with this problem from our own lives: walking down the street we realise we are on collision course with a pedestrian coming the other way. After some false starts we reach a nonverbal agreement as to which side of the pavement we should each take, and we can continue without any awkward contact.

We'd like our digital soldiers to emulate this behaviour. A [paper](https://gamma.cs.unc.edu/ORCA/) by Jur van den Berg, Stephen J. Guy, Ming Lin, and Dinesh Manocha at the University of North Carolina at Chapel Hill develops a mathematical approach to this problem that lets agents find a "collision-avoiding path" to their destination. Impressively, this approach requires no top-level control, and no communication between agents! As long as they are all running the same algorithm and can sense the location of nearby agents, they will never collide, and will eventually reach their destination in all but the most cramped of conditions.

Here is an example of this technique in action:

<canvas style='background-color: lightblue; width: 100%; height: 400px'>
</canvas>

Avoiding collision for all time is a daunting task. Instead, let's pick some window of time $\tau$ (for example, one second), and commit to avoiding any collisions in that window. Each agent wants to find a velocity that it can move with for the upcoming time window and be sure it will not collide.

To make things as simple as possible, first suppose there are just two agents, $A$ and $B$. $B$ is just sitting still for now, and $A$ wants to know which velocities it can take. The authors use the concept of a *velocity obstacle* $VO^{\tau}_{A\|B}$. This is the set of velocities that $A$ can use that *will* result in a collision with $B$ within the time window $\tau$.

<div id='velocityObstacleDemo'>
</div>
<script src="{{ base.url | prepend: site.url }}/assets/js/velocityObstacle.js">