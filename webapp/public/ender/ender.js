/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build underscore backbone bean bonzo domready qwery jeesh q pajamas morpheus
  * =============================================================
  */

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011-2012 (@ded @fat)
  * http://ender.jit.su
  * License MIT
  */
(function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context['$']
    , oldEnder = context['ender']
    , oldRequire = context['require']
    , oldProvide = context['provide']

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules['$' + identifier] || window[identifier]
    if (!module) throw new Error("Ender Error: Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules['$' + name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  /**
   * main Ender return object
   * @constructor
   * @param {Array|Node|string} s a CSS selector or DOM node(s)
   * @param {Array.|Node} r a root node(s)
   */
  function Ender(s, r) {
    var elements
      , i

    this.selector = s
    // string || node || nodelist || window
    if (typeof s == 'undefined') {
      elements = []
      this.selector = ''
    } else if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      elements = ender._select(s, r)
    } else {
      elements = isFinite(s.length) ? s : [s]
    }
    this.length = elements.length
    for (i = this.length; i--;) this[i] = elements[i]
  }

  /**
   * @param {function(el, i, inst)} fn
   * @param {Object} opt_scope
   * @returns {Ender}
   */
  Ender.prototype['forEach'] = function (fn, opt_scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(opt_scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }

  Ender.prototype.$ = ender // handy reference to self


  function ender(s, r) {
    return new Ender(s, r)
  }

  ender['_VERSION'] = '0.4.3-dev'

  ender.fn = Ender.prototype // for easy compat to jQuery plugins

  ender.ender = function (o, chain) {
    aug(chain ? Ender.prototype : ender, o)
  }

  ender._select = function (s, r) {
    if (typeof s == 'string') return (r || document).querySelectorAll(s)
    if (s.nodeName) return [s]
    return s
  }


  // use callback to receive Ender's require & provide and remove them from global
  ender.noConflict = function (callback) {
    context['$'] = old
    if (callback) {
      context['provide'] = oldProvide
      context['require'] = oldRequire
      context['ender'] = oldEnder
      if (typeof callback == 'function') callback(require, provide, this)
    }
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = ender

}(this));

(function () {

  var module = { exports: {} }, exports = module.exports;

  //     Underscore.js 1.4.4
  //     http://underscorejs.org
  //     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
  //     Underscore may be freely distributed under the MIT license.
  
  (function() {
  
    // Baseline setup
    // --------------
  
    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this;
  
    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;
  
    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};
  
    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
  
    // Create quick reference variables for speed access to core prototypes.
    var push             = ArrayProto.push,
        slice            = ArrayProto.slice,
        concat           = ArrayProto.concat,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;
  
    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
      nativeForEach      = ArrayProto.forEach,
      nativeMap          = ArrayProto.map,
      nativeReduce       = ArrayProto.reduce,
      nativeReduceRight  = ArrayProto.reduceRight,
      nativeFilter       = ArrayProto.filter,
      nativeEvery        = ArrayProto.every,
      nativeSome         = ArrayProto.some,
      nativeIndexOf      = ArrayProto.indexOf,
      nativeLastIndexOf  = ArrayProto.lastIndexOf,
      nativeIsArray      = Array.isArray,
      nativeKeys         = Object.keys,
      nativeBind         = FuncProto.bind;
  
    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
      if (obj instanceof _) return obj;
      if (!(this instanceof _)) return new _(obj);
      this._wrapped = obj;
    };
  
    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = _;
      }
      exports._ = _;
    } else {
      root._ = _;
    }
  
    // Current version.
    _.VERSION = '1.4.4';
  
    // Collection Functions
    // --------------------
  
    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = _.each = _.forEach = function(obj, iterator, context) {
      if (obj == null) return;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
      } else {
        for (var key in obj) {
          if (_.has(obj, key)) {
            if (iterator.call(context, obj[key], key, obj) === breaker) return;
          }
        }
      }
    };
  
    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = _.collect = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    };
  
    var reduceError = 'Reduce of empty array with no initial value';
  
    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
    _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
      var initial = arguments.length > 2;
      if (obj == null) obj = [];
      if (nativeReduce && obj.reduce === nativeReduce) {
        if (context) iterator = _.bind(iterator, context);
        return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
      }
      each(obj, function(value, index, list) {
        if (!initial) {
          memo = value;
          initial = true;
        } else {
          memo = iterator.call(context, memo, value, index, list);
        }
      });
      if (!initial) throw new TypeError(reduceError);
      return memo;
    };
  
    // The right-associative version of reduce, also known as `foldr`.
    // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
    _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
      var initial = arguments.length > 2;
      if (obj == null) obj = [];
      if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
        if (context) iterator = _.bind(iterator, context);
        return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
      }
      var length = obj.length;
      if (length !== +length) {
        var keys = _.keys(obj);
        length = keys.length;
      }
      each(obj, function(value, index, list) {
        index = keys ? keys[--length] : --length;
        if (!initial) {
          memo = obj[index];
          initial = true;
        } else {
          memo = iterator.call(context, memo, obj[index], index, list);
        }
      });
      if (!initial) throw new TypeError(reduceError);
      return memo;
    };
  
    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function(obj, iterator, context) {
      var result;
      any(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) {
          result = value;
          return true;
        }
      });
      return result;
    };
  
    // Return all the elements that pass a truth test.
    // Delegates to **ECMAScript 5**'s native `filter` if available.
    // Aliased as `select`.
    _.filter = _.select = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
      each(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) results[results.length] = value;
      });
      return results;
    };
  
    // Return all the elements for which a truth test fails.
    _.reject = function(obj, iterator, context) {
      return _.filter(obj, function(value, index, list) {
        return !iterator.call(context, value, index, list);
      }, context);
    };
  
    // Determine whether all of the elements match a truth test.
    // Delegates to **ECMAScript 5**'s native `every` if available.
    // Aliased as `all`.
    _.every = _.all = function(obj, iterator, context) {
      iterator || (iterator = _.identity);
      var result = true;
      if (obj == null) return result;
      if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
      each(obj, function(value, index, list) {
        if (!(result = result && iterator.call(context, value, index, list))) return breaker;
      });
      return !!result;
    };
  
    // Determine if at least one element in the object matches a truth test.
    // Delegates to **ECMAScript 5**'s native `some` if available.
    // Aliased as `any`.
    var any = _.some = _.any = function(obj, iterator, context) {
      iterator || (iterator = _.identity);
      var result = false;
      if (obj == null) return result;
      if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
      each(obj, function(value, index, list) {
        if (result || (result = iterator.call(context, value, index, list))) return breaker;
      });
      return !!result;
    };
  
    // Determine if the array or object contains a given value (using `===`).
    // Aliased as `include`.
    _.contains = _.include = function(obj, target) {
      if (obj == null) return false;
      if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
      return any(obj, function(value) {
        return value === target;
      });
    };
  
    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function(obj, method) {
      var args = slice.call(arguments, 2);
      var isFunc = _.isFunction(method);
      return _.map(obj, function(value) {
        return (isFunc ? method : value[method]).apply(value, args);
      });
    };
  
    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function(obj, key) {
      return _.map(obj, function(value){ return value[key]; });
    };
  
    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function(obj, attrs, first) {
      if (_.isEmpty(attrs)) return first ? null : [];
      return _[first ? 'find' : 'filter'](obj, function(value) {
        for (var key in attrs) {
          if (attrs[key] !== value[key]) return false;
        }
        return true;
      });
    };
  
    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function(obj, attrs) {
      return _.where(obj, attrs, true);
    };
  
    // Return the maximum element or (element-based computation).
    // Can't optimize arrays of integers longer than 65,535 elements.
    // See: https://bugs.webkit.org/show_bug.cgi?id=80797
    _.max = function(obj, iterator, context) {
      if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
        return Math.max.apply(Math, obj);
      }
      if (!iterator && _.isEmpty(obj)) return -Infinity;
      var result = {computed : -Infinity, value: -Infinity};
      each(obj, function(value, index, list) {
        var computed = iterator ? iterator.call(context, value, index, list) : value;
        computed >= result.computed && (result = {value : value, computed : computed});
      });
      return result.value;
    };
  
    // Return the minimum element (or element-based computation).
    _.min = function(obj, iterator, context) {
      if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
        return Math.min.apply(Math, obj);
      }
      if (!iterator && _.isEmpty(obj)) return Infinity;
      var result = {computed : Infinity, value: Infinity};
      each(obj, function(value, index, list) {
        var computed = iterator ? iterator.call(context, value, index, list) : value;
        computed < result.computed && (result = {value : value, computed : computed});
      });
      return result.value;
    };
  
    // Shuffle an array.
    _.shuffle = function(obj) {
      var rand;
      var index = 0;
      var shuffled = [];
      each(obj, function(value) {
        rand = _.random(index++);
        shuffled[index - 1] = shuffled[rand];
        shuffled[rand] = value;
      });
      return shuffled;
    };
  
    // An internal function to generate lookup iterators.
    var lookupIterator = function(value) {
      return _.isFunction(value) ? value : function(obj){ return obj[value]; };
    };
  
    // Sort the object's values by a criterion produced by an iterator.
    _.sortBy = function(obj, value, context) {
      var iterator = lookupIterator(value);
      return _.pluck(_.map(obj, function(value, index, list) {
        return {
          value : value,
          index : index,
          criteria : iterator.call(context, value, index, list)
        };
      }).sort(function(left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
          if (a > b || a === void 0) return 1;
          if (a < b || b === void 0) return -1;
        }
        return left.index < right.index ? -1 : 1;
      }), 'value');
    };
  
    // An internal function used for aggregate "group by" operations.
    var group = function(obj, value, context, behavior) {
      var result = {};
      var iterator = lookupIterator(value || _.identity);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  
    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = function(obj, value, context) {
      return group(obj, value, context, function(result, key, value) {
        (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
      });
    };
  
    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = function(obj, value, context) {
      return group(obj, value, context, function(result, key) {
        if (!_.has(result, key)) result[key] = 0;
        result[key]++;
      });
    };
  
    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function(array, obj, iterator, context) {
      iterator = iterator == null ? _.identity : lookupIterator(iterator);
      var value = iterator.call(context, obj);
      var low = 0, high = array.length;
      while (low < high) {
        var mid = (low + high) >>> 1;
        iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
      }
      return low;
    };
  
    // Safely convert anything iterable into a real, live array.
    _.toArray = function(obj) {
      if (!obj) return [];
      if (_.isArray(obj)) return slice.call(obj);
      if (obj.length === +obj.length) return _.map(obj, _.identity);
      return _.values(obj);
    };
  
    // Return the number of elements in an object.
    _.size = function(obj) {
      if (obj == null) return 0;
      return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
    };
  
    // Array Functions
    // ---------------
  
    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function(array, n, guard) {
      if (array == null) return void 0;
      return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
    };
  
    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N. The **guard** check allows it to work with
    // `_.map`.
    _.initial = function(array, n, guard) {
      return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
    };
  
    // Get the last element of an array. Passing **n** will return the last N
    // values in the array. The **guard** check allows it to work with `_.map`.
    _.last = function(array, n, guard) {
      if (array == null) return void 0;
      if ((n != null) && !guard) {
        return slice.call(array, Math.max(array.length - n, 0));
      } else {
        return array[array.length - 1];
      }
    };
  
    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array. The **guard**
    // check allows it to work with `_.map`.
    _.rest = _.tail = _.drop = function(array, n, guard) {
      return slice.call(array, (n == null) || guard ? 1 : n);
    };
  
    // Trim out all falsy values from an array.
    _.compact = function(array) {
      return _.filter(array, _.identity);
    };
  
    // Internal implementation of a recursive `flatten` function.
    var flatten = function(input, shallow, output) {
      each(input, function(value) {
        if (_.isArray(value)) {
          shallow ? push.apply(output, value) : flatten(value, shallow, output);
        } else {
          output.push(value);
        }
      });
      return output;
    };
  
    // Return a completely flattened version of an array.
    _.flatten = function(array, shallow) {
      return flatten(array, shallow, []);
    };
  
    // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
      return _.difference(array, slice.call(arguments, 1));
    };
  
    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function(array, isSorted, iterator, context) {
      if (_.isFunction(isSorted)) {
        context = iterator;
        iterator = isSorted;
        isSorted = false;
      }
      var initial = iterator ? _.map(array, iterator, context) : array;
      var results = [];
      var seen = [];
      each(initial, function(value, index) {
        if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
          seen.push(value);
          results.push(array[index]);
        }
      });
      return results;
    };
  
    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function() {
      return _.uniq(concat.apply(ArrayProto, arguments));
    };
  
    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function(array) {
      var rest = slice.call(arguments, 1);
      return _.filter(_.uniq(array), function(item) {
        return _.every(rest, function(other) {
          return _.indexOf(other, item) >= 0;
        });
      });
    };
  
    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function(array) {
      var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
      return _.filter(array, function(value){ return !_.contains(rest, value); });
    };
  
    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function() {
      var args = slice.call(arguments);
      var length = _.max(_.pluck(args, 'length'));
      var results = new Array(length);
      for (var i = 0; i < length; i++) {
        results[i] = _.pluck(args, "" + i);
      }
      return results;
    };
  
    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function(list, values) {
      if (list == null) return {};
      var result = {};
      for (var i = 0, l = list.length; i < l; i++) {
        if (values) {
          result[list[i]] = values[i];
        } else {
          result[list[i][0]] = list[i][1];
        }
      }
      return result;
    };
  
    // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
    // we need this function. Return the position of the first occurrence of an
    // item in an array, or -1 if the item is not included in the array.
    // Delegates to **ECMAScript 5**'s native `indexOf` if available.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = function(array, item, isSorted) {
      if (array == null) return -1;
      var i = 0, l = array.length;
      if (isSorted) {
        if (typeof isSorted == 'number') {
          i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
        } else {
          i = _.sortedIndex(array, item);
          return array[i] === item ? i : -1;
        }
      }
      if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
      for (; i < l; i++) if (array[i] === item) return i;
      return -1;
    };
  
    // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
    _.lastIndexOf = function(array, item, from) {
      if (array == null) return -1;
      var hasIndex = from != null;
      if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
        return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
      }
      var i = (hasIndex ? from : array.length);
      while (i--) if (array[i] === item) return i;
      return -1;
    };
  
    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function(start, stop, step) {
      if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
      }
      step = arguments[2] || 1;
  
      var len = Math.max(Math.ceil((stop - start) / step), 0);
      var idx = 0;
      var range = new Array(len);
  
      while(idx < len) {
        range[idx++] = start;
        start += step;
      }
  
      return range;
    };
  
    // Function (ahem) Functions
    // ------------------
  
    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function(func, context) {
      if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
      var args = slice.call(arguments, 2);
      return function() {
        return func.apply(context, args.concat(slice.call(arguments)));
      };
    };
  
    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context.
    _.partial = function(func) {
      var args = slice.call(arguments, 1);
      return function() {
        return func.apply(this, args.concat(slice.call(arguments)));
      };
    };
  
    // Bind all of an object's methods to that object. Useful for ensuring that
    // all callbacks defined on an object belong to it.
    _.bindAll = function(obj) {
      var funcs = slice.call(arguments, 1);
      if (funcs.length === 0) funcs = _.functions(obj);
      each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
      return obj;
    };
  
    // Memoize an expensive function by storing its results.
    _.memoize = function(func, hasher) {
      var memo = {};
      hasher || (hasher = _.identity);
      return function() {
        var key = hasher.apply(this, arguments);
        return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
      };
    };
  
    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function(func, wait) {
      var args = slice.call(arguments, 2);
      return setTimeout(function(){ return func.apply(null, args); }, wait);
    };
  
    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = function(func) {
      return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };
  
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    _.throttle = function(func, wait) {
      var context, args, timeout, result;
      var previous = 0;
      var later = function() {
        previous = new Date;
        timeout = null;
        result = func.apply(context, args);
      };
      return function() {
        var now = new Date;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
        } else if (!timeout) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    };
  
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function(func, wait, immediate) {
      var timeout, result;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(context, args);
        return result;
      };
    };
  
    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = function(func) {
      var ran = false, memo;
      return function() {
        if (ran) return memo;
        ran = true;
        memo = func.apply(this, arguments);
        func = null;
        return memo;
      };
    };
  
    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function(func, wrapper) {
      return function() {
        var args = [func];
        push.apply(args, arguments);
        return wrapper.apply(this, args);
      };
    };
  
    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function() {
      var funcs = arguments;
      return function() {
        var args = arguments;
        for (var i = funcs.length - 1; i >= 0; i--) {
          args = [funcs[i].apply(this, args)];
        }
        return args[0];
      };
    };
  
    // Returns a function that will only be executed after being called N times.
    _.after = function(times, func) {
      if (times <= 0) return func();
      return function() {
        if (--times < 1) {
          return func.apply(this, arguments);
        }
      };
    };
  
    // Object Functions
    // ----------------
  
    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = nativeKeys || function(obj) {
      if (obj !== Object(obj)) throw new TypeError('Invalid object');
      var keys = [];
      for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
      return keys;
    };
  
    // Retrieve the values of an object's properties.
    _.values = function(obj) {
      var values = [];
      for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
      return values;
    };
  
    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function(obj) {
      var pairs = [];
      for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
      return pairs;
    };
  
    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function(obj) {
      var result = {};
      for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
      return result;
    };
  
    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function(obj) {
      var names = [];
      for (var key in obj) {
        if (_.isFunction(obj[key])) names.push(key);
      }
      return names.sort();
    };
  
    // Extend a given object with all the properties in passed-in object(s).
    _.extend = function(obj) {
      each(slice.call(arguments, 1), function(source) {
        if (source) {
          for (var prop in source) {
            obj[prop] = source[prop];
          }
        }
      });
      return obj;
    };
  
    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(obj) {
      var copy = {};
      var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
      each(keys, function(key) {
        if (key in obj) copy[key] = obj[key];
      });
      return copy;
    };
  
     // Return a copy of the object without the blacklisted properties.
    _.omit = function(obj) {
      var copy = {};
      var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
      for (var key in obj) {
        if (!_.contains(keys, key)) copy[key] = obj[key];
      }
      return copy;
    };
  
    // Fill in a given object with default properties.
    _.defaults = function(obj) {
      each(slice.call(arguments, 1), function(source) {
        if (source) {
          for (var prop in source) {
            if (obj[prop] == null) obj[prop] = source[prop];
          }
        }
      });
      return obj;
    };
  
    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function(obj) {
      if (!_.isObject(obj)) return obj;
      return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };
  
    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function(obj, interceptor) {
      interceptor(obj);
      return obj;
    };
  
    // Internal recursive comparison function for `isEqual`.
    var eq = function(a, b, aStack, bStack) {
      // Identical objects are equal. `0 === -0`, but they aren't identical.
      // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
      if (a === b) return a !== 0 || 1 / a == 1 / b;
      // A strict comparison is necessary because `null == undefined`.
      if (a == null || b == null) return a === b;
      // Unwrap any wrapped objects.
      if (a instanceof _) a = a._wrapped;
      if (b instanceof _) b = b._wrapped;
      // Compare `[[Class]]` names.
      var className = toString.call(a);
      if (className != toString.call(b)) return false;
      switch (className) {
        // Strings, numbers, dates, and booleans are compared by value.
        case '[object String]':
          // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
          // equivalent to `new String("5")`.
          return a == String(b);
        case '[object Number]':
          // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
          // other numeric values.
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          // Coerce dates and booleans to numeric primitive values. Dates are compared by their
          // millisecond representations. Note that invalid dates with millisecond representations
          // of `NaN` are not equivalent.
          return +a == +b;
        // RegExps are compared by their source patterns and flags.
        case '[object RegExp]':
          return a.source == b.source &&
                 a.global == b.global &&
                 a.multiline == b.multiline &&
                 a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') return false;
      // Assume equality for cyclic structures. The algorithm for detecting cyclic
      // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
      var length = aStack.length;
      while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] == a) return bStack[length] == b;
      }
      // Add the first object to the stack of traversed objects.
      aStack.push(a);
      bStack.push(b);
      var size = 0, result = true;
      // Recursively compare objects and arrays.
      if (className == '[object Array]') {
        // Compare array lengths to determine if a deep comparison is necessary.
        size = a.length;
        result = size == b.length;
        if (result) {
          // Deep compare the contents, ignoring non-numeric properties.
          while (size--) {
            if (!(result = eq(a[size], b[size], aStack, bStack))) break;
          }
        }
      } else {
        // Objects with different constructors are not equivalent, but `Object`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                                 _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
          return false;
        }
        // Deep compare objects.
        for (var key in a) {
          if (_.has(a, key)) {
            // Count the expected number of properties.
            size++;
            // Deep compare each member.
            if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
          }
        }
        // Ensure that both objects contain the same number of properties.
        if (result) {
          for (key in b) {
            if (_.has(b, key) && !(size--)) break;
          }
          result = !size;
        }
      }
      // Remove the first object from the stack of traversed objects.
      aStack.pop();
      bStack.pop();
      return result;
    };
  
    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function(a, b) {
      return eq(a, b, [], []);
    };
  
    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function(obj) {
      if (obj == null) return true;
      if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
      for (var key in obj) if (_.has(obj, key)) return false;
      return true;
    };
  
    // Is a given value a DOM element?
    _.isElement = function(obj) {
      return !!(obj && obj.nodeType === 1);
    };
  
    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function(obj) {
      return toString.call(obj) == '[object Array]';
    };
  
    // Is a given variable an object?
    _.isObject = function(obj) {
      return obj === Object(obj);
    };
  
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
      _['is' + name] = function(obj) {
        return toString.call(obj) == '[object ' + name + ']';
      };
    });
  
    // Define a fallback version of the method in browsers (ahem, IE), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
      _.isArguments = function(obj) {
        return !!(obj && _.has(obj, 'callee'));
      };
    }
  
    // Optimize `isFunction` if appropriate.
    if (typeof (/./) !== 'function') {
      _.isFunction = function(obj) {
        return typeof obj === 'function';
      };
    }
  
    // Is a given object a finite number?
    _.isFinite = function(obj) {
      return isFinite(obj) && !isNaN(parseFloat(obj));
    };
  
    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function(obj) {
      return _.isNumber(obj) && obj != +obj;
    };
  
    // Is a given value a boolean?
    _.isBoolean = function(obj) {
      return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    };
  
    // Is a given value equal to null?
    _.isNull = function(obj) {
      return obj === null;
    };
  
    // Is a given variable undefined?
    _.isUndefined = function(obj) {
      return obj === void 0;
    };
  
    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
      return hasOwnProperty.call(obj, key);
    };
  
    // Utility Functions
    // -----------------
  
    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function() {
      root._ = previousUnderscore;
      return this;
    };
  
    // Keep the identity function around for default iterators.
    _.identity = function(value) {
      return value;
    };
  
    // Run a function **n** times.
    _.times = function(n, iterator, context) {
      var accum = Array(n);
      for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
      return accum;
    };
  
    // Return a random integer between min and max (inclusive).
    _.random = function(min, max) {
      if (max == null) {
        max = min;
        min = 0;
      }
      return min + Math.floor(Math.random() * (max - min + 1));
    };
  
    // List of HTML entities for escaping.
    var entityMap = {
      escape: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
      }
    };
    entityMap.unescape = _.invert(entityMap.escape);
  
    // Regexes containing the keys and values listed immediately above.
    var entityRegexes = {
      escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
      unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
    };
  
    // Functions for escaping and unescaping strings to/from HTML interpolation.
    _.each(['escape', 'unescape'], function(method) {
      _[method] = function(string) {
        if (string == null) return '';
        return ('' + string).replace(entityRegexes[method], function(match) {
          return entityMap[method][match];
        });
      };
    });
  
    // If the value of the named property is a function then invoke it;
    // otherwise, return it.
    _.result = function(object, property) {
      if (object == null) return null;
      var value = object[property];
      return _.isFunction(value) ? value.call(object) : value;
    };
  
    // Add your own custom functions to the Underscore object.
    _.mixin = function(obj) {
      each(_.functions(obj), function(name){
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
          var args = [this._wrapped];
          push.apply(args, arguments);
          return result.call(this, func.apply(_, args));
        };
      });
    };
  
    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    };
  
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
      evaluate    : /<%([\s\S]+?)%>/g,
      interpolate : /<%=([\s\S]+?)%>/g,
      escape      : /<%-([\s\S]+?)%>/g
    };
  
    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;
  
    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
      "'":      "'",
      '\\':     '\\',
      '\r':     'r',
      '\n':     'n',
      '\t':     't',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };
  
    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  
    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    _.template = function(text, data, settings) {
      var render;
      settings = _.defaults({}, settings, _.templateSettings);
  
      // Combine delimiters into one regular expression via alternation.
      var matcher = new RegExp([
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
      ].join('|') + '|$', 'g');
  
      // Compile the template source, escaping string literals appropriately.
      var index = 0;
      var source = "__p+='";
      text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset)
          .replace(escaper, function(match) { return '\\' + escapes[match]; });
  
        if (escape) {
          source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        }
        if (interpolate) {
          source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        }
        if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='";
        }
        index = offset + match.length;
        return match;
      });
      source += "';\n";
  
      // If a variable is not specified, place data values in local scope.
      if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
  
      source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + "return __p;\n";
  
      try {
        render = new Function(settings.variable || 'obj', '_', source);
      } catch (e) {
        e.source = source;
        throw e;
      }
  
      if (data) return render(data, _);
      var template = function(data) {
        return render.call(this, data, _);
      };
  
      // Provide the compiled function source as a convenience for precompilation.
      template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
  
      return template;
    };
  
    // Add a "chain" function, which will delegate to the wrapper.
    _.chain = function(obj) {
      return _(obj).chain();
    };
  
    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.
  
    // Helper function to continue chaining intermediate results.
    var result = function(obj) {
      return this._chain ? _(obj).chain() : obj;
    };
  
    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);
  
    // Add all mutator Array functions to the wrapper.
    each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        var obj = this._wrapped;
        method.apply(obj, arguments);
        if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
        return result.call(this, obj);
      };
    });
  
    // Add all accessor Array functions to the wrapper.
    each(['concat', 'join', 'slice'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        return result.call(this, method.apply(this._wrapped, arguments));
      };
    });
  
    _.extend(_.prototype, {
  
      // Start chaining a wrapped Underscore object.
      chain: function() {
        this._chain = true;
        return this;
      },
  
      // Extracts the result from a wrapped and chained object.
      value: function() {
        return this._wrapped;
      }
  
    });
  
  }).call(this);
  

  provide("underscore", module.exports);

  $.ender(module.exports);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Bean - copyright (c) Jacob Thornton 2011-2012
    * https://github.com/fat/bean
    * MIT license
    */
  (function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(definition)
    else context[name] = definition()
  })('bean', this, function (name, context) {
    name    = name    || 'bean'
    context = context || this
  
    var win            = window
      , old            = context[name]
      , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
      , nameRegex      = /\..*/
      , addEvent       = 'addEventListener'
      , removeEvent    = 'removeEventListener'
      , doc            = document || {}
      , root           = doc.documentElement || {}
      , W3C_MODEL      = root[addEvent]
      , eventSupport   = W3C_MODEL ? addEvent : 'attachEvent'
      , ONE            = {} // singleton for quick matching making add() do one()
  
      , slice          = Array.prototype.slice
      , str2arr        = function (s, d) { return s.split(d || ' ') }
      , isString       = function (o) { return typeof o == 'string' }
      , isFunction     = function (o) { return typeof o == 'function' }
  
        // events that we consider to be 'native', anything not in this list will
        // be treated as a custom event
      , standardNativeEvents =
          'click dblclick mouseup mousedown contextmenu '                  + // mouse buttons
          'mousewheel mousemultiwheel DOMMouseScroll '                     + // mouse wheel
          'mouseover mouseout mousemove selectstart selectend '            + // mouse movement
          'keydown keypress keyup '                                        + // keyboard
          'orientationchange '                                             + // mobile
          'focus blur change reset select submit '                         + // form elements
          'load unload beforeunload resize move DOMContentLoaded '         + // window
          'readystatechange message '                                      + // window
          'error abort scroll '                                              // misc
        // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
        // that doesn't actually exist, so make sure we only do these on newer browsers
      , w3cNativeEvents =
          'show '                                                          + // mouse buttons
          'input invalid '                                                 + // form elements
          'touchstart touchmove touchend touchcancel '                     + // touch
          'gesturestart gesturechange gestureend '                         + // gesture
          'textinput'                                                      + // TextEvent
          'readystatechange pageshow pagehide popstate '                   + // window
          'hashchange offline online '                                     + // window
          'afterprint beforeprint '                                        + // printing
          'dragstart dragenter dragover dragleave drag drop dragend '      + // dnd
          'loadstart progress suspend emptied stalled loadmetadata '       + // media
          'loadeddata canplay canplaythrough playing waiting seeking '     + // media
          'seeked ended durationchange timeupdate play pause ratechange '  + // media
          'volumechange cuechange '                                        + // media
          'checking noupdate downloading cached updateready obsolete '       // appcache
  
        // convert to a hash for quick lookups
      , nativeEvents = (function (hash, events, i) {
          for (i = 0; i < events.length; i++) events[i] && (hash[events[i]] = 1)
          return hash
        }({}, str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ''))))
  
        // custom events are events that we *fake*, they are not provided natively but
        // we can use native events to generate them
      , customEvents = (function () {
          var isAncestor = 'compareDocumentPosition' in root
                ? function (element, container) {
                    return container.compareDocumentPosition && (container.compareDocumentPosition(element) & 16) === 16
                  }
                : 'contains' in root
                  ? function (element, container) {
                      container = container.nodeType === 9 || container === window ? root : container
                      return container !== element && container.contains(element)
                    }
                  : function (element, container) {
                      while (element = element.parentNode) if (element === container) return 1
                      return 0
                    }
            , check = function (event) {
                var related = event.relatedTarget
                return !related
                  ? related == null
                  : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString())
                      && !isAncestor(related, this))
              }
  
          return {
              mouseenter: { base: 'mouseover', condition: check }
            , mouseleave: { base: 'mouseout', condition: check }
            , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
          }
        }())
  
        // we provide a consistent Event object across browsers by taking the actual DOM
        // event object and generating a new one from its properties.
      , Event = (function () {
              // a whitelist of properties (for different event types) tells us what to check for and copy
          var commonProps  = str2arr('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget ' +
                'detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey '  +
                'srcElement target timeStamp type view which propertyName')
            , mouseProps   = commonProps.concat(str2arr('button buttons clientX clientY dataTransfer '      +
                'fromElement offsetX offsetY pageX pageY screenX screenY toElement'))
            , mouseWheelProps = mouseProps.concat(str2arr('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
                'axis')) // 'axis' is FF specific
            , keyProps     = commonProps.concat(str2arr('char charCode key keyCode keyIdentifier '          +
                'keyLocation location'))
            , textProps    = commonProps.concat(str2arr('data'))
            , touchProps   = commonProps.concat(str2arr('touches targetTouches changedTouches scale rotation'))
            , messageProps = commonProps.concat(str2arr('data origin source'))
            , stateProps   = commonProps.concat(str2arr('state'))
            , overOutRegex = /over|out/
              // some event types need special handling and some need special properties, do that all here
            , typeFixers   = [
                  { // key events
                      reg: /key/i
                    , fix: function (event, newEvent) {
                        newEvent.keyCode = event.keyCode || event.which
                        return keyProps
                      }
                  }
                , { // mouse events
                      reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
                    , fix: function (event, newEvent, type) {
                        newEvent.rightClick = event.which === 3 || event.button === 2
                        newEvent.pos = { x: 0, y: 0 }
                        if (event.pageX || event.pageY) {
                          newEvent.clientX = event.pageX
                          newEvent.clientY = event.pageY
                        } else if (event.clientX || event.clientY) {
                          newEvent.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                          newEvent.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                        }
                        if (overOutRegex.test(type)) {
                          newEvent.relatedTarget = event.relatedTarget
                            || event[(type == 'mouseover' ? 'from' : 'to') + 'Element']
                        }
                        return mouseProps
                      }
                  }
                , { // mouse wheel events
                      reg: /mouse.*(wheel|scroll)/i
                    , fix: function () { return mouseWheelProps }
                  }
                , { // TextEvent
                      reg: /^text/i
                    , fix: function () { return textProps }
                  }
                , { // touch and gesture events
                      reg: /^touch|^gesture/i
                    , fix: function () { return touchProps }
                  }
                , { // message events
                      reg: /^message$/i
                    , fix: function () { return messageProps }
                  }
                , { // popstate events
                      reg: /^popstate$/i
                    , fix: function () { return stateProps }
                  }
                , { // everything else
                      reg: /.*/
                    , fix: function () { return commonProps }
                  }
              ]
            , typeFixerMap = {} // used to map event types to fixer functions (above), a basic cache mechanism
  
            , Event = function (event, element, isNative) {
                if (!arguments.length) return
                event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event
                this.originalEvent = event
                this.isNative       = isNative
                this.isBean         = true
  
                if (!event) return
  
                var type   = event.type
                  , target = event.target || event.srcElement
                  , i, l, p, props, fixer
  
                this.target = target && target.nodeType === 3 ? target.parentNode : target
  
                if (isNative) { // we only need basic augmentation on custom events, the rest expensive & pointless
                  fixer = typeFixerMap[type]
                  if (!fixer) { // haven't encountered this event type before, map a fixer function for it
                    for (i = 0, l = typeFixers.length; i < l; i++) {
                      if (typeFixers[i].reg.test(type)) { // guaranteed to match at least one, last is .*
                        typeFixerMap[type] = fixer = typeFixers[i].fix
                        break
                      }
                    }
                  }
  
                  props = fixer(event, this, type)
                  for (i = props.length; i--;) {
                    if (!((p = props[i]) in this) && p in event) this[p] = event[p]
                  }
                }
              }
  
          // preventDefault() and stopPropagation() are a consistent interface to those functions
          // on the DOM, stop() is an alias for both of them together
          Event.prototype.preventDefault = function () {
            if (this.originalEvent.preventDefault) this.originalEvent.preventDefault()
            else this.originalEvent.returnValue = false
          }
          Event.prototype.stopPropagation = function () {
            if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation()
            else this.originalEvent.cancelBubble = true
          }
          Event.prototype.stop = function () {
            this.preventDefault()
            this.stopPropagation()
            this.stopped = true
          }
          // stopImmediatePropagation() has to be handled internally because we manage the event list for
          // each element
          // note that originalElement may be a Bean#Event object in some situations
          Event.prototype.stopImmediatePropagation = function () {
            if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation()
            this.isImmediatePropagationStopped = function () { return true }
          }
          Event.prototype.isImmediatePropagationStopped = function () {
            return this.originalEvent.isImmediatePropagationStopped && this.originalEvent.isImmediatePropagationStopped()
          }
          Event.prototype.clone = function (currentTarget) {
            //TODO: this is ripe for optimisation, new events are *expensive*
            // improving this will speed up delegated events
            var ne = new Event(this, this.element, this.isNative)
            ne.currentTarget = currentTarget
            return ne
          }
  
          return Event
        }())
  
        // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
      , targetElement = function (element, isNative) {
          return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
        }
  
        /**
          * Bean maintains an internal registry for event listeners. We don't touch elements, objects
          * or functions to identify them, instead we store everything in the registry.
          * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
          */
      , RegEntry = (function () {
          // each handler is wrapped so we can handle delegation and custom events
          var wrappedHandler = function (element, fn, condition, args) {
              var call = function (event, eargs) {
                    return fn.apply(element, args ? slice.call(eargs, event ? 0 : 1).concat(args) : eargs)
                  }
                , findTarget = function (event, eventElement) {
                    return fn.__beanDel ? fn.__beanDel.ft(event.target, element) : eventElement
                  }
                , handler = condition
                    ? function (event) {
                        var target = findTarget(event, this) // deleated event
                        if (condition.apply(target, arguments)) {
                          if (event) event.currentTarget = target
                          return call(event, arguments)
                        }
                      }
                    : function (event) {
                        if (fn.__beanDel) event = event.clone(findTarget(event)) // delegated event, fix the fix
                        return call(event, arguments)
                      }
              handler.__beanDel = fn.__beanDel
              return handler
            }
  
          , RegEntry = function (element, type, handler, original, namespaces, args, root) {
              var customType     = customEvents[type]
                , isNative
  
              if (type == 'unload') {
                // self clean-up
                handler = once(removeListener, element, type, handler, original)
              }
  
              if (customType) {
                if (customType.condition) {
                  handler = wrappedHandler(element, handler, customType.condition, args)
                }
                type = customType.base || type
              }
  
              this.isNative      = isNative = nativeEvents[type] && !!element[eventSupport]
              this.customType    = !W3C_MODEL && !isNative && type
              this.element       = element
              this.type          = type
              this.original      = original
              this.namespaces    = namespaces
              this.eventType     = W3C_MODEL || isNative ? type : 'propertychange'
              this.target        = targetElement(element, isNative)
              this[eventSupport] = !!this.target[eventSupport]
              this.root          = root
              this.handler       = wrappedHandler(element, handler, null, args)
            }
  
          // given a list of namespaces, is our entry in any of them?
          RegEntry.prototype.inNamespaces = function (checkNamespaces) {
            var i, j, c = 0
            if (!checkNamespaces) return true
            if (!this.namespaces) return false
            for (i = checkNamespaces.length; i--;) {
              for (j = this.namespaces.length; j--;) {
                if (checkNamespaces[i] == this.namespaces[j]) c++
              }
            }
            return checkNamespaces.length === c
          }
  
          // match by element, original fn (opt), handler fn (opt)
          RegEntry.prototype.matches = function (checkElement, checkOriginal, checkHandler) {
            return this.element === checkElement &&
              (!checkOriginal || this.original === checkOriginal) &&
              (!checkHandler || this.handler === checkHandler)
          }
  
          return RegEntry
        }())
  
      , registry = (function () {
          // our map stores arrays by event type, just because it's better than storing
          // everything in a single array.
          // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
          // rootListeners so we can look them up fast
          var map = {}
  
            // generic functional search of our registry for matching listeners,
            // `fn` returns false to break out of the loop
            , forAll = function (element, type, original, handler, root, fn) {
                var pfx = root ? 'r' : '$'
                if (!type || type == '*') {
                  // search the whole registry
                  for (var t in map) {
                    if (t.charAt(0) == pfx) {
                      forAll(element, t.substr(1), original, handler, root, fn)
                    }
                  }
                } else {
                  var i = 0, l, list = map[pfx + type], all = element == '*'
                  if (!list) return
                  for (l = list.length; i < l; i++) {
                    if ((all || list[i].matches(element, original, handler)) && !fn(list[i], list, i, type)) return
                  }
                }
              }
  
            , has = function (element, type, original, root) {
                // we're not using forAll here simply because it's a bit slower and this
                // needs to be fast
                var i, list = map[(root ? 'r' : '$') + type]
                if (list) {
                  for (i = list.length; i--;) {
                    if (!list[i].root && list[i].matches(element, original, null)) return true
                  }
                }
                return false
              }
  
            , get = function (element, type, original, root) {
                var entries = []
                forAll(element, type, original, null, root, function (entry) {
                  return entries.push(entry)
                })
                return entries
              }
  
            , put = function (entry) {
                var has = !entry.root && !this.has(entry.element, entry.type, null, false)
                  , key = (entry.root ? 'r' : '$') + entry.type
                ;(map[key] || (map[key] = [])).push(entry)
                return has
              }
  
            , del = function (entry) {
                forAll(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {
                  list.splice(i, 1)
                  entry.removed = true
                  if (list.length === 0) delete map[(entry.root ? 'r' : '$') + entry.type]
                  return false
                })
              }
  
              // dump all entries, used for onunload
            , entries = function () {
                var t, entries = []
                for (t in map) {
                  if (t.charAt(0) == '$') entries = entries.concat(map[t])
                }
                return entries
              }
  
          return { has: has, get: get, put: put, del: del, entries: entries }
        }())
  
        // we need a selector engine for delegated events, use querySelectorAll if it exists
        // but for older browsers we need Qwery, Sizzle or similar
      , selectorEngine
      , setSelectorEngine = function (e) {
          if (!arguments.length) {
            selectorEngine = doc.querySelectorAll
              ? function (s, r) {
                  return r.querySelectorAll(s)
                }
              : function () {
                  throw new Error('Bean: No selector engine installed') // eeek
                }
          } else {
            selectorEngine = e
          }
        }
  
        // we attach this listener to each DOM event that we need to listen to, only once
        // per event type per DOM element
      , rootListener = function (event, type) {
          if (!W3C_MODEL && type && event && event.propertyName != '_on' + type) return
  
          var listeners = registry.get(this, type || event.type, null, false)
            , l = listeners.length
            , i = 0
  
          event = new Event(event, this, true)
          if (type) event.type = type
  
          // iterate through all handlers registered for this type, calling them unless they have
          // been removed by a previous handler or stopImmediatePropagation() has been called
          for (; i < l && !event.isImmediatePropagationStopped(); i++) {
            if (!listeners[i].removed) listeners[i].handler.call(this, event)
          }
        }
  
        // add and remove listeners to DOM elements
      , listener = W3C_MODEL
          ? function (element, type, add) {
              // new browsers
              element[add ? addEvent : removeEvent](type, rootListener, false)
            }
          : function (element, type, add, custom) {
              // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
              // to simulate event bubbling etc.
              var entry
              if (add) {
                registry.put(entry = new RegEntry(
                    element
                  , custom || type
                  , function (event) { // handler
                      rootListener.call(element, event, custom)
                    }
                  , rootListener
                  , null
                  , null
                  , true // is root
                ))
                if (custom && element['_on' + custom] == null) element['_on' + custom] = 0
                entry.target.attachEvent('on' + entry.eventType, entry.handler)
              } else {
                entry = registry.get(element, custom || type, rootListener, true)[0]
                if (entry) {
                  entry.target.detachEvent('on' + entry.eventType, entry.handler)
                  registry.del(entry)
                }
              }
            }
  
      , once = function (rm, element, type, fn, originalFn) {
          // wrap the handler in a handler that does a remove as well
          return function () {
            fn.apply(this, arguments)
            rm(element, type, originalFn)
          }
        }
  
      , removeListener = function (element, orgType, handler, namespaces) {
          var type     = orgType && orgType.replace(nameRegex, '')
            , handlers = registry.get(element, type, null, false)
            , removed  = {}
            , i, l
  
          for (i = 0, l = handlers.length; i < l; i++) {
            if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
              // TODO: this is problematic, we have a registry.get() and registry.del() that
              // both do registry searches so we waste cycles doing this. Needs to be rolled into
              // a single registry.forAll(fn) that removes while finding, but the catch is that
              // we'll be splicing the arrays that we're iterating over. Needs extra tests to
              // make sure we don't screw it up. @rvagg
              registry.del(handlers[i])
              if (!removed[handlers[i].eventType] && handlers[i][eventSupport])
                removed[handlers[i].eventType] = { t: handlers[i].eventType, c: handlers[i].type }
            }
          }
          // check each type/element for removed listeners and remove the rootListener where it's no longer needed
          for (i in removed) {
            if (!registry.has(element, removed[i].t, null, false)) {
              // last listener of this type, remove the rootListener
              listener(element, removed[i].t, false, removed[i].c)
            }
          }
        }
  
        // set up a delegate helper using the given selector, wrap the handler function
      , delegate = function (selector, fn) {
          //TODO: findTarget (therefore $) is called twice, once for match and once for
          // setting e.currentTarget, fix this so it's only needed once
          var findTarget = function (target, root) {
                var i, array = isString(selector) ? selectorEngine(selector, root) : selector
                for (; target && target !== root; target = target.parentNode) {
                  for (i = array.length; i--;) {
                    if (array[i] === target) return target
                  }
                }
              }
            , handler = function (e) {
                var match = findTarget(e.target, this)
                if (match) fn.apply(match, arguments)
              }
  
          // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
          handler.__beanDel = {
              ft       : findTarget // attach it here for customEvents to use too
            , selector : selector
          }
          return handler
        }
  
      , fireListener = W3C_MODEL ? function (isNative, type, element) {
          // modern browsers, do a proper dispatchEvent()
          var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
          evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
          element.dispatchEvent(evt)
        } : function (isNative, type, element) {
          // old browser use onpropertychange, just increment a custom property to trigger the event
          element = targetElement(element, isNative)
          isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
        }
  
        /**
          * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
          */
  
        /**
          * off(element[, eventType(s)[, handler ]])
          */
      , off = function (element, typeSpec, fn) {
          var isTypeStr = isString(typeSpec)
            , k, type, namespaces, i
  
          if (isTypeStr && typeSpec.indexOf(' ') > 0) {
            // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
            typeSpec = str2arr(typeSpec)
            for (i = typeSpec.length; i--;)
              off(element, typeSpec[i], fn)
            return element
          }
  
          type = isTypeStr && typeSpec.replace(nameRegex, '')
          if (type && customEvents[type]) type = customEvents[type].base
  
          if (!typeSpec || isTypeStr) {
            // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
            if (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, '')) namespaces = str2arr(namespaces, '.')
            removeListener(element, type, fn, namespaces)
          } else if (isFunction(typeSpec)) {
            // off(el, fn)
            removeListener(element, null, typeSpec)
          } else {
            // off(el, { t1: fn1, t2, fn2 })
            for (k in typeSpec) {
              if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k])
            }
          }
  
          return element
        }
  
        /**
          * on(element, eventType(s)[, selector], handler[, args ])
          */
      , on = function(element, events, selector, fn) {
          var originalFn, type, types, i, args, entry, first
  
          //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
          if (selector === undefined && typeof events == 'object') {
            //TODO: this can't handle delegated events
            for (type in events) {
              if (events.hasOwnProperty(type)) {
                on.call(this, element, type, events[type])
              }
            }
            return
          }
  
          if (!isFunction(selector)) {
            // delegated event
            originalFn = fn
            args       = slice.call(arguments, 4)
            fn         = delegate(selector, originalFn, selectorEngine)
          } else {
            args       = slice.call(arguments, 3)
            fn         = originalFn = selector
          }
  
          types = str2arr(events)
  
          // special case for one(), wrap in a self-removing handler
          if (this === ONE) {
            fn = once(off, element, events, fn, originalFn)
          }
  
          for (i = types.length; i--;) {
            // add new handler to the registry and check if it's the first for this element/type
            first = registry.put(entry = new RegEntry(
                element
              , types[i].replace(nameRegex, '') // event type
              , fn
              , originalFn
              , str2arr(types[i].replace(namespaceRegex, ''), '.') // namespaces
              , args
              , false // not root
            ))
            if (entry[eventSupport] && first) {
              // first event of this type on this element, add root listener
              listener(element, entry.eventType, true, entry.customType)
            }
          }
  
          return element
        }
  
        /**
          * add(element[, selector], eventType(s), handler[, args ])
          *
          * Deprecated: kept (for now) for backward-compatibility
          */
      , add = function (element, events, fn, delfn) {
          return on.apply(
              null
            , !isString(fn)
                ? slice.call(arguments)
                : [ element, fn, events, delfn ].concat(arguments.length > 3 ? slice.call(arguments, 5) : [])
          )
        }
  
        /**
          * one(element, eventType(s)[, selector], handler[, args ])
          */
      , one = function () {
          return on.apply(ONE, arguments)
        }
  
        /**
          * fire(element, eventType(s)[, args ])
          *
          * The optional 'args' argument must be an array, if no 'args' argument is provided
          * then we can use the browser's DOM event system, otherwise we trigger handlers manually
          */
      , fire = function (element, type, args) {
          var types = str2arr(type)
            , i, j, l, names, handlers
  
          for (i = types.length; i--;) {
            type = types[i].replace(nameRegex, '')
            if (names = types[i].replace(namespaceRegex, '')) names = str2arr(names, '.')
            if (!names && !args && element[eventSupport]) {
              fireListener(nativeEvents[type], type, element)
            } else {
              // non-native event, either because of a namespace, arguments or a non DOM element
              // iterate over all listeners and manually 'fire'
              handlers = registry.get(element, type, null, false)
              args = [false].concat(args)
              for (j = 0, l = handlers.length; j < l; j++) {
                if (handlers[j].inNamespaces(names)) {
                  handlers[j].handler.apply(element, args)
                }
              }
            }
          }
          return element
        }
  
        /**
          * clone(dstElement, srcElement[, eventType ])
          *
          * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
          */
      , clone = function (element, from, type) {
          var handlers = registry.get(from, type, null, false)
            , l = handlers.length
            , i = 0
            , args, beanDel
  
          for (; i < l; i++) {
            if (handlers[i].original) {
              args = [ element, handlers[i].type ]
              if (beanDel = handlers[i].handler.__beanDel) args.push(beanDel.selector)
              args.push(handlers[i].original)
              on.apply(null, args)
            }
          }
          return element
        }
  
      , bean = {
            on                : on
          , add               : add
          , one               : one
          , off               : off
          , remove            : off
          , clone             : clone
          , fire              : fire
          , setSelectorEngine : setSelectorEngine
          , noConflict        : function () {
              context[name] = old
              return this
            }
        }
  
    // for IE, clean up on unload to avoid leaks
    if (win.attachEvent) {
      var cleanup = function () {
        var i, entries = registry.entries()
        for (i in entries) {
          if (entries[i].type && entries[i].type !== 'unload') off(entries[i].element, entries[i].type)
        }
        win.detachEvent('onunload', cleanup)
        win.CollectGarbage && win.CollectGarbage()
      }
      win.attachEvent('onunload', cleanup)
    }
  
    // initialize selector engine to internal default (qSA or throw Error)
    setSelectorEngine()
  
    return bean
  });

  provide("bean", module.exports);

  !function ($) {
    var b = require('bean')
  
      , integrate = function (method, type, method2) {
          var _args = type ? [type] : []
          return function () {
            for (var i = 0, l = this.length; i < l; i++) {
              if (!arguments.length && method == 'on' && type) method = 'fire'
              b[method].apply(this, [this[i]].concat(_args, Array.prototype.slice.call(arguments, 0)))
            }
            return this
          }
        }
  
      , add   = integrate('add')
      , on    = integrate('on')
      , one   = integrate('one')
      , off   = integrate('off')
      , fire  = integrate('fire')
      , clone = integrate('clone')
  
      , hover = function (enter, leave, i) { // i for internal
          for (i = this.length; i--;) {
            b.on.call(this, this[i], 'mouseenter', enter)
            b.on.call(this, this[i], 'mouseleave', leave)
          }
          return this
        }
  
      , methods = {
            on             : on
          , addListener    : on
          , bind           : on
          , listen         : on
          , delegate       : add // jQuery compat, same arg order as add()
  
          , one            : one
  
          , off            : off
          , unbind         : off
          , unlisten       : off
          , removeListener : off
          , undelegate     : off
  
          , emit           : fire
          , trigger        : fire
  
          , cloneEvents    : clone
  
          , hover          : hover
        }
  
      , shortcuts =
           ('blur change click dblclick error focus focusin focusout keydown keypress '
          + 'keyup load mousedown mouseenter mouseleave mouseout mouseover mouseup '
          + 'mousemove resize scroll select submit unload').split(' ')
  
    for (var i = shortcuts.length; i--;) {
      methods[shortcuts[i]] = integrate('on', shortcuts[i])
    }
  
    b.setSelectorEngine($)
  
    $.ender(methods, true)
  }(ender);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Bonzo: DOM Utility (c) Dustin Diaz 2012
    * https://github.com/ded/bonzo
    * License MIT
    */
  (function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(definition)
    else context[name] = definition()
  })('bonzo', this, function() {
    var win = window
      , doc = win.document
      , html = doc.documentElement
      , parentNode = 'parentNode'
      , specialAttributes = /^(checked|value|selected|disabled)$/i
        // tags that we have trouble inserting *into*
      , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
      , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
      , table = ['<table>', '</table>', 1]
      , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
      , option = ['<select>', '</select>', 1]
      , noscope = ['_', '', 0, 1]
      , tagMap = { // tags that we have trouble *inserting*
            thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
          , tr: ['<table><tbody>', '</tbody></table>', 2]
          , th: td , td: td
          , col: ['<table><colgroup>', '</colgroup></table>', 2]
          , fieldset: ['<form>', '</form>', 1]
          , legend: ['<form><fieldset>', '</fieldset></form>', 2]
          , option: option, optgroup: option
          , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
        }
      , stateAttributes = /^(checked|selected|disabled)$/
      , ie = /msie/i.test(navigator.userAgent)
      , hasClass, addClass, removeClass
      , uidMap = {}
      , uuids = 0
      , digit = /^-?[\d\.]+$/
      , dattr = /^data-(.+)$/
      , px = 'px'
      , setAttribute = 'setAttribute'
      , getAttribute = 'getAttribute'
      , byTag = 'getElementsByTagName'
      , features = function() {
          var e = doc.createElement('p')
          e.innerHTML = '<a href="#x">x</a><table style="float:left;"></table>'
          return {
            hrefExtended: e[byTag]('a')[0][getAttribute]('href') != '#x' // IE < 8
          , autoTbody: e[byTag]('tbody').length !== 0 // IE < 8
          , computedStyle: doc.defaultView && doc.defaultView.getComputedStyle
          , cssFloat: e[byTag]('table')[0].style.styleFloat ? 'styleFloat' : 'cssFloat'
          , transform: function () {
              var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
              for (i = 0; i < props.length; i++) {
                if (props[i] in e.style) return props[i]
              }
            }()
          , classList: 'classList' in e
          , opasity: function () {
              return typeof doc.createElement('a').style.opacity !== 'undefined'
            }()
          }
        }()
      , trimReplace = /(^\s*|\s*$)/g
      , whitespaceRegex = /\s+/
      , toString = String.prototype.toString
      , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
      , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
      , trim = String.prototype.trim ?
          function (s) {
            return s.trim()
          } :
          function (s) {
            return s.replace(trimReplace, '')
          }
  
      , getStyle = features.computedStyle
          ? function (el, property) {
              var value = null
                , computed = doc.defaultView.getComputedStyle(el, '')
              computed && (value = computed[property])
              return el.style[property] || value
            }
          : !(ie && html.currentStyle)
            ? function (el, property) {
                return el.style[property]
              }
            :
            /**
             * @param {Element} el
             * @param {string} property
             * @return {string|number}
             */
            function (el, property) {
              var val, value
              if (property == 'opacity' && !features.opasity) {
                val = 100
                try {
                  val = el['filters']['DXImageTransform.Microsoft.Alpha'].opacity
                } catch (e1) {
                  try {
                    val = el['filters']('alpha').opacity
                  } catch (e2) {}
                }
                return val / 100
              }
              value = el.currentStyle ? el.currentStyle[property] : null
              return el.style[property] || value
            }
  
    function isNode(node) {
      return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
    }
  
  
    function normalize(node, host, clone) {
      var i, l, ret
      if (typeof node == 'string') return bonzo.create(node)
      if (isNode(node)) node = [ node ]
      if (clone) {
        ret = [] // don't change original array
        for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
        return ret
      }
      return node
    }
  
    /**
     * @param {string} c a class name to test
     * @return {boolean}
     */
    function classReg(c) {
      return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
    }
  
  
    /**
     * @param {Bonzo|Array} ar
     * @param {function(Object, number, (Bonzo|Array))} fn
     * @param {Object=} opt_scope
     * @param {boolean=} opt_rev
     * @return {Bonzo|Array}
     */
    function each(ar, fn, opt_scope, opt_rev) {
      var ind, i = 0, l = ar.length
      for (; i < l; i++) {
        ind = opt_rev ? ar.length - i - 1 : i
        fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
      }
      return ar
    }
  
  
    /**
     * @param {Bonzo|Array} ar
     * @param {function(Object, number, (Bonzo|Array))} fn
     * @param {Object=} opt_scope
     * @return {Bonzo|Array}
     */
    function deepEach(ar, fn, opt_scope) {
      for (var i = 0, l = ar.length; i < l; i++) {
        if (isNode(ar[i])) {
          deepEach(ar[i].childNodes, fn, opt_scope)
          fn.call(opt_scope || ar[i], ar[i], i, ar)
        }
      }
      return ar
    }
  
  
    /**
     * @param {string} s
     * @return {string}
     */
    function camelize(s) {
      return s.replace(/-(.)/g, function (m, m1) {
        return m1.toUpperCase()
      })
    }
  
  
    /**
     * @param {string} s
     * @return {string}
     */
    function decamelize(s) {
      return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
    }
  
  
    /**
     * @param {Element} el
     * @return {*}
     */
    function data(el) {
      el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
      var uid = el[getAttribute]('data-node-uid')
      return uidMap[uid] || (uidMap[uid] = {})
    }
  
  
    /**
     * removes the data associated with an element
     * @param {Element} el
     */
    function clearData(el) {
      var uid = el[getAttribute]('data-node-uid')
      if (uid) delete uidMap[uid]
    }
  
  
    function dataValue(d) {
      var f
      try {
        return (d === null || d === undefined) ? undefined :
          d === 'true' ? true :
            d === 'false' ? false :
              d === 'null' ? null :
                (f = parseFloat(d)) == d ? f : d;
      } catch(e) {}
      return undefined
    }
  
  
    /**
     * @param {Bonzo|Array} ar
     * @param {function(Object, number, (Bonzo|Array))} fn
     * @param {Object=} opt_scope
     * @return {boolean} whether `some`thing was found
     */
    function some(ar, fn, opt_scope) {
      for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
      return false
    }
  
  
    /**
     * this could be a giant enum of CSS properties
     * but in favor of file size sans-closure deadcode optimizations
     * we're just asking for any ol string
     * then it gets transformed into the appropriate style property for JS access
     * @param {string} p
     * @return {string}
     */
    function styleProperty(p) {
        (p == 'transform' && (p = features.transform)) ||
          (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin')) ||
          (p == 'float' && (p = features.cssFloat))
        return p ? camelize(p) : null
    }
  
    // this insert method is intense
    function insert(target, host, fn, rev) {
      var i = 0, self = host || this, r = []
        // target nodes could be a css selector if it's a string and a selector engine is present
        // otherwise, just use target
        , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
      // normalize each node in case it's still a string and we need to create nodes on the fly
      each(normalize(nodes), function (t, j) {
        each(self, function (el) {
          fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
        }, null, rev)
      }, this, rev)
      self.length = i
      each(r, function (e) {
        self[--i] = e
      }, null, !rev)
      return self
    }
  
  
    /**
     * sets an element to an explicit x/y position on the page
     * @param {Element} el
     * @param {?number} x
     * @param {?number} y
     */
    function xy(el, x, y) {
      var $el = bonzo(el)
        , style = $el.css('position')
        , offset = $el.offset()
        , rel = 'relative'
        , isRel = style == rel
        , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]
  
      if (style == 'static') {
        $el.css('position', rel)
        style = rel
      }
  
      isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
      isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)
  
      x != null && (el.style.left = x - offset.left + delta[0] + px)
      y != null && (el.style.top = y - offset.top + delta[1] + px)
  
    }
  
    // classList support for class management
    // altho to be fair, the api sucks because it won't accept multiple classes at once
    if (features.classList) {
      hasClass = function (el, c) {
        return el.classList.contains(c)
      }
      addClass = function (el, c) {
        el.classList.add(c)
      }
      removeClass = function (el, c) {
        el.classList.remove(c)
      }
    }
    else {
      hasClass = function (el, c) {
        return classReg(c).test(el.className)
      }
      addClass = function (el, c) {
        el.className = trim(el.className + ' ' + c)
      }
      removeClass = function (el, c) {
        el.className = trim(el.className.replace(classReg(c), ' '))
      }
    }
  
  
    /**
     * this allows method calling for setting values
     *
     * @example
     * bonzo(elements).css('color', function (el) {
     *   return el.getAttribute('data-original-color')
     * })
     *
     * @param {Element} el
     * @param {function (Element)|string}
     * @return {string}
     */
    function setter(el, v) {
      return typeof v == 'function' ? v(el) : v
    }
  
    function scroll(x, y, type) {
      var el = this[0]
      if (!el) return this
      if (x == null && y == null) {
        return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
      }
      if (isBody(el)) {
        win.scrollTo(x, y)
      } else {
        x != null && (el.scrollLeft = x)
        y != null && (el.scrollTop = y)
      }
      return this
    }
  
    /**
     * @constructor
     * @param {Array.<Element>|Element|Node|string} elements
     */
    function Bonzo(elements) {
      this.length = 0
      if (elements) {
        elements = typeof elements !== 'string' &&
          !elements.nodeType &&
          typeof elements.length !== 'undefined' ?
            elements :
            [elements]
        this.length = elements.length
        for (var i = 0; i < elements.length; i++) this[i] = elements[i]
      }
    }
  
    Bonzo.prototype = {
  
        /**
         * @param {number} index
         * @return {Element|Node}
         */
        get: function (index) {
          return this[index] || null
        }
  
        // itetators
        /**
         * @param {function(Element|Node)} fn
         * @param {Object=} opt_scope
         * @return {Bonzo}
         */
      , each: function (fn, opt_scope) {
          return each(this, fn, opt_scope)
        }
  
        /**
         * @param {Function} fn
         * @param {Object=} opt_scope
         * @return {Bonzo}
         */
      , deepEach: function (fn, opt_scope) {
          return deepEach(this, fn, opt_scope)
        }
  
  
        /**
         * @param {Function} fn
         * @param {Function=} opt_reject
         * @return {Array}
         */
      , map: function (fn, opt_reject) {
          var m = [], n, i
          for (i = 0; i < this.length; i++) {
            n = fn.call(this, this[i], i)
            opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
          }
          return m
        }
  
      // text and html inserters!
  
      /**
       * @param {string} h the HTML to insert
       * @param {boolean=} opt_text whether to set or get text content
       * @return {Bonzo|string}
       */
      , html: function (h, opt_text) {
          var method = opt_text
                ? html.textContent === undefined ? 'innerText' : 'textContent'
                : 'innerHTML'
            , that = this
            , append = function (el, i) {
                each(normalize(h, that, i), function (node) {
                  el.appendChild(node)
                })
              }
            , updateElement = function (el, i) {
                try {
                  if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                    return el[method] = h
                  }
                } catch (e) {}
                append(el, i)
              }
          return typeof h != 'undefined'
            ? this.empty().each(updateElement)
            : this[0] ? this[0][method] : ''
        }
  
        /**
         * @param {string=} opt_text the text to set, otherwise this is a getter
         * @return {Bonzo|string}
         */
      , text: function (opt_text) {
          return this.html(opt_text, true)
        }
  
        // more related insertion methods
  
        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , append: function (node) {
          var that = this
          return this.each(function (el, i) {
            each(normalize(node, that, i), function (i) {
              el.appendChild(i)
            })
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , prepend: function (node) {
          var that = this
          return this.each(function (el, i) {
            var first = el.firstChild
            each(normalize(node, that, i), function (i) {
              el.insertBefore(i, first)
            })
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , appendTo: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            t.appendChild(el)
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , prependTo: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            t.insertBefore(el, t.firstChild)
          }, 1)
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , before: function (node) {
          var that = this
          return this.each(function (el, i) {
            each(normalize(node, that, i), function (i) {
              el[parentNode].insertBefore(i, el)
            })
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , after: function (node) {
          var that = this
          return this.each(function (el, i) {
            each(normalize(node, that, i), function (i) {
              el[parentNode].insertBefore(i, el.nextSibling)
            }, null, 1)
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , insertBefore: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            t[parentNode].insertBefore(el, t)
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , insertAfter: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            var sibling = t.nextSibling
            sibling ?
              t[parentNode].insertBefore(el, sibling) :
              t[parentNode].appendChild(el)
          }, 1)
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , replaceWith: function (node) {
          bonzo(normalize(node)).insertAfter(this)
          return this.remove()
        }
  
        /**
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , clone: function (opt_host) {
          var ret = [] // don't change original array
            , l, i
          for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
          return bonzo(ret)
        }
  
        // class management
  
        /**
         * @param {string} c
         * @return {Bonzo}
         */
      , addClass: function (c) {
          c = toString.call(c).split(whitespaceRegex)
          return this.each(function (el) {
            // we `each` here so you can do $el.addClass('foo bar')
            each(c, function (c) {
              if (c && !hasClass(el, setter(el, c)))
                addClass(el, setter(el, c))
            })
          })
        }
  
  
        /**
         * @param {string} c
         * @return {Bonzo}
         */
      , removeClass: function (c) {
          c = toString.call(c).split(whitespaceRegex)
          return this.each(function (el) {
            each(c, function (c) {
              if (c && hasClass(el, setter(el, c)))
                removeClass(el, setter(el, c))
            })
          })
        }
  
  
        /**
         * @param {string} c
         * @return {boolean}
         */
      , hasClass: function (c) {
          c = toString.call(c).split(whitespaceRegex)
          return some(this, function (el) {
            return some(c, function (c) {
              return c && hasClass(el, c)
            })
          })
        }
  
  
        /**
         * @param {string} c classname to toggle
         * @param {boolean=} opt_condition whether to add or remove the class straight away
         * @return {Bonzo}
         */
      , toggleClass: function (c, opt_condition) {
          c = toString.call(c).split(whitespaceRegex)
          return this.each(function (el) {
            each(c, function (c) {
              if (c) {
                typeof opt_condition !== 'undefined' ?
                  opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                  hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
              }
            })
          })
        }
  
        // display togglers
  
        /**
         * @param {string=} opt_type useful to set back to anything other than an empty string
         * @return {Bonzo}
         */
      , show: function (opt_type) {
          opt_type = typeof opt_type == 'string' ? opt_type : ''
          return this.each(function (el) {
            el.style.display = opt_type
          })
        }
  
  
        /**
         * @return {Bonzo}
         */
      , hide: function () {
          return this.each(function (el) {
            el.style.display = 'none'
          })
        }
  
  
        /**
         * @param {Function=} opt_callback
         * @param {string=} opt_type
         * @return {Bonzo}
         */
      , toggle: function (opt_callback, opt_type) {
          opt_type = typeof opt_type == 'string' ? opt_type : '';
          typeof opt_callback != 'function' && (opt_callback = null)
          return this.each(function (el) {
            el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
            opt_callback && opt_callback.call(el)
          })
        }
  
  
        // DOM Walkers & getters
  
        /**
         * @return {Element|Node}
         */
      , first: function () {
          return bonzo(this.length ? this[0] : [])
        }
  
  
        /**
         * @return {Element|Node}
         */
      , last: function () {
          return bonzo(this.length ? this[this.length - 1] : [])
        }
  
  
        /**
         * @return {Element|Node}
         */
      , next: function () {
          return this.related('nextSibling')
        }
  
  
        /**
         * @return {Element|Node}
         */
      , previous: function () {
          return this.related('previousSibling')
        }
  
  
        /**
         * @return {Element|Node}
         */
      , parent: function() {
          return this.related(parentNode)
        }
  
  
        /**
         * @private
         * @param {string} method the directional DOM method
         * @return {Element|Node}
         */
      , related: function (method) {
          return bonzo(this.map(
            function (el) {
              el = el[method]
              while (el && el.nodeType !== 1) {
                el = el[method]
              }
              return el || 0
            },
            function (el) {
              return el
            }
          ))
        }
  
  
        /**
         * @return {Bonzo}
         */
      , focus: function () {
          this.length && this[0].focus()
          return this
        }
  
  
        /**
         * @return {Bonzo}
         */
      , blur: function () {
          this.length && this[0].blur()
          return this
        }
  
        // style getter setter & related methods
  
        /**
         * @param {Object|string} o
         * @param {string=} opt_v
         * @return {Bonzo|string}
         */
      , css: function (o, opt_v) {
          var p, iter = o
          // is this a request for just getting a style?
          if (opt_v === undefined && typeof o == 'string') {
            // repurpose 'v'
            opt_v = this[0]
            if (!opt_v) return null
            if (opt_v === doc || opt_v === win) {
              p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
              return o == 'width' ? p.width : o == 'height' ? p.height : ''
            }
            return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
          }
  
          if (typeof o == 'string') {
            iter = {}
            iter[o] = opt_v
          }
  
          if (ie && iter.opacity) {
            // oh this 'ol gamut
            iter.filter = 'alpha(opacity=' + (iter.opacity * 100) + ')'
            // give it layout
            iter.zoom = o.zoom || 1;
            delete iter.opacity;
          }
  
          function fn(el, p, v) {
            for (var k in iter) {
              if (iter.hasOwnProperty(k)) {
                v = iter[k];
                // change "5" to "5px" - unless you're line-height, which is allowed
                (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
                try { el.style[p] = setter(el, v) } catch(e) {}
              }
            }
          }
          return this.each(fn)
        }
  
  
        /**
         * @param {number=} opt_x
         * @param {number=} opt_y
         * @return {Bonzo|number}
         */
      , offset: function (opt_x, opt_y) {
          if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
            return this.each(function (el) {
              xy(el, opt_x.left, opt_x.top)
            })
          } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
            return this.each(function (el) {
              xy(el, opt_x, opt_y)
            })
          }
          if (!this[0]) return {
              top: 0
            , left: 0
            , height: 0
            , width: 0
          }
          var el = this[0]
            , de = el.ownerDocument.documentElement
            , bcr = el.getBoundingClientRect()
            , scroll = getWindowScroll()
            , width = el.offsetWidth
            , height = el.offsetHeight
            , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
            , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)
  
          return {
              top: top
            , left: left
            , height: height
            , width: width
          }
        }
  
  
        /**
         * @return {number}
         */
      , dim: function () {
          if (!this.length) return { height: 0, width: 0 }
          var el = this[0]
            , de = el.nodeType == 9 && el.documentElement // document
            , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
               // el isn't visible, can't be measured properly, so fix that
               function (t) {
                 var s = {
                     position: el.style.position || ''
                   , visibility: el.style.visibility || ''
                   , display: el.style.display || ''
                 }
                 t.first().css({
                     position: 'absolute'
                   , visibility: 'hidden'
                   , display: 'block'
                 })
                 return s
              }(this) : null
            , width = de
                ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
                : el.offsetWidth
            , height = de
                ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
                : el.offsetHeight
  
          orig && this.first().css(orig)
          return {
              height: height
            , width: width
          }
        }
  
        // attributes are hard. go shopping
  
        /**
         * @param {string} k an attribute to get or set
         * @param {string=} opt_v the value to set
         * @return {Bonzo|string}
         */
      , attr: function (k, opt_v) {
          var el = this[0]
            , n
  
          if (typeof k != 'string' && !(k instanceof String)) {
            for (n in k) {
              k.hasOwnProperty(n) && this.attr(n, k[n])
            }
            return this
          }
  
          return typeof opt_v == 'undefined' ?
            !el ? null : specialAttributes.test(k) ?
              stateAttributes.test(k) && typeof el[k] == 'string' ?
                true : el[k] : (k == 'href' || k =='src') && features.hrefExtended ?
                  el[getAttribute](k, 2) : el[getAttribute](k) :
            this.each(function (el) {
              specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
            })
        }
  
  
        /**
         * @param {string} k
         * @return {Bonzo}
         */
      , removeAttr: function (k) {
          return this.each(function (el) {
            stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
          })
        }
  
  
        /**
         * @param {string=} opt_s
         * @return {Bonzo|string}
         */
      , val: function (s) {
          return (typeof s == 'string') ?
            this.attr('value', s) :
            this.length ? this[0].value : null
        }
  
        // use with care and knowledge. this data() method uses data attributes on the DOM nodes
        // to do this differently costs a lot more code. c'est la vie
        /**
         * @param {string|Object=} opt_k the key for which to get or set data
         * @param {Object=} opt_v
         * @return {Bonzo|Object}
         */
      , data: function (opt_k, opt_v) {
          var el = this[0], o, m
          if (typeof opt_v === 'undefined') {
            if (!el) return null
            o = data(el)
            if (typeof opt_k === 'undefined') {
              each(el.attributes, function (a) {
                (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
              })
              return o
            } else {
              if (typeof o[opt_k] === 'undefined')
                o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
              return o[opt_k]
            }
          } else {
            return this.each(function (el) { data(el)[opt_k] = opt_v })
          }
        }
  
        // DOM detachment & related
  
        /**
         * @return {Bonzo}
         */
      , remove: function () {
          this.deepEach(clearData)
          return this.detach()
        }
  
  
        /**
         * @return {Bonzo}
         */
      , empty: function () {
          return this.each(function (el) {
            deepEach(el.childNodes, clearData)
  
            while (el.firstChild) {
              el.removeChild(el.firstChild)
            }
          })
        }
  
  
        /**
         * @return {Bonzo}
         */
      , detach: function () {
          return this.each(function (el) {
            el[parentNode] && el[parentNode].removeChild(el)
          })
        }
  
        // who uses a mouse anyway? oh right.
  
        /**
         * @param {number} y
         */
      , scrollTop: function (y) {
          return scroll.call(this, null, y, 'y')
        }
  
  
        /**
         * @param {number} x
         */
      , scrollLeft: function (x) {
          return scroll.call(this, x, null, 'x')
        }
  
    }
  
  
    function cloneNode(host, el) {
      var c = el.cloneNode(true)
        , cloneElems
        , elElems
        , i
  
      // check for existence of an event cloner
      // preferably https://github.com/fat/bean
      // otherwise Bonzo won't do this for you
      if (host.$ && typeof host.cloneEvents == 'function') {
        host.$(c).cloneEvents(el)
  
        // clone events from every child node
        cloneElems = host.$(c).find('*')
        elElems = host.$(el).find('*')
  
        for (i = 0; i < elElems.length; i++)
          host.$(cloneElems[i]).cloneEvents(elElems[i])
      }
      return c
    }
  
    function isBody(element) {
      return element === win || (/^(?:body|html)$/i).test(element.tagName)
    }
  
    function getWindowScroll() {
      return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
    }
  
    function createScriptFromHtml(html) {
      var scriptEl = document.createElement('script')
        , matches = html.match(simpleScriptTagRe)
      scriptEl.src = matches[1]
      return scriptEl
    }
  
    /**
     * @param {Array.<Element>|Element|Node|string} els
     * @return {Bonzo}
     */
    function bonzo(els) {
      return new Bonzo(els)
    }
  
    bonzo.setQueryEngine = function (q) {
      query = q;
      delete bonzo.setQueryEngine
    }
  
    bonzo.aug = function (o, target) {
      // for those standalone bonzo users. this love is for you.
      for (var k in o) {
        o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
      }
    }
  
    bonzo.create = function (node) {
      // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
      return typeof node == 'string' && node !== '' ?
        function () {
          if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
          var tag = node.match(/^\s*<([^\s>]+)/)
            , el = doc.createElement('div')
            , els = []
            , p = tag ? tagMap[tag[1].toLowerCase()] : null
            , dep = p ? p[2] + 1 : 1
            , ns = p && p[3]
            , pn = parentNode
            , tb = features.autoTbody && p && p[0] == '<table>' && !(/<tbody/i).test(node)
  
          el.innerHTML = p ? (p[0] + node + p[1]) : node
          while (dep--) el = el.firstChild
          // for IE NoScope, we may insert cruft at the begining just to get it to work
          if (ns && el && el.nodeType !== 1) el = el.nextSibling
          do {
            // tbody special case for IE<8, creates tbody on any empty table
            // we don't want it if we're just after a <thead>, <caption>, etc.
            if ((!tag || el.nodeType == 1) && (!tb || (el.tagName && el.tagName != 'TBODY'))) {
              els.push(el)
            }
          } while (el = el.nextSibling)
          // IE < 9 gives us a parentNode which messes up insert() check for cloning
          // `dep` > 1 can also cause problems with the insert() check (must do this last)
          each(els, function(el) { el[pn] && el[pn].removeChild(el) })
          return els
        }() : isNode(node) ? [node.cloneNode(true)] : []
    }
  
    bonzo.doc = function () {
      var vp = bonzo.viewport()
      return {
          width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
        , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
      }
    }
  
    bonzo.firstChild = function (el) {
      for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
        if (c[i].nodeType === 1) e = c[j = i]
      }
      return e
    }
  
    bonzo.viewport = function () {
      return {
          width: ie ? html.clientWidth : self.innerWidth
        , height: ie ? html.clientHeight : self.innerHeight
      }
    }
  
    bonzo.isAncestor = 'compareDocumentPosition' in html ?
      function (container, element) {
        return (container.compareDocumentPosition(element) & 16) == 16
      } : 'contains' in html ?
      function (container, element) {
        return container !== element && container.contains(element);
      } :
      function (container, element) {
        while (element = element[parentNode]) {
          if (element === container) {
            return true
          }
        }
        return false
      }
  
    return bonzo
  }); // the only line we care about using a semi-colon. placed here for concatenation tools
  

  provide("bonzo", module.exports);

  (function ($) {
  
    var b = require('bonzo')
    b.setQueryEngine($)
    $.ender(b)
    $.ender(b(), true)
    $.ender({
      create: function (node) {
        return $(b.create(node))
      }
    })
  
    $.id = function (id) {
      return $([document.getElementById(id)])
    }
  
    function indexOf(ar, val) {
      for (var i = 0; i < ar.length; i++) if (ar[i] === val) return i
      return -1
    }
  
    function uniq(ar) {
      var r = [], i = 0, j = 0, k, item, inIt
      for (; item = ar[i]; ++i) {
        inIt = false
        for (k = 0; k < r.length; ++k) {
          if (r[k] === item) {
            inIt = true; break
          }
        }
        if (!inIt) r[j++] = item
      }
      return r
    }
  
    $.ender({
      parents: function (selector, closest) {
        if (!this.length) return this
        if (!selector) selector = '*'
        var collection = $(selector), j, k, p, r = []
        for (j = 0, k = this.length; j < k; j++) {
          p = this[j]
          while (p = p.parentNode) {
            if (~indexOf(collection, p)) {
              r.push(p)
              if (closest) break;
            }
          }
        }
        return $(uniq(r))
      }
  
    , parent: function() {
        return $(uniq(b(this).parent()))
      }
  
    , closest: function (selector) {
        return this.parents(selector, true)
      }
  
    , first: function () {
        return $(this.length ? this[0] : this)
      }
  
    , last: function () {
        return $(this.length ? this[this.length - 1] : [])
      }
  
    , next: function () {
        return $(b(this).next())
      }
  
    , previous: function () {
        return $(b(this).previous())
      }
  
    , related: function (t) {
        return $(b(this).related(t))
      }
  
    , appendTo: function (t) {
        return b(this.selector).appendTo(t, this)
      }
  
    , prependTo: function (t) {
        return b(this.selector).prependTo(t, this)
      }
  
    , insertAfter: function (t) {
        return b(this.selector).insertAfter(t, this)
      }
  
    , insertBefore: function (t) {
        return b(this.selector).insertBefore(t, this)
      }
  
    , clone: function () {
        return $(b(this).clone(this))
      }
  
    , siblings: function () {
        var i, l, p, r = []
        for (i = 0, l = this.length; i < l; i++) {
          p = this[i]
          while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
          p = this[i]
          while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
        }
        return $(r)
      }
  
    , children: function () {
        var i, l, el, r = []
        for (i = 0, l = this.length; i < l; i++) {
          if (!(el = b.firstChild(this[i]))) continue;
          r.push(el)
          while (el = el.nextSibling) el.nodeType == 1 && r.push(el)
        }
        return $(uniq(r))
      }
  
    , height: function (v) {
        return dimension.call(this, 'height', v)
      }
  
    , width: function (v) {
        return dimension.call(this, 'width', v)
      }
    }, true)
  
    /**
     * @param {string} type either width or height
     * @param {number=} opt_v becomes a setter instead of a getter
     * @return {number}
     */
    function dimension(type, opt_v) {
      return typeof opt_v == 'undefined'
        ? b(this).dim()[type]
        : this.css(type, opt_v)
    }
  }(ender));

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * domready (c) Dustin Diaz 2012 - License MIT
    */
  !function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
    else this[name] = definition()
  }('domready', function (ready) {
  
    var fns = [], fn, f = false
      , doc = document
      , testEl = doc.documentElement
      , hack = testEl.doScroll
      , domContentLoaded = 'DOMContentLoaded'
      , addEventListener = 'addEventListener'
      , onreadystatechange = 'onreadystatechange'
      , readyState = 'readyState'
      , loaded = /^loade|c/.test(doc[readyState])
  
    function flush(f) {
      loaded = 1
      while (f = fns.shift()) f()
    }
  
    doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
      doc.removeEventListener(domContentLoaded, fn, f)
      flush()
    }, f)
  
  
    hack && doc.attachEvent(onreadystatechange, fn = function () {
      if (/^c/.test(doc[readyState])) {
        doc.detachEvent(onreadystatechange, fn)
        flush()
      }
    })
  
    return (ready = hack ?
      function (fn) {
        self != top ?
          loaded ? fn() : fns.push(fn) :
          function () {
            try {
              testEl.doScroll('left')
            } catch (e) {
              return setTimeout(function() { ready(fn) }, 50)
            }
            fn()
          }()
      } :
      function (fn) {
        loaded ? fn() : fns.push(fn)
      })
  })

  provide("domready", module.exports);

  !function ($) {
    var ready = require('domready')
    $.ender({domReady: ready})
    $.ender({
      ready: function (f) {
        ready(f)
        return this
      }
    }, true)
  }(ender);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * @preserve Qwery - A Blazing Fast query selector engine
    * https://github.com/ded/qwery
    * copyright Dustin Diaz 2012
    * MIT License
    */
  
  (function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(definition)
    else context[name] = definition()
  })('qwery', this, function () {
    var doc = document
      , html = doc.documentElement
      , byClass = 'getElementsByClassName'
      , byTag = 'getElementsByTagName'
      , qSA = 'querySelectorAll'
      , useNativeQSA = 'useNativeQSA'
      , tagName = 'tagName'
      , nodeType = 'nodeType'
      , select // main select() method, assign later
  
      , id = /#([\w\-]+)/
      , clas = /\.[\w\-]+/g
      , idOnly = /^#([\w\-]+)$/
      , classOnly = /^\.([\w\-]+)$/
      , tagOnly = /^([\w\-]+)$/
      , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
      , splittable = /(^|,)\s*[>~+]/
      , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
      , splitters = /[\s\>\+\~]/
      , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
      , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
      , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
      , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
      , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
      , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
      , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
      , tokenizr = new RegExp(splitters.source + splittersMore.source)
      , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')
  
    var walker = {
        ' ': function (node) {
          return node && node !== html && node.parentNode
        }
      , '>': function (node, contestant) {
          return node && node.parentNode == contestant.parentNode && node.parentNode
        }
      , '~': function (node) {
          return node && node.previousSibling
        }
      , '+': function (node, contestant, p1, p2) {
          if (!node) return false
          return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
        }
      }
  
    function cache() {
      this.c = {}
    }
    cache.prototype = {
      g: function (k) {
        return this.c[k] || undefined
      }
    , s: function (k, v, r) {
        v = r ? new RegExp(v) : v
        return (this.c[k] = v)
      }
    }
  
    var classCache = new cache()
      , cleanCache = new cache()
      , attrCache = new cache()
      , tokenCache = new cache()
  
    function classRegex(c) {
      return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
    }
  
    // not quite as fast as inline loops in older browsers so don't use liberally
    function each(a, fn) {
      var i = 0, l = a.length
      for (; i < l; i++) fn(a[i])
    }
  
    function flatten(ar) {
      for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
      return r
    }
  
    function arrayify(ar) {
      var i = 0, l = ar.length, r = []
      for (; i < l; i++) r[i] = ar[i]
      return r
    }
  
    function previous(n) {
      while (n = n.previousSibling) if (n[nodeType] == 1) break;
      return n
    }
  
    function q(query) {
      return query.match(chunker)
    }
  
    // called using `this` as element and arguments from regex group results.
    // given => div.hello[title="world"]:foo('bar')
    // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
    function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
      var i, m, k, o, classes
      if (this[nodeType] !== 1) return false
      if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
      if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
      if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
        for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
      }
      if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
      if (wholeAttribute && !value) { // select is just for existance of attrib
        o = this.attributes
        for (k in o) {
          if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
            return this
          }
        }
      }
      if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
        // select is for attrib equality
        return false
      }
      return this
    }
  
    function clean(s) {
      return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
    }
  
    function checkAttr(qualify, actual, val) {
      switch (qualify) {
      case '=':
        return actual == val
      case '^=':
        return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
      case '$=':
        return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
      case '*=':
        return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
      case '~=':
        return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
      case '|=':
        return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
      }
      return 0
    }
  
    // given a selector, first check for simple cases then collect all base candidate matches and filter
    function _qwery(selector, _root) {
      var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
        , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
        , dividedTokens = selector.match(dividers)
  
      if (!tokens.length) return r
  
      token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
      if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
      if (!root) return r
  
      intr = q(token)
      // collect base candidates to filter
      els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
        function (r) {
          while (root = root.nextSibling) {
            root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
          }
          return r
        }([]) :
        root[byTag](intr[1] || '*')
      // filter elements according to the right-most part of the selector
      for (i = 0, l = els.length; i < l; i++) {
        if (item = interpret.apply(els[i], intr)) r[r.length] = item
      }
      if (!tokens.length) return r
  
      // filter further according to the rest of the selector (the left side)
      each(r, function (e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
      return ret
    }
  
    // compare element to a selector
    function is(el, selector, root) {
      if (isNode(selector)) return el == selector
      if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?
  
      var selectors = selector.split(','), tokens, dividedTokens
      while (selector = selectors.pop()) {
        tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
        dividedTokens = selector.match(dividers)
        tokens = tokens.slice(0) // copy array
        if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
          return true
        }
      }
      return false
    }
  
    // given elements matching the right-most part of a selector, filter out any that don't match the rest
    function ancestorMatch(el, tokens, dividedTokens, root) {
      var cand
      // recursively work backwards through the tokens and up the dom, covering all options
      function crawl(e, i, p) {
        while (p = walker[dividedTokens[i]](p, e)) {
          if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
            if (i) {
              if (cand = crawl(p, i - 1, p)) return cand
            } else return p
          }
        }
      }
      return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
    }
  
    function isNode(el, t) {
      return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
    }
  
    function uniq(ar) {
      var a = [], i, j;
      o:
      for (i = 0; i < ar.length; ++i) {
        for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
        a[a.length] = ar[i]
      }
      return a
    }
  
    function arrayLike(o) {
      return (typeof o === 'object' && isFinite(o.length))
    }
  
    function normalizeRoot(root) {
      if (!root) return doc
      if (typeof root == 'string') return qwery(root)[0]
      if (!root[nodeType] && arrayLike(root)) return root[0]
      return root
    }
  
    function byId(root, id, el) {
      // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
      return root[nodeType] === 9 ? root.getElementById(id) :
        root.ownerDocument &&
          (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
            (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
    }
  
    function qwery(selector, _root) {
      var m, el, root = normalizeRoot(_root)
  
      // easy, fast cases that we can dispatch with simple DOM calls
      if (!root || !selector) return []
      if (selector === window || isNode(selector)) {
        return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
      }
      if (selector && arrayLike(selector)) return flatten(selector)
      if (m = selector.match(easy)) {
        if (m[1]) return (el = byId(root, m[1])) ? [el] : []
        if (m[2]) return arrayify(root[byTag](m[2]))
        if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
      }
  
      return select(selector, root)
    }
  
    // where the root is not document and a relationship selector is first we have to
    // do some awkward adjustments to get it to work, even with qSA
    function collectSelector(root, collector) {
      return function (s) {
        var oid, nid
        if (splittable.test(s)) {
          if (root[nodeType] !== 9) {
            // make sure the el has an id, rewrite the query, set root to doc and run it
            if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
            s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
            collector(root.parentNode || root, s, true)
            oid || root.removeAttribute('id')
          }
          return;
        }
        s.length && collector(root, s, false)
      }
    }
  
    var isAncestor = 'compareDocumentPosition' in html ?
      function (element, container) {
        return (container.compareDocumentPosition(element) & 16) == 16
      } : 'contains' in html ?
      function (element, container) {
        container = container[nodeType] === 9 || container == window ? html : container
        return container !== element && container.contains(element)
      } :
      function (element, container) {
        while (element = element.parentNode) if (element === container) return 1
        return 0
      }
    , getAttr = function () {
        // detect buggy IE src/href getAttribute() call
        var e = doc.createElement('p')
        return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
          function (e, a) {
            return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
              e.getAttribute(a, 2) : e.getAttribute(a)
          } :
          function (e, a) { return e.getAttribute(a) }
      }()
    , hasByClass = !!doc[byClass]
      // has native qSA support
    , hasQSA = doc.querySelector && doc[qSA]
      // use native qSA
    , selectQSA = function (selector, root) {
        var result = [], ss, e
        try {
          if (root[nodeType] === 9 || !splittable.test(selector)) {
            // most work is done right here, defer to qSA
            return arrayify(root[qSA](selector))
          }
          // special case where we need the services of `collectSelector()`
          each(ss = selector.split(','), collectSelector(root, function (ctx, s) {
            e = ctx[qSA](s)
            if (e.length == 1) result[result.length] = e.item(0)
            else if (e.length) result = result.concat(arrayify(e))
          }))
          return ss.length > 1 && result.length > 1 ? uniq(result) : result
        } catch (ex) { }
        return selectNonNative(selector, root)
      }
      // no native selector support
    , selectNonNative = function (selector, root) {
        var result = [], items, m, i, l, r, ss
        selector = selector.replace(normalizr, '$1')
        if (m = selector.match(tagAndOrClass)) {
          r = classRegex(m[2])
          items = root[byTag](m[1] || '*')
          for (i = 0, l = items.length; i < l; i++) {
            if (r.test(items[i].className)) result[result.length] = items[i]
          }
          return result
        }
        // more complex selector, get `_qwery()` to do the work for us
        each(ss = selector.split(','), collectSelector(root, function (ctx, s, rewrite) {
          r = _qwery(s, ctx)
          for (i = 0, l = r.length; i < l; i++) {
            if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
          }
        }))
        return ss.length > 1 && result.length > 1 ? uniq(result) : result
      }
    , configure = function (options) {
        // configNativeQSA: use fully-internal selector or native qSA where present
        if (typeof options[useNativeQSA] !== 'undefined')
          select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
      }
  
    configure({ useNativeQSA: true })
  
    qwery.configure = configure
    qwery.uniq = uniq
    qwery.is = is
    qwery.pseudos = {}
  
    return qwery
  });
  

  provide("qwery", module.exports);

  (function ($) {
    var q = function () {
      var r
      try {
        r = require('qwery')
      } catch (ex) {
        r = require('qwery-mobile')
      } finally {
        return r
      }
    }()
  
    $.pseudos = q.pseudos
  
    $._select = function (s, r) {
      // detect if sibling module 'bonzo' is available at run-time
      // rather than load-time since technically it's not a dependency and
      // can be loaded in any order
      // hence the lazy function re-definition
      return ($._select = (function () {
        var b
        if (typeof $.create == 'function') return function (s, r) {
          return /^\s*</.test(s) ? $.create(s, r) : q(s, r)
        }
        try {
          b = require('bonzo')
          return function (s, r) {
            return /^\s*</.test(s) ? b.create(s, r) : q(s, r)
          }
        } catch (e) { }
        return q
      })())(s, r)
    }
  
    $.ender({
        find: function (s) {
          var r = [], i, l, j, k, els
          for (i = 0, l = this.length; i < l; i++) {
            els = q(s, this[i])
            for (j = 0, k = els.length; j < k; j++) r.push(els[j])
          }
          return $(q.uniq(r))
        }
      , and: function (s) {
          var plus = $(s)
          for (var i = this.length, j = 0, l = this.length + plus.length; i < l; i++, j++) {
            this[i] = plus[j]
          }
          this.length += plus.length
          return this
        }
      , is: function(s, r) {
          var i, l
          for (i = 0, l = this.length; i < l; i++) {
            if (q.is(this[i], s, r)) {
              return true
            }
          }
          return false
        }
    }, true)
  }(ender));
  

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  // vim:ts=4:sts=4:sw=4:
  /*!
   *
   * Copyright 2009-2012 Kris Kowal under the terms of the MIT
   * license found at http://github.com/kriskowal/q/raw/master/LICENSE
   *
   * With parts by Tyler Close
   * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
   * at http://www.opensource.org/licenses/mit-license.html
   * Forked at ref_send.js version: 2009-05-11
   *
   * With parts by Mark Miller
   * Copyright (C) 2011 Google Inc.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   */
  
  (function (definition) {
      // Turn off strict mode for this function so we can assign to global.Q
      /*jshint strict: false*/
  
      // This file will function properly as a <script> tag, or a module
      // using CommonJS and NodeJS or RequireJS module formats.  In
      // Common/Node/RequireJS, the module exports the Q API and when
      // executed as a simple <script>, it creates a Q global instead.
  
      // Montage Require
      if (typeof bootstrap === "function") {
          bootstrap("promise", definition);
  
      // CommonJS
      } else if (typeof exports === "object") {
          definition(void 0, exports);
  
      // RequireJS
      } else if (typeof define === "function") {
          define(definition);
  
      // SES (Secure EcmaScript)
      } else if (typeof ses !== "undefined") {
          if (!ses.ok()) {
              return;
          } else {
              ses.makeQ = function () {
                  var Q = {};
                  return definition(void 0, Q);
              };
          }
  
      // <script>
      } else {
          definition(void 0, Q = {});
      }
  
  })(function (require, exports) {
  "use strict";
  
  // All code after this point will be filtered from stack traces reported
  // by Q.
  var qStartingLine = captureLine();
  var qFileName;
  
  // shims
  
  // used for fallback "defend" and in "allResolved"
  var noop = function () {};
  
  // for the security conscious, defend may be a deep freeze as provided
  // by cajaVM.  Otherwise we try to provide a shallow freeze just to
  // discourage promise changes that are not compatible with secure
  // usage.  If Object.freeze does not exist, fall back to doing nothing
  // (no op).
  var defend = Object.freeze || noop;
  if (typeof cajaVM !== "undefined") {
      defend = cajaVM.def;
  }
  
  // use the fastest possible means to execute a task in a future turn
  // of the event loop.
  var nextTick;
  if (typeof process !== "undefined") {
      // node
      nextTick = process.nextTick;
  } else if (typeof setImmediate === "function") {
      // In IE10, or use https://github.com/NobleJS/setImmediate
      nextTick = setImmediate;
  } else if (typeof MessageChannel !== "undefined") {
      // modern browsers
      // http://www.nonblocking.io/2011/06/windownexttick.html
      var channel = new MessageChannel();
      // linked list of tasks (single, with head node)
      var head = {}, tail = head;
      channel.port1.onmessage = function () {
          head = head.next;
          var task = head.task;
          delete head.task;
          task();
      };
      nextTick = function (task) {
          tail = tail.next = {task: task};
          channel.port2.postMessage(0);
      };
  } else {
      // old browsers
      nextTick = function (task) {
          setTimeout(task, 0);
      };
  }
  
  // Attempt to make generics safe in the face of downstream
  // modifications.
  // There is no situation where this is necessary.
  // If you need a security guarantee, these primordials need to be
  // deeply frozen anyway, and if you don’t need a security guarantee,
  // this is just plain paranoid.
  // However, this does have the nice side-effect of reducing the size
  // of the code by reducing x.call() to merely x(), eliminating many
  // hard-to-minify characters.
  // See Mark Miller’s explanation of what this does.
  // http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
  var uncurryThis;
  // I have kept both variations because the first is theoretically
  // faster, if bind is available.
  if (Function.prototype.bind) {
      var Function_bind = Function.prototype.bind;
      uncurryThis = Function_bind.bind(Function_bind.call);
  } else {
      uncurryThis = function (f) {
          return function () {
              return f.call.apply(f, arguments);
          };
      };
  }
  
  var array_slice = uncurryThis(Array.prototype.slice);
  
  var array_reduce = uncurryThis(
      Array.prototype.reduce || function (callback, basis) {
          var index = 0,
              length = this.length;
          // concerning the initial value, if one is not provided
          if (arguments.length === 1) {
              // seek to the first value in the array, accounting
              // for the possibility that is is a sparse array
              do {
                  if (index in this) {
                      basis = this[index++];
                      break;
                  }
                  if (++index >= length) {
                      throw new TypeError();
                  }
              } while (1);
          }
          // reduce
          for (; index < length; index++) {
              // account for the possibility that the array is sparse
              if (index in this) {
                  basis = callback(basis, this[index], index);
              }
          }
          return basis;
      }
  );
  
  var array_indexOf = uncurryThis(
      Array.prototype.indexOf || function (value) {
          // not a very good shim, but good enough for our one use of it
          for (var i = 0; i < this.length; i++) {
              if (this[i] === value) {
                  return i;
              }
          }
          return -1;
      }
  );
  
  var array_map = uncurryThis(
      Array.prototype.map || function (callback, thisp) {
          var self = this;
          var collect = [];
          array_reduce(self, function (undefined, value, index) {
              collect.push(callback.call(thisp, value, index, self));
          }, void 0);
          return collect;
      }
  );
  
  var object_create = Object.create || function (prototype) {
      function Type() { }
      Type.prototype = prototype;
      return new Type();
  };
  
  var object_keys = Object.keys || function (object) {
      var keys = [];
      for (var key in object) {
          keys.push(key);
      }
      return keys;
  };
  
  var object_toString = Object.prototype.toString;
  
  // generator related shims
  
  function isStopIteration(exception) {
      return (
          object_toString(exception) === "[object StopIteration]" ||
          exception instanceof QReturnValue
      );
  }
  
  var QReturnValue;
  if (typeof ReturnValue !== "undefined") {
      QReturnValue = ReturnValue;
  } else {
      QReturnValue = function (value) {
          this.value = value;
      };
  }
  
  // long stack traces
  
  var STACK_JUMP_SEPARATOR = "From previous event:";
  
  function makeStackTraceLong(error, promise) {
      // If possible (that is, if in V8), transform the error stack
      // trace by removing Node and Q cruft, then concatenating with
      // the stack trace of the promise we are ``done``ing. See #57.
      if (promise.stack &&
          typeof error === "object" &&
          error !== null &&
          error.stack &&
          error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
      ) {
          error.stack = filterStackString(error.stack) +
              "\n" + STACK_JUMP_SEPARATOR + "\n" +
              filterStackString(promise.stack);
      }
  }
  
  function filterStackString(stackString) {
      var lines = stackString.split("\n");
      var desiredLines = [];
      for (var i = 0; i < lines.length; ++i) {
          var line = lines[i];
  
          if (!isInternalFrame(line) && !isNodeFrame(line)) {
              desiredLines.push(line);
          }
      }
      return desiredLines.join("\n");
  }
  
  function isNodeFrame(stackLine) {
      return stackLine.indexOf("(module.js:") !== -1 ||
             stackLine.indexOf("(node.js:") !== -1;
  }
  
  function isInternalFrame(stackLine) {
      var pieces = /at .+ \((.*):(\d+):\d+\)/.exec(stackLine);
  
      if (!pieces) {
          return false;
      }
  
      var fileName = pieces[1];
      var lineNumber = pieces[2];
  
      return fileName === qFileName &&
          lineNumber >= qStartingLine &&
          lineNumber <= qEndingLine;
  }
  
  // discover own file name and line number range for filtering stack
  // traces
  function captureLine() {
      if (Error.captureStackTrace) {
          var fileName, lineNumber;
  
          var oldPrepareStackTrace = Error.prepareStackTrace;
  
          Error.prepareStackTrace = function (error, frames) {
              fileName = frames[1].getFileName();
              lineNumber = frames[1].getLineNumber();
          };
  
          // teases call of temporary prepareStackTrace
          // JSHint and Closure Compiler generate known warnings here
          /*jshint expr: true */
          new Error().stack;
  
          Error.prepareStackTrace = oldPrepareStackTrace;
          qFileName = fileName;
          return lineNumber;
      }
  }
  
  function deprecate(callback, name, alternative) {
      return function () {
          if (typeof console !== "undefined" && typeof console.warn === "function") {
              console.warn(name + " is deprecated, use " + alternative + " instead.", new Error("").stack);
          }
          return callback.apply(callback, arguments);
      };
  }
  
  // end of shims
  // beginning of real work
  
  /**
   * Performs a task in a future turn of the event loop.
   * @param {Function} task
   */
  exports.nextTick = nextTick;
  
  /**
   * Constructs a {promise, resolve} object.
   *
   * The resolver is a callback to invoke with a more resolved value for the
   * promise. To fulfill the promise, invoke the resolver with any value that is
   * not a function. To reject the promise, invoke the resolver with a rejection
   * object. To put the promise in the same state as another promise, invoke the
   * resolver with that other promise.
   */
  exports.defer = defer;
  function defer() {
      // if "pending" is an "Array", that indicates that the promise has not yet
      // been resolved.  If it is "undefined", it has been resolved.  Each
      // element of the pending array is itself an array of complete arguments to
      // forward to the resolved promise.  We coerce the resolution value to a
      // promise using the ref promise because it handles both fully
      // resolved values and other promises gracefully.
      var pending = [], progressListeners = [], value;
  
      var deferred = object_create(defer.prototype);
      var promise = object_create(makePromise.prototype);
  
      promise.promiseSend = function (op, _, __, progress) {
          var args = array_slice(arguments);
          if (pending) {
              pending.push(args);
              if (op === "when" && progress) {
                  progressListeners.push(progress);
              }
          } else {
              nextTick(function () {
                  value.promiseSend.apply(value, args);
              });
          }
      };
  
      promise.valueOf = function () {
          if (pending) {
              return promise;
          }
          return value.valueOf();
      };
  
      if (Error.captureStackTrace) {
          Error.captureStackTrace(promise, defer);
  
          // Reify the stack into a string by using the accessor; this prevents
          // memory leaks as per GH-111. At the same time, cut off the first line;
          // it's always just "[object Promise]\n", as per the `toString`.
          promise.stack = promise.stack.substring(promise.stack.indexOf("\n") + 1);
      }
  
      function become(resolvedValue) {
          if (!pending) {
              return;
          }
          value = resolve(resolvedValue);
          array_reduce(pending, function (undefined, pending) {
              nextTick(function () {
                  value.promiseSend.apply(value, pending);
              });
          }, void 0);
          pending = void 0;
          progressListeners = void 0;
      }
  
      defend(promise);
  
      deferred.promise = promise;
      deferred.resolve = become;
      deferred.reject = function (exception) {
          become(reject(exception));
      };
      deferred.notify = function (progress) {
          if (pending) {
              array_reduce(progressListeners, function (undefined, progressListener) {
                  nextTick(function () {
                      progressListener(progress);
                  });
              }, void 0);
          }
      };
  
      return deferred;
  }
  
  /**
   * Creates a Node-style callback that will resolve or reject the deferred
   * promise.
   * @returns a nodeback
   */
  defer.prototype.makeNodeResolver = function () {
      var self = this;
      return function (error, value) {
          if (error) {
              self.reject(error);
          } else if (arguments.length > 2) {
              self.resolve(array_slice(arguments, 1));
          } else {
              self.resolve(value);
          }
      };
  };
  // XXX deprecated
  defer.prototype.node = deprecate(defer.prototype.makeNodeResolver, "node", "makeNodeResolver");
  
  /**
   * @param makePromise {Function} a function that returns nothing and accepts
   * the resolve, reject, and notify functions for a deferred.
   * @returns a promise that may be resolved with the given resolve and reject
   * functions, or rejected by a thrown exception in makePromise
   */
  exports.promise = promise;
  function promise(makePromise) {
      var deferred = defer();
      fcall(
          makePromise,
          deferred.resolve,
          deferred.reject,
          deferred.notify
      ).fail(deferred.reject);
      return deferred.promise;
  }
  
  /**
   * Constructs a Promise with a promise descriptor object and optional fallback
   * function.  The descriptor contains methods like when(rejected), get(name),
   * put(name, value), post(name, args), and delete(name), which all
   * return either a value, a promise for a value, or a rejection.  The fallback
   * accepts the operation name, a resolver, and any further arguments that would
   * have been forwarded to the appropriate method above had a method been
   * provided with the proper name.  The API makes no guarantees about the nature
   * of the returned object, apart from that it is usable whereever promises are
   * bought and sold.
   */
  exports.makePromise = makePromise;
  function makePromise(descriptor, fallback, valueOf, exception) {
      if (fallback === void 0) {
          fallback = function (op) {
              return reject(new Error("Promise does not support operation: " + op));
          };
      }
  
      var promise = object_create(makePromise.prototype);
  
      promise.promiseSend = function (op, resolved /* ...args */) {
          var args = array_slice(arguments, 2);
          var result;
          try {
              if (descriptor[op]) {
                  result = descriptor[op].apply(promise, args);
              } else {
                  result = fallback.apply(promise, [op].concat(args));
              }
          } catch (exception) {
              result = reject(exception);
          }
          if (resolved) {
              resolved(result);
          }
      };
  
      if (valueOf) {
          promise.valueOf = valueOf;
      }
  
      if (exception) {
          promise.exception = exception;
      }
  
      defend(promise);
  
      return promise;
  }
  
  // provide thenables, CommonJS/Promises/A
  makePromise.prototype.then = function (fulfilled, rejected, progressed) {
      return when(this, fulfilled, rejected, progressed);
  };
  
  makePromise.prototype.thenResolve = function (value) {
      return when(this, function () { return value; });
  };
  
  // Chainable methods
  array_reduce(
      [
          "isResolved", "isFulfilled", "isRejected",
          "when", "spread", "send",
          "get", "put", "del",
          "post", "invoke",
          "keys",
          "apply", "call", "bind",
          "fapply", "fcall", "fbind",
          "all", "allResolved",
          "view", "viewInfo",
          "timeout", "delay",
          "catch", "finally", "fail", "fin", "progress", "end", "done",
          "nfcall", "nfapply", "nfbind",
          "ncall", "napply", "nbind",
          "npost", "ninvoke",
          "nend", "nodeify"
      ],
      function (undefined, name) {
          makePromise.prototype[name] = function () {
              return exports[name].apply(
                  exports,
                  [this].concat(array_slice(arguments))
              );
          };
      },
      void 0
  );
  
  makePromise.prototype.toSource = function () {
      return this.toString();
  };
  
  makePromise.prototype.toString = function () {
      return "[object Promise]";
  };
  
  defend(makePromise.prototype);
  
  /**
   * If an object is not a promise, it is as "near" as possible.
   * If a promise is rejected, it is as "near" as possible too.
   * If it’s a fulfilled promise, the fulfillment value is nearer.
   * If it’s a deferred promise and the deferred has been resolved, the
   * resolution is "nearer".
   * @param object
   * @returns most resolved (nearest) form of the object
   */
  exports.nearer = valueOf;
  function valueOf(value) {
      if (isPromise(value)) {
          return value.valueOf();
      }
      return value;
  }
  
  /**
   * @returns whether the given object is a promise.
   * Otherwise it is a fulfilled value.
   */
  exports.isPromise = isPromise;
  function isPromise(object) {
      return object && typeof object.promiseSend === "function";
  }
  
  /**
   * @returns whether the given object can be coerced to a promise.
   * Otherwise it is a fulfilled value.
   */
  exports.isPromiseAlike = isPromiseAlike;
  function isPromiseAlike(object) {
      return object && typeof object.then === "function";
  }
  
  /**
   * @returns whether the given object is a resolved promise.
   */
  exports.isResolved = isResolved;
  function isResolved(object) {
      return isFulfilled(object) || isRejected(object);
  }
  
  /**
   * @returns whether the given object is a value or fulfilled
   * promise.
   */
  exports.isFulfilled = isFulfilled;
  function isFulfilled(object) {
      return !isPromiseAlike(valueOf(object));
  }
  
  /**
   * @returns whether the given object is a rejected promise.
   */
  exports.isRejected = isRejected;
  function isRejected(object) {
      object = valueOf(object);
      return isPromise(object) && 'exception' in object;
  }
  
  var rejections = [];
  var errors = [];
  var errorsDisplayed;
  function displayErrors() {
      if (
          !errorsDisplayed &&
          typeof window !== "undefined" &&
          !window.Touch &&
          window.console
      ) {
          // This promise library consumes exceptions thrown in handlers so
          // they can be handled by a subsequent promise.  The rejected
          // promises get added to this array when they are created, and
          // removed when they are handled.
          console.log("Should be empty:", errors);
      }
      errorsDisplayed = true;
  }
  
  /**
   * Constructs a rejected promise.
   * @param exception value describing the failure
   */
  exports.reject = reject;
  function reject(exception) {
      var rejection = makePromise({
          "when": function (rejected) {
              // note that the error has been handled
              if (rejected) {
                  var at = array_indexOf(rejections, this);
                  if (at !== -1) {
                      errors.splice(at, 1);
                      rejections.splice(at, 1);
                  }
              }
              return rejected ? rejected(exception) : reject(exception);
          }
      }, function fallback() {
          return reject(exception);
      }, function valueOf() {
          return this;
      }, exception);
      // note that the error has not been handled
      displayErrors();
      rejections.push(rejection);
      errors.push(exception);
      return rejection;
  }
  
  /**
   * Constructs a promise for an immediate reference.
   * @param value immediate reference
   */
  exports.begin = resolve; // XXX experimental
  exports.resolve = resolve;
  exports.ref = deprecate(resolve, "ref", "resolve"); // XXX deprecated, use resolve
  function resolve(object) {
      // If the object is already a Promise, return it directly.  This enables
      // the resolve function to both be used to created references from objects,
      // but to tolerably coerce non-promises to promises.
      if (isPromise(object)) {
          return object;
      }
      // In order to break infinite recursion or loops between `then` and
      // `resolve`, it is necessary to attempt to extract fulfilled values
      // out of foreign promise implementations before attempting to wrap
      // them as unresolved promises.  It is my hope that other
      // implementations will implement `valueOf` to synchronously extract
      // the fulfillment value from their fulfilled promises.  If the
      // other promise library does not implement `valueOf`, the
      // implementations on primordial prototypes are harmless.
      object = valueOf(object);
      // assimilate thenables, CommonJS/Promises/A
      if (isPromiseAlike(object)) {
          var deferred = defer();
          object.then(deferred.resolve, deferred.reject, deferred.notify);
          return deferred.promise;
      }
      return makePromise({
          "when": function () {
              return object;
          },
          "get": function (name) {
              return object[name];
          },
          "put": function (name, value) {
              object[name] = value;
              return object;
          },
          "del": function (name) {
              delete object[name];
              return object;
          },
          "post": function (name, value) {
              return object[name].apply(object, value);
          },
          "apply": function (self, args) {
              return object.apply(self, args);
          },
          "fapply": function (args) {
              return object.apply(void 0, args);
          },
          "viewInfo": function () {
              var on = object;
              var properties = {};
  
              function fixFalsyProperty(name) {
                  if (!properties[name]) {
                      properties[name] = typeof on[name];
                  }
              }
  
              while (on) {
                  Object.getOwnPropertyNames(on).forEach(fixFalsyProperty);
                  on = Object.getPrototypeOf(on);
              }
              return {
                  "type": typeof object,
                  "properties": properties
              };
          },
          "keys": function () {
              return object_keys(object);
          }
      }, void 0, function valueOf() {
          return object;
      });
  }
  
  /**
   * Annotates an object such that it will never be
   * transferred away from this process over any promise
   * communication channel.
   * @param object
   * @returns promise a wrapping of that object that
   * additionally responds to the "isDef" message
   * without a rejection.
   */
  exports.master = master;
  function master(object) {
      return makePromise({
          "isDef": function () {}
      }, function fallback() {
          var args = array_slice(arguments);
          return send.apply(void 0, [object].concat(args));
      }, function () {
          return valueOf(object);
      });
  }
  
  exports.viewInfo = viewInfo;
  function viewInfo(object, info) {
      object = resolve(object);
      if (info) {
          return makePromise({
              "viewInfo": function () {
                  return info;
              }
          }, function fallback() {
              var args = array_slice(arguments);
              return send.apply(void 0, [object].concat(args));
          }, function () {
              return valueOf(object);
          });
      } else {
          return send(object, "viewInfo");
      }
  }
  
  exports.view = view;
  function view(object) {
      return viewInfo(object).when(function (info) {
          var view;
          if (info.type === "function") {
              view = function () {
                  return apply(object, void 0, arguments);
              };
          } else {
              view = {};
          }
          var properties = info.properties || {};
          object_keys(properties).forEach(function (name) {
              if (properties[name] === "function") {
                  view[name] = function () {
                      return post(object, name, arguments);
                  };
              }
          });
          return resolve(view);
      });
  }
  
  /**
   * Registers an observer on a promise.
   *
   * Guarantees:
   *
   * 1. that fulfilled and rejected will be called only once.
   * 2. that either the fulfilled callback or the rejected callback will be
   *    called, but not both.
   * 3. that fulfilled and rejected will not be called in this turn.
   *
   * @param value      promise or immediate reference to observe
   * @param fulfilled  function to be called with the fulfilled value
   * @param rejected   function to be called with the rejection exception
   * @param progressed function to be called on any progress notifications
   * @return promise for the return value from the invoked callback
   */
  exports.when = when;
  function when(value, fulfilled, rejected, progressed) {
      var deferred = defer();
      var done = false;   // ensure the untrusted promise makes at most a
                          // single call to one of the callbacks
  
      function _fulfilled(value) {
          try {
              return typeof fulfilled === "function" ? fulfilled(value) : value;
          } catch (exception) {
              return reject(exception);
          }
      }
  
      function _rejected(exception) {
          if (typeof rejected === "function") {
              makeStackTraceLong(exception, resolvedValue);
              try {
                  return rejected(exception);
              } catch (newException) {
                  return reject(newException);
              }
          }
          return reject(exception);
      }
  
      function _progressed(value) {
          return typeof progressed === "function" ? progressed(value) : value;
      }
  
      var resolvedValue = resolve(value);
      nextTick(function () {
          resolvedValue.promiseSend("when", function (value) {
              if (done) {
                  return;
              }
              done = true;
  
              deferred.resolve(_fulfilled(value));
          }, function (exception) {
              if (done) {
                  return;
              }
              done = true;
  
              deferred.resolve(_rejected(exception));
          });
      });
  
      // Progress propagator need to be attached in the current tick.
      resolvedValue.promiseSend("when", void 0, void 0, function (value) {
          deferred.notify(_progressed(value));
      });
  
      return deferred.promise;
  }
  
  /**
   * Spreads the values of a promised array of arguments into the
   * fulfillment callback.
   * @param fulfilled callback that receives variadic arguments from the
   * promised array
   * @param rejected callback that receives the exception if the promise
   * is rejected.
   * @returns a promise for the return value or thrown exception of
   * either callback.
   */
  exports.spread = spread;
  function spread(promise, fulfilled, rejected) {
      return when(promise, function (valuesOrPromises) {
          return all(valuesOrPromises).then(function (values) {
              return fulfilled.apply(void 0, values);
          }, rejected);
      }, rejected);
  }
  
  /**
   * The async function is a decorator for generator functions, turning
   * them into asynchronous generators.  This presently only works in
   * Firefox/Spidermonkey, however, this code does not cause syntax
   * errors in older engines.  This code should continue to work and
   * will in fact improve over time as the language improves.
   *
   * Decorates a generator function such that:
   *  - it may yield promises
   *  - execution will continue when that promise is fulfilled
   *  - the value of the yield expression will be the fulfilled value
   *  - it returns a promise for the return value (when the generator
   *    stops iterating)
   *  - the decorated function returns a promise for the return value
   *    of the generator or the first rejected promise among those
   *    yielded.
   *  - if an error is thrown in the generator, it propagates through
   *    every following yield until it is caught, or until it escapes
   *    the generator function altogether, and is translated into a
   *    rejection for the promise returned by the decorated generator.
   *  - in present implementations of generators, when a generator
   *    function is complete, it throws ``StopIteration``, ``return`` is
   *    a syntax error in the presence of ``yield``, so there is no
   *    observable return value. There is a proposal[1] to add support
   *    for ``return``, which would permit the value to be carried by a
   *    ``StopIteration`` instance, in which case it would fulfill the
   *    promise returned by the asynchronous generator.  This can be
   *    emulated today by throwing StopIteration explicitly with a value
   *    property.
   *
   *  [1]: http://wiki.ecmascript.org/doku.php?id=strawman:async_functions#reference_implementation
   *
   */
  exports.async = async;
  function async(makeGenerator) {
      return function () {
          // when verb is "send", arg is a value
          // when verb is "throw", arg is an exception
          function continuer(verb, arg) {
              var result;
              try {
                  result = generator[verb](arg);
              } catch (exception) {
                  if (isStopIteration(exception)) {
                      return exception.value;
                  } else {
                      return reject(exception);
                  }
              }
              return when(result, callback, errback);
          }
          var generator = makeGenerator.apply(this, arguments);
          var callback = continuer.bind(continuer, "send");
          var errback = continuer.bind(continuer, "throw");
          return callback();
      };
  }
  
  /**
   * Throws a ReturnValue exception to stop an asynchronous generator.
   * Only useful presently in Firefox/SpiderMonkey since generators are
   * implemented.
   * @param value the return value for the surrounding generator
   * @throws ReturnValue exception with the value.
   * @example
   * Q.async(function () {
   *      var foo = yield getFooPromise();
   *      var bar = yield getBarPromise();
   *      Q.return(foo + bar);
   * })
   */
  exports['return'] = _return;
  function _return(value) {
      throw new QReturnValue(value);
  }
  
  /**
   * The promised function decorator ensures that any promise arguments
   * are resolved and passed as values (`this` is also resolved and passed
   * as a value).  It will also ensure that the result of a function is
   * always a promise.
   *
   * @example
   * var add = Q.promised(function (a, b) {
   *     return a + b;
   * });
   * add(Q.resolve(a), Q.resolve(B));
   *
   * @param {function} callback The function to decorate
   * @returns {function} a function that has been decorated.
   */
  exports.promised = promised;
  function promised(callback) {
      return function () {
          return all([this, all(arguments)]).spread(function (self, args) {
            return callback.apply(self, args);
          });
      };
  }
  
  /**
   * Constructs a promise method that can be used to safely observe resolution of
   * a promise for an arbitrarily named method like "propfind" in a future turn.
   */
  exports.sender = deprecate(sender, "sender", "dispatcher"); // XXX deprecated, use dispatcher
  exports.Method = deprecate(sender, "Method", "dispatcher"); // XXX deprecated, use dispatcher
  function sender(op) {
      return function (object) {
          var args = array_slice(arguments, 1);
          return send.apply(void 0, [object, op].concat(args));
      };
  }
  
  /**
   * sends a message to a value in a future turn
   * @param object* the recipient
   * @param op the name of the message operation, e.g., "when",
   * @param ...args further arguments to be forwarded to the operation
   * @returns result {Promise} a promise for the result of the operation
   */
  exports.send = deprecate(send, "send", "dispatch"); // XXX deprecated, use dispatch
  function send(object, op) {
      var deferred = defer();
      var args = array_slice(arguments, 2);
      object = resolve(object);
      nextTick(function () {
          object.promiseSend.apply(
              object,
              [op, deferred.resolve].concat(args)
          );
      });
      return deferred.promise;
  }
  
  /**
   * sends a message to a value in a future turn
   * @param object* the recipient
   * @param op the name of the message operation, e.g., "when",
   * @param args further arguments to be forwarded to the operation
   * @returns result {Promise} a promise for the result of the operation
   */
  exports.dispatch = dispatch;
  function dispatch(object, op, args) {
      var deferred = defer();
      object = resolve(object);
      nextTick(function () {
          object.promiseSend.apply(
              object,
              [op, deferred.resolve].concat(args)
          );
      });
      return deferred.promise;
  }
  
  /**
   * Constructs a promise method that can be used to safely observe resolution of
   * a promise for an arbitrarily named method like "propfind" in a future turn.
   *
   * "dispatcher" constructs methods like "get(promise, name)" and "put(promise)".
   */
  exports.dispatcher = dispatcher;
  function dispatcher(op) {
      return function (object) {
          var args = array_slice(arguments, 1);
          return dispatch(object, op, args);
      };
  }
  
  /**
   * Gets the value of a property in a future turn.
   * @param object    promise or immediate reference for target object
   * @param name      name of property to get
   * @return promise for the property value
   */
  exports.get = dispatcher("get");
  
  /**
   * Sets the value of a property in a future turn.
   * @param object    promise or immediate reference for object object
   * @param name      name of property to set
   * @param value     new value of property
   * @return promise for the return value
   */
  exports.put = dispatcher("put");
  
  /**
   * Deletes a property in a future turn.
   * @param object    promise or immediate reference for target object
   * @param name      name of property to delete
   * @return promise for the return value
   */
  exports["delete"] = // XXX experimental
  exports.del = dispatcher("del");
  
  /**
   * Invokes a method in a future turn.
   * @param object    promise or immediate reference for target object
   * @param name      name of method to invoke
   * @param value     a value to post, typically an array of
   *                  invocation arguments for promises that
   *                  are ultimately backed with `resolve` values,
   *                  as opposed to those backed with URLs
   *                  wherein the posted value can be any
   *                  JSON serializable object.
   * @return promise for the return value
   */
  // bound locally because it is used by other methods
  var post = exports.post = dispatcher("post");
  
  /**
   * Invokes a method in a future turn.
   * @param object    promise or immediate reference for target object
   * @param name      name of method to invoke
   * @param ...args   array of invocation arguments
   * @return promise for the return value
   */
  exports.invoke = function (value, name) {
      var args = array_slice(arguments, 2);
      return post(value, name, args);
  };
  
  /**
   * Applies the promised function in a future turn.
   * @param object    promise or immediate reference for target function
   * @param thisp     the `this` object for the call
   * @param args      array of application arguments
   */
  // XXX deprecated, use fapply
  var apply = exports.apply = deprecate(dispatcher("apply"), "apply", "fapply");
  
  /**
   * Applies the promised function in a future turn.
   * @param object    promise or immediate reference for target function
   * @param args      array of application arguments
   */
  var fapply = exports.fapply = dispatcher("fapply");
  
  /**
   * Calls the promised function in a future turn.
   * @param object    promise or immediate reference for target function
   * @param thisp     the `this` object for the call
   * @param ...args   array of application arguments
   */
  // XXX deprecated, use fcall
  exports.call = deprecate(call, "call", "fcall");
  function call(value, thisp) {
      var args = array_slice(arguments, 2);
      return apply(value, thisp, args);
  }
  
  /**
   * Calls the promised function in a future turn.
   * @param object    promise or immediate reference for target function
   * @param ...args   array of application arguments
   */
  exports["try"] = fcall; // XXX experimental
  exports.fcall = fcall;
  function fcall(value) {
      var args = array_slice(arguments, 1);
      return fapply(value, args);
  }
  
  /**
   * Binds the promised function, transforming return values into a fulfilled
   * promise and thrown errors into a rejected one.
   * @param object    promise or immediate reference for target function
   * @param thisp   the `this` object for the call
   * @param ...args   array of application arguments
   */
  exports.bind = deprecate(bind, "bind", "fbind"); // XXX deprecated, use fbind
  function bind(value, thisp) {
      var args = array_slice(arguments, 2);
      return function bound() {
          var allArgs = args.concat(array_slice(arguments));
          return apply(value, thisp, allArgs);
      };
  }
  
  /**
   * Binds the promised function, transforming return values into a fulfilled
   * promise and thrown errors into a rejected one.
   * @param object    promise or immediate reference for target function
   * @param ...args   array of application arguments
   */
  exports.fbind = fbind;
  function fbind(value) {
      var args = array_slice(arguments, 1);
      return function fbound() {
          var allArgs = args.concat(array_slice(arguments));
          return fapply(value, allArgs);
      };
  }
  
  /**
   * Requests the names of the owned properties of a promised
   * object in a future turn.
   * @param object    promise or immediate reference for target object
   * @return promise for the keys of the eventually resolved object
   */
  exports.keys = dispatcher("keys");
  
  /**
   * Turns an array of promises into a promise for an array.  If any of
   * the promises gets rejected, the whole array is rejected immediately.
   * @param {Array*} an array (or promise for an array) of values (or
   * promises for values)
   * @returns a promise for an array of the corresponding values
   */
  // By Mark Miller
  // http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
  exports.all = all;
  function all(promises) {
      return when(promises, function (promises) {
          var countDown = promises.length;
          if (countDown === 0) {
              return resolve(promises);
          }
          var deferred = defer();
          array_reduce(promises, function (undefined, promise, index) {
              if (isFulfilled(promise)) {
                  promises[index] = valueOf(promise);
                  if (--countDown === 0) {
                      deferred.resolve(promises);
                  }
              } else {
                  when(promise, function (value) {
                      promises[index] = value;
                      if (--countDown === 0) {
                          deferred.resolve(promises);
                      }
                  })
                  .fail(deferred.reject);
              }
          }, void 0);
          return deferred.promise;
      });
  }
  
  /**
   * Waits for all promises to be resolved, either fulfilled or
   * rejected.  This is distinct from `all` since that would stop
   * waiting at the first rejection.  The promise returned by
   * `allResolved` will never be rejected.
   * @param promises a promise for an array (or an array) of promises
   * (or values)
   * @return a promise for an array of promises
   */
  exports.allResolved = allResolved;
  function allResolved(promises) {
      return when(promises, function (promises) {
          return when(all(array_map(promises, function (promise) {
              return when(promise, noop, noop);
          })), function () {
              return array_map(promises, resolve);
          });
      });
  }
  
  /**
   * Captures the failure of a promise, giving an oportunity to recover
   * with a callback.  If the given promise is fulfilled, the returned
   * promise is fulfilled.
   * @param {Any*} promise for something
   * @param {Function} callback to fulfill the returned promise if the
   * given promise is rejected
   * @returns a promise for the return value of the callback
   */
  exports["catch"] = // XXX experimental
  exports.fail = fail;
  function fail(promise, rejected) {
      return when(promise, void 0, rejected);
  }
  
  /**
   * Attaches a listener that can respond to progress notifications from a
   * promise's originating deferred. This listener receives the exact arguments
   * passed to ``deferred.notify``.
   * @param {Any*} promise for something
   * @param {Function} callback to receive any progress notifications
   * @returns the given promise, unchanged
   */
  exports.progress = progress;
  function progress(promise, progressed) {
      return when(promise, void 0, void 0, progressed);
  }
  
  /**
   * Provides an opportunity to observe the rejection of a promise,
   * regardless of whether the promise is fulfilled or rejected.  Forwards
   * the resolution to the returned promise when the callback is done.
   * The callback can return a promise to defer completion.
   * @param {Any*} promise
   * @param {Function} callback to observe the resolution of the given
   * promise, takes no arguments.
   * @returns a promise for the resolution of the given promise when
   * ``fin`` is done.
   */
  exports["finally"] = // XXX experimental
  exports.fin = fin;
  function fin(promise, callback) {
      return when(promise, function (value) {
          return when(callback(), function () {
              return value;
          });
      }, function (exception) {
          return when(callback(), function () {
              return reject(exception);
          });
      });
  }
  
  /**
   * Terminates a chain of promises, forcing rejections to be
   * thrown as exceptions.
   * @param {Any*} promise at the end of a chain of promises
   * @returns nothing
   */
  exports.end = deprecate(done, "end", "done"); // XXX deprecated, use done
  exports.done = done;
  function done(promise, fulfilled, rejected, progress) {
      function onUnhandledError(error) {
          // forward to a future turn so that ``when``
          // does not catch it and turn it into a rejection.
          nextTick(function () {
              makeStackTraceLong(error, promise);
  
              if (exports.onerror) {
                  exports.onerror(error);
              } else {
                  throw error;
              }
          });
      }
  
      // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
      var promiseToHandle = fulfilled || rejected || progress ?
          when(promise, fulfilled, rejected, progress) :
          promise;
  
      fail(promiseToHandle, onUnhandledError);
  }
  
  /**
   * Causes a promise to be rejected if it does not get fulfilled before
   * some milliseconds time out.
   * @param {Any*} promise
   * @param {Number} milliseconds timeout
   * @returns a promise for the resolution of the given promise if it is
   * fulfilled before the timeout, otherwise rejected.
   */
  exports.timeout = timeout;
  function timeout(promise, ms) {
      var deferred = defer();
      var timeoutId = setTimeout(function () {
          deferred.reject(new Error("Timed out after " + ms + " ms"));
      }, ms);
  
      when(promise, function (value) {
          clearTimeout(timeoutId);
          deferred.resolve(value);
      }, function (exception) {
          clearTimeout(timeoutId);
          deferred.reject(exception);
      });
  
      return deferred.promise;
  }
  
  /**
   * Returns a promise for the given value (or promised value) after some
   * milliseconds.
   * @param {Any*} promise
   * @param {Number} milliseconds
   * @returns a promise for the resolution of the given promise after some
   * time has elapsed.
   */
  exports.delay = delay;
  function delay(promise, timeout) {
      if (timeout === void 0) {
          timeout = promise;
          promise = void 0;
      }
      var deferred = defer();
      setTimeout(function () {
          deferred.resolve(promise);
      }, timeout);
      return deferred.promise;
  }
  
  /**
   * Passes a continuation to a Node function, which is called with the given
   * arguments provided as an array, and returns a promise.
   *
   *      Q.nfapply(FS.readFile, [__filename])
   *      .then(function (content) {
   *      })
   *
   */
  exports.nfapply = nfapply;
  function nfapply(callback, args) {
      var nodeArgs = array_slice(args);
      var deferred = defer();
      nodeArgs.push(deferred.makeNodeResolver());
  
      fapply(callback, nodeArgs).fail(deferred.reject);
      return deferred.promise;
  }
  
  /**
   * Passes a continuation to a Node function, which is called with the given
   * arguments provided individually, and returns a promise.
   *
   *      Q.nfcall(FS.readFile, __filename)
   *      .then(function (content) {
   *      })
   *
   */
  exports.nfcall = nfcall;
  function nfcall(callback/*, ...args */) {
      var nodeArgs = array_slice(arguments, 1);
      var deferred = defer();
      nodeArgs.push(deferred.makeNodeResolver());
  
      fapply(callback, nodeArgs).fail(deferred.reject);
      return deferred.promise;
  }
  
  /**
   * Wraps a NodeJS continuation passing function and returns an equivalent
   * version that returns a promise.
   *
   *      Q.nfbind(FS.readFile, __filename)("utf-8")
   *      .then(console.log)
   *      .done()
   *
   */
  exports.nfbind = nfbind;
  function nfbind(callback/*, ...args */) {
      var baseArgs = array_slice(arguments, 1);
      return function () {
          var nodeArgs = baseArgs.concat(array_slice(arguments));
          var deferred = defer();
          nodeArgs.push(deferred.makeNodeResolver());
  
          fapply(callback, nodeArgs).fail(deferred.reject);
          return deferred.promise;
      };
  }
  
  /**
   * Passes a continuation to a Node function, which is called with a given
   * `this` value and arguments provided as an array, and returns a promise.
   *
   *      Q.napply(FS.readFile, FS, [__filename])
   *      .then(function (content) {
   *      })
   *
   */
  exports.napply = deprecate(napply, "napply", "npost");
  function napply(callback, thisp, args) {
      return nbind(callback, thisp).apply(void 0, args);
  }
  
  /**
   * Passes a continuation to a Node function, which is called with a given
   * `this` value and arguments provided individually, and returns a promise.
   *
   *      Q.ncall(FS.readFile, FS, __filename)
   *      .then(function (content) {
   *      })
   *
   */
  exports.ncall = deprecate(ncall, "ncall", "ninvoke");
  function ncall(callback, thisp /*, ...args*/) {
      var args = array_slice(arguments, 2);
      return napply(callback, thisp, args);
  }
  
  /**
   * Wraps a NodeJS continuation passing function and returns an equivalent
   * version that returns a promise.
   *
   *      Q.nbind(FS.readFile, FS)(__filename)
   *      .then(console.log)
   *      .done()
   *
   */
  exports.nbind = deprecate(nbind, "nbind", "nfbind");
  function nbind(callback /* thisp, ...args*/) {
      if (arguments.length > 1) {
          var thisp = arguments[1];
          var args = array_slice(arguments, 2);
  
          var originalCallback = callback;
          callback = function () {
              var combinedArgs = args.concat(array_slice(arguments));
              return originalCallback.apply(thisp, combinedArgs);
          };
      }
      return function () {
          var deferred = defer();
          var args = array_slice(arguments);
          // add a continuation that resolves the promise
          args.push(deferred.makeNodeResolver());
          // trap exceptions thrown by the callback
          fapply(callback, args)
          .fail(deferred.reject);
          return deferred.promise;
      };
  }
  
  /**
   * Calls a method of a Node-style object that accepts a Node-style
   * callback with a given array of arguments, plus a provided callback.
   * @param object an object that has the named method
   * @param {String} name name of the method of object
   * @param {Array} args arguments to pass to the method; the callback
   * will be provided by Q and appended to these arguments.
   * @returns a promise for the value or error
   */
  exports.npost = npost;
  function npost(object, name, args) {
      var nodeArgs = array_slice(args);
      var deferred = defer();
      nodeArgs.push(deferred.makeNodeResolver());
  
      post(object, name, nodeArgs).fail(deferred.reject);
      return deferred.promise;
  }
  
  /**
   * Calls a method of a Node-style object that accepts a Node-style
   * callback, forwarding the given variadic arguments, plus a provided
   * callback argument.
   * @param object an object that has the named method
   * @param {String} name name of the method of object
   * @param ...args arguments to pass to the method; the callback will
   * be provided by Q and appended to these arguments.
   * @returns a promise for the value or error
   */
  exports.ninvoke = ninvoke;
  function ninvoke(object, name /*, ...args*/) {
      var nodeArgs = array_slice(arguments, 2);
      var deferred = defer();
      nodeArgs.push(deferred.makeNodeResolver());
  
      post(object, name, nodeArgs).fail(deferred.reject);
      return deferred.promise;
  }
  
  exports.nend = deprecate(nodeify, "nend", "nodeify"); // XXX deprecated, use nodeify
  exports.nodeify = nodeify;
  function nodeify(promise, nodeback) {
      if (nodeback) {
          promise.then(function (value) {
              nextTick(function () {
                  nodeback(null, value);
              });
          }, function (error) {
              nextTick(function () {
                  nodeback(error);
              });
          });
      } else {
          return promise;
      }
  }
  
  // All code before this point will be filtered from stack traces.
  var qEndingLine = captureLine();
  
  });
  

  provide("q", module.exports);

  $.ender(module.exports);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Morpheus - A Brilliant Animator
    * https://github.com/ded/morpheus - (c) Dustin Diaz 2011
    * License MIT
    */
  !function (name, definition) {
    if (typeof define == 'function') define(definition)
    else if (typeof module != 'undefined') module.exports = definition()
    else this[name] = definition()
  }('morpheus', function () {
  
    var doc = document
      , win = window
      , perf = win.performance
      , perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow)
      , now = perfNow ? function () { return perfNow.call(perf) } : function () { return +new Date() }
      , html = doc.documentElement
      , thousand = 1000
      , rgbOhex = /^rgb\(|#/
      , relVal = /^([+\-])=([\d\.]+)/
      , numUnit = /^(?:[\+\-]=?)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/
      , rotate = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/
      , scale = /scale\(((?:[+\-]=)?([\d\.]+))\)/
      , skew = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/
      , translate = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/
        // these elements do not require 'px'
      , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, transform: 1}
  
    // which property name does this browser use for transform
    var transform = function () {
      var styles = doc.createElement('a').style
        , props = ['webkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'Transform']
        , i
      for (i = 0; i < props.length; i++) {
        if (props[i] in styles) return props[i]
      }
    }()
  
    // does this browser support the opacity property?
    var opasity = function () {
      return typeof doc.createElement('a').style.opacity !== 'undefined'
    }()
  
    // initial style is determined by the elements themselves
    var getStyle = doc.defaultView && doc.defaultView.getComputedStyle ?
      function (el, property) {
        property = property == 'transform' ? transform : property
        var value = null
          , computed = doc.defaultView.getComputedStyle(el, '')
        computed && (value = computed[camelize(property)])
        return el.style[property] || value
      } : html.currentStyle ?
  
      function (el, property) {
        property = camelize(property)
  
        if (property == 'opacity') {
          var val = 100
          try {
            val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity
          } catch (e1) {
            try {
              val = el.filters('alpha').opacity
            } catch (e2) {}
          }
          return val / 100
        }
        var value = el.currentStyle ? el.currentStyle[property] : null
        return el.style[property] || value
      } :
      function (el, property) {
        return el.style[camelize(property)]
      }
  
    var frame = function () {
      // native animation frames
      // http://webstuff.nfshost.com/anim-timing/Overview.html
      // http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
      return win.requestAnimationFrame  ||
        win.webkitRequestAnimationFrame ||
        win.mozRequestAnimationFrame    ||
        win.msRequestAnimationFrame     ||
        win.oRequestAnimationFrame      ||
        function (callback) {
          win.setTimeout(function () {
            callback(+new Date())
          }, 17) // when I was 17..
        }
    }()
  
    var children = []
  
    function has(array, elem, i) {
      if (Array.prototype.indexOf) return array.indexOf(elem)
      for (i = 0; i < array.length; ++i) {
        if (array[i] === elem) return i
      }
    }
  
    function render(timestamp) {
      var i, count = children.length
      // if we're using a high res timer, make sure timestamp is not the old epoch-based value.
      // http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
      if (perfNow && timestamp > 1e12) timestamp = now()
      for (i = count; i--;) {
        children[i](timestamp)
      }
      children.length && frame(render)
    }
  
    function live(f) {
      if (children.push(f) === 1) frame(render)
    }
  
    function die(f) {
      var rest, index = has(children, f)
      if (index >= 0) {
        rest = children.slice(index + 1)
        children.length = index
        children = children.concat(rest)
      }
    }
  
    function parseTransform(style, base) {
      var values = {}, m
      if (m = style.match(rotate)) values.rotate = by(m[1], base ? base.rotate : null)
      if (m = style.match(scale)) values.scale = by(m[1], base ? base.scale : null)
      if (m = style.match(skew)) {values.skewx = by(m[1], base ? base.skewx : null); values.skewy = by(m[3], base ? base.skewy : null)}
      if (m = style.match(translate)) {values.translatex = by(m[1], base ? base.translatex : null); values.translatey = by(m[3], base ? base.translatey : null)}
      return values
    }
  
    function formatTransform(v) {
      var s = ''
      if ('rotate' in v) s += 'rotate(' + v.rotate + 'deg) '
      if ('scale' in v) s += 'scale(' + v.scale + ') '
      if ('translatex' in v) s += 'translate(' + v.translatex + 'px,' + v.translatey + 'px) '
      if ('skewx' in v) s += 'skew(' + v.skewx + 'deg,' + v.skewy + 'deg)'
      return s
    }
  
    function rgb(r, g, b) {
      return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
    }
  
    // convert rgb and short hex to long hex
    function toHex(c) {
      var m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      return (m ? rgb(m[1], m[2], m[3]) : c)
        .replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3') // short skirt to long jacket
    }
  
    // change font-size => fontSize etc.
    function camelize(s) {
      return s.replace(/-(.)/g, function (m, m1) {
        return m1.toUpperCase()
      })
    }
  
    // aren't we having it?
    function fun(f) {
      return typeof f == 'function'
    }
  
    function nativeTween(t) {
      // default to a pleasant-to-the-eye easeOut (like native animations)
      return Math.sin(t * Math.PI / 2)
    }
  
    /**
      * Core tween method that requests each frame
      * @param duration: time in milliseconds. defaults to 1000
      * @param fn: tween frame callback function receiving 'position'
      * @param done {optional}: complete callback function
      * @param ease {optional}: easing method. defaults to easeOut
      * @param from {optional}: integer to start from
      * @param to {optional}: integer to end at
      * @returns method to stop the animation
      */
    function tween(duration, fn, done, ease, from, to) {
      ease = fun(ease) ? ease : morpheus.easings[ease] || nativeTween
      var time = duration || thousand
        , self = this
        , diff = to - from
        , start = now()
        , stop = 0
        , end = 0
  
      function run(t) {
        var delta = t - start
        if (delta > time || stop) {
          to = isFinite(to) ? to : 1
          stop ? end && fn(to) : fn(to)
          die(run)
          return done && done.apply(self)
        }
        // if you don't specify a 'to' you can use tween as a generic delta tweener
        // cool, eh?
        isFinite(to) ?
          fn((diff * ease(delta / time)) + from) :
          fn(ease(delta / time))
      }
  
      live(run)
  
      return {
        stop: function (jump) {
          stop = 1
          end = jump // jump to end of animation?
          if (!jump) done = null // remove callback if not jumping to end
        }
      }
    }
  
    /**
      * generic bezier method for animating x|y coordinates
      * minimum of 2 points required (start and end).
      * first point start, last point end
      * additional control points are optional (but why else would you use this anyway ;)
      * @param points: array containing control points
         [[0, 0], [100, 200], [200, 100]]
      * @param pos: current be(tween) position represented as float  0 - 1
      * @return [x, y]
      */
    function bezier(points, pos) {
      var n = points.length, r = [], i, j
      for (i = 0; i < n; ++i) {
        r[i] = [points[i][0], points[i][1]]
      }
      for (j = 1; j < n; ++j) {
        for (i = 0; i < n - j; ++i) {
          r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0]
          r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1]
        }
      }
      return [r[0][0], r[0][1]]
    }
  
    // this gets you the next hex in line according to a 'position'
    function nextColor(pos, start, finish) {
      var r = [], i, e, from, to
      for (i = 0; i < 6; i++) {
        from = Math.min(15, parseInt(start.charAt(i),  16))
        to   = Math.min(15, parseInt(finish.charAt(i), 16))
        e = Math.floor((to - from) * pos + from)
        e = e > 15 ? 15 : e < 0 ? 0 : e
        r[i] = e.toString(16)
      }
      return '#' + r.join('')
    }
  
    // this retreives the frame value within a sequence
    function getTweenVal(pos, units, begin, end, k, i, v) {
      if (k == 'transform') {
        v = {}
        for (var t in begin[i][k]) {
          v[t] = (t in end[i][k]) ? Math.round(((end[i][k][t] - begin[i][k][t]) * pos + begin[i][k][t]) * thousand) / thousand : begin[i][k][t]
        }
        return v
      } else if (typeof begin[i][k] == 'string') {
        return nextColor(pos, begin[i][k], end[i][k])
      } else {
        // round so we don't get crazy long floats
        v = Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * thousand) / thousand
        // some css properties don't require a unit (like zIndex, lineHeight, opacity)
        if (!(k in unitless)) v += units[i][k] || 'px'
        return v
      }
    }
  
    // support for relative movement via '+=n' or '-=n'
    function by(val, start, m, r, i) {
      return (m = relVal.exec(val)) ?
        (i = parseFloat(m[2])) && (start + (m[1] == '+' ? 1 : -1) * i) :
        parseFloat(val)
    }
  
    /**
      * morpheus:
      * @param element(s): HTMLElement(s)
      * @param options: mixed bag between CSS Style properties & animation options
      *  - {n} CSS properties|values
      *     - value can be strings, integers,
      *     - or callback function that receives element to be animated. method must return value to be tweened
      *     - relative animations start with += or -= followed by integer
      *  - duration: time in ms - defaults to 1000(ms)
      *  - easing: a transition method - defaults to an 'easeOut' algorithm
      *  - complete: a callback method for when all elements have finished
      *  - bezier: array of arrays containing x|y coordinates that define the bezier points. defaults to none
      *     - this may also be a function that receives element to be animated. it must return a value
      */
    function morpheus(elements, options) {
      var els = elements ? (els = isFinite(elements.length) ? elements : [elements]) : [], i
        , complete = options.complete
        , duration = options.duration
        , ease = options.easing
        , points = options.bezier
        , begin = []
        , end = []
        , units = []
        , bez = []
        , originalLeft
        , originalTop
  
      if (points) {
        // remember the original values for top|left
        originalLeft = options.left;
        originalTop = options.top;
        delete options.right;
        delete options.bottom;
        delete options.left;
        delete options.top;
      }
  
      for (i = els.length; i--;) {
  
        // record beginning and end states to calculate positions
        begin[i] = {}
        end[i] = {}
        units[i] = {}
  
        // are we 'moving'?
        if (points) {
  
          var left = getStyle(els[i], 'left')
            , top = getStyle(els[i], 'top')
            , xy = [by(fun(originalLeft) ? originalLeft(els[i]) : originalLeft || 0, parseFloat(left)),
                    by(fun(originalTop) ? originalTop(els[i]) : originalTop || 0, parseFloat(top))]
  
          bez[i] = fun(points) ? points(els[i], xy) : points
          bez[i].push(xy)
          bez[i].unshift([
            parseInt(left, 10),
            parseInt(top, 10)
          ])
        }
  
        for (var k in options) {
          switch (k) {
          case 'complete':
          case 'duration':
          case 'easing':
          case 'bezier':
            continue
          }
          var v = getStyle(els[i], k), unit
            , tmp = fun(options[k]) ? options[k](els[i]) : options[k]
          if (typeof tmp == 'string' &&
              rgbOhex.test(tmp) &&
              !rgbOhex.test(v)) {
            delete options[k]; // remove key :(
            continue; // cannot animate colors like 'orange' or 'transparent'
                      // only #xxx, #xxxxxx, rgb(n,n,n)
          }
  
          begin[i][k] = k == 'transform' ? parseTransform(v) :
            typeof tmp == 'string' && rgbOhex.test(tmp) ?
              toHex(v).slice(1) :
              parseFloat(v)
          end[i][k] = k == 'transform' ? parseTransform(tmp, begin[i][k]) :
            typeof tmp == 'string' && tmp.charAt(0) == '#' ?
              toHex(tmp).slice(1) :
              by(tmp, parseFloat(v));
          // record original unit
          (typeof tmp == 'string') && (unit = tmp.match(numUnit)) && (units[i][k] = unit[1])
        }
      }
      // ONE TWEEN TO RULE THEM ALL
      return tween.apply(els, [duration, function (pos, v, xy) {
        // normally not a fan of optimizing for() loops, but we want something
        // fast for animating
        for (i = els.length; i--;) {
          if (points) {
            xy = bezier(bez[i], pos)
            els[i].style.left = xy[0] + 'px'
            els[i].style.top = xy[1] + 'px'
          }
          for (var k in options) {
            v = getTweenVal(pos, units, begin, end, k, i)
            k == 'transform' ?
              els[i].style[transform] = formatTransform(v) :
              k == 'opacity' && !opasity ?
                (els[i].style.filter = 'alpha(opacity=' + (v * 100) + ')') :
                (els[i].style[camelize(k)] = v)
          }
        }
      }, complete, ease])
    }
  
    // expose useful methods
    morpheus.tween = tween
    morpheus.getStyle = getStyle
    morpheus.bezier = bezier
    morpheus.transform = transform
    morpheus.parseTransform = parseTransform
    morpheus.formatTransform = formatTransform
    morpheus.easings = {}
  
    return morpheus
  
  });
  

  provide("morpheus", module.exports);

  var morpheus = require('morpheus')
  !function ($) {
    $.ender({
      animate: function (options) {
        return morpheus(this, options)
      }
    , fadeIn: function (d, fn) {
        return morpheus(this, {
            duration: d
          , opacity: 1
          , complete: fn
        })
      }
    , fadeOut: function (d, fn) {
        return morpheus(this, {
            duration: d
          , opacity: 0
          , complete: fn
        })
      }
    }, true)
    $.ender({
      tween: morpheus.tween
    })
  }(ender)

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  //     Backbone.js 0.9.10
  
  //     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
  //     Backbone may be freely distributed under the MIT license.
  //     For all details and documentation:
  //     http://backbonejs.org
  
  (function(){
  
    // Initial Setup
    // -------------
  
    // Save a reference to the global object (`window` in the browser, `exports`
    // on the server).
    var root = this;
  
    // Save the previous value of the `Backbone` variable, so that it can be
    // restored later on, if `noConflict` is used.
    var previousBackbone = root.Backbone;
  
    // Create a local reference to array methods.
    var array = [];
    var push = array.push;
    var slice = array.slice;
    var splice = array.splice;
  
    // The top-level namespace. All public Backbone classes and modules will
    // be attached to this. Exported for both CommonJS and the browser.
    var Backbone;
    if (typeof exports !== 'undefined') {
      Backbone = exports;
    } else {
      Backbone = root.Backbone = {};
    }
  
    // Current version of the library. Keep in sync with `package.json`.
    Backbone.VERSION = '0.9.10';
  
    // Require Underscore, if we're on the server, and it's not already present.
    var _ = root._;
    if (!_ && (typeof require !== 'undefined')) _ = require('underscore');
  
    // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
    Backbone.$ = root.jQuery || root.Zepto || root.ender;
  
    // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
    // to its previous owner. Returns a reference to this Backbone object.
    Backbone.noConflict = function() {
      root.Backbone = previousBackbone;
      return this;
    };
  
    // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
    // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
    // set a `X-Http-Method-Override` header.
    Backbone.emulateHTTP = false;
  
    // Turn on `emulateJSON` to support legacy servers that can't deal with direct
    // `application/json` requests ... will encode the body as
    // `application/x-www-form-urlencoded` instead and will send the model in a
    // form param named `model`.
    Backbone.emulateJSON = false;
  
    // Backbone.Events
    // ---------------
  
    // Regular expression used to split event strings.
    var eventSplitter = /\s+/;
  
    // Implement fancy features of the Events API such as multiple event
    // names `"change blur"` and jQuery-style event maps `{change: action}`
    // in terms of the existing API.
    var eventsApi = function(obj, action, name, rest) {
      if (!name) return true;
      if (typeof name === 'object') {
        for (var key in name) {
          obj[action].apply(obj, [key, name[key]].concat(rest));
        }
      } else if (eventSplitter.test(name)) {
        var names = name.split(eventSplitter);
        for (var i = 0, l = names.length; i < l; i++) {
          obj[action].apply(obj, [names[i]].concat(rest));
        }
      } else {
        return true;
      }
    };
  
    // Optimized internal dispatch function for triggering events. Tries to
    // keep the usual cases speedy (most Backbone events have 3 arguments).
    var triggerEvents = function(events, args) {
      var ev, i = -1, l = events.length;
      switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx);
      return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0]);
      return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1]);
      return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);
      return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
      }
    };
  
    // A module that can be mixed in to *any object* in order to provide it with
    // custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = {};
    //     _.extend(object, Backbone.Events);
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    var Events = Backbone.Events = {
  
      // Bind one or more space separated events, or an events map,
      // to a `callback` function. Passing `"all"` will bind the callback to
      // all events fired.
      on: function(name, callback, context) {
        if (!(eventsApi(this, 'on', name, [callback, context]) && callback)) return this;
        this._events || (this._events = {});
        var list = this._events[name] || (this._events[name] = []);
        list.push({callback: callback, context: context, ctx: context || this});
        return this;
      },
  
      // Bind events to only be triggered a single time. After the first time
      // the callback is invoked, it will be removed.
      once: function(name, callback, context) {
        if (!(eventsApi(this, 'once', name, [callback, context]) && callback)) return this;
        var self = this;
        var once = _.once(function() {
          self.off(name, once);
          callback.apply(this, arguments);
        });
        once._callback = callback;
        this.on(name, once, context);
        return this;
      },
  
      // Remove one or many callbacks. If `context` is null, removes all
      // callbacks with that function. If `callback` is null, removes all
      // callbacks for the event. If `name` is null, removes all bound
      // callbacks for all events.
      off: function(name, callback, context) {
        var list, ev, events, names, i, l, j, k;
        if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
        if (!name && !callback && !context) {
          this._events = {};
          return this;
        }
  
        names = name ? [name] : _.keys(this._events);
        for (i = 0, l = names.length; i < l; i++) {
          name = names[i];
          if (list = this._events[name]) {
            events = [];
            if (callback || context) {
              for (j = 0, k = list.length; j < k; j++) {
                ev = list[j];
                if ((callback && callback !== ev.callback &&
                                 callback !== ev.callback._callback) ||
                    (context && context !== ev.context)) {
                  events.push(ev);
                }
              }
            }
            this._events[name] = events;
          }
        }
  
        return this;
      },
  
      // Trigger one or many events, firing all bound callbacks. Callbacks are
      // passed the same arguments as `trigger` is, apart from the event name
      // (unless you're listening on `"all"`, which will cause your callback to
      // receive the true name of the event as the first argument).
      trigger: function(name) {
        if (!this._events) return this;
        var args = slice.call(arguments, 1);
        if (!eventsApi(this, 'trigger', name, args)) return this;
        var events = this._events[name];
        var allEvents = this._events.all;
        if (events) triggerEvents(events, args);
        if (allEvents) triggerEvents(allEvents, arguments);
        return this;
      },
  
      // An inversion-of-control version of `on`. Tell *this* object to listen to
      // an event in another object ... keeping track of what it's listening to.
      listenTo: function(obj, name, callback) {
        var listeners = this._listeners || (this._listeners = {});
        var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
        listeners[id] = obj;
        obj.on(name, typeof name === 'object' ? this : callback, this);
        return this;
      },
  
      // Tell this object to stop listening to either specific events ... or
      // to every object it's currently listening to.
      stopListening: function(obj, name, callback) {
        var listeners = this._listeners;
        if (!listeners) return;
        if (obj) {
          obj.off(name, typeof name === 'object' ? this : callback, this);
          if (!name && !callback) delete listeners[obj._listenerId];
        } else {
          if (typeof name === 'object') callback = this;
          for (var id in listeners) {
            listeners[id].off(name, callback, this);
          }
          this._listeners = {};
        }
        return this;
      }
    };
  
    // Aliases for backwards compatibility.
    Events.bind   = Events.on;
    Events.unbind = Events.off;
  
    // Allow the `Backbone` object to serve as a global event bus, for folks who
    // want global "pubsub" in a convenient place.
    _.extend(Backbone, Events);
  
    // Backbone.Model
    // --------------
  
    // Create a new model, with defined attributes. A client id (`cid`)
    // is automatically generated and assigned for you.
    var Model = Backbone.Model = function(attributes, options) {
      var defaults;
      var attrs = attributes || {};
      this.cid = _.uniqueId('c');
      this.attributes = {};
      if (options && options.collection) this.collection = options.collection;
      if (options && options.parse) attrs = this.parse(attrs, options) || {};
      if (defaults = _.result(this, 'defaults')) {
        attrs = _.defaults({}, attrs, defaults);
      }
      this.set(attrs, options);
      this.changed = {};
      this.initialize.apply(this, arguments);
    };
  
    // Attach all inheritable methods to the Model prototype.
    _.extend(Model.prototype, Events, {
  
      // A hash of attributes whose current and previous value differ.
      changed: null,
  
      // The default name for the JSON `id` attribute is `"id"`. MongoDB and
      // CouchDB users may want to set this to `"_id"`.
      idAttribute: 'id',
  
      // Initialize is an empty function by default. Override it with your own
      // initialization logic.
      initialize: function(){},
  
      // Return a copy of the model's `attributes` object.
      toJSON: function(options) {
        return _.clone(this.attributes);
      },
  
      // Proxy `Backbone.sync` by default.
      sync: function() {
        return Backbone.sync.apply(this, arguments);
      },
  
      // Get the value of an attribute.
      get: function(attr) {
        return this.attributes[attr];
      },
  
      // Get the HTML-escaped value of an attribute.
      escape: function(attr) {
        return _.escape(this.get(attr));
      },
  
      // Returns `true` if the attribute contains a value that is not null
      // or undefined.
      has: function(attr) {
        return this.get(attr) != null;
      },
  
      // ----------------------------------------------------------------------
  
      // Set a hash of model attributes on the object, firing `"change"` unless
      // you choose to silence it.
      set: function(key, val, options) {
        var attr, attrs, unset, changes, silent, changing, prev, current;
        if (key == null) return this;
  
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (typeof key === 'object') {
          attrs = key;
          options = val;
        } else {
          (attrs = {})[key] = val;
        }
  
        options || (options = {});
  
        // Run validation.
        if (!this._validate(attrs, options)) return false;
  
        // Extract attributes and options.
        unset           = options.unset;
        silent          = options.silent;
        changes         = [];
        changing        = this._changing;
        this._changing  = true;
  
        if (!changing) {
          this._previousAttributes = _.clone(this.attributes);
          this.changed = {};
        }
        current = this.attributes, prev = this._previousAttributes;
  
        // Check for changes of `id`.
        if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];
  
        // For each `set` attribute, update or delete the current value.
        for (attr in attrs) {
          val = attrs[attr];
          if (!_.isEqual(current[attr], val)) changes.push(attr);
          if (!_.isEqual(prev[attr], val)) {
            this.changed[attr] = val;
          } else {
            delete this.changed[attr];
          }
          unset ? delete current[attr] : current[attr] = val;
        }
  
        // Trigger all relevant attribute changes.
        if (!silent) {
          if (changes.length) this._pending = true;
          for (var i = 0, l = changes.length; i < l; i++) {
            this.trigger('change:' + changes[i], this, current[changes[i]], options);
          }
        }
  
        if (changing) return this;
        if (!silent) {
          while (this._pending) {
            this._pending = false;
            this.trigger('change', this, options);
          }
        }
        this._pending = false;
        this._changing = false;
        return this;
      },
  
      // Remove an attribute from the model, firing `"change"` unless you choose
      // to silence it. `unset` is a noop if the attribute doesn't exist.
      unset: function(attr, options) {
        return this.set(attr, void 0, _.extend({}, options, {unset: true}));
      },
  
      // Clear all attributes on the model, firing `"change"` unless you choose
      // to silence it.
      clear: function(options) {
        var attrs = {};
        for (var key in this.attributes) attrs[key] = void 0;
        return this.set(attrs, _.extend({}, options, {unset: true}));
      },
  
      // Determine if the model has changed since the last `"change"` event.
      // If you specify an attribute name, determine if that attribute has changed.
      hasChanged: function(attr) {
        if (attr == null) return !_.isEmpty(this.changed);
        return _.has(this.changed, attr);
      },
  
      // Return an object containing all the attributes that have changed, or
      // false if there are no changed attributes. Useful for determining what
      // parts of a view need to be updated and/or what attributes need to be
      // persisted to the server. Unset attributes will be set to undefined.
      // You can also pass an attributes object to diff against the model,
      // determining if there *would be* a change.
      changedAttributes: function(diff) {
        if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
        var val, changed = false;
        var old = this._changing ? this._previousAttributes : this.attributes;
        for (var attr in diff) {
          if (_.isEqual(old[attr], (val = diff[attr]))) continue;
          (changed || (changed = {}))[attr] = val;
        }
        return changed;
      },
  
      // Get the previous value of an attribute, recorded at the time the last
      // `"change"` event was fired.
      previous: function(attr) {
        if (attr == null || !this._previousAttributes) return null;
        return this._previousAttributes[attr];
      },
  
      // Get all of the attributes of the model at the time of the previous
      // `"change"` event.
      previousAttributes: function() {
        return _.clone(this._previousAttributes);
      },
  
      // ---------------------------------------------------------------------
  
      // Fetch the model from the server. If the server's representation of the
      // model differs from its current attributes, they will be overriden,
      // triggering a `"change"` event.
      fetch: function(options) {
        options = options ? _.clone(options) : {};
        if (options.parse === void 0) options.parse = true;
        var success = options.success;
        options.success = function(model, resp, options) {
          if (!model.set(model.parse(resp, options), options)) return false;
          if (success) success(model, resp, options);
        };
        return this.sync('read', this, options);
      },
  
      // Set a hash of model attributes, and sync the model to the server.
      // If the server returns an attributes hash that differs, the model's
      // state will be `set` again.
      save: function(key, val, options) {
        var attrs, success, method, xhr, attributes = this.attributes;
  
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (key == null || typeof key === 'object') {
          attrs = key;
          options = val;
        } else {
          (attrs = {})[key] = val;
        }
  
        // If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
        if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return false;
  
        options = _.extend({validate: true}, options);
  
        // Do not persist invalid models.
        if (!this._validate(attrs, options)) return false;
  
        // Set temporary attributes if `{wait: true}`.
        if (attrs && options.wait) {
          this.attributes = _.extend({}, attributes, attrs);
        }
  
        // After a successful server-side save, the client is (optionally)
        // updated with the server-side state.
        if (options.parse === void 0) options.parse = true;
        success = options.success;
        options.success = function(model, resp, options) {
          // Ensure attributes are restored during synchronous saves.
          model.attributes = attributes;
          var serverAttrs = model.parse(resp, options);
          if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
          if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
            return false;
          }
          if (success) success(model, resp, options);
        };
  
        // Finish configuring and sending the Ajax request.
        method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
        if (method === 'patch') options.attrs = attrs;
        xhr = this.sync(method, this, options);
  
        // Restore attributes.
        if (attrs && options.wait) this.attributes = attributes;
  
        return xhr;
      },
  
      // Destroy this model on the server if it was already persisted.
      // Optimistically removes the model from its collection, if it has one.
      // If `wait: true` is passed, waits for the server to respond before removal.
      destroy: function(options) {
        options = options ? _.clone(options) : {};
        var model = this;
        var success = options.success;
  
        var destroy = function() {
          model.trigger('destroy', model, model.collection, options);
        };
  
        options.success = function(model, resp, options) {
          if (options.wait || model.isNew()) destroy();
          if (success) success(model, resp, options);
        };
  
        if (this.isNew()) {
          options.success(this, null, options);
          return false;
        }
  
        var xhr = this.sync('delete', this, options);
        if (!options.wait) destroy();
        return xhr;
      },
  
      // Default URL for the model's representation on the server -- if you're
      // using Backbone's restful methods, override this to change the endpoint
      // that will be called.
      url: function() {
        var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
        if (this.isNew()) return base;
        return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
      },
  
      // **parse** converts a response into the hash of attributes to be `set` on
      // the model. The default implementation is just to pass the response along.
      parse: function(resp, options) {
        return resp;
      },
  
      // Create a new model with identical attributes to this one.
      clone: function() {
        return new this.constructor(this.attributes);
      },
  
      // A model is new if it has never been saved to the server, and lacks an id.
      isNew: function() {
        return this.id == null;
      },
  
      // Check if the model is currently in a valid state.
      isValid: function(options) {
        return !this.validate || !this.validate(this.attributes, options);
      },
  
      // Run validation against the next complete set of model attributes,
      // returning `true` if all is well. Otherwise, fire a general
      // `"error"` event and call the error callback, if specified.
      _validate: function(attrs, options) {
        if (!options.validate || !this.validate) return true;
        attrs = _.extend({}, this.attributes, attrs);
        var error = this.validationError = this.validate(attrs, options) || null;
        if (!error) return true;
        this.trigger('invalid', this, error, options || {});
        return false;
      }
  
    });
  
    // Backbone.Collection
    // -------------------
  
    // Provides a standard collection class for our sets of models, ordered
    // or unordered. If a `comparator` is specified, the Collection will maintain
    // its models in sort order, as they're added and removed.
    var Collection = Backbone.Collection = function(models, options) {
      options || (options = {});
      if (options.model) this.model = options.model;
      if (options.comparator !== void 0) this.comparator = options.comparator;
      this.models = [];
      this._reset();
      this.initialize.apply(this, arguments);
      if (models) this.reset(models, _.extend({silent: true}, options));
    };
  
    // Define the Collection's inheritable methods.
    _.extend(Collection.prototype, Events, {
  
      // The default model for a collection is just a **Backbone.Model**.
      // This should be overridden in most cases.
      model: Model,
  
      // Initialize is an empty function by default. Override it with your own
      // initialization logic.
      initialize: function(){},
  
      // The JSON representation of a Collection is an array of the
      // models' attributes.
      toJSON: function(options) {
        return this.map(function(model){ return model.toJSON(options); });
      },
  
      // Proxy `Backbone.sync` by default.
      sync: function() {
        return Backbone.sync.apply(this, arguments);
      },
  
      // Add a model, or list of models to the set.
      add: function(models, options) {
        models = _.isArray(models) ? models.slice() : [models];
        options || (options = {});
        var i, l, model, attrs, existing, doSort, add, at, sort, sortAttr;
        add = [];
        at = options.at;
        sort = this.comparator && (at == null) && options.sort != false;
        sortAttr = _.isString(this.comparator) ? this.comparator : null;
  
        // Turn bare objects into model references, and prevent invalid models
        // from being added.
        for (i = 0, l = models.length; i < l; i++) {
          if (!(model = this._prepareModel(attrs = models[i], options))) {
            this.trigger('invalid', this, attrs, options);
            continue;
          }
  
          // If a duplicate is found, prevent it from being added and
          // optionally merge it into the existing model.
          if (existing = this.get(model)) {
            if (options.merge) {
              existing.set(attrs === model ? model.attributes : attrs, options);
              if (sort && !doSort && existing.hasChanged(sortAttr)) doSort = true;
            }
            continue;
          }
  
          // This is a new model, push it to the `add` list.
          add.push(model);
  
          // Listen to added models' events, and index models for lookup by
          // `id` and by `cid`.
          model.on('all', this._onModelEvent, this);
          this._byId[model.cid] = model;
          if (model.id != null) this._byId[model.id] = model;
        }
  
        // See if sorting is needed, update `length` and splice in new models.
        if (add.length) {
          if (sort) doSort = true;
          this.length += add.length;
          if (at != null) {
            splice.apply(this.models, [at, 0].concat(add));
          } else {
            push.apply(this.models, add);
          }
        }
  
        // Silently sort the collection if appropriate.
        if (doSort) this.sort({silent: true});
  
        if (options.silent) return this;
  
        // Trigger `add` events.
        for (i = 0, l = add.length; i < l; i++) {
          (model = add[i]).trigger('add', model, this, options);
        }
  
        // Trigger `sort` if the collection was sorted.
        if (doSort) this.trigger('sort', this, options);
  
        return this;
      },
  
      // Remove a model, or a list of models from the set.
      remove: function(models, options) {
        models = _.isArray(models) ? models.slice() : [models];
        options || (options = {});
        var i, l, index, model;
        for (i = 0, l = models.length; i < l; i++) {
          model = this.get(models[i]);
          if (!model) continue;
          delete this._byId[model.id];
          delete this._byId[model.cid];
          index = this.indexOf(model);
          this.models.splice(index, 1);
          this.length--;
          if (!options.silent) {
            options.index = index;
            model.trigger('remove', model, this, options);
          }
          this._removeReference(model);
        }
        return this;
      },
  
      // Add a model to the end of the collection.
      push: function(model, options) {
        model = this._prepareModel(model, options);
        this.add(model, _.extend({at: this.length}, options));
        return model;
      },
  
      // Remove a model from the end of the collection.
      pop: function(options) {
        var model = this.at(this.length - 1);
        this.remove(model, options);
        return model;
      },
  
      // Add a model to the beginning of the collection.
      unshift: function(model, options) {
        model = this._prepareModel(model, options);
        this.add(model, _.extend({at: 0}, options));
        return model;
      },
  
      // Remove a model from the beginning of the collection.
      shift: function(options) {
        var model = this.at(0);
        this.remove(model, options);
        return model;
      },
  
      // Slice out a sub-array of models from the collection.
      slice: function(begin, end) {
        return this.models.slice(begin, end);
      },
  
      // Get a model from the set by id.
      get: function(obj) {
        if (obj == null) return void 0;
        this._idAttr || (this._idAttr = this.model.prototype.idAttribute);
        return this._byId[obj.id || obj.cid || obj[this._idAttr] || obj];
      },
  
      // Get the model at the given index.
      at: function(index) {
        return this.models[index];
      },
  
      // Return models with matching attributes. Useful for simple cases of `filter`.
      where: function(attrs) {
        if (_.isEmpty(attrs)) return [];
        return this.filter(function(model) {
          for (var key in attrs) {
            if (attrs[key] !== model.get(key)) return false;
          }
          return true;
        });
      },
  
      // Force the collection to re-sort itself. You don't need to call this under
      // normal circumstances, as the set will maintain sort order as each item
      // is added.
      sort: function(options) {
        if (!this.comparator) {
          throw new Error('Cannot sort a set without a comparator');
        }
        options || (options = {});
  
        // Run sort based on type of `comparator`.
        if (_.isString(this.comparator) || this.comparator.length === 1) {
          this.models = this.sortBy(this.comparator, this);
        } else {
          this.models.sort(_.bind(this.comparator, this));
        }
  
        if (!options.silent) this.trigger('sort', this, options);
        return this;
      },
  
      // Pluck an attribute from each model in the collection.
      pluck: function(attr) {
        return _.invoke(this.models, 'get', attr);
      },
  
      // Smartly update a collection with a change set of models, adding,
      // removing, and merging as necessary.
      update: function(models, options) {
        options = _.extend({add: true, merge: true, remove: true}, options);
        if (options.parse) models = this.parse(models, options);
        var model, i, l, existing;
        var add = [], remove = [], modelMap = {};
  
        // Allow a single model (or no argument) to be passed.
        if (!_.isArray(models)) models = models ? [models] : [];
  
        // Proxy to `add` for this case, no need to iterate...
        if (options.add && !options.remove) return this.add(models, options);
  
        // Determine which models to add and merge, and which to remove.
        for (i = 0, l = models.length; i < l; i++) {
          model = models[i];
          existing = this.get(model);
          if (options.remove && existing) modelMap[existing.cid] = true;
          if ((options.add && !existing) || (options.merge && existing)) {
            add.push(model);
          }
        }
        if (options.remove) {
          for (i = 0, l = this.models.length; i < l; i++) {
            model = this.models[i];
            if (!modelMap[model.cid]) remove.push(model);
          }
        }
  
        // Remove models (if applicable) before we add and merge the rest.
        if (remove.length) this.remove(remove, options);
        if (add.length) this.add(add, options);
        return this;
      },
  
      // When you have more items than you want to add or remove individually,
      // you can reset the entire set with a new list of models, without firing
      // any `add` or `remove` events. Fires `reset` when finished.
      reset: function(models, options) {
        options || (options = {});
        if (options.parse) models = this.parse(models, options);
        for (var i = 0, l = this.models.length; i < l; i++) {
          this._removeReference(this.models[i]);
        }
        options.previousModels = this.models.slice();
        this._reset();
        if (models) this.add(models, _.extend({silent: true}, options));
        if (!options.silent) this.trigger('reset', this, options);
        return this;
      },
  
      // Fetch the default set of models for this collection, resetting the
      // collection when they arrive. If `update: true` is passed, the response
      // data will be passed through the `update` method instead of `reset`.
      fetch: function(options) {
        options = options ? _.clone(options) : {};
        if (options.parse === void 0) options.parse = true;
        var success = options.success;
        options.success = function(collection, resp, options) {
          var method = options.update ? 'update' : 'reset';
          collection[method](resp, options);
          if (success) success(collection, resp, options);
        };
        return this.sync('read', this, options);
      },
  
      // Create a new instance of a model in this collection. Add the model to the
      // collection immediately, unless `wait: true` is passed, in which case we
      // wait for the server to agree.
      create: function(model, options) {
        options = options ? _.clone(options) : {};
        if (!(model = this._prepareModel(model, options))) return false;
        if (!options.wait) this.add(model, options);
        var collection = this;
        var success = options.success;
        options.success = function(model, resp, options) {
          if (options.wait) collection.add(model, options);
          if (success) success(model, resp, options);
        };
        model.save(null, options);
        return model;
      },
  
      // **parse** converts a response into a list of models to be added to the
      // collection. The default implementation is just to pass it through.
      parse: function(resp, options) {
        return resp;
      },
  
      // Create a new collection with an identical list of models as this one.
      clone: function() {
        return new this.constructor(this.models);
      },
  
      // Reset all internal state. Called when the collection is reset.
      _reset: function() {
        this.length = 0;
        this.models.length = 0;
        this._byId  = {};
      },
  
      // Prepare a model or hash of attributes to be added to this collection.
      _prepareModel: function(attrs, options) {
        if (attrs instanceof Model) {
          if (!attrs.collection) attrs.collection = this;
          return attrs;
        }
        options || (options = {});
        options.collection = this;
        var model = new this.model(attrs, options);
        if (!model._validate(attrs, options)) return false;
        return model;
      },
  
      // Internal method to remove a model's ties to a collection.
      _removeReference: function(model) {
        if (this === model.collection) delete model.collection;
        model.off('all', this._onModelEvent, this);
      },
  
      // Internal method called every time a model in the set fires an event.
      // Sets need to update their indexes when models change ids. All other
      // events simply proxy through. "add" and "remove" events that originate
      // in other collections are ignored.
      _onModelEvent: function(event, model, collection, options) {
        if ((event === 'add' || event === 'remove') && collection !== this) return;
        if (event === 'destroy') this.remove(model, options);
        if (model && event === 'change:' + model.idAttribute) {
          delete this._byId[model.previous(model.idAttribute)];
          if (model.id != null) this._byId[model.id] = model;
        }
        this.trigger.apply(this, arguments);
      },
  
      sortedIndex: function (model, value, context) {
        value || (value = this.comparator);
        var iterator = _.isFunction(value) ? value : function(model) {
          return model.get(value);
        };
        return _.sortedIndex(this.models, model, iterator, context);
      }
  
    });
  
    // Underscore methods that we want to implement on the Collection.
    var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
      'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
      'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
      'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
      'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
      'isEmpty', 'chain'];
  
    // Mix in each Underscore method as a proxy to `Collection#models`.
    _.each(methods, function(method) {
      Collection.prototype[method] = function() {
        var args = slice.call(arguments);
        args.unshift(this.models);
        return _[method].apply(_, args);
      };
    });
  
    // Underscore methods that take a property name as an argument.
    var attributeMethods = ['groupBy', 'countBy', 'sortBy'];
  
    // Use attributes instead of properties.
    _.each(attributeMethods, function(method) {
      Collection.prototype[method] = function(value, context) {
        var iterator = _.isFunction(value) ? value : function(model) {
          return model.get(value);
        };
        return _[method](this.models, iterator, context);
      };
    });
  
    // Backbone.Router
    // ---------------
  
    // Routers map faux-URLs to actions, and fire events when routes are
    // matched. Creating a new one sets its `routes` hash, if not set statically.
    var Router = Backbone.Router = function(options) {
      options || (options = {});
      if (options.routes) this.routes = options.routes;
      this._bindRoutes();
      this.initialize.apply(this, arguments);
    };
  
    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var optionalParam = /\((.*?)\)/g;
    var namedParam    = /(\(\?)?:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
  
    // Set up all inheritable **Backbone.Router** properties and methods.
    _.extend(Router.prototype, Events, {
  
      // Initialize is an empty function by default. Override it with your own
      // initialization logic.
      initialize: function(){},
  
      // Manually bind a single named route to a callback. For example:
      //
      //     this.route('search/:query/p:num', 'search', function(query, num) {
      //       ...
      //     });
      //
      route: function(route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (!callback) callback = this[name];
        Backbone.history.route(route, _.bind(function(fragment) {
          var args = this._extractParameters(route, fragment);
          callback && callback.apply(this, args);
          this.trigger.apply(this, ['route:' + name].concat(args));
          this.trigger('route', name, args);
          Backbone.history.trigger('route', this, name, args);
        }, this));
        return this;
      },
  
      // Simple proxy to `Backbone.history` to save a fragment into the history.
      navigate: function(fragment, options) {
        Backbone.history.navigate(fragment, options);
        return this;
      },
  
      // Bind all defined routes to `Backbone.history`. We have to reverse the
      // order of the routes here to support behavior where the most general
      // routes can be defined at the bottom of the route map.
      _bindRoutes: function() {
        if (!this.routes) return;
        var route, routes = _.keys(this.routes);
        while ((route = routes.pop()) != null) {
          this.route(route, this.routes[route]);
        }
      },
  
      // Convert a route string into a regular expression, suitable for matching
      // against the current location hash.
      _routeToRegExp: function(route) {
        route = route.replace(escapeRegExp, '\\$&')
                     .replace(optionalParam, '(?:$1)?')
                     .replace(namedParam, function(match, optional){
                       return optional ? match : '([^\/]+)';
                     })
                     .replace(splatParam, '(.*?)');
        return new RegExp('^' + route + '$');
      },
  
      // Given a route, and a URL fragment that it matches, return the array of
      // extracted parameters.
      _extractParameters: function(route, fragment) {
        return route.exec(fragment).slice(1);
      }
  
    });
  
    // Backbone.History
    // ----------------
  
    // Handles cross-browser history management, based on URL fragments. If the
    // browser does not support `onhashchange`, falls back to polling.
    var History = Backbone.History = function() {
      this.handlers = [];
      _.bindAll(this, 'checkUrl');
  
      // Ensure that `History` can be used outside of the browser.
      if (typeof window !== 'undefined') {
        this.location = window.location;
        this.history = window.history;
      }
    };
  
    // Cached regex for stripping a leading hash/slash and trailing space.
    var routeStripper = /^[#\/]|\s+$/g;
  
    // Cached regex for stripping leading and trailing slashes.
    var rootStripper = /^\/+|\/+$/g;
  
    // Cached regex for detecting MSIE.
    var isExplorer = /msie [\w.]+/;
  
    // Cached regex for removing a trailing slash.
    var trailingSlash = /\/$/;
  
    // Has the history handling already been started?
    History.started = false;
  
    // Set up all inheritable **Backbone.History** properties and methods.
    _.extend(History.prototype, Events, {
  
      // The default interval to poll for hash changes, if necessary, is
      // twenty times a second.
      interval: 50,
  
      // Gets the true hash value. Cannot use location.hash directly due to bug
      // in Firefox where location.hash will always be decoded.
      getHash: function(window) {
        var match = (window || this).location.href.match(/#(.*)$/);
        return match ? match[1] : '';
      },
  
      // Get the cross-browser normalized URL fragment, either from the URL,
      // the hash, or the override.
      getFragment: function(fragment, forcePushState) {
        if (fragment == null) {
          if (this._hasPushState || !this._wantsHashChange || forcePushState) {
            fragment = this.location.pathname;
            var root = this.root.replace(trailingSlash, '');
            if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
          } else {
            fragment = this.getHash();
          }
        }
        return fragment.replace(routeStripper, '');
      },
  
      // Start the hash change handling, returning `true` if the current URL matches
      // an existing route, and `false` otherwise.
      start: function(options) {
        if (History.started) throw new Error("Backbone.history has already been started");
        History.started = true;
  
        // Figure out the initial configuration. Do we need an iframe?
        // Is pushState desired ... is it available?
        this.options          = _.extend({}, {root: '/'}, this.options, options);
        this.root             = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        this._wantsPushState  = !!this.options.pushState;
        this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
        var fragment          = this.getFragment();
        var docMode           = document.documentMode;
        var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
  
        // Normalize root to always include a leading and trailing slash.
        this.root = ('/' + this.root + '/').replace(rootStripper, '/');
  
        if (oldIE && this._wantsHashChange) {
          this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
          this.navigate(fragment);
        }
  
        // Depending on whether we're using pushState or hashes, and whether
        // 'onhashchange' is supported, determine how we check the URL state.
        if (this._hasPushState) {
          Backbone.$(window).on('popstate', this.checkUrl);
        } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
          Backbone.$(window).on('hashchange', this.checkUrl);
        } else if (this._wantsHashChange) {
          this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }
  
        // Determine if we need to change the base url, for a pushState link
        // opened by a non-pushState browser.
        this.fragment = fragment;
        var loc = this.location;
        var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;
  
        // If we've started off with a route from a `pushState`-enabled browser,
        // but we're currently in a browser that doesn't support it...
        if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + this.location.search + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;
  
        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
        }
  
        if (!this.options.silent) return this.loadUrl();
      },
  
      // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
      // but possibly useful for unit testing Routers.
      stop: function() {
        Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
        clearInterval(this._checkUrlInterval);
        History.started = false;
      },
  
      // Add a route to be tested when the fragment changes. Routes added later
      // may override previous routes.
      route: function(route, callback) {
        this.handlers.unshift({route: route, callback: callback});
      },
  
      // Checks the current URL to see if it has changed, and if it has,
      // calls `loadUrl`, normalizing across the hidden iframe.
      checkUrl: function(e) {
        var current = this.getFragment();
        if (current === this.fragment && this.iframe) {
          current = this.getFragment(this.getHash(this.iframe));
        }
        if (current === this.fragment) return false;
        if (this.iframe) this.navigate(current);
        this.loadUrl() || this.loadUrl(this.getHash());
      },
  
      // Attempt to load the current URL fragment. If a route succeeds with a
      // match, returns `true`. If no defined routes matches the fragment,
      // returns `false`.
      loadUrl: function(fragmentOverride) {
        var fragment = this.fragment = this.getFragment(fragmentOverride);
        var matched = _.any(this.handlers, function(handler) {
          if (handler.route.test(fragment)) {
            handler.callback(fragment);
            return true;
          }
        });
        return matched;
      },
  
      // Save a fragment into the hash history, or replace the URL state if the
      // 'replace' option is passed. You are responsible for properly URL-encoding
      // the fragment in advance.
      //
      // The options object can contain `trigger: true` if you wish to have the
      // route callback be fired (not usually desirable), or `replace: true`, if
      // you wish to modify the current URL without adding an entry to the history.
      navigate: function(fragment, options) {
        if (!History.started) return false;
        if (!options || options === true) options = {trigger: options};
        fragment = this.getFragment(fragment || '');
        if (this.fragment === fragment) return;
        this.fragment = fragment;
        var url = this.root + fragment;
  
        // If pushState is available, we use it to set the fragment as a real URL.
        if (this._hasPushState) {
          this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
  
        // If hash changes haven't been explicitly disabled, update the hash
        // fragment to store history.
        } else if (this._wantsHashChange) {
          this._updateHash(this.location, fragment, options.replace);
          if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
            // Opening and closing the iframe tricks IE7 and earlier to push a
            // history entry on hash-tag change.  When replace is true, we don't
            // want this.
            if(!options.replace) this.iframe.document.open().close();
            this._updateHash(this.iframe.location, fragment, options.replace);
          }
  
        // If you've told us that you explicitly don't want fallback hashchange-
        // based history, then `navigate` becomes a page refresh.
        } else {
          return this.location.assign(url);
        }
        if (options.trigger) this.loadUrl(fragment);
      },
  
      // Update the hash location, either replacing the current entry, or adding
      // a new one to the browser history.
      _updateHash: function(location, fragment, replace) {
        if (replace) {
          var href = location.href.replace(/(javascript:|#).*$/, '');
          location.replace(href + '#' + fragment);
        } else {
          // Some browsers require that `hash` contains a leading #.
          location.hash = '#' + fragment;
        }
      }
  
    });
  
    // Create the default Backbone.history.
    Backbone.history = new History;
  
    // Backbone.View
    // -------------
  
    // Creating a Backbone.View creates its initial element outside of the DOM,
    // if an existing element is not provided...
    var View = Backbone.View = function(options) {
      this.cid = _.uniqueId('view');
      this._configure(options || {});
      this._ensureElement();
      this.initialize.apply(this, arguments);
      this.delegateEvents();
    };
  
    // Cached regex to split keys for `delegate`.
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
  
    // List of view options to be merged as properties.
    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
  
    // Set up all inheritable **Backbone.View** properties and methods.
    _.extend(View.prototype, Events, {
  
      // The default `tagName` of a View's element is `"div"`.
      tagName: 'div',
  
      // jQuery delegate for element lookup, scoped to DOM elements within the
      // current view. This should be prefered to global lookups where possible.
      $: function(selector) {
        return this.$el.find(selector);
      },
  
      // Initialize is an empty function by default. Override it with your own
      // initialization logic.
      initialize: function(){},
  
      // **render** is the core function that your view should override, in order
      // to populate its element (`this.el`), with the appropriate HTML. The
      // convention is for **render** to always return `this`.
      render: function() {
        return this;
      },
  
      // Remove this view by taking the element out of the DOM, and removing any
      // applicable Backbone.Events listeners.
      remove: function() {
        this.$el.remove();
        this.stopListening();
        return this;
      },
  
      // Change the view's element (`this.el` property), including event
      // re-delegation.
      setElement: function(element, delegate) {
        if (this.$el) this.undelegateEvents();
        this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
        this.el = this.$el[0];
        if (delegate !== false) this.delegateEvents();
        return this;
      },
  
      // Set callbacks, where `this.events` is a hash of
      //
      // *{"event selector": "callback"}*
      //
      //     {
      //       'mousedown .title':  'edit',
      //       'click .button':     'save'
      //       'click .open':       function(e) { ... }
      //     }
      //
      // pairs. Callbacks will be bound to the view, with `this` set properly.
      // Uses event delegation for efficiency.
      // Omitting the selector binds the event to `this.el`.
      // This only works for delegate-able events: not `focus`, `blur`, and
      // not `change`, `submit`, and `reset` in Internet Explorer.
      delegateEvents: function(events) {
        if (!(events || (events = _.result(this, 'events')))) return;
        this.undelegateEvents();
        for (var key in events) {
          var method = events[key];
          if (!_.isFunction(method)) method = this[events[key]];
          if (!method) throw new Error('Method "' + events[key] + '" does not exist');
          var match = key.match(delegateEventSplitter);
          var eventName = match[1], selector = match[2];
          method = _.bind(method, this);
          eventName += '.delegateEvents' + this.cid;
          if (selector === '') {
            this.$el.on(eventName, method);
          } else {
            this.$el.on(eventName, selector, method);
          }
        }
      },
  
      // Clears all callbacks previously bound to the view with `delegateEvents`.
      // You usually don't need to use this, but may wish to if you have multiple
      // Backbone views attached to the same DOM element.
      undelegateEvents: function() {
        this.$el.off('.delegateEvents' + this.cid);
      },
  
      // Performs the initial configuration of a View with a set of options.
      // Keys with special meaning *(model, collection, id, className)*, are
      // attached directly to the view.
      _configure: function(options) {
        if (this.options) options = _.extend({}, _.result(this, 'options'), options);
        _.extend(this, _.pick(options, viewOptions));
        this.options = options;
      },
  
      // Ensure that the View has a DOM element to render into.
      // If `this.el` is a string, pass it through `$()`, take the first
      // matching element, and re-assign it to `el`. Otherwise, create
      // an element from the `id`, `className` and `tagName` properties.
      _ensureElement: function() {
        if (!this.el) {
          var attrs = _.extend({}, _.result(this, 'attributes'));
          if (this.id) attrs.id = _.result(this, 'id');
          if (this.className) attrs['class'] = _.result(this, 'className');
          var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
          this.setElement($el, false);
        } else {
          this.setElement(_.result(this, 'el'), false);
        }
      }
  
    });
  
    // Backbone.sync
    // -------------
  
    // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
    var methodMap = {
      'create': 'POST',
      'update': 'PUT',
      'patch':  'PATCH',
      'delete': 'DELETE',
      'read':   'GET'
    };
  
    // Override this function to change the manner in which Backbone persists
    // models to the server. You will be passed the type of request, and the
    // model in question. By default, makes a RESTful Ajax request
    // to the model's `url()`. Some possible customizations could be:
    //
    // * Use `setTimeout` to batch rapid-fire updates into a single request.
    // * Send up the models as XML instead of JSON.
    // * Persist models via WebSockets instead of Ajax.
    //
    // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
    // as `POST`, with a `_method` parameter containing the true HTTP method,
    // as well as all requests with the body as `application/x-www-form-urlencoded`
    // instead of `application/json` with the model in a param named `model`.
    // Useful when interfacing with server-side languages like **PHP** that make
    // it difficult to read the body of `PUT` requests.
    Backbone.sync = function(method, model, options) {
      var type = methodMap[method];
  
      // Default options, unless specified.
      _.defaults(options || (options = {}), {
        emulateHTTP: Backbone.emulateHTTP,
        emulateJSON: Backbone.emulateJSON
      });
  
      // Default JSON-request options.
      var params = {type: type, dataType: 'json'};
  
      // Ensure that we have a URL.
      if (!options.url) {
        params.url = _.result(model, 'url') || urlError();
      }
  
      // Ensure that we have the appropriate request data.
      if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
        params.contentType = 'application/json';
        params.data = JSON.stringify(options.attrs || model.toJSON(options));
      }
  
      // For older servers, emulate JSON by encoding the request into an HTML-form.
      if (options.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.data = params.data ? {model: params.data} : {};
      }
  
      // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
      // And an `X-HTTP-Method-Override` header.
      if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
        params.type = 'POST';
        if (options.emulateJSON) params.data._method = type;
        var beforeSend = options.beforeSend;
        options.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
          if (beforeSend) return beforeSend.apply(this, arguments);
        };
      }
  
      // Don't process data on a non-GET request.
      if (params.type !== 'GET' && !options.emulateJSON) {
        params.processData = false;
      }
  
      var success = options.success;
      options.success = function(resp) {
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
  
      var error = options.error;
      options.error = function(xhr) {
        if (error) error(model, xhr, options);
        model.trigger('error', model, xhr, options);
      };
  
      // Make the request, allowing the user to override any Ajax options.
      var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
      model.trigger('request', model, xhr, options);
      return xhr;
    };
  
    // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
    Backbone.ajax = function() {
      return Backbone.$.ajax.apply(Backbone.$, arguments);
    };
  
    // Helpers
    // -------
  
    // Helper function to correctly set up the prototype chain, for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    var extend = function(protoProps, staticProps) {
      var parent = this;
      var child;
  
      // The constructor function for the new subclass is either defined by you
      // (the "constructor" property in your `extend` definition), or defaulted
      // by us to simply call the parent's constructor.
      if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
      } else {
        child = function(){ return parent.apply(this, arguments); };
      }
  
      // Add static properties to the constructor function, if supplied.
      _.extend(child, parent, staticProps);
  
      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function.
      var Surrogate = function(){ this.constructor = child; };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate;
  
      // Add prototype properties (instance properties) to the subclass,
      // if supplied.
      if (protoProps) _.extend(child.prototype, protoProps);
  
      // Set a convenience property in case the parent's prototype is needed
      // later.
      child.__super__ = parent.prototype;
  
      return child;
    };
  
    // Set up inheritance for the model, collection, router, view and history.
    Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
  
    // Throw an error when a URL is needed, and none is supplied.
    var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    };
  
  }).call(this);
  

  provide("backbone", module.exports);

  $.ender(module.exports);

}());



(function () {

  var module = { exports: {} }, exports = module.exports;

  /*! pajamas - v1.3.5 - 2013-01-11
  * http://documentup.com/geowa4/pajamas
  * Copyright (c) 2013 George Adams IV (http://gada.ms); Licensed MIT */
  
  !(function (factory) {
    if (typeof module !== 'undefined' && typeof module.exports === 'object')
      module.exports = factory(require('q'))
    else if (typeof define === 'function' && define.amd) define(['q'], factory)
    else this['pj'] = factory(this['Q'])
  } (function (Q) {
    var win = window
      , doc = document
      , rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
      , readyState = 'readyState'
      , xmlHttpRequest = 'XMLHttpRequest'
      , xhr = win[xmlHttpRequest] ?
          function () { return new win[xmlHttpRequest]() } :
          function () { return new win.ActiveXObject('Microsoft.XMLHTTP') }
      , contentType = 'Content-Type'
      , requestedWith = 'X-Requested-With'
      , defaultHeaders = {
          contentType : 'application/x-www-form-urlencoded; charset=UTF-8'
        , Accept      : {
            '*'    : 'text/javascript, text/html, application/xml,' +
                     ' text/xml, */*'
          , xml    : 'application/xml, text/xml'
          , html   : 'text/html'
          , text   : 'text/plain'
          , json   : 'application/json, text/javascript'
          , script : 'text/javascript, application/javascript,' +
                       ' application/ecmascript, application/x-ecmascript'
          }
        , requestedWith: xmlHttpRequest
        }
  
      , isArray = Array.isArray || function (obj) {
          return obj instanceof Array
        }
  
      , isFunction = typeof (/-/) !== 'function' ? function (obj) {
          return typeof obj === 'function'
        } : function (obj) {
          return Object.prototype.toString.call(obj) === '[object Function]'
        }
  
      , isNumeric = function (n) {
          return !isNaN(parseFloat(n)) && isFinite(n)
        }
  
      , clone = function (o) {
          var copy = {}
            , prop
  
          for (prop in o) {
            if (o.hasOwnProperty(prop)) copy[prop] = o[prop];
          }
  
          return copy
        }
  
      , inferDataType = function (url) {
          var extension = url.substr(url.lastIndexOf('.') + 1)
  
          if (extension === url) return 'json'
          else if (extension === 'js') return 'script'
          else if (extension === 'txt') return 'text'
          else return extension
        }
  
      , urlAppend = function (url, dataString) {
          if (typeof dataString !== 'string') return url
          return url + (url.indexOf('?') !== -1 ? '&' : '?') + dataString
        }
  
      , setHeaders = function (http, options) {
          var headers = options.headers || {}
            , accept = 'Accept'
            , h
  
          headers[accept] = headers[accept] ||
            defaultHeaders[accept][options.dataType] ||
            defaultHeaders[accept]['*']
  
          if (!options.crossDomain && !headers[requestedWith])
            headers[requestedWith] = defaultHeaders.requestedWith
          if (!headers[contentType])
            headers[contentType] = options.contentType ||
              defaultHeaders.contentType
          for (h in headers)
            if (headers.hasOwnProperty(h)) http.setRequestHeader(h, headers[h])
        }
  
      , defaultParser = function (deferred) {
          deferred.resolve(this)
        }
  
      , responseParsers = {
          json   : function (deferred) {
            var r = this.responseText
  
            try {
              r = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
              deferred.resolve(r)
            } catch (err) {
              deferred.reject(new Error('Could not parse JSON in response.'))
            }
          }
        , script : function (deferred) {
            try {
              deferred.resolve(eval(this.responseText))
            } catch (err) {
              deferred.reject(err)
            }
          }
        , text   : function (deferred) {
            deferred.resolve(String(this.responseText))
          }
        , html   : function (deferred) {
            deferred.resolve(this.responseText)
          }
        , xml    : function (deferred) {
            var r = this.responseXML
            // Chrome makes `responseXML` null;
            // IE makes `documentElement` null;
            // FF makes up an element;
            // this is my attempt at standardization
            if (r === null || r.documentElement === null ||
                r.documentElement.nodeName === 'parsererror')
              deferred.resolve(null)
            else deferred.resolve(r)
          }
        }
  
      , isCrossDomain = function (url, defaultUrl) {
          var parts = rurl.exec(url)
            , defaultParts = rurl.exec(defaultUrl)
          return !!(parts &&
            (parts[1] !== defaultParts[1] || parts[2] !== defaultParts[2] ||
              (parts[3] || (parts[1] === 'http:' ? 80 : 443)) !==
                (defaultParts[3] || (defaultParts[1] === 'http:' ? 80 : 443 ))))
        }
  
      , sendLocal = function (o, deferred) {
          var http = isFunction(o.xhr) ? o.xhr() : xhr()
            , timeoutVal
            , send = function () {
                try {
                  http.send(o.data)
                } catch (err) {
                  deferred.reject(err)
                }
              }
  
          http.open(o.type, o.url, true)
          setHeaders(http, o)
  
          http.onreadystatechange = function () {
            var status
              , err
  
            timeoutVal && clearTimeout(timeoutVal)
  
            if (http && http[readyState] === 4) {
              status = http.status
              if (status >= 200 && status < 300 ||
                  status === 304 ||
                  status === 0 && http.responseText !== '') {
                if (http.responseText)
                  (responseParsers[o.dataType] || defaultParser)
                    .call(http, deferred)
                else
                  deferred.resolve(null)
              }
              else {
                err = new Error(o.type + ' ' + o.url + ': ' + http.status + ' ' +
                  http.statusText)
                err.type = o.type
                err.url = o.url
                err.status = http.status
                err.statusText = http.statusText
                deferred.reject(err)
              }
            }
          }
  
          if (isNumeric(o.timeout)) {
            timeoutVal = setTimeout(function() {
              http.abort()
              deferred.reject(new Error('timeout'))
            }, o.timeout)
          }
  
          isNumeric(o.delay) ?
            setTimeout(function () {
              send()
            }, o.delay) :
            send()
        }
  
      , sendRemote = function (o, deferred) {
          var head = document.head || document.getElementsByTagName('head')[0] ||
              document.documentElement
            , script = document.createElement('script')
            , callbackName
            , callback
            , timeoutVal
            , send = function () {
                script && head.appendChild(script)
              }
  
          script.async = 'async'
          if (o.dataType === 'jsonp') {
            callbackName =  o.jsonp || 'pajamas' +
              (Date.now || function () { return (new Date()).getTime() }).call()
            callback = function (data) {
              window[callbackName] = undefined
              try {
                delete window[callbackName]
              } catch (e) {}
              deferred.resolve(data)
            }
            window[callbackName] = callback
            o.url += (o.url.indexOf('?') > -1 ? '&' : '?') +
              (o.jsonp || 'callback') + '=' + callbackName
            script.src = o.url
          }
          else {
            script.src = o.url
          }
  
          script.onload = script.onreadystatechange = function(_, isAbort) {
            if (isAbort || !script.readyState ||
              /loaded|complete/.test(script.readyState)) {
              script.onload = script.onreadystatechange = null;
              if (head && script.parentNode) {
                head.removeChild(script)
              }
              script = undefined
              timeoutVal && clearTimeout(timeoutVal)
  
              if (!isAbort) {
                if (o.dataType !== 'jsonp') deferred.resolve()
              }
              else {
                deferred.reject(new Error(o.url + ' aborted'))
              }
            }
          }
  
          if (isNumeric(o.timeout)) {
            timeoutVal = setTimeout(function() {
              script.onload(0, 1)
              deferred.reject(new Error('timeout'))
            }, o.timeout)
          }
  
          isNumeric(o.delay) ?
            setTimeout(function () {
              send()
            }, o.delay) :
            send()
        }
      , pajamas = function (options) {
          var deferred = Q.defer()
            , promise = deferred.promise
            , o = options == null ? {} : clone(options)
            , defaultUrl = (function () {
                var anchor
                try {
                  return location.href
                } catch (e) {
                  anchor = doc.createElement('a')
                  anchor.href = ''
                  return anchor.href
                }
              } ())
          
          o.type = o.type ? o.type.toUpperCase() : 'GET'
          o.url || (o.url = defaultUrl)
          o.data = (o.data && o.processData !== false &&
              typeof o.data !== 'string') ?
            pajamas.param(o.data) :
            (o.data || null)
          o.dataType || (o.dataType = inferDataType(o.url))
          o.crossDomain || (o.crossDomain = isCrossDomain(o.url, defaultUrl))
          
          if (o.data && typeof o.data === 'string' && o.type === 'GET') {
            o.url = urlAppend(o.url, o.data)
            o.data = null
          }
          
          if (!o.crossDomain && o.dataType !== 'jsonp') sendLocal(o, deferred)
          else sendRemote(o, deferred)
  
          return promise
          .then(function (value) {
              var ret = o.success && o.success(value)
              return ret || value
            }
          , function (reason) {
              var ret
              // retry as many times as desired
              if (isNumeric(o.retry) && o.retry > 0) {
                o.retry--
                return pajamas(o)
              }
              else if (o.retry === Object(o.retry)) {
                return pajamas(o.retry)
              }
              ret = o.error && o.error(reason)
              if (ret) return ret
              // throw reason if o.error didn't throw or return
              throw reason
            })
        }
  
    pajamas.param = function (data) {
      var prefix
        , queryStringBuilder = []
  
        , push = function(key, value) {
            var enc = encodeURIComponent
  
            value = isFunction(value) ?
              value() :
              (value == null ? '' : value)
            queryStringBuilder.push(enc(key) + '=' + enc(value))
          }
  
        , buildParams = function (prefix, obj) {
            var name
              , i
              , v
  
            if (isArray(obj)) {
              for (i = 0; i < obj.length; i++) {
                v = obj[i]
                if (/\[\]$/.test(prefix)) {
                  push(prefix, v)
                }
                else {
                  buildParams(
                    prefix + '[' + (typeof v === 'object' ? i : '') + ']'
                  , v)
                }
              }
            }
            else if (obj && typeof obj === 'object') {
              for (name in obj) {
                if (obj.hasOwnProperty(name))
                  buildParams(prefix + '[' + name + ']', obj[name])
              }
            }
            else push(prefix, obj)
          }
  
      if (isArray(data)) { // assume output from serializeArray
        for (prefix = 0; prefix < data.length; prefix++) {
          push(data[prefix].name, data[prefix].value)
        }
      }
      else {
        for (prefix in data) {
          if (data.hasOwnProperty(prefix))
            buildParams(prefix, data[prefix])
        }
      }
  
      return queryStringBuilder.join('&').replace(/%20/g, '+')
    }
  
    pajamas.val = function (el) {
      var v
  
      if (el.nodeName.toLowerCase() === 'select') {
        v = (function () {
          var v
            , vals = []
            , selectedIndex = el.selectedIndex
            , opt
            , options = el.options
            , isSingleSelect = el.type === 'select-one'
            , i
            , max
  
          if (selectedIndex < 0) return null
  
          i = isSingleSelect ? selectedIndex : 0;
          max = isSingleSelect ? selectedIndex + 1 : options.length;
          for (; i < max; i++) {
            opt = options[i]
  
            if (opt.selected && !opt.disabled &&
                (!opt.parentNode.disabled ||
                  opt.parentNode.nodeName.toLowerCase() !== 'optgroup')) {
              v = pajamas.val(opt)
  
              if (isSingleSelect) return v
              vals.push(v)
            }
          }
  
          return vals
        } ())
      }
      else if (el.nodeName.toLowerCase() === 'option') {
        v = el.attributes.value;
        return !v || v.specified ? el.value : el.text;
      }
      else if (el.type === 'button' ||
          el.nodeName.toLowerCase() === 'button') {
        v = el.getAttributeNode('value')
        return v ? v.value : undefined
      }
      else if (el.type === 'radio' || el.type === 'checkbox') {
        return el.getAttribute('value') === null ? 'on' : el.value
      }
      else {
        v = el.value;
      }
  
      return typeof v === 'string' ?
        v.replace(/\r/g, '') :
        v == null ? '' : v;
    }
  
    pajamas.serializeArray = function () {
      var arr = []
        , i
        , el
        , crlf = /\r?\n/g
        , checkableType = /radio|checkbox/i
        , pushAll = function (elems) {
            var el
              , v
              , i
              , j
            for (i = 0; i < elems.length; i++) {
              el = elems[i]
              if (el.name && !el.disabled &&
                  (checkableType.test(el.type) ? el.checked : true)) {
                v = pajamas.val(el)
                if (v != null) {
                  if (isArray(v)) { // from multiple select, for instance
                    for (j = 0; j < v.length; j++) {
                      arr.push({
                          name  : el.name
                        , value : v[j].replace(crlf, '\r\n')
                      })
                    }
                  }
                  else {
                    arr.push({
                        name  : el.name
                      , value : v.replace(crlf, '\r\n')
                    })
                  }
                }
              }
            }
          }
      for (i = 0; i < arguments.length; i++) {
        el = arguments[i]
        el.elements ? pushAll(el.elements) : pushAll([el])
      }
      return arr
    }
    pajamas.serialize = function (){
      return pajamas.param(pajamas.serializeArray.apply(null, arguments))
    }
  
    return pajamas
  }));

  provide("pajamas", module.exports);

  !(function ($) {
    var pj = require('pajamas')
      , integrate = function(method) {
          return function() {
            var args = []
              , i = (this && this.length) || 0
            while (i--) args.unshift(this[i])
            return pj[method].apply(null, args)
          }
        }
      , s = integrate('serialize')
      , sa = integrate('serializeArray')
      , v = integrate('val')
  
    $.ender({
        ajax  : pj
      , param : pj.param
    })
  
    $.ender({
        serialize      : s
      , serializeArray : sa
      , val            : v
    }, true)
  } (ender))
  

}());