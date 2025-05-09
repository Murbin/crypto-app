module.exports = {
    preset: 'react-native',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo|@expo|@unimodules|unimodules|sentry-expo|native-base)',
    ],
    // setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
}; 