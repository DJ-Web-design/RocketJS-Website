const RSM = require("./core").ReactStateManagement,
      VSM = require("./core").VueStateManagement,
      Parser = require("./core").JsParser;

/**
 * React Compiler
 * 
 * Function that take the HTML string and traslate that to Vue
 * 
 * @param {string} name The Component Name
 * @param {string} html The HTML String
 * @param {string} css The CSS String
 * @param {string} js The Javascript String
 * @return {string}
 */
exports.ReactCompiler = (name, html, css, js) =>{
	//Initialize Classes JsParser and StateManagement
	let ReactStateManagement = new RSM();
	let parse = new Parser(js); //Pass JS String

	//Get all data from HTML string
	ReactStateManagement.getHTMLString(html);

	//Get states declarations from JS and set to Data
	ReactStateManagement.setStates(parse.getStates());

	//Get Methods from JS and set to Data
	ReactStateManagement.getJsData(parse.getParsed(), "r");

	ReactStateManagement.setStateWatchers(parse.getWatchers());

	ReactStateManagement.setVars(parse.getVars());

	//Add new lines and idents to code beauty
	let pretty = ReactStateManagement
		.setReactFilterHTMLState(html)
		.split(/\n/)
		.map(e=>{
			if (e) return "\t\t\t"+e+"\n";
		})
		.join("");
		
	//Template to Set All Data
	let template =
`import React, {Component} from "react"
${ReactStateManagement.setReactComponents()}
class ${name || "MyComponent"} extends Component {
	${ReactStateManagement.setReactStateToTemplate()}
	render(){
		return(
${pretty}\t\t)
	}
}
export default ${name || "MyComponent"};
`
	return template
}


/**
 * Vue Translator
 * 
 * Function that take the HTML string and traslate that to Vue
 *
 * @param {string} html The HTML String 
 * @param {string} css The CSS String
 * @param {string} js The Javascript String
 * @return {string}
 */
exports.VueCompiler = (name, html, css, js) =>{
	//Initialize Classes JsParser and StateManagement
	let VueStateManagement = new VSM();
	let parse = new Parser(js);

	let style; // Declare empty var to asign styles

	//If param 'css' is not empty, set style tags to final render 
	css !== "" ? style = `<style scoped>\n${css}</style>` : style = "";

	//Get all data from HTML string
	VueStateManagement.getHTMLString(html);

	//Get states declarations from JS and set to Data
	VueStateManagement.setStates(parse.getStates());

	//Get Methods from JS and set to Data
	VueStateManagement.getJsData(parse.getParsed(), "v");

	VueStateManagement.setStateWatchers(parse.getWatchers());

	VueStateManagement.setVars(parse.getVars());
	
	//Add new lines and idents to code beauty
	let pretty = VueStateManagement
		.setVueFilterHTMLState(html)
		.split(/\n/)
		.map(e=>{
			if (e) return "\t"+e+"\n";
		})
		.join("");
	
	//Template to Set All Data
	let template = 
`<template>
${pretty}
</template>
<script>
 ${VueStateManagement.getVueDataTemplate(name)}
</script>
${style}`;
	return template
}