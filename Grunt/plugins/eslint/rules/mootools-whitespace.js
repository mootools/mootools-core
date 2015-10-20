'use strict';

var rules = [
	{regex: /function\s+\(/g, message: 'Unexpected whitespace between "function" and "("'},
	{regex: /\)\s+{/g, message: 'Unexpected whitespace between ")" and "{"'},
	{regex: /(catch|for|if|switch|while|with)\(/g, message: 'Expected whitespace between "%s" and "(" but found none'},
	{regex: /}(catch|else|finally)/g, message: 'Expected whitespace between "}" and "%s" but found none'},
	{regex: /(do|else|finally|try){/g, message: 'Expected whitespace between "%s" and "{" but found none'}
];

module.exports = function(context){
	var errors = [];

	function checkForIrregularWhitespace(node){
		context.getSourceLines().forEach(function(line, index){
			rules.forEach(function(rule){
				var loc,
					match;

				while ((match = rule.regex.exec(line)) !== null){
					loc = {
						line: index + 1,
						column: match.index
					};
					errors.push([node, loc, rule.message.replace('%s', match[1])]);
				}
			});
		});
	}

	return {
		'Program': function(node){
			checkForIrregularWhitespace(node);
		},
		'Program:exit': function(){
			errors.forEach(function(error){
				context.report.apply(context, error);
			});
		}
	};
};

module.exports.schema = [];
