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

-   [x] compile (→ bytecode)

    -   [ ] fix arg push order

-   [ ] std_lib

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

|   #    | mnemonic | description                                                        |
| :----: | :------: | :----------------------------------------------------------------- |
| `0x00` |    no    | **No operation**                                                   |
| `0x10` |    ps    | **Push** literal or reference to the stack                         |
| `0x20` |    ld    | **Load** a variable and push its value to the stack                |
| `0x30` |    st    | **Set** a variable and **store** the value at the top of the stack |
| `0x40` | jp / j\_ | **Jump** to an instruction (if ...) [^1]                           |
| `0x50` |    op    | Perform a logical, arithmetic or bitwise **operation**             |
| `0x60` |   (op)   | -                                                                  |
| `0x70` |   l\_    | Perform a **list** operation, stored in the heap [^1]              |
| `0x80` | cl / rt  | **Call** or **return** (subrutine)                                 |
| `0x90` |    io    | Perform an **I/O** operation                                       |
| `0xA0` |    -     |                                                                    |
| `0xB0` |    -     |                                                                    |
| `0xC0` |    -     |                                                                    |
| `0xD0` |    -     |                                                                    |
| `0xE0` |    -     |                                                                    |
| `0xF0` |    ht    | **Halt** execution                                                 |

[^1]: Other mnemonics:

-   **jz**: jump if zero

-   **jn**: jump if not zero

-   **ls**: list start

-   **le**: list end

-   **ll**: list load

-   **lm**: list modify

-   **lr**: list remove
