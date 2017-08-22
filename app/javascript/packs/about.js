import loadPolyfills from '../mastodon/load_polyfills';

require.context('../images/', true);

function loaded() {
  const TimelineContainer = require('../mastodon/containers/timeline_container').default;
  const React = require('react');
  const ReactDOM = require('react-dom');
  const mountNode = document.getElementById('mastodon-timeline');
  document.getElementById('mastodon-timeline').style.overflow-anchor = 'none';
  alert('Set overflow-anchor.');

  if (mountNode !== null) {
    const props = JSON.parse(mountNode.getAttribute('data-props'));
    ReactDOM.render(<TimelineContainer {...props} />, mountNode);
  }
}

function main() {
  const ready = require('../mastodon/ready').default;
  ready(loaded);
}

loadPolyfills().then(main).catch(error => {
  console.error(error);
});
