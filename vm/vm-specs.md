# lluna vm

## types

basic (atoms):

-   `nil`

-   `bool` (t* / f*)

-   `int` (16-bit signed)

-   `flt` (binary16, half precision)

-   `char` (using llunascii)

linked:

-   `list`

-   `str` (a list of chars)

## llunascii (mode 0)

chars use 8 bits of information:

-   2 bits for the mode (00 = latin & punctuation; 01 = emoji, 10 & 11: user defined)

-   6 bits for the actual char

|      | 000 | 001 | 010 | 011 | 100 | 101 | 110 | 111 |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- |
| 000x | ␣   | !   | ^   | #   | \|  | %   | &   | '   |
| 001x | (   | )   | \*  | +   | ,   | -   | .   | /   |
| 010x | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   |
| 011x | 8   | 9   | :   | ;   | <   | =   | >   | ?   |
| 100x | @   | a   | b   | c   | d   | e   | f   | g   |
| 101x | h   | i   | j   | k   | l   | m   | n   | o   |
| 110x | p   | q   | r   | s   | t   | u   | v   | w   |
| 111x | x   | y   | z   | \\  | \_  | ~   |     |     |

## registers

|  #  | register                   |
| :-: | :------------------------- |
| ip  | instruction pointer        |
| sp  | stack pointer              |
| ac  | accumulator                |
| nh  | new avaliable heap address |

> The **accumulator** is used both to store the result of an operation and to return a value between stack frames

## instructions

|   # | opcode | args  | description                                |
| --: | :----: | :---: | :----------------------------------------- |
|   0 |   ht   |   -   | **Halt** execution                         |
|   1 |   st   |  x y  | **Set** value X to index Y                 |
|   2 |   op   | x y z | Perform the **operation** X(Y, Z)          |
|   3 |   jp   |  x y  | **Jump** to instruction X if Y != 0        |
|   4 |   nf   |   -   | Add a **new** stack **frame**              |
|   5 |   cl   |   x   | **Call** subroutine at instruction X       |
|   6 |   rt   |   -   | **Return**, poping the current stack frame |
|   7 |   lk   | x y z | Manage a **link**                          |

`op` operations:

-   `+` add
-   `-` sub
-   `*` mul
-   `/` div
-   `%` mod
-   `=` eq
-   `<` lt
-   `!=` neq
-   `<=` leq
-   ... (logical, bitwise, etc.)

`lk` operations (Y, Z):

-   sch (set cell header) -> type Y, index Z
-   new -> from index Y to Z at address 'nh'
-   mod -> modifies Yth element at cell Z for value in 'ac'
-   ext -> extract Yth element at cell Z to its own cell
-   app -> 
-   del

---

```
cell header:
-   type
-   total length
cell footer:
-   link


(1 2 3)

-> new

-> add start (0 1 2 3)

	1. r -> a | ([a] 1 2 3 n:-)
	2.        | ([a] 1 2 3 n:-) ([b] 0 n:a)
	3. r -> b | ([a] 1 2 3 n:-) ([b] 0 n:a)

-> add end   (1 2 3 4)

	1. r -> a | ([a] 1 2 3 n:-)
	2.        | ([a] 1 2 3 n:-) ([b] 0 n:-)
	3.        | ([a] 1 2 3 n:b) ([b] 0 n:a)

-> mod (1 5 3)

	1. ([a] 1 2 3 n:-)
	2. ([a] 1 5 3 n:-)

-> ins (1 5 6 3)

	1. ([a] 1  2  3 n:-)
	2. ([a] 1  2  3 n:-) ([b] 5 6 n:-)
	2. ([a] 1 [b] 3 n:-) ([b] 5 6 n:-)

```