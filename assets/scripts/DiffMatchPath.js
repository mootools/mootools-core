/**
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc, 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA
 */

/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Class containing the diff, match and patch methods.
 * @constructor
 */
function diff_match_patch() {

  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up.  (0 for infinity)
  this.Diff_Timeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  this.Diff_EditCost = 4;
  // The size beyond which the double-ended diff activates.
  // Double-ending is twice as fast, but less accurate.
  this.Diff_DualThreshold = 32;
  // Tweak the relative importance (0.0 = accuracy, 1.0 = proximity)
  this.Match_Balance = 0.5;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose)
  this.Match_Threshold = 0.5;
  // The min and max cutoffs used when computing text lengths.
  this.Match_MinLength = 100;
  this.Match_MaxLength = 1000;
  // Chunk size for context length.
  this.Patch_Margin = 4;

  /**
   * Compute the number of bits in an int.
   * The normal answer for JavaScript is 32.
   * @return {Number} Max bits
   */
  function getMaxBits() {
    var maxbits = 0;
    var oldi = 1;
    var newi = 2;
    while (oldi != newi) {
      maxbits++;
      oldi = newi;
      newi = newi << 1;
    }
    return maxbits;
  }
  // How many bits in a number?
  this.Match_MaxBits = getMaxBits();
}

//  DIFF FUNCTIONS


/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;


/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {String} text1 Old string to be diffed
 * @param {String} text2 New string to be diffed
 * @param {Boolean} opt_checklines Optional speedup flag.  If present and false,
 *     then don't run a line-level diff first to identify the changed areas.
 *     Defaults to true, which does a faster, slightly less optimal diff
 * @return {Array} Array of diff tuples
 */
diff_match_patch.prototype.diff_main = function(text1, text2, opt_checklines) {
  // Check for equality (speedup)
  if (text1 == text2) {
    return [[DIFF_EQUAL, text1]];
  }

  if (typeof opt_checklines == 'undefined') {
    opt_checklines = true;
  }
  var checklines = opt_checklines;

  // Trim off common prefix (speedup)
  var commonlength = this.diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup)
  commonlength = this.diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block
  var diffs = this.diff_compute(text1, text2, checklines);

  // Restore the prefix and suffix
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  this.diff_cleanupMerge(diffs);
  return diffs;
};


/**
 * Find the differences between two texts.
 * @param {String} text1 Old string to be diffed
 * @param {String} text2 New string to be diffed
 * @param {Boolean} checklines Speedup flag.  If false, then don't run a
 *     line-level diff first to identify the changed areas.
 *     If true, then run a faster, slightly less optimal diff
 * @return {Array} Array of diff tuples
 */
diff_match_patch.prototype.diff_compute = function(text1, text2, checklines) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup)
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup)
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup)
    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
             [DIFF_EQUAL, shorttext],
             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }
  longtext = shorttext = null;  // Garbage collect

  // Check to see if the problem can be split in two.
  var hm = this.diff_halfMatch(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = this.diff_main(text1_a, text2_a, checklines);
    var diffs_b = this.diff_main(text1_b, text2_b, checklines);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  // Perform a real diff.
  if (checklines && text1.length + text2.length < 250) {
    // Too trivial for the overhead.
    checklines = false;
  }
  var linearray;
  if (checklines) {
    // Scan the text on a line-by-line basis first.
    var a = this.diff_linesToChars(text1, text2);
    text1 = a[0];
    text2 = a[1];
    linearray = a[2];
  }
  diffs = this.diff_map(text1, text2);
  if (!diffs) {
    // No acceptable result.
    diffs = [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }
  if (checklines) {
    // Convert the diff back to original text.
    this.diff_charsToLines(diffs, linearray);
    // Eliminate freak matches (e.g. blank lines)
    this.diff_cleanupSemantic(diffs);

    // Rediff any replacement blocks, this time character-by-character.
    // Add a dummy entry at the end.
    diffs.push([DIFF_EQUAL, '']);
    var pointer = 0;
    var count_delete = 0;
    var count_insert = 0;
    var text_delete = '';
    var text_insert = '';
    while (pointer < diffs.length) {
      if (diffs[pointer][0] == DIFF_INSERT) {
        count_insert++;
        text_insert += diffs[pointer][1];
      } else if (diffs[pointer][0] == DIFF_DELETE) {
        count_delete++;
        text_delete += diffs[pointer][1];
      } else {
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete >= 1 && count_insert >= 1) {
          // Delete the offending records and add the merged ones.
          var a = this.diff_main(text_delete, text_insert, false);
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert);
          pointer = pointer - count_delete - count_insert;
          for (var j = a.length - 1; j >= 0; j--) {
            diffs.splice(pointer, 0, a[j]);
          }
          pointer = pointer + a.length;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
      }
     pointer++;
    }
    diffs.pop();  // Remove the dummy entry at the end.
  }
  return diffs;
};


/**
 * Split two texts into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param {String} text1 First string
 * @param {String} text2 Second string
 * @return {Array} Three element Array, containing the encoded text1,
 *     the encoded text2 and the array of unique strings.  The zeroth element
 *     of the array of unique strings is intentionally blank.
 */
diff_match_patch.prototype.diff_linesToChars = function(text1, text2) {
  var linearray = [];  // e.g. linearray[4] == 'Hello\n'
  var linehash = {};   // e.g. linehash['Hello\n'] == 4

  // '\x00' is a valid character, but various debuggers don't like it.
  // So we'll insert a junk entry to avoid generating a null character.
  linearray.push('');

  /**
   * Split a text into an array of strings.  Reduce the texts to a string of
   * hashes where each Unicode character represents one line.
   * Modifies linearray and linehash through being a closure.
   * @param {String} text String to encode
   * @return {String} Encoded string
   */
  function diff_linesToCharsMunge(text) {
    var chars = '';
    // text.split('\n') would work fine, but would temporarily double our
    // memory footprint for minimal speed improvement.
    while (text) {
      var i = text.indexOf('\n');
      if (i == -1) {
        i = text.length;
      }
      var line = text.substring(0, i + 1);
      text = text.substring(i + 1);
      if (linehash.hasOwnProperty ? linehash.hasOwnProperty(line) :
          (linehash[line] !== undefined)) {
        chars += String.fromCharCode(linehash[line]);
      } else {
        linearray.push(line);
        linehash[line] = linearray.length - 1;
        chars += String.fromCharCode(linearray.length - 1);
      }
    }
    return chars;
  }

  var chars1 = diff_linesToCharsMunge(text1);
  var chars2 = diff_linesToCharsMunge(text2);
  return [chars1, chars2, linearray];
};


/**
 * Rehydrate the text in a diff from a string of line hashes to real lines of
 * text.
 * @param {Array} diffs Array of diff tuples
 * @param {Array} linearray Array of unique strings
 */
diff_match_patch.prototype.diff_charsToLines = function(diffs, linearray) {
  for (var x = 0; x < diffs.length; x++) {
    var chars = diffs[x][1];
    var text = [];
    for (var y = 0; y < chars.length; y++) {
      text.push(linearray[chars.charCodeAt(y)]);
    }
    diffs[x][1] = text.join('');
  }
};


/**
 * Explore the intersection points between the two texts.
 * @param {String} text1 Old string to be diffed
 * @param {String} text2 New string to be diffed
 * @return {Array | Null} Array of diff tuples or null if no diff available
 */
diff_match_patch.prototype.diff_map = function(text1, text2) {
  // Don't run for too long.
  var ms_end = (new Date()).getTime() + this.Diff_Timeout * 1000;
  var max_d = text1.length + text2.length - 1;
  var doubleEnd = this.Diff_DualThreshold * 2 < max_d;
  var v_map1 = [];
  var v_map2 = [];
  var v1 = {};
  var v2 = {};
  v1[1] = 0;
  v2[1] = 0;
  var x, y;
  var footstep;  // Used to track overlapping paths.
  var footsteps = {};
  var done = false;
  // Safari 1.x doesn't have hasOwnProperty
  var hasOwnProperty = !!(footsteps.hasOwnProperty);
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = (text1.length + text2.length) % 2;
  for (var d = 0; d < max_d; d++) {
    // Bail out if timeout reached.
    if (this.Diff_Timeout > 0 && (new Date()).getTime() > ms_end) {
      return null;
    }

    // Walk the front path one step.
    v_map1[d] = {};
    for (var k = -d; k <= d; k += 2) {
      if (k == -d || k != d && v1[k - 1] < v1[k + 1]) {
        x = v1[k + 1];
      } else {
        x = v1[k - 1] + 1;
      }
      y = x - k;
      if (doubleEnd) {
        footstep = x + ',' + y;
        if (front && (hasOwnProperty ? footsteps.hasOwnProperty(footstep) :
                      (footsteps[footstep] !== undefined))) {
          done = true;
        }
        if (!front) {
          footsteps[footstep] = d;
        }
      }
      while (!done && x < text1.length && y < text2.length &&
             text1.charAt(x) == text2.charAt(y)) {
        x++;
        y++;
        if (doubleEnd) {
          footstep = x + ',' + y;
          if (front && (hasOwnProperty ? footsteps.hasOwnProperty(footstep) :
              (footsteps[footstep] !== undefined))) {
            done = true;
          }
          if (!front) {
            footsteps[footstep] = d;
          }
        }
      }
      v1[k] = x;
      v_map1[d][x + ',' + y] = true;
      if (x == text1.length && y == text2.length) {
        // Reached the end in single-path mode.
        return this.diff_path1(v_map1, text1, text2);
      } else if (done) {
        // Front path ran over reverse path.
        v_map2 = v_map2.slice(0, footsteps[footstep] + 1);
        var a = this.diff_path1(v_map1, text1.substring(0, x),
                                text2.substring(0, y));
        return a.concat(this.diff_path2(v_map2, text1.substring(x),
                                        text2.substring(y)));
      }
    }

    if (doubleEnd) {
      // Walk the reverse path one step.
      v_map2[d] = {};
      for (var k = -d; k <= d; k += 2) {
        if (k == -d || k != d && v2[k - 1] < v2[k + 1]) {
          x = v2[k + 1];
        } else {
          x = v2[k - 1] + 1;
        }
        y = x - k;
        footstep = (text1.length - x) + ',' + (text2.length - y);
        if (!front && (hasOwnProperty ? footsteps.hasOwnProperty(footstep) :
                       (footsteps[footstep] !== undefined))) {
          done = true;
        }
        if (front) {
          footsteps[footstep] = d;
        }
        while (!done && x < text1.length && y < text2.length &&
               text1.charAt(text1.length - x - 1) ==
               text2.charAt(text2.length - y - 1)) {
          x++;
          y++;
          footstep = (text1.length - x) + ',' + (text2.length - y);
          if (!front && (hasOwnProperty ? footsteps.hasOwnProperty(footstep) :
                         (footsteps[footstep] !== undefined))) {
            done = true;
          }
          if (front) {
            footsteps[footstep] = d;
          }
        }
        v2[k] = x;
        v_map2[d][x + ',' + y] = true;
        if (done) {
          // Reverse path ran over front path.
          v_map1 = v_map1.slice(0, footsteps[footstep] + 1);
          var a = this.diff_path1(v_map1, text1.substring(0, text1.length - x),
                                  text2.substring(0, text2.length - y));
          return a.concat(this.diff_path2(v_map2,
                          text1.substring(text1.length - x),
                          text2.substring(text2.length - y)));
        }
      }
    }
  }
  // Number of diffs equals number of characters, no commonality at all.
  return null;
};


/**
 * Work from the middle back to the start to determine the path.
 * @param {Array} v_map Array of paths.
 * @param {String} text1 Old string fragment to be diffed
 * @param {String} text2 New string fragment to be diffed
 * @return {Array} Array of diff tuples
 */
diff_match_patch.prototype.diff_path1 = function(v_map, text1, text2) {
  var path = [];
  var x = text1.length;
  var y = text2.length;
  var last_op = null;
  for (var d = v_map.length - 2; d >= 0; d--) {
    while (1) {
      if (v_map[d].hasOwnProperty ? v_map[d].hasOwnProperty((x - 1) + ',' + y) :
          (v_map[d][(x - 1) + ',' + y] !== undefined)) {
        x--;
        if (last_op === DIFF_DELETE) {
          path[0][1] = text1.charAt(x) + path[0][1];
        } else {
          path.unshift([DIFF_DELETE, text1.charAt(x)]);
        }
        last_op = DIFF_DELETE;
        break;
      } else if (v_map[d].hasOwnProperty ?
                 v_map[d].hasOwnProperty(x + ',' + (y - 1)) :
                 (v_map[d][x + ',' + (y - 1)] !== undefined)) {
        y--;
        if (last_op === DIFF_INSERT) {
          path[0][1] = text2.charAt(y) + path[0][1];
        } else {
          path.unshift([DIFF_INSERT, text2.charAt(y)]);
        }
        last_op = DIFF_INSERT;
        break;
      } else {
        x--;
        y--;
        //if (text1.charAt(x) != text2.charAt(y)) {
        //  return alert('No diagonal.  Can\'t happen. (diff_path1)');
        //}
        if (last_op === DIFF_EQUAL) {
          path[0][1] = text1.charAt(x) + path[0][1];
        } else {
          path.unshift([DIFF_EQUAL, text1.charAt(x)]);
        }
        last_op = DIFF_EQUAL;
      }
    }
  }
  return path;
};


/**
 * Work from the middle back to the end to determine the path.
 * @param {Array} v_map Array of paths.
 * @param {String} text1 Old string fragment to be diffed
 * @param {String} text2 New string fragment to be diffed
 * @return {Array} Array of diff tuples
 */
diff_match_patch.prototype.diff_path2 = function(v_map, text1, text2) {
  var path = [];
  var x = text1.length;
  var y = text2.length;
  var last_op = null;
  for (var d = v_map.length - 2; d >= 0; d--) {
    while (1) {
      if (v_map[d].hasOwnProperty ? v_map[d].hasOwnProperty((x - 1) + ',' + y) :
          (v_map[d][(x - 1) + ',' + y] !== undefined)) {
        x--;
        if (last_op === DIFF_DELETE) {
          path[path.length - 1][1] += text1.charAt(text1.length - x - 1);
        } else {
          path.push([DIFF_DELETE, text1.charAt(text1.length - x - 1)]);
        }
        last_op = DIFF_DELETE;
        break;
      } else if (v_map[d].hasOwnProperty ?
                 v_map[d].hasOwnProperty(x + ',' + (y - 1)) :
                 (v_map[d][x + ',' + (y - 1)] !== undefined)) {
        y--;
        if (last_op === DIFF_INSERT) {
          path[path.length - 1][1] += text2.charAt(text2.length - y - 1);
        } else {
          path.push([DIFF_INSERT, text2.charAt(text2.length - y - 1)]);
        }
        last_op = DIFF_INSERT;
        break;
      } else {
        x--;
        y--;
        //if (text1.charAt(text1.length - x - 1) !=
        //    text2.charAt(text2.length - y - 1)) {
        //  return alert('No diagonal.  Can\'t happen. (diff_path2)');
        //}
        if (last_op === DIFF_EQUAL) {
          path[path.length - 1][1] += text1.charAt(text1.length - x - 1);
        } else {
          path.push([DIFF_EQUAL, text1.charAt(text1.length - x - 1)]);
        }
        last_op = DIFF_EQUAL;
      }
    }
  }
  return path;
};


/**
 * Trim off common prefix
 * @param {String} text1 First string
 * @param {String} text2 Second string
 * @return {Number} The number of characters common to the start of each
 *     string.
 */
diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charCodeAt(0) !== text2.charCodeAt(0)) {
    return 0;
  }
  // Binary search.
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) ==
        text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Trim off common suffix
 * @param {String} text1 First string
 * @param {String} text2 Second string
 * @return {Number} The number of characters common to the end of each string.
 */
diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charCodeAt(text1.length - 1) !==
                          text2.charCodeAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * @param {String} text1 First string
 * @param {String} text2 Second string
 * @return {Array} Five element Array, containing the prefix of text1, the
 *     suffix of text1, the prefix of text2, the suffix of text2 and the
 *     common middle.  Or null if there was no match.
 */
diff_match_patch.prototype.diff_halfMatch = function(text1, text2) {
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 10 || shorttext.length < 1) {
    return null;  // Pointless.
  }
  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {String} longtext Longer string
   * @param {String} shorttext Shorter string
   * @param {Number} i Start index of quarter length substring within longtext
   * @return {Array} Five element Array, containing the prefix of longtext, the
   *     suffix of longtext, the prefix of shorttext, the suffix of shorttext
   *     and the common middle.  Or null if there was no match.
   */
  function diff_halfMatchI(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i),
                                     shorttext.substring(j));
      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i),
                                     shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) +
            shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length >= longtext.length / 2) {
      return [best_longtext_a, best_longtext_b,
              best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI(longtext, shorttext,
                             Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI(longtext, shorttext,
                             Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};


/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {Array} diffs Array of diff tuples
 */
diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var lastequality = null;  // Always equal to equalities[equalities.length-1][1]
  var pointer = 0;  // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_changes1 = 0;
  // Number of characters that changed after the equality.
  var length_changes2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // equality found
      equalities.push(pointer);
      length_changes1 = length_changes2;
      length_changes2 = 0;
      lastequality = diffs[pointer][1];
    } else {  // an insertion or deletion
      length_changes2 += diffs[pointer][1].length;
      if (lastequality !== null && (lastequality.length <= length_changes1) &&
          (lastequality.length <= length_changes2)) {
        //alert('Splitting: "' + lastequality + '"');
        // Duplicate record
        diffs.splice(equalities[equalities.length - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalities.length - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalities.pop();
        // Throw away the previous equality (it needs to be reevaluated).
        equalities.pop();
        pointer = equalities.length ? equalities[equalities.length - 1] : -1;
        length_changes1 = 0;  // Reset the counters.
        length_changes2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
  this.diff_cleanupSemanticLossless(diffs);
};


/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {Array} diffs Array of diff tuples
 */
diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
  /**
   * Given three strings, compute a score representing whether the two internal
   * boundaries fall on word boundaries.
   * Closure, but does not reference any external variables.
   * @param {String} one First string
   * @param {String} two Second string
   * @param {String} three Third string
   * @return {Number} The score.
   */
  function diff_cleanupSemanticScore(one, two, three) {
    var whitespace = /\s/;
    var score = 0;
    if (one.charAt(one.length - 1).match(whitespace) ||
        two.charAt(0).match(whitespace)) {
      score++;
    }
    if (two.charAt(two.length - 1).match(whitespace) ||
        three.charAt(0).match(whitespace)) {
      score++;
    }
    return score;
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = this.diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore(equality1, edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore(equality1, edit, equality2);
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        diffs[pointer - 1][1] = bestEquality1;
        diffs[pointer][1] = bestEdit;
        diffs[pointer + 1][1] = bestEquality2;
      }
    }
    pointer++;
  }
};


/**
 * Reduce the number of edits by eliminating operationally trivial equalities.
 * @param {Array} diffs Array of diff tuples
 */
diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var lastequality = '';  // Always equal to equalities[equalities.length-1][1]
  var pointer = 0;  // Index of current position.
  // Is there an insertion operation before the last equality.
  var pre_ins = false;
  // Is there a deletion operation before the last equality.
  var pre_del = false;
  // Is there an insertion operation after the last equality.
  var post_ins = false;
  // Is there a deletion operation after the last equality.
  var post_del = false;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // equality found
      if (diffs[pointer][1].length < this.Diff_EditCost &&
          (post_ins || post_del)) {
        // Candidate found.
        equalities.push(pointer);
        pre_ins = post_ins;
        pre_del = post_del;
        lastequality = diffs[pointer][1];
      } else {
        // Not a candidate, and can never become one.
        equalities = [];
        lastequality = '';
      }
      post_ins = post_del = false;
    } else {  // an insertion or deletion
      if (diffs[pointer][0] == DIFF_DELETE) {
        post_del = true;
      } else {
        post_ins = true;
      }
      /*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
      if (lastequality && ((pre_ins && pre_del && post_ins && post_del) ||
                           ((lastequality.length < this.Diff_EditCost / 2) &&
                            (pre_ins + pre_del + post_ins + post_del) == 3))) {
        //alert('Splitting: "' + lastequality + '"');
        // Duplicate record
        diffs.splice(equalities[equalities.length - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalities.length - 1] + 1][0] = DIFF_INSERT;
        equalities.pop();  // Throw away the equality we just deleted;
        lastequality = '';
        if (pre_ins && pre_del) {
          // No changes made which could affect previous entry, keep going.
          post_ins = post_del = true;
          equalities = [];
        } else {
          equalities.pop();  // Throw away the previous equality;
          pointer = equalities.length ? equalities[equalities.length - 1] : -1;
          post_ins = post_del = false;
        }
        changes = true;
      }
    }
    pointer++;
  }

  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {Array} diffs Array of diff tuples
 */
diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_INSERT) {
      count_insert++;
      text_insert += diffs[pointer][1];
      pointer++;
    } else if (diffs[pointer][0] == DIFF_DELETE) {
      count_delete++;
      text_delete += diffs[pointer][1];
      pointer++;
    } else {  // Upon reaching an equality, check for prior redundancies.
      if (count_delete !== 0 || count_insert !== 0) {
        if (count_delete !== 0 && count_insert !== 0) {
          // Factor out any common prefixies.
          commonlength = this.diff_commonPrefix(text_insert, text_delete);
          if (commonlength !== 0) {
            if ((pointer - count_delete - count_insert) > 0 &&
                diffs[pointer - count_delete - count_insert - 1][0] ==
                DIFF_EQUAL) {
              diffs[pointer - count_delete - count_insert - 1][1] +=
                  text_insert.substring(0, commonlength);
            } else {
              diffs.splice(0, 0, [DIFF_EQUAL,
                  text_insert.substring(0, commonlength)]);
              pointer++;
            }
            text_insert = text_insert.substring(commonlength);
            text_delete = text_delete.substring(commonlength);
          }
          // Factor out any common suffixies.
          commonlength = this.diff_commonSuffix(text_insert, text_delete);
          if (commonlength !== 0) {
            diffs[pointer][1] = text_insert.substring(text_insert.length
                - commonlength) + diffs[pointer][1];
            text_insert = text_insert.substring(0, text_insert.length
                - commonlength);
            text_delete = text_delete.substring(0, text_delete.length
                - commonlength);
          }
        }
        // Delete the offending records and add the merged ones.
        if (count_delete === 0) {
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert, [DIFF_INSERT, text_insert]);
        } else if (count_insert === 0) {
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert, [DIFF_DELETE, text_delete]);
        } else {
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert, [DIFF_DELETE, text_delete],
                       [DIFF_INSERT, text_insert]);
        }
        pointer = pointer - count_delete - count_insert +
                  (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
      } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
        // Merge this equality with the previous one.
        diffs[pointer - 1][1] += diffs[pointer][1];
        diffs.splice(pointer, 1);
      } else {
        pointer++;
      }
      count_insert = 0;
      count_delete = 0;
      text_delete = '';
      text_insert = '';
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop();  // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length -
          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] +
            diffs[pointer][1].substring(0, diffs[pointer][1].length -
                                        diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length)
          == diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
            diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * Add an index to each tuple, represents where the tuple is located in text2.
 * e.g. [[DIFF_DELETE, 'h', 0], [DIFF_INSERT, 'c', 0], [DIFF_EQUAL, 'at', 1]]
 * @param {Array} diffs Array of diff tuples
 */
diff_match_patch.prototype.diff_addIndex = function(diffs) {
  var i = 0;
  for (var x = 0; x < diffs.length; x++) {
    diffs[x].push(i);
    if (diffs[x][0] !== DIFF_DELETE) {
      i += diffs[x][1].length;
    }
  }
};


/**
 * loc is a location in text1, compute and return the equivalent location in
 * text2.
 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
 * @param {Array} diffs Array of diff tuples
 * @param {Number} loc Location within text1
 * @return {Number} Location within text2
 */
diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
  var chars1 = 0;
  var chars2 = 0;
  var last_chars1 = 0;
  var last_chars2 = 0;
  var x;
  for (x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {  // Equality or deletion.
      chars1 += diffs[x][1].length;
    }
    if (diffs[x][0] !== DIFF_DELETE) {  // Equality or insertion.
      chars2 += diffs[x][1].length;
    }
    if (chars1 > loc) {  // Overshot the location.
      break;
    }
    last_chars1 = chars1;
    last_chars2 = chars2;
  }
  // Was the location was deleted?
  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
    return last_chars2;
  }
  // Add the remaining character length.
  return last_chars2 + (loc - last_chars1);
};


/**
 * Convert a diff array into a pretty HTML report.
 * @param {Array} diffs Array of diff tuples
 * @return {String} HTML representation
 */
diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
  this.diff_addIndex(diffs);
  var html = [];
  for (var x = 0; x < diffs.length; x++) {
    var m = diffs[x][0]; // Mode (delete, equal, insert)
    var t = diffs[x][1]; // Text of change.
    var i = diffs[x][2]; // Index of change.
    t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    t = t.replace(/\n/g, '&para;<BR>');
    if (m === DIFF_DELETE) {
      html.push('<DEL STYLE="background:#FFE6E6;" TITLE="i=', i, '">',
              t, '</DEL>');
    } else if (m === DIFF_INSERT) {
      html.push('<INS STYLE="background:#E6FFE6;" TITLE="i=', i, '">',
              t, '</INS>');
    } else {
      html.push('<SPAN TITLE="i=', i, '">', t, '</SPAN>');
    }
  }
  return html.join('');
};


/**
 * Compute and return the source text (all equalities and deletions).
 * @param {Array} diffs Array of diff tuples
 * @return {String} Source text
 */
diff_match_patch.prototype.diff_text1 = function(diffs) {
  var txt = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      txt.push(diffs[x][1]);
    }
  }
  return txt.join('');
};


/**
 * Compute and return the destination text (all equalities and insertions).
 * @param {Array} diffs Array of diff tuples
 * @return {String} Destination text
 */
diff_match_patch.prototype.diff_text2 = function(diffs) {
  var txt = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_DELETE) {
      txt.push(diffs[x][1]);
    }
  }
  return txt.join('');
};


/**
 * Crush the diff into an encoded string which describes the operations
 * required to transform text1 into text2.
 * E.g. =3\t-2\t+ing\t  -> Keep 3 chars, delete 2 chars, insert 'ing'.
 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
 * @param {Array} diffs Array of diff tuples
 * @return {String} Delta text
 */
diff_match_patch.prototype.diff_toDelta = function(diffs) {
  var txt = [];
  for (var x = 0; x < diffs.length; x++) {
    switch(diffs[x][0]) {
      case DIFF_DELETE:
        txt.push('-', diffs[x][1].length, '\t');
        break;
      case DIFF_EQUAL:
        txt.push('=', diffs[x][1].length, '\t');
        break;
      case DIFF_INSERT:
        txt.push('+', encodeURI(diffs[x][1]), '\t');
        break;
      default:
        alert('Invalid diff operation in diff_toDelta()');
    }
  }
  return txt.join('').replace(/%20/g, ' ');
};


/**
 * Given the original text1, and an encoded string which describes the
 * operations required to transform text1 into text2, compute the full diff.
 * @param {String} text1 Source string for the diff
 * @param {String} delta Delta text
 * @return {Array} Array of diff tuples
 */
diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
  var diffs = [];
  var pointer = 0;  // Cursor in text1
  var tokens = delta.split(/\t/g);
  for (var x = 0; x < tokens.length; x++) {
    var param = tokens[x].substring(1);
    switch(tokens[x].charAt(0)) {
      case '-':
        // Fall through.
      case '=':
        var n = parseInt(param, 10);
        if (isNaN(n) || n < 0) {
          alert('Invalid number in diff_fromDelta()');
        } else {
          var text = text1.substring(pointer, pointer += n);
          if (tokens[x].charAt(0) == '=') {
            diffs.push([DIFF_EQUAL, text]);
          } else {
            diffs.push([DIFF_DELETE, text]);
          }
        }
        break;
      case '+':
        diffs.push([DIFF_INSERT, decodeURI(param)]);
        break;
      default:
        // Blank tokens are ok (from a trailing \t).
        // Anything else is an error.
        if (tokens[x]) {
          alert('Invalid diff operation in diff_fromDelta()');
        }
    }
  }
  if (pointer != text1.length) {
    alert('Text length mismatch in diff_fromDelta()');
  }
  return diffs;
};


//  MATCH FUNCTIONS


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc'.
 * @param {String} text The text to search
 * @param {String} pattern The pattern to search for
 * @param {Number} loc The location to search around
 * @return {Number | Null} Best match index or null
 */
diff_match_patch.prototype.match_main = function(text, pattern, loc) {
  loc = Math.max(0, Math.min(loc, text.length - pattern.length));
  if (text == pattern) {
    // Shortcut (potentially not guaranteed by the algorithm)
    return 0;
  } else if (text.length === 0) {
    // Nothing to match.
    return null;
  } else if (text.substring(loc, loc + pattern.length) == pattern) {
    // Perfect match at the perfect spot!  (Includes case of null pattern)
    return loc;
  } else {
    // Do a fuzzy compare.
    return this.match_bitap(text, pattern, loc);
  }
};


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
 * Bitap algorithm.
 * @param {String} text The text to search
 * @param {String} pattern The pattern to search for
 * @param {Number} loc The location to search around
 * @return {Number | Null} Best match index or null
 */
diff_match_patch.prototype.match_bitap = function(text, pattern, loc) {
  if (pattern.length > this.Match_MaxBits) {
    return alert('Pattern too long for this browser.');
  }

  // Initialise the alphabet.
  var s = this.match_alphabet(pattern);

  var score_text_length = text.length;
  // Coerce the text length between reasonable maximums and minimums.
  score_text_length = Math.max(score_text_length, this.Match_MinLength);
  score_text_length = Math.min(score_text_length, this.Match_MaxLength);

  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Compute and return the score for a match with e errors and x location.
   * Accesses loc, score_text_length and pattern through being a closure.
   * @param {Number} e Number of errors in match
   * @param {Number} x Location of match
   * @return {Number} Overall score for match
   */
  function match_bitapScore(e, x) {
    var d = Math.abs(loc - x);
    return (e / pattern.length / dmp.Match_Balance) +
           (d / score_text_length / (1.0 - dmp.Match_Balance));
  }

  // Highest score beyond which we give up.
  var score_threshold = this.Match_Threshold;
  // Is there a nearby exact match? (speedup)
  var best_loc = text.indexOf(pattern, loc);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore(0, best_loc), score_threshold);
  }
  // What about in the other direction? (speedup)
  best_loc = text.lastIndexOf(pattern, loc + pattern.length);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore(0, best_loc), score_threshold);
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1);
  best_loc = null;

  var bin_min, bin_mid;
  var bin_max = Math.max(loc + loc, text.length);
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    var rd = Array(text.length);

    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = loc;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore(d, bin_mid) < score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(0, loc - (bin_mid - loc) - 1);
    var finish = Math.min(text.length - 1, pattern.length + bin_mid);

    if (text.charAt(finish) == pattern.charAt(pattern.length - 1)) {
      rd[finish] = (1 << (d + 1)) - 1;
    } else {
      rd[finish] = (1 << d) - 1;
    }
    for (var j = finish - 1; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following lines generate
      // warnings.
      if (d === 0) {  // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & s[text.charAt(j)];
      } else {  // Subsequent passes: fuzzy match.
        rd[j] = ((rd[j + 1] << 1) | 1) & s[text.charAt(j)] |
                ((last_rd[j + 1] << 1) | 1) | ((last_rd[j] << 1) | 1) |
                last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore(d, j);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j;
          if (j > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(0, loc - (j - loc));
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore(d + 1, loc) > score_threshold) {
      break;
    }
    last_rd = rd;
  }
  return best_loc;
};


/**
 * Initialise the alphabet for the Bitap algorithm.
 * @param {String} pattern The text to encode
 * @return {Object} Hash of character locations
 */
diff_match_patch.prototype.match_alphabet = function(pattern) {
  var s = Object();
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] = 0;
  }
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
  }
  return s;
};


//  PATCH FUNCTIONS


/**
 * Increase the context until it is unique,
 * but don't let the pattern expand beyond Match_MaxBits.
 * @param {Patch} patch The patch to grow
 * @param {String} text Source text
 */
diff_match_patch.prototype.patch_addContext = function(patch, text) {
  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
  var padding = 0;
  while (text.indexOf(pattern) != text.lastIndexOf(pattern) &&
         pattern.length < this.Match_MaxBits - this.Patch_Margin
         - this.Patch_Margin) {
    padding += this.Patch_Margin;
    pattern = text.substring(patch.start2 - padding,
                             patch.start2 + patch.length1 + padding);
  }
  // Add one chunk for good luck.
  padding += this.Patch_Margin;
  // Add the prefix.
  var prefix = text.substring(patch.start2 - padding, patch.start2);
  if (prefix !== '') {
    patch.diffs.unshift([DIFF_EQUAL, prefix]);
  }
  // Add the suffix.
  var suffix = text.substring(patch.start2 + patch.length1,
                              patch.start2 + patch.length1 + padding);
  if (suffix !== '') {
    patch.diffs.push([DIFF_EQUAL, suffix]);
  }

  // Roll back the start points.
  patch.start1 -= prefix.length;
  patch.start2 -= prefix.length;
  // Extend the lengths.
  patch.length1 += prefix.length + suffix.length;
  patch.length2 += prefix.length + suffix.length;
};


/**
 * Compute a list of patches to turn text1 into text2.
 * Use diffs if provided, otherwise compute it ourselves.
 * @param {String} text1 Old text
 * @param {String} text2 New text
 * @param {Array} opt_diffs Optional array of diff tuples for text1 to text2.
 * @return {Array} Array of patch objects.
 */
diff_match_patch.prototype.patch_make = function(text1, text2, opt_diffs) {
  var diffs;
  if (typeof opt_diffs != 'undefined') {
    diffs = opt_diffs;
  } else {
    diffs = this.diff_main(text1, text2, true);
    if (diffs.length > 2) {
      this.diff_cleanupSemantic(diffs);
      this.diff_cleanupEfficiency(diffs);
    }
  }

  if (diffs.length === 0) {
    return [];  // Get rid of the null case.
  }
  var patches = [];
  var patch = new patch_obj();
  var char_count1 = 0;  // Number of characters into the text1 string.
  var char_count2 = 0;  // Number of characters into the text2 string.
  var prepatch_text = text1;  // Recreate the patches to determine context info.
  var postpatch_text = text1;
  for (var x = 0; x < diffs.length; x++) {
    var diff_type = diffs[x][0];
    var diff_text = diffs[x][1];

    if (patch.diffs.length === 0 && diff_type !== DIFF_EQUAL) {
      // A new patch starts here.
      patch.start1 = char_count1;
      patch.start2 = char_count2;
    }

    if (diff_type === DIFF_INSERT) {
      // Insertion
      patch.diffs.push(diffs[x]);
      patch.length2 += diff_text.length;
      postpatch_text = postpatch_text.substring(0, char_count2) + diff_text +
                       postpatch_text.substring(char_count2);
    } else if (diff_type === DIFF_DELETE) {
      // Deletion.
      patch.length1 += diff_text.length;
      patch.diffs.push(diffs[x]);
      postpatch_text = postpatch_text.substring(0, char_count2) +
                       postpatch_text.substring(char_count2 + diff_text.length);
    } else if (diff_type === DIFF_EQUAL &&
               diff_text.length <= 2 * this.Patch_Margin &&
               patch.diffs.length !== 0 && diffs.length != x + 1) {
      // Small equality inside a patch.
      patch.diffs.push(diffs[x]);
      patch.length1 += diff_text.length;
      patch.length2 += diff_text.length;
    }

    if (diff_type === DIFF_EQUAL && diff_text.length >= 2 * this.Patch_Margin) {
      // Time for a new patch.
      if (patch.diffs.length !== 0) {
        this.patch_addContext(patch, prepatch_text);
        patches.push(patch);
        patch = new patch_obj();
        prepatch_text = postpatch_text;
      }
    }

    // Update the current character count.
    if (diff_type !== DIFF_INSERT) {
      char_count1 += diff_text.length;
    }
    if (diff_type !== DIFF_DELETE) {
      char_count2 += diff_text.length;
    }
  }
  // Pick up the leftover patch if not empty.
  if (patch.diffs.length !== 0) {
    this.patch_addContext(patch, prepatch_text);
    patches.push(patch);
  }

  return patches;
};


/**
 * Merge a set of patches onto the text.  Return a patched text, as well
 * as a list of true/false values indicating which patches were applied.
 * @param {Array} patches Array of patch objects
 * @param {String} text Old text
 * @return {Array} Two element Array, containing the new text and an array of
 *      boolean values
 */
diff_match_patch.prototype.patch_apply = function(patches, text) {
  this.patch_splitMax(patches);
  var results = [];
  var delta = 0;
  for (var x = 0; x < patches.length; x++) {
    var expected_loc = patches[x].start2 + delta;
    var text1 = this.diff_text1(patches[x].diffs);
    var start_loc = this.match_main(text, text1, expected_loc);
    if (start_loc === null) {
      // No match found.  :(
      results.push(false);
    } else {
      // Found a match.  :)
      results.push(true);
      delta = start_loc - expected_loc;
      var text2 = text.substring(start_loc, start_loc + text1.length);
      if (text1 == text2) {
        // Perfect match, just shove the replacement text in.
        text = text.substring(0, start_loc) +
               this.diff_text2(patches[x].diffs) +
               text.substring(start_loc + text1.length);
      } else {
        // Imperfect match.  Run a diff to get a framework of equivalent
        // indicies.
        var diffs = this.diff_main(text1, text2, false);
        this.diff_cleanupSemanticLossless(diffs);
        var index1 = 0;
        var index2;
        for (var y = 0; y < patches[x].diffs.length; y++) {
          var mod = patches[x].diffs[y];
          if (mod[0] !== DIFF_EQUAL) {
            index2 = this.diff_xIndex(diffs, index1);
          }
          if (mod[0] === DIFF_INSERT) {  // Insertion
            text = text.substring(0, start_loc + index2) + mod[1] +
                   text.substring(start_loc + index2);
          } else if (mod[0] === DIFF_DELETE) {  // Deletion
            text = text.substring(0, start_loc + index2) +
                   text.substring(start_loc + this.diff_xIndex(diffs,
                       index1 + mod[1].length));
          }
          if (mod[0] !== DIFF_DELETE) {
            index1 += mod[1].length;
          }
        }
      }
    }
  }
  return [text, results];
};


/**
 * Look through the patches and break up any which are longer than the maximum
 * limit of the match algorithm.
 * @param {Array} patches Array of patch objects.
 */
diff_match_patch.prototype.patch_splitMax = function(patches) {
  for (var x = 0; x < patches.length; x++) {
    if (patches[x].length1 > this.Match_MaxBits) {
      var bigpatch = patches[x];
      // Remove the big old patch.
      patches.splice(x, 1);
      var patch_size = this.Match_MaxBits;
      var start1 = bigpatch.start1;
      var start2 = bigpatch.start2;
      var precontext = '';
      while (bigpatch.diffs.length !== 0) {
        // Create one of several smaller patches.
        var patch = new patch_obj();
        var empty = true;
        patch.start1 = start1 - precontext.length;
        patch.start2 = start2 - precontext.length;
        if (precontext !== '') {
          patch.length1 = patch.length2 = precontext.length;
          patch.diffs.push([DIFF_EQUAL, precontext]);
        }
        while (bigpatch.diffs.length !== 0 &&
               patch.length1 < patch_size - this.Patch_Margin) {
          var diff_type = bigpatch.diffs[0][0];
          var diff_text = bigpatch.diffs[0][1];
          if (diff_type === DIFF_INSERT) {
            // Insertions are harmless.
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
            patch.diffs.push(bigpatch.diffs.shift());
            empty = false;
          } else {
            // Deletion or equality.  Only take as much as we can stomach.
            diff_text = diff_text.substring(0, patch_size - patch.length1 -
                                               this.Patch_Margin);
            patch.length1 += diff_text.length;
            start1 += diff_text.length;
            if (diff_type === DIFF_EQUAL) {
              patch.length2 += diff_text.length;
              start2 += diff_text.length;
            } else {
              empty = false;
            }
            patch.diffs.push([diff_type, diff_text]);
            if (diff_text == bigpatch.diffs[0][1]) {
              bigpatch.diffs.shift();
            } else {
              bigpatch.diffs[0][1] =
                  bigpatch.diffs[0][1].substring(diff_text.length);
            }
          }
        }
        // Compute the head context for the next patch.
        precontext = this.diff_text2(patch.diffs);
        precontext =
            precontext.substring(precontext.length - this.Patch_Margin);
        // Append the end context for this patch.
        var postcontext = this.diff_text1(bigpatch.diffs).substring(0, this.Patch_Margin);
        if (postcontext !== '') {
          patch.length1 += postcontext.length;
          patch.length2 += postcontext.length;
          if (patch.diffs.length !== 0 &&
              patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
            patch.diffs[patch.diffs.length - 1][1] += postcontext;
          } else {
            patch.diffs.push([DIFF_EQUAL, postcontext]);
          }
        }
        if (!empty) {
          patches.splice(x++, 0, patch);
        }
      }
    }
  }
};


/**
 * Take a list of patches and return a textual representation.
 * @param {Array} patches Array of patch objects.
 * @return {String} Text representation of patches.
 */
diff_match_patch.prototype.patch_toText = function(patches) {
  var text = [];
  for (var x = 0; x < patches.length; x++) {
    text.push(patches[x]);
  }
  return text.join('');
};


/**
 * Parse a textual representation of patches and return a list of patch objects.
 * @param {String} textline Text representation of patches.
 * @return {Array} Array of patch objects.
 */
diff_match_patch.prototype.patch_fromText = function(textline) {
  var patches = [];
  var text = textline.split('\n');
  while (text.length !== 0) {
    var m = text[0].match(/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/);
    if (!m) {
      return alert('Invalid patch string:\n' + text[0]);
    }
    var patch = new patch_obj();
    patches.push(patch);
    patch.start1 = parseInt(m[1], 10);
    if (m[2] === '') {
      patch.start1--;
      patch.length1 = 1;
    } else if (m[2] == '0') {
      patch.length1 = 0;
    } else {
      patch.start1--;
      patch.length1 = parseInt(m[2], 10);
    }

    patch.start2 = parseInt(m[3], 10);
    if (m[4] === '') {
      patch.start2--;
      patch.length2 = 1;
    } else if (m[4] == '0') {
      patch.length2 = 0;
    } else {
      patch.start2--;
      patch.length2 = parseInt(m[4], 10);
    }
    text.shift();

    while (text.length !== 0) {
      var sign = text[0].charAt(0);
      var line = decodeURIComponent(text[0].substring(1));
      if (sign == '-') {
        // Deletion.
        patch.diffs.push([DIFF_DELETE, line]);
      } else if (sign == '+') {
        // Insertion.
        patch.diffs.push([DIFF_INSERT, line]);
      } else if (sign == ' ') {
        // Minor equality.
        patch.diffs.push([DIFF_EQUAL, line]);
      } else if (sign == '@') {
        // Start of next patch.
        break;
      } else if (sign === '') {
        // Blank line?  Whatever.
      } else {
        // WTF?
        return alert('Invalid patch mode: "' + sign + '"\n' + line);
      }
      text.shift();
    }
  }
  return patches;
};


/**
 * Class representing one patch operation.
 * @constructor
 */
function patch_obj() {
  this.diffs = [];
  this.start1 = null;
  this.start2 = null;
  this.length1 = 0;
  this.length2 = 0;
}


/**
 * Emmulate GNU diff's format.
 * Header: @@ -382,8 +481,9 @@
 * Indicies are printed as 1-based, not 0-based.
 * @return {String} The GNU diff string
 */
patch_obj.prototype.toString = function() {
  var coords1, coords2;
  if (this.length1 === 0) {
    coords1 = this.start1 + ',0';
  } else if (this.length1 == 1) {
    coords1 = this.start1 + 1;
  } else {
    coords1 = (this.start1 + 1) + ',' + this.length1;
  }
  if (this.length2 === 0) {
    coords2 = this.start2 + ',0';
  } else if (this.length2 == 1) {
    coords2 = this.start2 + 1;
  } else {
    coords2 = (this.start2 + 1) + ',' + this.length2;
  }
  var txt = ['@@ -', coords1, ' +', coords2, ' @@\n'];
  // Escape the body of the patch with %xx notation.
  for (var x = 0; x < this.diffs.length; x++) {
    switch(this.diffs[x][0]) {
      case DIFF_DELETE:
        txt.push('-');
        break;
      case DIFF_EQUAL:
        txt.push(' ');
        break;
      case DIFF_INSERT:
        txt.push('+');
        break;
      default:
        alert('Invalid diff operation in patch_obj.toString()');
    }
    txt.push(encodeURI(this.diffs[x][1]), '\n');
  }
  return txt.join('').replace(/%20/g, ' ');
};

