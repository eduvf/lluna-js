![logo](logo.svg)

# Lluna lang JS

## What’s *Lluna*?

***Lluna*** ([/ˈʎu.nə/](https://en.wiktionary.org/wiki/lluna) *lit.* moon) is a personal project involving many subprojects that focus on learning, minimalism and design.

**Lluna lang** is *Lluna*’s programming language, inspired mainly by [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) and [Lua](https://en.wikipedia.org/wiki/Lua_(programming_language)).

## Why JS?

This JavaScript implementation is a proof of concept, the final version will be written in C and have a proper VM.

However, since it’s JavaScript, you can try this implementation of *Lluna lang* right away in your browser.

## TO-DO

- [x] lex (→ tokens)

- [x] parse (→ AST)

- [ ] compile (→ bytecode)
  
  - [x] define basic opcodes
  
  - [ ] define function opcodes
  
  - [ ] define list opcodes
  
  - [ ] implement compiler

- [ ] vm (→ magic✨)

- [ ] interactive web interpreter

- [ ] tutorial / wiki

## Opcodes

- `0x00`: no operation

- `0x10, 0x11`: push, pop

- `0x20, 0x21, 0x22`: load, store, mod

- `0x30, 0x31, 0x32`: jump, jump if zero, jump if not zero

- `0x40, 0x41, ...`: op add, op sub, ...

- `0xFF`: halt

| #      | mnemonic      | args | description                                        |
|:------:|:-------------:|:----:|:-------------------------------------------------- |
| `0x00` | no            | -    | **No operation**                                   |
| `0x10` | ps            | x    | **Push** value X to the stack                      |
| `0x11` | pp            | -    | **Pop** from the stack                             |
| `0x20` | ld            | x    | **Load** from index X and push to the stack        |
| `0x21` | st            | x    | Pop from the stack and **store** to index X        |
| `0x22` | md            | x    | Pop from the stack and **modify** value at index X |
| `0x30` | jp            | x    | **Jump** to instruction X                          |
| `0x31` | jz            | x    | Pop from the stack and **jump if zero**            |
| `0x32` | jn            | x    | Pop from the stack and **jump if not zero**        |
| `0x40` | op + / op add | -    | Perform the **add operation**                      |
| `0x41` | op - / op sub | -    | Perform the **sub operation**                      |
|        |               |      |                                                    |
|        |               |      |                                                    |
|        |               |      |                                                    |
|        |               |      |                                                    |
|        |               |      |                                                    |
|        |               |      |                                                    |
| `0xFF` | ht            | -    | **Halt**                                           |