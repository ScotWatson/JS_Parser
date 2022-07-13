/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Sequence from "https://scotwatson.github.io/Sequence/Sequence.mjs"
import * as Unicode from "https://scotwatson.github.io/Unicode/Unicode.mjs"

// 11.1.1 Static Semantics: 
// Argument: cp (a Unicode code point)
// Returns: (String)
function UTF16EncodeCodePoint(cp) {
  return cp.toString();
}

// 11.1.2 Static Semantics:
// Converts text into a String value, as described in 6.1.4.
// Argument: text (a sequence of Unicode code points)
// Returns: (String)
function CodePointsToString(text) {
  let result = "";
  for (const cp of text) {
    result += UTF16EncodeCodePoint(cp);
  }
  return result;
}

// 11.1.3 Static Semantics:
// Two code units that form a UTF-16 surrogate pair are converted to a code point.
// Argument: lead (a code unit)
// Argument: trail (a code unit)
// Returns a code point. 
function UTF16SurrogatePairToCodePoint(lead, trail) {
  return UnicodeCodePoint.fromSurrogatePair({
    lead,
    trail,
  });
}

// 11.1.4 Static Semantics:
// Argument: string (a String)
// Argument: position (a non-negative integer)
// Returns: (Object) Record with fields [[CodePoint]] (a code point), [[CodeUnitCount]] (a positive integer), and [[IsUnpairedSurrogate]] (a Boolean).
// It interprets string as a sequence of UTF-16 encoded code points, as described in 6.1.4, and reads from it a single code point starting with the code unit at index position.
function CodePointAt(string, position) {
  let size = string.length;
  if (position < 0 || position >= size) {
    throw new Error("Assertion failed");
  }
  let first = string.charAt(position);
  let first_value = first.charCodeAt(0);
  let cp = new UnicodeCodePoint(first_value);
  if (!isLeadingSurrogate(first) && !isTrailingSurrogate(first)) {
    return {
      CodePoint: cp,
      CodeUnitCount: 1,
      IsUnpairedSurrogate: false,
    };
  }
  if (isTrailingSurrogate(first) || (position + 1) === size) {
    return {
      CodePoint: cp,
      CodeUnitCount: 1,
      IsUnpairedSurrogate: true,
    };
  }
  let second = string.charAt(position + 1);
  if (!isTrailingSurrogate(second)) {
    return {
      CodePoint: cp,
      CodeUnitCount: 1,
      IsUnpairedSurrogate: true,
    };
  }
  cp = UTF16SurrogatePairToCodePoint(first, second);
  return {
    CodePoint: cp,
    CodeUnitCount: 2,
    IsUnpairedSurrogate: false
  };
  function isLeadingSurrogate(val) {
    return (val >= 0xD800 && val < 0xDC00);
  }
  function isTrailingSurrogate() {
    return (val >= 0xDC00 && val < 0xE000);
  }
}

// 11.1.5 Static Semantics:
// Argument: string (String)
// Return: (a List of code points)
// It returns the sequence of Unicode code points that results from interpreting string as UTF-16 encoded Unicode text as described in 6.1.4.
function StringToCodePoints(string) {
  let codePoints = new Sequence.Sequence(Unicode.UnicodeCodePoint);
  let size = string.length;
  let position = 0;
  while (position < size) {
    let cp = CodePointAt(string, position).
    codePoints.push(cp);
    position = position + cp.toString().length.
  }
  return codePoints;
}

// 11.1.6 Static Semantics: 
// Argument: sourceText (Sequence of Unicode code points)
// Argument: goalSymbol (a nonterminal in one of the ECMAScript grammars)
// Return: (a Parse Node or a non-empty List of SyntaxError objects)
function ParseText(sourceText, goalSymbol) {
//    1. Attempt to parse sourceText using goalSymbol as the goal symbol, and analyse the parse result for any early error conditions. Parsing and early error detection may be interleaved in an implementation-defined manner.
//    2. If the parse succeeded and no early errors were found, return the Parse Node (an instance of goalSymbol) at the root of the parse tree resulting from the parse.
//    3. Otherwise, return a List of one or more SyntaxError objects representing the parsing errors and/or early errors. If more than one parsing error or early error is present, the number and ordering of error objects in the list is implementation-defined, but at least one must be present.
}

function isWhitespace(cp) {
  switch (cp.valueOf()) {
    case 0x0009:
    case 0x000B:
    case 0x000C:
    case 0xFEFF:
      return true;
    default:
      return (cp.category === "Zs");
  }
}

function isLineTerminator(cp) {
  switch (cp.valueOf()) {
    case 0x000A:
    case 0x000D:
    case 0x2028:
    case 0x2029:
      return true;
    default:
      return false;
  }
}
