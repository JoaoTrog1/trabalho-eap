/// <reference types="cypress" />

describe('Registro', () => {
  const timestamp = Date.now()
  const username = `testuser${timestamp}`
  const password = 'Test@123456'


  it('deve criar um novo usuário com sucesso', () => {
    cy.visit('/register')
    cy.contains('h1', 'Crie sua conta').should('be.visible')
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.contains('button', 'Criar conta').click()
    cy.url().should('include', '/login')
    cy.contains('Conta criada com sucesso!').should('be.visible')
  })

  it('deve validar campos obrigatórios no formulário de registro', () => {
    cy.visit('/register')
    cy.contains('button', 'Criar conta').click()
    cy.url().should('include', '/register')
    cy.get('#username').should('have.attr', 'required')
    cy.get('#password').should('have.attr', 'required')
  })

  it('deve permitir navegação para a página de login', () => {
    cy.visit('/register')
    cy.contains('Já tenho conta').click()
    cy.url().should('include', '/login')
    cy.contains('h1', 'Bem-vindo de volta').should('be.visible')
  })
})
