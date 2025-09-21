module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'build',
          'chore',
          'ci',
          'docs',
          'feat',
          'fix',
          'perf',
          'refactor',
          'revert',
          'style',
          'test'
        ]
      ],
      'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
      'subject-empty': [2, 'never'],
      'subject-max-length': [2, 'always', 150],
      'type-empty': [2, 'never']
    }
  }