import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/service/(.*)$': '<rootDir>/service/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^next/image$': '<rootDir>/__mocks__/next/image.js',
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jose)/)"
  ],
}

module.exports = createJestConfig(customJestConfig)
