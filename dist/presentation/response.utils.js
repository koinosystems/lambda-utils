export async function formatReponse(statusCode, body, isBase64Encoded, headers) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, identity-provider, token, Identity-Provider, Token',
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    };
    return Promise.resolve(JSON.parse(JSON.stringify({
        statusCode: statusCode,
        body: JSON.stringify(body),
        isBase64Encoded: isBase64Encoded || false,
        headers: corsHeaders,
    })));
}
export async function formatResponseDownload(statusCode, body, fileName) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, identity-provider, token, Identity-Provider, Token',
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
        'Content-disposition': `attachment; filename=${fileName}`,
        'Content-Type': 'application/zip, application/octet-stream',
        'Accept-Encoding': 'application/zip, application/octet-stream',
    };
    return Promise.resolve(JSON.parse(JSON.stringify({
        statusCode: statusCode,
        body: body,
        isBase64Encoded: false,
        headers: corsHeaders,
    })));
}
export async function responseSuccess(statusCode = 200, data = {}, headers = {}) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, identity-provider, token, Identity-Provider, Token',
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    };
    const response = {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
            ...headers,
        },
        body: JSON.stringify({
            data,
        }),
    };
    return Promise.resolve(response);
}
export async function responseError(statusCode = 500, err, headers = {}) {
    console.log(err);
    const response = {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify({
            error: err,
        }),
    };
    if (statusCode === 500) {
        response.body = JSON.stringify({
            error: {
                message: 'There was an internal server error. Please try again later. If the problem persists, please contact technical support.',
            },
        });
    }
    return Promise.resolve(response);
}
