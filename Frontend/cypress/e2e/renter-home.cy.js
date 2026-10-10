const properties = [
  {
    _id: 'property-low',
    propertyAddress: 'Low Price Apartment',
    propertyAmt: 1000,
    propertyType: 'residential',
    propertyAdType: 'rent',
    ownerName: 'Test Owner',
    ownerContact: '555-0100',
    ownerId: 'owner-1',
    isAvailable: 'Available',
    additionalInfo: 'Lower-priced test property',
    propertyImage: [{ path: 'image.png' }],
  },
  {
    _id: 'property-mid',
    propertyAddress: 'Mid Price House',
    propertyAmt: 2500,
    propertyType: 'residential',
    propertyAdType: 'rent',
    ownerName: 'Test Owner',
    ownerContact: '555-0101',
    ownerId: 'owner-2',
    isAvailable: 'Available',
    additionalInfo: 'Mid-priced test property',
    propertyImage: [{ path: 'image.png' }],
  },
  {
    _id: 'property-high',
    propertyAddress: 'High Price Villa',
    propertyAmt: 5000,
    propertyType: 'residential',
    propertyAdType: 'sale',
    ownerName: 'Test Owner',
    ownerContact: '555-0102',
    ownerId: 'owner-3',
    isAvailable: 'Available',
    additionalInfo: 'Higher-priced test property',
    propertyImage: [{ path: 'image.png' }],
  },
];

describe('Renter home page', () => {
  beforeEach(() => {
    const renterEmail = cy.env(['renterEmail']);
    const renterPassword = cy.env(['renterPassword']);
    if (!renterEmail || !renterPassword) {
      throw new Error(
        'Set CYPRESS_RENTER_EMAIL and CYPRESS_RENTER_PASSWORD before running renter home E2E tests.',
      );
    }

    cy.intercept('GET', '**/api/user/getAllProperties', {
      statusCode: 200,
      body: { success: true, data: properties },
    });

    cy.visit('/login', {
      onBeforeLoad(window) {
        window.localStorage.clear();
      },
    });
    cy.get('input[name="email"]').type('user@email.com');
    cy.get('input[name="password"]').type('tH~V}Z.x#zNh7QB', { log: false });
    cy.contains('button', 'Sign In').click();
    cy.location('pathname', { timeout: 15000 }).should('eq', '/renterhome');
    cy.contains('h3', 'Mid Price House').should('be.visible');
  });

  it('opens property info and booking modal', () => {
    cy.contains('h3', 'Mid Price House')
      .parents('.relative')
      .first()
      .contains('button', 'Get Info / Book')
      .click();

    cy.contains('h3', 'Property Info').should('be.visible');
    cy.contains('b', 'Location:')
      .parent()
      .should('contain.text', 'Mid Price House');
    cy.contains('button', 'Book Property').should('be.visible');
  });

  it('adds a property to favorites and filters to favorites', () => {
    cy.contains('h3', 'Mid Price House')
      .parents('.relative')
      .first()
      .find('button[aria-label="Add to favorites"]')
      .click()
      .should('have.attr', 'aria-pressed', 'true');

    cy.contains('button', 'Favorites (1)').click();

    cy.contains('h3', 'Mid Price House').should('be.visible');
    cy.contains('h3', 'Low Price Apartment').should('not.exist');
    cy.contains('h3', 'High Price Villa').should('not.exist');
  });

  it('filters properties within the selected price range', () => {
    cy.get('input[aria-label="Minimum price"]').type('2000');
    cy.get('input[aria-label="Maximum price"]').type('4000');

    cy.contains('h3', 'Mid Price House').should('be.visible');
    cy.contains('h3', 'Low Price Apartment').should('not.exist');
    cy.contains('h3', 'High Price Villa').should('not.exist');
  });
});
