# Design

Descriptions:
Have a default description ("description")
Have array of requirements & corresponding description, later ones have higher priority

Options:
Have an array of options
Each option

The reason option & descriptions are done differently is that
- There is only one description, but
- There are multiple options, each option can have its own requirements and be independent of other options

For example
* Option 1, 2: shows when `puzzleSolved` is false
* Option 3: shows when `puzzleSolved` is true
* Other options always show

If we were to store by when requirement sets hold, then the always-show options are repeated a lot, which would usually mean more memory consumption???