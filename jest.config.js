module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      /* ts-jest config goes here in Jest */
      isolatedModules: true,
    }],
  },
  globals: {},
};
