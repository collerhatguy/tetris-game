# Problem: How should I test the project?

I need to decide what testing libraries to use and
whether I should be allowed to commit broken tests.

## Considerations

- Jest
- Karma
- Marble Testing
- Observer Spy

## Decision

It is best to use Karma since it comes pre packaged with angular and requires the least amount of setup.
I have also decided to use the Observer spy library to test my asyncronous data since it is
the easiest to understand and what I am most familiar with.
I will also set it up so that my test run on every commit and will cancel the commit if they fail.
I do not believe test percentage is important as much as test quality so I will not track that.
