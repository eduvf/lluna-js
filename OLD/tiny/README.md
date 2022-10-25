![](logo.svg)

# lluna js

Tiny JS implementation of Lluna

## exemples

Factorial (recursive)

```
~ f n (
	: r
	? (< 0 n) (
		: r (* n (f (- n 1)))
	)(
		: r 1
	)
)
! (f 5)
```
