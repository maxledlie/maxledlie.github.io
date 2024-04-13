---
layout: post
title: 'Notes on React'
use_math: true
---

## What problems does React solve?

### Efficient rendering of complex state

The browser represents the contents of a web page as the DOM (Document Object Model). This can be thought of as a tree of DOM elements (e.g. divs, canvases, buttons etc.), each of which has properties and zero or more children.

If we have a large web page, and therefore a large tree, and we change a property of a single element on that tree,
the browser often won't need to rerender the entire page to make that change. A lot of work has gone into browser engines so that they only do the smallest amount of work required to make a given change, and therefore complex, frequently changing web pages can be rendered smoothly.

However, to allow the browser to make these intelligent decisions, we have to write the code for our UI in an imperative style: for every possible change in state, we have to specify exactly how the DOM should change to reflect this. This might involve adding or deleting elements, or changing the properties of an element.

Thinking very abstractly, suppose there are $N$ possible states for the data behind the user interface. In theory, every one of these possible states could result in a slightly different page. To let the browser work as efficiently as possible, we have to write code to handle all $N^2$ possible transitions from one state to another,
making only the minimal number of changes to the DOM in every case.

One of the key features of React is that it *works out this minimal set of changes for us*.

React maintains an <span style="color: red">**element tree**</span> (previously known as a *virtual DOM*): a mirror of the DOM stored as a JavaScript object. When the state changes, React returns a new version of the element tree that reflects this new state. React then takes on the task of "diffing" these two trees: finding the minimal set of changes required to transform the first into the second. It can then make only those minimal changes to the real DOM.

The part of React that does this diffing is called the <span style="color: red">**reconciler**</span>.

## Components define an element tree

This section is based on [this blog post](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html).

Each element (each node in the element tree discussed above) consists of a *type* and *props*. The *type* tells us how to render the element as a DOM node. It might be the name of a concrete DOM element, like 'div' or 'button'.