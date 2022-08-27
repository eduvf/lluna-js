![logo](logo.svg)

# Lluna lang JS

## What’s _Lluna_?

**_Lluna_** ([/ˈʎu.nə/](https://en.wiktionary.org/wiki/lluna) _lit._ moon) is a personal project involving many subprojects that focus on learning, minimalism and design.

**Lluna lang** is _Lluna_’s programming language, inspired mainly by [Lisp](<https://en.wikipedia.org/wiki/Lisp_(programming_language)>) and [Lua](<https://en.wikipedia.org/wiki/Lua_(programming_language)>).

## Why JS?

This JavaScript implementation is a proof of concept, the final version will be written in C and have a proper VM.

However, since it’s JavaScript, you can try this implementation of _Lluna lang_ right away in your browser.

## TO-DO

Clean and simplify:

-   [x] lex (→ tokens)

-   [x] parse (→ AST)

-   [ ] compile (→ bytecode)

-   [ ] vm (→ magic✨)

Extra:

-   [ ] interactive web interpreter

-   [ ] tutorial / wiki

## VM specs

### Types

|  type  |                                     format                                     |           bit           |
| :----: | :----------------------------------------------------------------------------: | :---------------------: |
| `nil`  |                                     `nil`                                      |            -            |
| `bool` |                                  `_1` or `_0`                                  |          [`B`]          |
| `num`  | [binary16](https://en.wikipedia.org/wiki/Half-precision_floating-point_format) | [`SEEE EEMM MMMM MMMM`] |
| `char` |                            [llunascii](#llunascii)                             |      [`MMCC CCCC`]      |

#### llunascii

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

### Opcodes

-   `0x00`: no operation

-   `0x10, 0x11`: push, pop

-   `0x20, 0x21`: load, store

-   `0x30, 0x31, 0x32`: jump, jump if zero, jump if not zero

-   `0x40, 0x41, ...`: op add, op sub, ...

-   `0xFF`: halt

|   #    |   mnemonic    | args | description                                               |
| :----: | :-----------: | :--: | :-------------------------------------------------------- |
| `0x00` |      no       |  -   | **No operation**                                          |
| `0x10` |      ps       |  x   | **Push** value X to the stack                             |
| `0x11` |      pp       |  -   | **Pop** from the stack                                    |
| `0x20` |      ld       |  x   | **Load** from index X and push to the stack               |
| `0x21` |      st       |  x   | Pop from the stack and **store** to index X               |
| `0x30` |      jp       |  x   | **Jump** to instruction X                                 |
| `0x31` |      jz       |  x   | Pop from the stack and **jump if zero**                   |
| `0x32` |      jn       |  x   | Pop from the stack and **jump if not zero**               |
| `0x40` | op + / op add |  -   | Perform the **add operation**                             |
| `0x41` | op - / op sub |  -   | Perform the **sub operation**                             |
| `0x50` |  io std_out   |  -   | Pop from the stack and **write** to 'std_out'             |
| `0x51` |   io std_in   |  -   | Pause execution and ask for **input** in 'std_in'         |
| `0x60` |      cl       |  x   | **Call** subrutine passing list X as arguments            |
| `0x61` |      rt       |  x   | **Return** from subroutine, retain list X as return value |
| `0x70` |      lb       |  x   | **List begin**                                            |
| `0x71` |      lp       |  x   | **List push**                                             |
| `0x72` |      lk       |  x   | **List link**                                             |
| `0x73` |      ll       |  x   | **List load**                                             |
| `0x74` |      lm       |  x   | **List modify**                                           |
|        |      ...      |      |                                                           |
| `0xFF` |      ht       |  -   | **Halt**                                                  |
