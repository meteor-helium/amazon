Amazon = {};


OAuth.registerService('amazon', 2, null, function(query) {

  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  var expiresAt = (+new Date) + parseInt(response.expiresIn, 10);

  // include all fields from Amazon
  var whitelisted = ['user_id', 'name', 'email'];

  var identity = getIdentity(accessToken);

  var serviceData = {
    id: identity.user_id,
    accessToken: accessToken,
    expiresAt: expiresAt
  };

  var fields = _.pick(identity, whitelisted);
  _.extend(serviceData, fields);

  // only set the token in serviceData if it's there. this ensures
  // that we don't lose old ones (since we only get this on the first
  // log in attempt)
  if (response.refreshToken)
    serviceData.refreshToken = response.refreshToken;

  return {
    serviceData: serviceData,
    options: {profile: {name: identity.name}}
  };
});


// returns an object containing:
// - accessToken
// - tokenType
// - expiresIn (In seconds)
// - refreshToken
var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'amazon'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var responseContent;
  try {
    // Request an access token
    responseContent = HTTP.post(
      "https://api.amazon.com/auth/o2/token", {
        params: {
          grant_type: 'authorization_code',
          code: query.code,
          redirect_uri: OAuth._redirectUri('amazon', config),
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.clientSecret)
        }
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Amazon. " + err.message),
      {response: err.response});
  }

  // Success!
  return {
    accessToken: responseContent.access_token,
    tokenType: responseContent.token_type,
    expiresIn: responseContent.expires_in,
    refreshToken: responseContent.refresh_token
  };
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.get("https://api.amazon.com/user/profile", {
      headers: {
        Authorization: "Bearer " + accessToken
      }
    }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Amazon. " + err.message),
      {response: err.response});
  }
};

Amazon.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
