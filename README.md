# RPN Calculator

A minimalistic *scientific calculator* with *reverse polish notation* for *Firefox OS* and *Firefox Mobile* on *Android*.

It is available on [Firefox Marketplace](https://marketplace.firefox.com/app/rpn-calculator/) (once it passes the review process).

**Beta test phase:** Please see beta notes and quick introduction below.

![Portrait mode screenshot](https://marketplace.cdn.mozilla.net/img/uploads/previews/full/175/175970.png "Portrait mode") ![Landscape mode screenshot](https://marketplace.cdn.mozilla.net/img/uploads/previews/full/175/175972.png "Landscape mode")

## Description

*RPN Calculator* provides a minimalistic, yet powerful and efficient interface to the world of reverse polish notation. It boils down the gist of Hewlett Packard's RPN calculators into one consistent, modern user interface, while focusing on the most important functionality and workflows.

If you're familiar with the likes of *HP 35s*, *HP 15C*, or the *HP 49* model family, you will feel right at home when it comes to everyday number crunching. If RPN isn't familiar to you, *RPN Calculator*'s simplicity won't confuse you with all the functionality that crowds the keypad a full-featured, programmable scientific calculator.

## Notable features

* RPN input
* Four-level stack
* Consistent keyboard layout and inverse mapping
* Display precision of 16 significant digits (*a lot* more internally)
* Standard trigonometric and arithmetic functions
* Rudimentary support for complex numbers (result only, no input)
* Portrait and landscape mode

## Quick introduction

On an RPN calculator you must first push values onto the stack using the *ENTER* key (↵), and then use the desired operator key to calculate the result which will end up on top the stack – often referenced by its variable name *x* –, consuming the operands that went into the calculation.

To calculate **(7+6)/(2-5)**, for example, enter the following sequence:

* **7↵ 6↵ + 2↵ 5↵ - ÷** 

This is what happens on the stack:

| Input | Stack  |
| ----- | ------ |
| 7↵    | 7      |
| 6↵    | 6,7    |
| +     | 13     |
| 2↵    | 2,13   |
| 5↵    | 5,2,13 |
| -     | -3,13  |
| ÷     | -4.333 |

To make input more efficient, *RPN Calculator* lets you skip ↵ when followed immediately by an operator, so the following shorter sequence yields the same result:

* **7↵ 6+ 2↵ 5- ÷**

Use x⇄y and R↓ to move values around on the stack and *INV* to access the layer with inverse or related functionality.

RPN may be confusing at first, but once you catch on, you likely won't want to go back to the classic infix notation which is hopelessly cumbersome for complex calculations.

## Beta test disclaimer

This version is intended for public beta testing, so please expect not only obvious bugs and calculation errors, but also subtle arithmetic mistakes. **Don't bet your life on the results.** 

## Known issues

* Trigonometric functions yield erratic results when fed with very large or small values.
* Fractional remainders below display precision result will be omitted on display, but not in calculation. Eg., the result of *1 + 1E-20* is shown as *1*, but subtract *1* from the result to get *1E-20* again.
* Firefox Mobile on Android shows a white box on the *DEL* key, because the default font lacks the ⌫ symbol.

Please provide feedback through github's ticket system. It will let me know about bugs, and also about the features you miss the most.

I hope you enjoy this app.
