import {
	FLEET_API_BASE_URL,
	FLEET_AUTH_TOKEN,
	SERVICE_ID,
	SERVICE_NAME_IDENTIFIER
} from '$env/static/private';

export const connectUsertoService = async (discordAccountId: string, discordUsername: string) => {
	let fleetResponse;

	try {
		fleetResponse = await fetch(`${FLEET_API_BASE_URL}/fleet/service/connectuser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${FLEET_AUTH_TOKEN}`
			},
			body: JSON.stringify({
				discordAccountId: `${discordAccountId}`,
				discordUsername: discordUsername,
				serviceId: SERVICE_ID,
				serviceNameIdentifier: SERVICE_NAME_IDENTIFIER
			})
		});
	} catch (error) {
		console.error(error); // server-side log
	}

	const rjson = await fleetResponse?.json();

	return rjson.success;
};

export const getUserDirectives = async (discordAccountId: string) => {
	let fleetResponse;

	try {
		fleetResponse = await fetch(
			`${FLEET_API_BASE_URL}/fleet/service/directive?discordAccountId=${discordAccountId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${FLEET_AUTH_TOKEN}`
				}
			}
		);
	} catch (error) {
		console.error(error); // server-side log
	}

	const rjson = await fleetResponse?.json();

	return rjson.directives;
};

export const getApiVersion = async () => {
	let fleetResponse;

	try {
		fleetResponse = await fetch(`${FLEET_API_BASE_URL}/fleet/version`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${FLEET_AUTH_TOKEN}`
			}
		});
	} catch (error) {
		console.error(error); // server-side log
	}

	const rjson = await fleetResponse?.json();

	return rjson.version;
};
