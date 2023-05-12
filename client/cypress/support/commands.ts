Cypress.Commands.add('login', (userType) => {
  // Replace with the actual API URL and credentials
  const apiUrl = 'http://localhost:4568/api/auth';
  const adminCredentials = {
    email: 'admin@example.com',
    password: 'admin_password',
  };
  const userCredentials = {
    email: 'user@example.com',
    password: 'user_password',
  };

  const credentials = userType === 'admin' ? adminCredentials : userCredentials;

  cy.request('POST', apiUrl, credentials).then((response) => {
    if (response.body && response.body.token) {
      // Save the token in localStorage to authenticate subsequent API requests
      window.localStorage.setItem('token', response.body.token);
    }
  });
});

