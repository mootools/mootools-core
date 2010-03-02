/*
---
name: Slick.Parser
provides: Slick.Parser
description: Standalone CSS3 Selector parser

license: MIT-style

authors:
- Thomas Aylott
- Valerio Proietti
- Fabio M Costa
- Jan Kassens
...
*/

(function(){
	
var exports = this;
	
var parsed,
	separatorIndex,
	combinatorIndex,
	partIndex,
	reversed,
	cache = {},
	reverseCache = {};

var parse = function(expression, isReversed){
	expression = '' + expression;
	reversed = !!isReversed;
	var currentCache = (reversed) ? reverseCache : cache;
	if (currentCache[expression]) return currentCache[expression];
	var exp = expression.replace(/^\s+|\s+$/g, '');
	parsed = {Slick: true, simple: true, type: [], expressions: [], raw: expression, reverse: function(){
		return parse(this.raw, true);
	}};
	separatorIndex = -1;
	while (exp != (exp = exp.replace(regexp, parser)));
	parsed.length = parsed.expressions.length;
	parsed.type = parsed.type.join(':');
	return currentCache[expression] = (reversed) ? reverse(parsed) : parsed;
};

var reverseCombinator = function(combinator){
	if (combinator === '!') return ' ';
	else if (combinator === ' ') return '!';
	else if ((/^!/).test(combinator)) return combinator.replace(/^(!)/, '');
	else return '!' + combinator;
};

var reverse = function(expression){
	var expressions = expression.expressions;
	for (var i = 0; i < expressions.length; i++){
		var exp = expressions[i];
		var last = {parts: [], tag: '*', combinator: reverseCombinator(exp[0].combinator)};
		
		for (var j = 0; j < exp.length; j++){
			var cexp = exp[j];
			if (!cexp.reverseCombinator) cexp.reverseCombinator = ' ';
			cexp.combinator = cexp.reverseCombinator;
			delete cexp.reverseCombinator;
		}
		
		exp.reverse().push(last);
	}
	return expression;
};

var escapeRegExp = function(string){// Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
	return string.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&");
};

var regexp = new RegExp(
/*
#!/usr/bin/env ruby
puts "\t\t" + DATA.read.gsub(/\(\?x\)|\s+#.*$|\s+|\\$|\\n/,'')
__END__
	"(?x)^(?:\
	  \\s* ( , ) \\s*               # Separator          \n\
	| \\s* ( <combinator>+ ) \\s*   # Combinator         \n\
	|      ( \\s+ )                 # CombinatorChildren \n\
	|      ( <unicode>+ | \\* )     # Tag                \n\
	| \\#  ( <unicode>+       )     # ID                 \n\
	| \\.  ( <unicode>+       )     # ClassName          \n\
	|                               # Attribute          \n\
	\\[  \
		\\s* (<unicode1>+)  (?:  \
			\\s* ([*^$!~|]?=)  (?:  \
				\\s* (?:\
				      \"((?:[^\"]|\\\\\")*)\"\
				    |  '((?:[^'] |\\\\')* )' \
				    |   (   [^\\]]*?    )  \
				)\
			)  \
		)?  \\s*  \
	\\](?!\\]) \n\
	|   :+ ( <unicode>+ )(?:\
	\\( (?:\
		 \"((?:[^\"]|\\\")*)\"\
		| '((?:[^']|\\'  )*)'\
		|  (   [^\\)]*     )\
	) \\)\
	)?\
	)"
//*/
	"^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:\"((?:[^\"]|\\\\\")*)\"|'((?:[^']|\\\\')*)'|([^\\]]*?))))?\\s*\\](?!\\])|:+(<unicode>+)(?:\\((?:\"((?:[^\"]|\\\")*)\"|'((?:[^']|\\')*)'|([^\\)]*))\\))?)"//*/
	// .replace(/\(\?x\)|\s+#.*$|\s+/gim, '')
	.replace(/<combinator>/, '[' + escapeRegExp(">+~`!@$%^&={}\\;</") + ']')
	.replace(/<unicode>/g, '(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
	.replace(/<unicode1>/g, '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
);

var qsaCombinators = (/^[\s~+>]$/);

var simpleAttributeOperators = (/^[*^$~|]?=$/);

function parser(
	rawMatch,
	
	separator,
	combinator,
	combinatorChildren,
	
	tagName,
	id,
	className,
	
	attributeKey,
	attributeOperator,
	attributeValueDouble,
	attributeValueSingle,
	attributeValue,
	
	pseudoClass,
	pseudoClassValueDouble,
	pseudoClassValueSingle,
	pseudoClassValue
){
	if (separator || separatorIndex === -1){
		parsed.expressions[++separatorIndex] = [];
		combinatorIndex = -1;
		if (separator){
			parsed.type.push('separator');
			return '';
		}
	}
	
	if (combinator || combinatorChildren || combinatorIndex === -1){
		combinator = combinator || ' ';
		if (parsed.simple && !qsaCombinators.test(combinator)) parsed.simple = false;
		var currentSeparator = parsed.expressions[separatorIndex];
		if (reversed && currentSeparator[combinatorIndex])
			currentSeparator[combinatorIndex].reverseCombinator = reverseCombinator(combinator);
		currentSeparator[++combinatorIndex] = {combinator: combinator, tag: '*', parts: []};
		partIndex = 0;
	}
	
	var currentParsed = parsed.expressions[separatorIndex][combinatorIndex];

	if (tagName){
		// if (tagName == '*') parsed.type.push('tagName*');
		// else parsed.type.push('tagName');
		parsed.type.push('tag');
		
		currentParsed.tag = tagName.replace(/\\/g,'');
		return '';
	} else if (id){
		parsed.type.push('id');
		currentParsed.id = id.replace(/\\/g,'');
		return '';
	} else if (className){
		if ((/classNames?/).test(parsed.type[parsed.type.length - 1]))
			parsed.type[parsed.type.length - 1] = 'classNames';
		else parsed.type.push('class');
		
		className = className.replace(/\\/g,'');
	
		if (!currentParsed.classes) currentParsed.classes = [className];
		else currentParsed.classes.push(className);
	
		currentParsed.parts[partIndex] = {
			type: 'class',
			value: className,
			regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
		};
	} else if (pseudoClass){
		parsed.type.push('pseudo');
		// TODO: pseudoClass is only not simple when it's custom or buggy
		// if (pseudoBuggyOrCustom[pseudoClass])
		// parsed.simple = false;
	
		if (!currentParsed.pseudos) currentParsed.pseudos = [];
		
		var value = pseudoClassValueDouble || pseudoClassValueSingle || pseudoClassValue || null;
		if (value) value = value.replace(/\\/g,'');
		
		currentParsed.pseudos.push(currentParsed.parts[partIndex] = {
			type: 'pseudo',
			key: pseudoClass.replace(/\\/g,''),
			value: value
		});
	} else if (attributeKey){
		parsed.type.push('attribute');
		if (!currentParsed.attributes) currentParsed.attributes = [];
		
		var key = attributeKey.replace(/\\/g,'');
		var operator = attributeOperator;
		var attribute = (attributeValueDouble || attributeValueSingle || attributeValue || '').replace(/\\/g,'');
		
		// Turn off simple mode for custom attribute operators. This should disable QSA mode
		if (parsed.simple !== false && operator) parsed.simple = !!simpleAttributeOperators.test(operator);
		
		var test, regexp;
		
		switch (operator){
			case '^=' : regexp = new RegExp(       '^'+ escapeRegExp(attribute)            ); break;
			case '$=' : regexp = new RegExp(            escapeRegExp(attribute) +'$'       ); break;
			case '~=' : regexp = new RegExp( '(^|\\s)'+ escapeRegExp(attribute) +'(\\s|$)' ); break;
			case '|=' : regexp = new RegExp(       '^'+ escapeRegExp(attribute) +'(-|$)'   ); break;
			case  '=' : test = function(value){
				return attribute == value;
			}; break;
			case '*=' : test = function(value){
				return value && value.indexOf(attribute) > -1;
			}; break;
			case '!=' : test = function(value){
				return attribute != value;
			}; break;
			default   : test = function(value){
				return !!value;
			};
		}
		
		if (!test) test = function(value){
			return value && regexp.test(value);
		};
		
		currentParsed.attributes.push(currentParsed.parts[partIndex] = {
			type: 'attribute',
			key: key,
			operator: operator,
			value: attribute,
			test: test
		});
	} else if (combinator){
		parsed.type.push(combinator);
	}

	partIndex++;
	return '';
};

// Slick NS

var Slick = exports.Slick || {};

Slick.parse = function(expression){
	return parse(expression);
};

if (!exports.Slick) exports.Slick = Slick;
	
}).apply((typeof exports != 'undefined') ? exports : this);
