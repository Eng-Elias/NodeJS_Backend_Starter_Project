# String Utils

`StringUtils.ts` is a utility class that provides common, reusable helper functions for string manipulation. Centralizing these simple functions helps to reduce code duplication and improve readability.

## Static Methods

### `capitalize(str: string): string`

Takes a string and returns a new string with the first character converted to uppercase. If the input string is empty, it returns an empty string.

**Usage:**

```typescript
import { StringUtils } from './utils/StringUtils';

const name = 'john';
const capitalizedName = StringUtils.capitalize(name); // Returns 'John'

const empty = '';
const capitalizedEmpty = StringUtils.capitalize(empty); // Returns ''
```

### `isEmpty(str: string | null | undefined): boolean`

Checks if a given string is `null`, `undefined`, or consists only of whitespace characters. This is more robust than a simple `!str` check, as it also handles strings like `"   "`.

**Usage:**

```typescript
import { StringUtils } from './utils/StringUtils';

StringUtils.isEmpty(null); // true
StringUtils.isEmpty(undefined); // true
StringUtils.isEmpty(''); // true
StringUtils.isEmpty('   '); // true

StringUtils.isEmpty('hello'); // false
StringUtils.isEmpty('  a  '); // false
```
