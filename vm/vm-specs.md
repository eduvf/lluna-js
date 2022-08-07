# lluna vm

## types

basic (atoms):

- `nil`

- `bool` (t_ / f_)

- `int` (16-bit signed)

- `flt` (binary16, half precision)

- `char` (using llunascii)

linked:

- `list`

- `str` (a list of chars)

## llunascii (mode 0)

chars use 8 bits of information:

- 2 bits for the mode (00 = latin & punctuation; 01 = emoji, 10 & 11: user defined)

- 6 bits for the actual char

|      | 000 | 001 | 010 | 011 | 100 | 101 | 110 | 111 |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- |
| 000x | ␣   | !   | ^   | #   | \|  | %   | &   | '   |
| 001x | (   | )   | *   | +   | ,   | -   | .   | /   |
| 010x | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   |
| 011x | 8   | 9   | :   | ;   | <   | =   | >   | ?   |
| 100x | @   | a   | b   | c   | d   | e   | f   | g   |
| 101x | h   | i   | j   | k   | l   | m   | n   | o   |
| 110x | p   | q   | r   | s   | t   | u   | v   | w   |
| 111x | x   | y   | z   | \\  | \_  | ~   |     |     |

## registers

- x

- y

- z

- ip (instruction pointer)

- sp (stack pointer)

## instructions

arguments can be atoms or registers

| #   | opcode | description                                       |
| ---:|:------:|:------------------------------------------------- |
| 0   | ht     | Halt execution                                    |
| 1   | sx V   | Set value (V) to X                                |
| 2   | sy V   | Set value (V) to Y                                |
| 3   | sz V   | Set value (V) to Z                                |
| 4   | op O   | Arithmetic/Logic operation (O), result in X       |
| 5   | jp O   | Jump by offset (O) if Z == 0                      |
| 6   | st I   | Store X with index (I) on the current stack frame |
| 7   | ld I   | Load X from index (I) [^1]                        |
| 8   | cl O   | Call subroutine at offset (O) [^2]                |
| 9   | rt     | Return from subroutine (only X & Y restore state) |
| A   | -      |                                                   |
| B   | -      |                                                   |
| C   | -      |                                                   |
| D   | -      |                                                   |
| E   | -      |                                                   |
| F   | -      |                                                   |

[^1]: starting on the current stack frame and going deeper in the stack if no reference is found

[^2]: the state of the registers X & Y is stored in the current stack frame before the call
