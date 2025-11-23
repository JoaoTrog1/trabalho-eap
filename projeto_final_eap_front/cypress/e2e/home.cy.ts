/// <reference types="cypress" />

describe('Home', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('deve carregar a página inicial', () => {
    cy.visit('/')
    cy.contains('h1', 'Centralize e organize seus comandos').should('be.visible')
    cy.contains('Gerenciador de comandos').should('be.visible')
    cy.contains('Salve snippets de código').should('be.visible')
    cy.contains('Salve comandos').should('be.visible')
    cy.contains('Organize com tags').should('be.visible')
    cy.contains('Busque por linguagem').should('be.visible')
  })

  it('deve mostrar botões corretos para usuario não autenticado', () => {
    cy.visit('/')
    cy.contains('Começar agora').should('be.visible')
    cy.contains('Criar conta gratuita').should('be.visible')
    cy.contains('Ver meus comandos').should('not.exist')
  })

  it('deve navegar para login quando clicar em "Começar agora"', () => {
    cy.visit('/')

    cy.contains('Começar agora').click()
    cy.url().should('include', '/login')
    cy.contains('h1', 'Bem-vindo de volta').should('be.visible')
  })

  it('deve navegar para registro quando clicar em "Criar conta gratuita"', () => {
    cy.visit('/')

    cy.contains('Criar conta gratuita').click()
    cy.url().should('include', '/register')
    cy.contains('h1', 'Crie sua conta').should('be.visible')
  })

  it('deve mostrar botão correto para usuario autenticado', () => {
    const fakeToken = 'vasco'
    cy.window().then((win) => {
      win.localStorage.setItem('token', fakeToken)
    })
    cy.visit('/')
    cy.contains('Ver meus comandos').should('be.visible')
    cy.contains('Começar agora').should('not.exist')
    cy.contains('Criar conta gratuita').should('not.exist')
  })

  it('deve tentar navegar para comandos quando usuario autenticado clica em "Ver meus comandos"', () => {
    const fakeToken = 'vasco'
    cy.window().then((win) => {
      win.localStorage.setItem('token', fakeToken)
    })
    cy.visit('/')
    cy.contains('Ver meus comandos').click()
    cy.url().should('include', '/login')
  })

  it('deve mostrar elementos corretamente', () => {
    cy.visit('/')
    cy.contains('247').should('be.visible') 
    cy.contains('12').should('be.visible') 
    cy.contains('Sincronização em tempo real').should('be.visible')
    cy.contains('Suporte a múltiplas linguagens').should('be.visible')
    cy.contains('Busca instantânea').should('be.visible')
  })
})