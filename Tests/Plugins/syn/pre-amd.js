// Distribution versions of syn add a global AMD-style define function.
// Let's make sure we can restore whatever exists before loading syn.

window._karma_syn = {};
window._karma_syn.define = window.define;
