![](logo.svg)

# (( _lluna lang js_ ))

## What’s _Lluna_?

**_Lluna_** ([/ˈʎu.nə/](https://en.wiktionary.org/wiki/lluna) _lit._ moon) is a personal project involving many subprojects that focus on learning, minimalism and design.

**Lluna lang** is _Lluna_’s programming language, inspired mainly by [Lisp](<https://en.wikipedia.org/wiki/Lisp_(programming_language)>) and [Lua](<https://en.wikipedia.org/wiki/Lua_(programming_language)>).

## Why JS?

This JavaScript implementation is a proof of concept, the final version will be written in C / Rust and have a proper VM.

However, since it’s JavaScript, you can try this implementation of _Lluna lang_ right away in your browser.

## Example

```
, calculate the factorial of a number (n)
(
: f (~ n (
	: r
	? (< 0 n) (
		: r (* n (f (- n 1)))
	)(
		: r 1
	)
))

-> 'Fact 5:' (f 5)
-> 'Fact 10:' (f 10)
)
```

---
