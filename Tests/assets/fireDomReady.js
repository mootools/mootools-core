//this script is used in the test iframe to ensure that domready fires correctly when the body is updated with the test html
try {
	if (typeof Browser != "undefined") Browser.loaded = true;
	if (window.fireEvent) window.fireEvent('domready');
} catch(e){
	dbug.log('domready not fired: ', e);
}
if (typeof IframeShim != "undefined") IframeShim.ready = true;