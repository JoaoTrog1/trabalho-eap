/// <reference types="cypress" />

describe('Capturas de tela', () => {
  let isAuthenticated = false

  const createUserAndLogin = () => {
    if (isAuthenticated) return

    const timestamp = Date.now()
    const username = `alguem${timestamp}`
    const password = 'senha12345'

    cy.visit('/register')
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.contains('button', 'Criar conta').click()
    cy.url({ timeout: 10000 }).should('include', '/login')

    cy.get('#username').clear().type(username)
    cy.get('#password').clear().type(password)
    cy.contains('button', 'Entrar').click()
    cy.wait(2000)

    isAuthenticated = true
  }

  const devices = [
    { 
      name: 'Celular', 
      width: 375, 
      height: 667,
    },
    { 
      name: 'Tablet', 
      width: 768, 
      height: 1024,
    },
    { 
      name: 'Desktop', 
      width: 1920, 
      height: 1080,
    }
  ]

  beforeEach(() => {
    cy.clearLocalStorage()
  })

  // Contextos sem autenticação
  context('Home', () => {
    devices.forEach(({ name, width, height }) => {
      it(`${name}`, () => {
        cy.viewport(width, height)
        cy.visit('/')
        cy.wait(1000) 

        cy.screenshot(`home-${name}`, {
          capture: 'viewport',
          overwrite: true
        })

        cy.contains('Centralize e organize seus comandos').should('be.visible')
      })
    })
  })

  context('Login', () => {
    devices.forEach(({ name, width, height }) => {
      it(`${name}`, () => {
        cy.viewport(width, height)
        cy.visit('/login')
        cy.wait(1000)
        
        cy.screenshot(`login-${name}`, {
          capture: 'viewport',
          overwrite: true
        })
        
        cy.contains('Bem-vindo de volta').should('be.visible')
      })
    })
  })

  context('Register', () => {
    devices.forEach(({ name, width, height }) => {
      it(`${name}`, () => {
        cy.viewport(width, height)
        cy.visit('/register')
        cy.wait(1000)
        
        cy.screenshot(`register-${name}`, {
          capture: 'viewport',
          overwrite: true
        })
        
        cy.contains('Crie sua conta').should('be.visible')
      })
    })
  })

  context('Commands', () => {
    before(() => {
      createUserAndLogin()
    })

    devices.forEach(({ name, width, height }) => {
      it(`${name}`, () => {
        
        cy.viewport(width, height)
        cy.visit('/commands')
        cy.wait(3000)
        
        cy.url().then((currentUrl) => {
          if (currentUrl.includes('/commands')) {
            cy.screenshot(`commands-${name}`, {
              capture: 'viewport',
              overwrite: true
            })
          } else {
            cy.log('Não foi possível acessar /commands')
          }
        })
      })
    })
  })

  context('Command Editor', () => {
    before(() => {
      createUserAndLogin()
    })

    devices.forEach(({ name, width, height }) => {
      it(`${name}`, () => {
        
        cy.viewport(width, height)
        cy.visit('/commands/new')
        cy.wait(2000)
        
        cy.url().then((currentUrl) => {
          if (currentUrl.includes('/commands')) {
            cy.screenshot(`editor-${name}`, {
              capture: 'viewport',
              overwrite: true
            })
          }
        })
      })
    })
  })

})
