module.exports = {
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'pl'],
    },
    reloadOnPrerender: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    localePath: './public/locales',
    localeDetection: false

};
