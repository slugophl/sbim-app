let csrfToken=null;

async function refreshCsrf() {
    let response;
    try {
        response = await fetch('http://localhost:3001/api/csrf', {credentials:'include'});
    } catch (error) {
        throw new Error('Network connection failed');
    }
    if(!response.ok) throw new Error('Could not initialize the session');
        csrfToken = (await response.json()).csrfToken;
}

export async function api(path, options={}) {
    // F1: await refreshCsrf if needed; build headers and credentials:'same-origin'.
    // If options.body is an object, JSON.stringify it and set Content-Type.
    // Add X-CSRF-Token on mutations; fetch; parse JSON; throw Error on !response.ok.
    // Use try/catch to give a useful connection error only for actual network failure.
    // Preserve server-provided error messages for HTTP failures.
    const method = options.method || 'GET';
    const headers = {};

    if (options.body !== undefined && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body);
        headers['Content-Type'] = 'application/json';
    }

    if (method !== 'GET') {
        await refreshCsrf();
        headers['X-CSRF-Token'] = csrfToken;
    }

    let response;
    try {
        response = await fetch(path, {...options, method, headers, credentials:'include'});
    } catch (error) {
        throw new Error('Network connection failed');
    }

    const data = await response.json();
        if (!response.ok) {
        const error = new Error(data.error || 'Request failed');
        error.status = response.status;
        throw error;
    }

    return data;
}