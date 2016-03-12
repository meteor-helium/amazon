Template.configureLoginServiceDialogForAmazon.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForAmazon.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'clientSecret', label: 'Client Secret'}
  ];
};
