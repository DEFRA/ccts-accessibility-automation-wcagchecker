Feature: Navigate Urls
  I want to use this template for my feature file

  @regression
  Scenario: Navigate to Defra pages
    Given I want to navigate to Defra pages
    When I provide the url "https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs" and hit enter
    And I provide the url "https://www.gov.uk/government/publications/birds-live-health-certificates" and hit enter
    Then I should be redirected to Defra page
    And I should not see any accessibility issues