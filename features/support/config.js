const { After, AfterAll, Before, BeforeAll, Status, defineParameterType, setDefaultTimeout, setWorldConstructor } = require('@cucumber/cucumber');

Before(async function(scenario) {
  this.locations = []
});
