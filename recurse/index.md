---
layout: default
title: Home
---

*This page contains my mostly unabridged daily check-in posts from my time at [The Recurse Center](recurse.com). It's going to get long! This may be of interest if you are considering attending RC, or if you know me personally and are curious what I'm up to.*

---

## Day 1

Hello RC, hello NYC!

I flew in on Saturday from Edinburgh, Scotland to spend the first two weeks in person.
On the flight, and on the evenings before, I sped through the first few chapters of the [Ray Tracer Challenge](http://raytracerchallenge.com/). This is my second time working through the book. Last time I implemented the ray tracer in C#. This time I'm doing it in plain C as part of my goal to learn some lower-level programming languages. Once I've encountered all the pain points with C first-hand, I'd like to try rewriting portions in Zig/Rust to see how they solve these problems.

I know there's a graphics interest group forming so would like to get involved in that.
I'd also be interested in forming an [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/) reading group with anyone else interested in learning about operating systems.

I managed to ray-trace an (optionally squashed) sphere :)
Also made some groovy glitch-art by using the wrong vector in a dot-product and forgetting to clamp color intensities between zero and one.
Started a repo at [github.com/maxledlie/beaker](github.com/maxledlie/beaker).
Excited and a little nervous to meet people in person tomorrow.

<div>
    <img src="/assets/images/recurse-posts/working.png" style="display: inline-block; width: 200px;"/>
    <img src="/assets/images/recurse-posts/unclamped_colors.png" style="display: inline-block; width: 200px;"/>
</div>

## Day 2

A perennial problem in my programming life is that I get really excited about some project idea and can't stop thinking about it all night. This means I get little to no sleep and can barely actually work on it the next day. I had this to the max last night after hearing about all the cool things everyone is working on. Maybe I need to start meditating to practise quietening the mind. I think of it as a good problem though :)

Anyway, yesterday after the morning meet and greets I did a couple pairing sessions. First with Frédéric, where we took the first steps on his project to write a WebAssembly runtime in C. We parsed the smallest possible Wasm program. Thanks Frédéric for helping me understand Wasm a bit better.

Then worked with Ben on the Mastermind challenge. We got all tests passing in the last possible moments for optimal thrills.

## Day 3

Good start to yesterday. Went for a coffee chat with Adrian. Walked around Dumbo and talked urban development/transit/infrastructure among other things. Thanks Adrian for showing me around!

Spoke with Flavius about experiences learning C. We've both found that while there are plenty of resources for learning the mechanics of the language, there are far fewer for how to lay out, debug and build large projects. Also, hearing about Elixir from Flavius made me want to check it out.

I had planned to join checkin calls and creative coding, but felt the urge to do some heads-down coding on the ray tracer in the afternoon. This was a bit of a breakthrough coding session for me: wrestled with a really gnarly memory-related bug for five hours, and eventually cracked it.

In the process, I learned how to inspect memory content's with gdb's examine instruction, and got a much better understanding of why Rust's concepts of ownership and lifetimes are needed. Planning to write about this in more detail as it may be of interest to the **Learning Rust** group.

Already feeling the benefit of being in a dedicated space for learning. If I'd encountered this bug in the evening after a day of work, I would probably have given up on the project after a few hours.

## Day 4

Struggling to remember yesterday. So much happened it's kind of a blur.

- Got multiple blobs rendering in the ray tracer
- Joined the virtual check-ins: fun to hear from some of the remote contingent who I haven't spoken with much yet
- Joined the shader jam, which was really fun. Paired with Alex and made https://www.shadertoy.com/view/WcBBz3. Hoping to find an hour to add to it next week.
- Fun lunch chats about graphics and art galleries
- Inaugural OSTEP reading group call. Sorry, Lean Interest Group, for stealing your Zoom room!
- Extremely cool presentations. Especially enjoyed:
    - Rust lifetimes from Katrina. Thinking of doing a related talk where I show how all the memory bugs I've been running into in C would be impossible in Rust.
    - Iridescent materials from Sasha. Maybe we could add iridescent materials to my ray tracer once it's a bit further along?
    - All the things you can do with text selections from Nolen. Just so creative and inspiring.
    - Interesting conversation with Matt and Jonathan about "software for social good". Maybe a discussion group to be set up?
Thanks Iris for demoing your work on MIDI-driven shaders. Intrigued to see where you go with it!
Today my calendar is a lot clearer. I'm planning to take a break from ray tracer stuff to work on some Project Euler problems, read a bit about operating system processes, and write some code with Matt before he leaves.

<img src="/assets/images/recurse-posts/multiple.png" style="display: inline-block; width: 200px;"/>

## Day 5

- Tried to solve Project Euler #101 in the morning, but my brain wouldn't start up.
- Went to the fabled Naya for lunch with Joel and talked a bit about the weirdnesses of research-focused jobs.
- At the volition workshop, concluded that I'm going to "major" on learning as much as I can about graphics programming, while "minoring" in making math visualisations and learning about operating systems. My initial ideas about collision avoidance and time travel mechanics in games are on hold for now.
- Worked with Matt on changing the movement in his platformer game from tile-based to continuous.

I had planned to take a break from ray tracer stuff today. But then I chatted to Lauria, who demoed me his incredible CPU renderer/game engine, and gave a really helpful explanation of rasterisation. This got me so psyched that I was back at the ray tracer all evening. Implemented shadows, planar surfaces, and a few different patterns. Also experimenting with cel-shading by quantizing the dot product between light and surface normals.

Reflections next!

<div>
    <img src="/assets/images/recurse-posts/patterns.png" style="display: inline-block; width: 200px;"/>
    <img src="/assets/images/recurse-posts/patterns_quantized.png" style="display: inline-block; width: 200px;"/>
</div>

---

<div class="rc-scout-wrapper"><div class="rc-scout" data-scout-rendered="true"><p class="rc-scout__text"><i class="rc-scout__logo"></i> Want to become a better programmer? <a class="rc-scout__link" href="https://www.recurse.com/scout/click?t=b6f2a500ae2bb03d094c920acacdee0c">Join the Recurse Center!</a></p></div> <style class="rc-scout__style" type="text/css">.rc-scout { display: block; padding: 0; border: 0; margin: 20px; } .rc-scout__text { display: block; padding: 0; border: 0; margin: 0; height: 100%; font-size: 100%; } .rc-scout__logo { display: inline-block; padding: 0; border: 0; margin: 0; width: 0.85em; height: 0.85em; background: no-repeat center url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2015%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2212%22%20height%3D%2210%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%2210%22%20height%3D%228%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%228%22%20height%3D%226%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%223%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%222%22%20height%3D%221%22%20fill%3D%22%233dc06c%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%229%22%20width%3D%224%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%221%22%20y%3D%2211%22%20width%3D%2210%22%20height%3D%224%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%220%22%20y%3D%2212%22%20width%3D%2212%22%20height%3D%223%22%20fill%3D%22%23000%22%3E%3C%2Frect%3E%3Crect%20x%3D%222%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%223%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%224%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%225%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%226%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%227%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%228%22%20y%3D%2213%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3Crect%20x%3D%229%22%20y%3D%2212%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23fff%22%3E%3C%2Frect%3E%3C%2Fsvg%3E'); } .rc-scout__link:link, .rc-scout__link:visited { color: #3dc06c; text-decoration: underline; } .rc-scout__link:hover, .rc-scout__link:active { color: #4e8b1d; }</style></div>