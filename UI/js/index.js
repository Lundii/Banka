function loginSignup(login) {
  document.querySelector('#registerCont').style.display = 'none';
  document.querySelector('#loginSignupCont').style.display = 'block';

  if (login) {
    document.querySelector('#login').style.display = 'block';
    document.querySelector('#loginCont').style.backgroundColor = 'white';
    document.querySelector('#signup').style.display = 'none';
    document.querySelector('#signupCont').style.backgroundColor = 'rgb(240, 240, 240)';
  } else {
    document.querySelector('#login').style.display = 'none';
    document.querySelector('#loginCont').style.backgroundColor = 'rgb(240, 240, 240)';
    document.querySelector('#signup').style.display = 'block';
    document.querySelector('#signupCont').style.backgroundColor = 'white';
  }
}

function registerUi() {
  document.querySelector('#registerCont').style.display = 'block';
  document.querySelector('#loginSignupCont').style.display = 'none';
}

function showAcctHistory() {
  document.querySelector('#accountHistory').style.display = 'block';
  document.querySelector('#accountSummary').style.display = 'none';
}

function showStaffDetails() {
  document.querySelector('#manageStaffs').style.display = 'none';
  document.querySelector('#staffDetails').style.display = 'block';
}

function showUserDetails() {
  document.querySelector('#manageUsers').style.display = 'none';
  document.querySelector('#userDetails').style.display = 'block';
}

function showAdminDetails() {
  document.querySelector('#manageAdmins').style.display = 'none';
  document.querySelector('#adminDetails').style.display = 'block';
}

function createNewAdmin() {
  document.querySelector('#manageAdmins').style.display = 'none';
  document.querySelector('#adminDetails').style.display = 'block';
  document.querySelector('#createNewAdmin').style.display = 'block';
}

function displayView() {
  const view = document.querySelector('#acctNumEmail').value.toLowerCase() || 'default';
  switch (view) {
    case 'user':
      window.location.href = '../pages/userPages/dashboard.html';
      break;
    case 'admin':
      window.location.href = '../pages/adminPages/manageUsers.html';
      break;
    case 'staff':
      window.location.href = '../pages/Staff(Cashier) pages/manageUsers.html';
      break;
    case 'default':
      window.location.href = '../pages/userPages/dashboard.html';
      break;
  }
}

window.addEventListener('resize', getWidth);

function getWidth() {
  const width = document.documentElement.clientWidth;
  if (width >= '720') {
    toggleMenu('hide');
  }
}
function toggleMenu(src) {
  if (src == 'hide') {
    if (document.querySelector('.nav-resp-vert') != null) {
      document.querySelector('.nav-resp-vert').style.display = 'none';
    } else if (document.querySelector('.nav-vert-cont') != null) {
      document.querySelector('.nav-vert-cont').style.display = 'none';
    }
    return;
  }
  if (src) {
    const toggle = document.querySelector('.nav-vert-cont');
    if (toggle.style.display.length == 0 || toggle.style.display == 'none') {
      toggle.style.display = 'block';
    } else {
      toggle.style.display = 'none';
    }
  } else {
    const toggle = document.querySelector('.nav-resp-vert');
    if (toggle.style.display.length == 0 || toggle.style.display == 'none') {
      toggle.style.display = 'block';
    } else {
      toggle.style.display = 'none';
    }
  }
}
