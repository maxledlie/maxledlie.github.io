---
layout: post
title: 'Linear Programming Implementation'
use_math: true
---

High-level explanations of the *simplex method* for linear programming are readily available online.
However, these often lack much explanation of how we might actually implement this in practice.
The following is an in-depth explanation of the simplex method, along with language-agnostic descriptions of unit tests that describe the required behaviour for a solver.

### Problem input format

Typically, when we encounter a problem amenable to linear programming in the wild, it will initially be expressed verbally. Here are a couple of examples of verbal descriptions of linear programming problems:

*Example 1*

*Example 2*

Whatever program we write, the user will always have to manually convert the verbal description into a standard input format. We would like this input format to be as general as possible to make life easy for the user. It should accept "less than" and "greater than" constraints (for the sake of simplicity, we're not allowing equality constraints in the input).

```cucumber
Scenario: A (linear) constraint in n variables consists of n coefficients, a bias, and a 'kind' (<=, or >=)
  Given c <- constraint([1, 2, 3], '<=', 6)
  Then c.coeffs = [1, 2, 3]
    And c.kind = '<='
    And c.bias = 6
```

Our input format for a problem, then, consists of an objective function, a flag indicating whether we wish to maximize or minimize this, and a list of constraints:

```cucumber
Scenario: Definition of a linear programming problem.
  Given c1 <- constraint([1, 2, 3], '<=', 6)
    And c2 <- constraint([2, 0, 1], '<=', 4)
    And lp <- lpProblem('max', [2, 4], [c1, c2])
    Then lp.target = 'max'
      And lp.coeffs = [2, 4]
      And lp.constraints = [c1, c2]
```

This is the object that a user will have to create and pass into our program to solve it.

### Standard form

Now that we've defined our flexible input format, we want to get a lot stricter. The simplex algorithm expects our problem to be expressed in a *standard form*, which consists only of equality constraints and nonnegativity constraints.

Each inequality constraint can be converted to an equality constraint and a nonnegativity constraint through the introduction of a new variable, which we call a *slack variable*. For example, take the inequality $$2x_1 - 3x_2 \le 4$$. This can be rearranged to $$4 - 2x_1 + 3x_2 \ge 0$$.
We now introduce a slack variable, $x_3$, which we constrain to be equal to the left hand side of this equation, and therefore greater than zero. This leaves us with the following pair of constraints:

$$
\begin{align}
2x_1 - 3x_2 + x_3 &= 4 \\
x_3 &\ge 0
\end{align}
$$

Our general algorithm for converting a linear program from the input format to the standard format is the following:

...

```cucumber
Scenario: A general problem in the input format can be converted to standard form
  Given c1 <- constraint([2, -1], '<=', 4)
    And c2 <- constraint([1, 3], '>=', 5)
    And lp <- lpProblem('max', [3, -2], [c1, c2])
    And lps <- standardize(lp)
  Then lps.c = [3, -3, -2, 2, 0, 0]
    And lps.A = [
      [2, -2, -1, 1, 1, 0],
      [-1, 1, -3, 3, 0, 1]
    ]
    And lps.b = [4, -5]
```

### A preprocessing step: Deleting redundant constraints

### Finding the corners (feasible bases)

Suppose that after converting to equational form, we end up with three variables and one constraint. Geometrically, our feasible region will look something like the following:

*Picture of feasible region for simple example.*

Since the objective function is linear, its optimal solution must lie at one of the "corners" of this region. In most practical cases we will have more than three variables, so we can no longer draw pictures like the one above, and the notion of "corner" gets quite muddled. We'll use our intuition from the three-variable case to build a solution for arbitrarily many variables.
We'll leave it to the mathematicians to prove that this generalisation is strictly valid: we'll be satisified if our tests pass!

The crucial idea is that each m-element subset of $$\{1, 2, ..., n\}$$ can direct us to at most one corner. We call each of these subsets a *basis*.

For any such subset, there is *no* corresponding solution if the columns of $A_B$ are linearly dependent.

*Figures illustrating how different subsets identify different corners*

One possible algorithm to find the optimal solution, then, is simply to iterate through every possible basis. For each of these bases we find the corresponding basic feasible solution, if one exists, and its objective value. We return the basic feasible solution with the maximum (or minimum) objective value.

Unfortunately, the number of basic feasible solutions grows exponentially with the number of variables and constraints. For most practical problems, this brute-force approach is simply too slow.

The simplex algorithm, which we'll start to implement in the next section, also searches through the bases to find the optimal solution, but does so far more efficiently.

### The simplex algorithm

We represent the current state of the algorithm with a *simplex tableau*. This is just a different way of representing the standard-form equations.

```cucumber
Scenario: A simplex tableau can be formed from a linear program in standard form
  Given A <- [
    [ 2, 3, 1, 0, 0, 0],
    [-3, 2, 0, 1, 0, 0],
    [ 0, 2, 0, 0, 1, 0],
    [ 2, 1, 0, 0, 0, 1]
  ]
    And b <- [6, 3, 5, 4]
    And c <- [4, 3]
    And lps <- lpProblemStandard(A, b, c)
    And t <- tableau(lps)
  Then t = [
    [-4, -3, 0, 0, 0, 0],
    [ 2,  3, 1, 0, 0, 0],
    [-3,  2, 0, 1, 0, 0],
    [ 0,  2, 0, 0, 1, 0],
    [ 2,  1, 0, 0, 0, 1]
  ]
```