// Distribution versions of syn add a global AMD-style define function.
// Let's make sure we restore whatever existed before loading syn.

window.define = window._karma_syn.define;
window._karma_syn = undefined;
