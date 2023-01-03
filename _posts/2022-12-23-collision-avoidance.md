---
layout: post
title: 'Collision Avoidance with ORCA'
use_math: true
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

The charts below provide an interactive example. The chart on the left represents the space of possible velocities agent A can take. The chart on the right displays the positions of agents A (blue) and B (red). Click a point in velocity space and  agent A will move with that velocity for one second before returning to its starting location. The red region in velocity space is $VO^{\tau}_{A\|B}$. Verify that velocities within this region cause A to collide with B.

<div style='display: flex; width: 100%; height: 500px'>
  <div id='velocitySpace' style='flex: 1; padding-right: 5px;'></div>
  <div id='positionSpace' style='flex: 1; padding-left: 5px;'></div>
</div>

If agent B is also moving with some constant velocity $v_B$ in the time window, our velocity obstacle is correspondingly translated by the vector $v_B$. Right click somewhere in velocity space to set the velocity of agent B, and notice how the velocity obstacle is translated accordingly.

Things get harder when we don't know for sure which velocity agent B will choose in the next time window. Suppose all we know is that agent B will choose from a set of velocities $V_B$. What is the set of velocities for agent A that will avoid a collision, *no matter which* velocity agent B selects from $V_B$?

In the next interactive, an annotation shows the set $V_B$ in velocity space. When you select a $v_A$, agent B will try its best to choose a velocity from $V_B$ that will result in a collision.

<div style='display: flex; width: 100%; height: 500px'>
  <div id='velocitySpace2' style='flex: 1; padding-right: 5px;'></div>
  <div id='positionSpace2' style='flex: 1; padding-left: 5px;'></div>
</div>

<script type='module' src="{{ base.url | prepend: site.url }}/assets/js/velocityObstacle.js">