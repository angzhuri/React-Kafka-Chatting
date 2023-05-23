module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    'src/': '<rootDir>/src/'
  },
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  testRunner: 'jest-jasmine2',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
}
