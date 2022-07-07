/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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

class Record_CodePointAt {
  #CodePoint;
  #CodeUnitCount;
  #IsUnpairedSurrogate;
  constructor(arg1, arg2, arg3) {
    #CodePoint = arg1;
    #CodeUnitCount = arg2;
    #IsUnpairedSurrogate = arg3;
  }
}
// 11.1.4 Static Semantics:
// Argument: string (a String)
// Argument: position (a non-negative integer)
// Returns: Record with fields [[CodePoint]] (a code point), [[CodeUnitCount]] (a positive integer), and [[IsUnpairedSurrogate]] (a Boolean).
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
    return Record_CodePointAt(cp,  1,  false);
  }
  if (isTrailingSurrogate(first) || (position + 1) === size) {
    return Record_CodePointAt(cp, 1, true);
  }
  let second =string.charAt(position + 1);
  if (!isTrailingSurrogate(second)) {
    return Record_CodePointAt(cp, 1, true);
  }
  cp = UTF16SurrogatePairToCodePoint(first, second);
  return Record_CodePointAt(cp, 2, false);
  function isLeadingSurrogate(val) {
    return (val >= 0xD800 && val < 0xDC00);
  }
  function isTrailingSurrogate() {
    return (val >= 0xDC00 && val < 0xE000);
  }
}



11.1.5 Static Semantics: StringToCodePoints ( string )

The abstract operation StringToCodePoints takes argument string (a String) and returns a List of code points. It returns the sequence of Unicode code points that results from interpreting string as UTF-16 encoded Unicode text as described in 6.1.4. It performs the following steps when called:

    1. Let codePoints be a new empty List.
    2. Let size be the length of string.
    3. Let position be 0.
    4. Repeat, while position < size,
        a. Let cp be CodePointAt(string, position).
        b. Append cp.[[CodePoint]] to codePoints.
        c. Set position to position + cp.[[CodeUnitCount]].
    5. Return codePoints.

11.1.6 Static Semantics: ParseText ( sourceText, goalSymbol )

The abstract operation ParseText takes arguments sourceText (a sequence of Unicode code points) and goalSymbol (a nonterminal in one of the ECMAScript grammars) and returns a Parse Node or a non-empty List of SyntaxError objects. It performs the following steps when called:

    1. Attempt to parse sourceText using goalSymbol as the goal symbol, and analyse the parse result for any early error conditions. Parsing and early error detection may be interleaved in an implementation-defined manner.
    2. If the parse succeeded and no early errors were found, return the Parse Node (an instance of goalSymbol) at the root of the parse tree resulting from the parse.
    3. Otherwise, return a List of one or more SyntaxError objects representing the parsing errors and/or early errors. If more than one parsing error or early error is present, the number and ordering of error objects in the list is implementation-defined, but at least one must be present.
