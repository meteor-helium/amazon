Package.describe({
  name: 'helium:amazon',
  version: '1.0.0',
  summary: 'Amazon OAuth flow',
  git: 'https://github.com/meteor-helium/amazon.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@1.2.0.2");
  
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'server');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Amazon');

  api.addFiles(
    ['amazon_configure.html', 'amazon_configure.js'],
    'client');

  api.addFiles('amazon_server.js', 'server');
  api.addFiles('amazon_client.js', 'client');
});
