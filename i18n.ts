import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ro from './locales/ro.json';


export const TranslationKey = {
    COMMON: "common",
    SIDEBAR: "sidebar",
    DASHBOARD: "dashboard",
    PROFILE_MENU: "profileMenu",
    LOGIN_PAGE: "loginPage",
    REGISTER_PAGE: "registerPage",
    FILES_PAGE: "filesPage",
    AI_CHAT: "aiChat",
    LOOKUP_PAGE: "lookupPage",
    DAILY_PAGE: "dailyPage",
    HOME_PAGE: "homePage",
    VIDEO_PAGE: "videoPage",
    ERRORS: "errors",
    SUCCESS: "success",
}

export const translations = {
    common: {
        add: `${TranslationKey.COMMON}.add`,
        cancel: `${TranslationKey.COMMON}.cancel`,
        confirm: `${TranslationKey.COMMON}.confirm`,
        close: `${TranslationKey.COMMON}.close`,
        loading: `${TranslationKey.COMMON}.loading`,
        delete: `${TranslationKey.COMMON}.delete`,
        clear: `${TranslationKey.COMMON}.clear`,
    },

    sidebar: {
        home: `${TranslationKey.SIDEBAR}.home`,
        summary: `${TranslationKey.SIDEBAR}.summary`,
    },

    dashboard: {
        profile: `${TranslationKey.DASHBOARD}.profile`,
        settings: `${TranslationKey.DASHBOARD}.settings`,
        home: `${TranslationKey.DASHBOARD}.home`,
        pdf: `${TranslationKey.DASHBOARD}.PDF`,
    },

    profileMenu: {
        profile: `${TranslationKey.PROFILE_MENU}.profile`,
        settings: `${TranslationKey.PROFILE_MENU}.settings`,
        logout: `${TranslationKey.PROFILE_MENU}.logout`,
        ro: `${TranslationKey.PROFILE_MENU}.ro`,
        en: `${TranslationKey.PROFILE_MENU}.en`,
        notLoggedIn: `${TranslationKey.PROFILE_MENU}.notLoggedIn`,
        expandAria: `${TranslationKey.PROFILE_MENU}.expandAria`,
    },

    loginPage: {
        login: `${TranslationKey.LOGIN_PAGE}.login`,
        account: `${TranslationKey.LOGIN_PAGE}.account`,
        password: `${TranslationKey.LOGIN_PAGE}.password`,
        rememberMe: `${TranslationKey.LOGIN_PAGE}.rememberMe`,
        registerNewAccount: `${TranslationKey.LOGIN_PAGE}.registerNewAccount`,
    },

    registerPage: {
        register: `${TranslationKey.REGISTER_PAGE}.register`,
        username: `${TranslationKey.REGISTER_PAGE}.username`,
        email: `${TranslationKey.REGISTER_PAGE}.email`,
        password: `${TranslationKey.REGISTER_PAGE}.password`,
        confirmPassword: `${TranslationKey.REGISTER_PAGE}.confirmPassword`,
        alreadyHaveAccount: `${TranslationKey.REGISTER_PAGE}.aldreadyHaveAccount`,
    },

    filesPage: {
        downloadFile: `${TranslationKey.FILES_PAGE}.downloadFile`,
        dragFile: `${TranslationKey.FILES_PAGE}.dragFile`,
        files: `${TranslationKey.FILES_PAGE}.files`,
        noAvailableFiles: `${TranslationKey.FILES_PAGE}.noAvailableFiles`,
        fileUploaded: `${TranslationKey.FILES_PAGE}.fileUploaded`,
        recentFiles: `${TranslationKey.FILES_PAGE}.recentFiles`,
        clearFiles: `${TranslationKey.FILES_PAGE}.clearFiles`,
        clearAllTitle: `${TranslationKey.FILES_PAGE}.clearAllTitle`,
        clearAllConfirm: `${TranslationKey.FILES_PAGE}.clearAllConfirm`,
        pdfPreview: `${TranslationKey.FILES_PAGE}.pdfPreview`
    },
    aiChat: {
        thinking: `${TranslationKey.AI_CHAT}.thinking`,
        thinkingTime: `${TranslationKey.AI_CHAT}.thinkingTime`,
        chatHistory: `${TranslationKey.AI_CHAT}.chatHistory`,
        newChat: `${TranslationKey.AI_CHAT}.newChat`,
        thinkingTooltip: `${TranslationKey.AI_CHAT}.thinkingTooltip`,
        thinkingNotSupported: `${TranslationKey.AI_CHAT}.thinkingNotSupported`,
        vision: `${TranslationKey.AI_CHAT}.vision`,
        attachImage: `${TranslationKey.AI_CHAT}.attachImage`,
        visionNotSupported: `${TranslationKey.AI_CHAT}.visionNotSupported`,
        selectModel: `${TranslationKey.AI_CHAT}.selectModel`,
        deleteSession: `${TranslationKey.AI_CHAT}.deleteSession`,
        addSkill: `${TranslationKey.AI_CHAT}.addSkill`,
        skillName: `${TranslationKey.AI_CHAT}.skillName`,
        skillNameRequired: `${TranslationKey.AI_CHAT}.skillNameRequired`,
        slug: `${TranslationKey.AI_CHAT}.slug`,
        slugRequired: `${TranslationKey.AI_CHAT}.slugRequired`,
        slugHelper: `${TranslationKey.AI_CHAT}.slugHelper`,
        noItemsFound: `${TranslationKey.AI_CHAT}.noItemsFound`,
        statusActive: `${TranslationKey.AI_CHAT}.statusActive`,
        statusInactive: `${TranslationKey.AI_CHAT}.statusInactive`,
        urlUnsafe: `${TranslationKey.AI_CHAT}.urlUnsafe`,
        urlReachable: `${TranslationKey.AI_CHAT}.urlReachable`,
        urlUnreachable: `${TranslationKey.AI_CHAT}.urlUnreachable`,
        imageAttachment: `${TranslationKey.AI_CHAT}.imageAttachment`
    },
    lookupPage: {
        title: `${TranslationKey.LOOKUP_PAGE}.title`,
        placeholder: `${TranslationKey.LOOKUP_PAGE}.placeholder`,
        submit: `${TranslationKey.LOOKUP_PAGE}.submit`,
        loading: `${TranslationKey.LOOKUP_PAGE}.loading`,
        error: `${TranslationKey.LOOKUP_PAGE}.error`,
    },
    dailyPage: {
        title: `${TranslationKey.DAILY_PAGE}.title`,
        subtitle: `${TranslationKey.DAILY_PAGE}.subtitle`,
        showing: `${TranslationKey.DAILY_PAGE}.showing`,
        selectDay: `${TranslationKey.DAILY_PAGE}.selectDay`,
        dailyGoal: `${TranslationKey.DAILY_PAGE}.dailyGoal`,
        from: `${TranslationKey.DAILY_PAGE}.from`,
        to: `${TranslationKey.DAILY_PAGE}.to`,
        dateRange: `${TranslationKey.DAILY_PAGE}.dateRange`,
        selectRange: `${TranslationKey.DAILY_PAGE}.selectRange`,
        apply: `${TranslationKey.DAILY_PAGE}.apply`,
        dailyTotals: `${TranslationKey.DAILY_PAGE}.dailyTotals`,
        caloriesConsumed: `${TranslationKey.DAILY_PAGE}.caloriesConsumed`,
        caloriesBurned: `${TranslationKey.DAILY_PAGE}.caloriesBurned`,
        caloriesTarget: `${TranslationKey.DAILY_PAGE}.caloriesTarget`,
        protein: `${TranslationKey.DAILY_PAGE}.protein`,
        carbs: `${TranslationKey.DAILY_PAGE}.carbs`,
        fat: `${TranslationKey.DAILY_PAGE}.fat`,
        foodEntries: `${TranslationKey.DAILY_PAGE}.foodEntries`,
        exercises: `${TranslationKey.DAILY_PAGE}.exercises`,
        noExercises: `${TranslationKey.DAILY_PAGE}.noExercises`,
        loading: `${TranslationKey.DAILY_PAGE}.loading`,
        error: `${TranslationKey.DAILY_PAGE}.error`,
    },
    homePage: {
        title: `${TranslationKey.HOME_PAGE}.title`,
    },
    videoPage: {
        title: `${TranslationKey.VIDEO_PAGE}.title`,
    },
    errors: {
        isRequired: `${TranslationKey.ERRORS}.isRequired`,
        invalidEmail: `${TranslationKey.ERRORS}.invalidEmail`,
        passwordsDoNotMatch: `${TranslationKey.ERRORS}.passwordsDoNotMatch`,
        userNotFound: `${TranslationKey.ERRORS}.user_not_found`,
        unknownError: `${TranslationKey.ERRORS}.unknownError`,
        logoutFailed: `${TranslationKey.ERRORS}.logoutFailed`,
        skillAddFailed: `${TranslationKey.ERRORS}.skillAddFailed`,
        registrationFailed: `${TranslationKey.ERRORS}.registrationFailed`,
    },

    success: {
        accountCreated: `${TranslationKey.SUCCESS}.accountCreated`,
        skillAdded: `${TranslationKey.SUCCESS}.skillAdded`,
        loggedOut: `${TranslationKey.SUCCESS}.loggedOut`,
    },
} as const;

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ro: { translation: ro },
        },
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        detection: {
            // order in which detection is done
            order: ['localStorage', 'navigator'],
            // where to store the language
            caches: ['localStorage'],
        },
    });

export default i18n;