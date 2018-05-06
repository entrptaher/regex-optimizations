# regex-optimizations
Optimize regex for better future.

# Goal: 

- `((x|y)|z)` to `(x|y|z)`
- `((abc))` to `(abc)`
- `(x)` to `x`
- `(x{5,7})` to `x{5,7}`
- `(x){5,7}` to `x{5,7}`
- Do Not convert `(x{2}){3}`
- `(x{0,n}){m}` to `x{0,n*m}`
- `(abc | dbc)` to `((a|d)bc)` to `[ad]bc`
- `(abc | dbc | koo)` to `((a|d)bc | koo)`
- `(abde | abcd | akoo)` to `a(bde|bcd|koo)` to `a(b(de|cd)|koo)`
- `axc | ayc | azc` to `a(x|y|z)c`
- `(aXe | bXf | cXg)`  NOT   `[abc]X[efg]` because `cXe` is not allowed.
- `(abc | abd | abe)` to `(a(bc|bd)) | abe` to `a(bc|bd|be)` to `(a(b(c|d|e)))` to `(a(b([cde])))` to `ab[c-e]`
- `(aab | ab)` to `a(ab|b)` to `a(a|)b` to `a{1,2}b`
- `\w+ \w+ \w+ \w+ \w+ \w+ \d+` to `\w+\s\w+\s\w+\s\w+\s\w+\s\w+\s\d+` to `(\w+\s){6}\d+`

# TODO:

- Add `tests` with examples
- Create the solutions
- Publish on npm or somewhere
