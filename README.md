# [Huffman Coding algorithm](https://en.wikipedia.org/wiki/Huffman_coding)

Generate optimal prefix code, used for lossless data compression.


## Example

Given 5 symbols and respective probability

| Symbol | Probability |
|--------|-------------|
|   a    |     0.2     |
|   b    |     0.1     |
|   c    |     0.3     |
|   d    |     0.14    |
|   e    |     0.16    |

It generates the optimal prefix code with coding

| Symbol | Coding | Length |
|--------|--------|--------|
|   e    |   00   |   2    |
|   a    |   01   |   2    |
|   b    |  100   |   3    |
|   d    |  101   |   3    |
|   c    |   11   |   2    |

## Median Length

    Ly  = Sum in i of (length(encoded symbol) * p(a_i)) 
        = length(e encoded) * p(e) + length(a) * p(a) + length(b) * p(b)....
        = 2.04 bit