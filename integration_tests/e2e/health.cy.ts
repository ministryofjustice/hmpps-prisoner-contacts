context('Healthcheck', () => {
  context('All healthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubTokenVerificationPing')
      cy.task('stubPrisonApiPing')
      cy.task('stubPrisonerSearchPing')
    })

    it('Health check page is visible', () => {
      cy.request('/health').then(response => {
        expect(response.body).to.have.property('healthy', true)
        expect(response.body.checks).to.have.property('hmppsAuth', 'OK')
        expect(response.body.checks).to.have.property('prisonApi', 'OK')
        expect(response.body.checks).to.have.property('prisonerSearch', 'OK')
      })
    })

    it('Ping is visible and UP', () => {
      cy.request('/ping').its('body.status').should('equal', 'UP')
    })
  })

  context('Some unhealthy', () => {
    it('Reports correctly when token verification down', () => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubTokenVerificationPing', 500)

      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).then(response => {
        expect(response.body.checks.hmppsAuth).to.equal('OK')
        expect(response.body.checks.tokenVerification).to.contain({ status: 500, retries: 2 })
      })
    })
  })
})
