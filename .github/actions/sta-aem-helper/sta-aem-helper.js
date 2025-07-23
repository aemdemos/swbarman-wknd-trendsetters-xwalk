/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import core from '@actions/core';
import fs from 'fs';
import jwt from 'jsonwebtoken';

/**
 * Fetches an Adobe IMS access token using JWT authentication.
 * Credit to @adobe/jwt-auth.
 *
 * @param {Object} config - The configuration object.
 * @param {string} config.clientId - The client ID for the integration.
 * @param {string} config.technicalAccountId - The technical account ID.
 * @param {string} config.orgId - The Adobe organization ID.
 * @param {string} config.clientSecret - The client secret for the integration.
 * @param {string} config.privateKey - The private key for signing the JWT.
 * @param {string} [config.passphrase] - The passphrase for the private key (optional).
 * @param {Array<string>|string} config.metaScopes - The meta scopes for the JWT.
 * @param {string} [config.ims] - The IMS endpoint URL (optional).
 * @returns {Promise<Object>} The JSON response containing the access token or error details.
 * @throws {Error} If required parameters are missing or token exchange fails.
 */
async function fetchJWTAuthAccessToken(config) {
  const {
    clientId,
    technicalAccountId,
    orgId,
    clientSecret,
    privateKey,
    passphrase = '',
    metaScopes,
    ims = 'https://ims-na1.adobelogin.com',
  } = config;

  const errors = [];
  if (!clientId) {
    errors.push('clientId');
  }
  if (!technicalAccountId) {
    errors.push('technicalAccountId');
  }
  if (!orgId) {
    errors.push('orgId');
  }
  if (!clientSecret) {
    errors.push('clientSecret');
  }
  if (!privateKey) {
    errors.push('privateKey');
  }
  if (!metaScopes || metaScopes.length === 0) {
    errors.push('metaScopes');
  }
  if (errors.length > 0) {
    throw new Error(
      `Missing required authorization parameter(s): ${errors.join(', ')}. Please check your configuration.`,
    );
  }

  let validatedMetaScopes = metaScopes;
  if (!Array.isArray(validatedMetaScopes)) {
    validatedMetaScopes = metaScopes.split(',');
  }

  const jwtPayload = {
    exp: Math.round(300 + Date.now() / 1000),
    iss: orgId,
    sub: technicalAccountId,
    aud: `${ims}/c/${clientId}`,
  };

  if (validatedMetaScopes && validatedMetaScopes.length > 0) {
    for (let i = 0; i < metaScopes.length; i += 1) {
      if (validatedMetaScopes[i].includes('https')) {
        jwtPayload[metaScopes[i]] = true;
      } else {
        jwtPayload[`${ims}/s/${validatedMetaScopes[i]}`] = true;
      }
    }
  }
  let token;
  try {
    token = jwt.sign(
      jwtPayload,
      { key: privateKey, passphrase },
      { algorithm: 'RS256' },
    );
  } catch (tokenError) {
    throw new Error(`Failed to sign JWT token: ${tokenError.message || tokenError}`);
  }

  const form = new FormData();
  form.append('client_id', clientId);
  form.append('client_secret', clientSecret);
  form.append('jwt_token', token);

  const postOptions = {
    method: 'POST',
    body: form,
  };

  return fetch(`${ims}/ims/exchange/jwt/`, postOptions)
    .catch((e) => {
      throw new Error(`Unexpected response received while swapping the jwt token. ${e.message || e}`);
    })
    .then((res) => res.json().then((data) => ({
      ok: res.ok,
      json: data,
    })))
    .then(({ ok, json }) => {
      const { access_token: accessToken, error, error_description: errorDescription } = json;
      if (ok && accessToken) {
        return json;
      }

      if (error && errorDescription) {
        core.warning(`❌ JWT token exchange failed: ${errorDescription} (Error: ${error})`);
        throw new Error(`JWT token exchange failed: ${errorDescription} (Error: ${error})`);
      } else {
        core.warning(`❌ Unexpected response received while swapping the jwt token: ${JSON.stringify(json)}`);
        throw new Error('Unexpected response received while swapping the jwt token.');
      }
    });
}

/**
 * Fetches an Adobe IMS access token using credentials from a file.
 *
 * @param {string} credentialsPath - The path to the JSON credentials file.
 * @returns {Promise<Object>} The JSON response containing the access token or error details.
 * @throws {Error} If the credentials file cannot be read or parsed, or if token exchange fails.
 */
async function fetchAccessToken(credentialsPath) {
  // Read and parse the credentials
  const fileContent = fs.readFileSync(credentialsPath, 'utf8');
  const rawCredentials = JSON.parse(fileContent);
  const integration = rawCredentials.integration || {};
  const technicalAccount = integration.technicalAccount || {};

  const config = {
    clientId: technicalAccount.clientId,
    clientSecret: technicalAccount.clientSecret,
    technicalAccountId: String(integration.id),
    orgId: integration.org,
    passphrase: '',
    privateKey: integration.privateKey,
    metaScopes: integration.metascopes,
    ims: `https://${integration.imsEndpoint}`,
  };

  return fetchJWTAuthAccessToken(config);
}

/**
 * Main function for the GitHub Action
 * @returns {Promise<void>}
 */
async function run() {
  try {
    const credentialsPath = core.getInput('credentials_path');
    const operation = core.getInput('operation');

    if (operation === 'fetch-access-token') {
      const accessToken = await fetchAccessToken(credentialsPath);
      if (accessToken) {
        core.setOutput('access_token', accessToken);
        core.info(`Access token fetched successfully: ${accessToken?.substring(0, 10)}...`);
      } else {
        throw new Error('Failed to fetch access token');
      }
    } else {
      throw new Error(`Unknown AEM helper operation: ${operation}`);
    }
  } catch (error) {
    core.warning(`❌ Error: ${error.message}`);
    core.setOutput('error_message', `❌ Error: ${error.message}`);
  }
}

await run();
