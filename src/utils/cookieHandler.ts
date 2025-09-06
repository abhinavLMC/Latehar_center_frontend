/**
 * Method to return the value of a cookie only
 *
 * @param {string} name Cookie Name
 * @returns
 */
export const getCookie = (name: string): string | undefined => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // let cookieString = document.cookie.split(';').find((e) => e.includes(name));
    // let cookieArr = cookieString?.split('=');
    // cookieArr?.shift();
    // let cookieValue = cookieArr?.join('=').trim();

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    return parts.length === 2 ? parts.pop()?.split(';').shift() : ''
  }
  return ''
}

/**
 * Method to set the cookie, set expiry to -1 to store it as a session cookie which gets deleted on closing browser
 *
 * @param {string} cName Cookie Name
 * @param {string|number|bool} cValue Cookie Value
 * @param {Number|null} expiry Cookie expiry in second
 */

export const setCookie = (cName: string, cValue: string | number | boolean, expiry: number = 365 * 24 * 60 * 60): void => {
// export const setCookie = (cName, cValue) => {
  if (typeof window !== 'undefined') {
    // const hostname = window.location.hostname;
    // remove any subdomains, e.g. www.example.com -> example.com
    // const domainArray = `.${hostname.match(/^(?:.*?\.)?([a-zA-Z0-9\-_]{3,}\.(?:\w{2,8}|\w{2,4}\.\w{2,4}))$/)}`.split(',');
    // let domain = Array.isArray(domainArray) ? `.${domainArray[1]}` : '';
    // domain = hostname === 'localhost' ? 'localhost' : domain;

    const secure = process.env.NEXT_PUBLIC_ENVIRONMENT !== 'local' ? ';Secure' : ''

    const date = new Date()
    let expires = ''

    date.setTime(date.getTime() + expiry * 1000)
    expires = `expires=${date.toUTCString()}`
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    document.cookie = `${cName} = ${cValue}; ${expires}; path=/; ${secure}`

    // if (expiry === -1) {
    //   // document.cookie = `${cName} = ${cValue}; path=/;  domain=${domain}${secure}`;
    //   // save as session cookie which gets deleted on closing browser
    //   document.cookie = `${cName} = ${cValue}; path=/;  ${secure}`;
    // } else {
    //   document.cookie = `${cName} = ${cValue}; expires= ${expires}; path=/; ${secure}`;
    // }

    // save as session cookie which gets deleted on closing browser
    // document.cookie = `${cName} = ${cValue}; path=/;  ${secure};`;
  }
}

/**
 * Method to expire/delete a cookie by name
 *
 * @param {string} name Cookie Name
 */
export const deleteCookie = (name: string): void => {
  if (typeof window !== 'undefined') {
    const { hostname } = window.location
    // remove any subdomains, e.g. www.example.com -> example.com
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const domainArray = hostname != null ? `.${hostname.match(/^(?:.*?\.)?([a-zA-Z0-9\-_]{3,}\.(?:\w{2,8}|\w{2,4}\.\w{2,4}))$/)}`.split(',') : ''
    let domain = Array.isArray(domainArray) ? `.${domainArray[1]}` : ''
    domain = hostname === 'localhost' ? 'localhost' : domain

    document.cookie = `${String(name)}=; path=/; domain=${domain};expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    document.cookie = `${String(name)}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  }
}