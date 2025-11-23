/// <reference types="cypress" />

describe('Login', () => {
  const timestamp = Date.now()
  const validUsername = `testuser${timestamp}`
  const validPassword = 'Test@123456'
  const invalidUsername = 'usuarioInexistente'
  const invalidPassword = 'senhaErrada123'

  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('dev fazer login com usuario e senha válidos', () => {
    cy.visit('/register')
    cy.get('#username').type(validUsername)
    cy.get('#password').type(validPassword)
    cy.contains('button', 'Criar conta').click()
    cy.url().should('include', '/login')
    cy.wait(1000)
    cy.get('#username').clear().type(validUsername)
    cy.get('#password').clear().type(validPassword)
    cy.contains('button', 'Entrar').click()
     cy.wait(500)
    cy.url().should('include', '/login')
  })

  it('dev mostrar erro ao tentar fazer login com usuario e senha inválidos', () => {
    cy.visit('/login')
    cy.get('#username').type(invalidUsername)
    cy.get('#password').type(invalidPassword)
    cy.contains('button', 'Entrar').click()
    cy.wait(2000)
    cy.url().should('include', '/login')
  })

  it('dev validar campos do formulário de login', () => {
    cy.visit('/login')
    cy.contains('button', 'Entrar').click()
    cy.url().should('include', '/login')
    cy.get('#username').should('have.attr', 'required')
    cy.get('#password').should('have.attr', 'required')
  })

  it('dev ir para a página de registro', () => {
    cy.visit('/login')
    cy.contains('Criar uma conta').click()
    cy.url().should('include', '/register')
    cy.contains('h1', 'Crie sua conta').should('be.visible')
  })
})