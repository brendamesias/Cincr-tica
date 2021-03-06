$(document).ready(function() {
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();


  $('#nicknameinput').keyup(function() {
    nickNameValid();
  });

  function nickNameValid() {
    if ($('#nicknameinput').val().length >= 4 && !($('#nicknameinput').val().match(/^\s+|\s+$/)) === true) {
      $('#next-view').prop('disabled', false);
    } else {
      alert('Tu nickname no debe tener espacios.') ;
    }
  }

  // Inicializando Firebase
  var config = {
    apiKey: 'AIzaSyAk-IzoOuu3mhEJTU8vR6fFITla-MBzA1k',
    authDomain: 'cincritica.firebaseapp.com',
    databaseURL: 'https://cincritica.firebaseio.com',
    projectId: 'cincritica',
    storageBucket: 'cincritica.appspot.com',
    messagingSenderId: '510323267571'
  };
  firebase.initializeApp(config);

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  // Evento que por medio  de un pop-up te permite acceder con tu cuenta de  google
  $('#btn-signup').click(
    function signUp() {
      firebase.auth()
        .signInWithPopup(provider)
        .then(function(result) {
          var user = firebase.auth().currentUser;
          saveDataUser(user);
          console.log(user.displayName);
          console.log(user.photoURL);

          // Extraemos los datos de usuario para el modal de registro exitoso
          $('#btn-modal').addClass('trying');
          $('#btn-modal').attr('data-toggle', 'modal');
          $('#btn-modal').attr('data-target', '#myModal');
          $('#btn-modal').trigger('click');
          $('#your-name').text(user.displayName);
          $('#your-email').text(user.email);
          $('#your-photo').append('<img style="width:50% ; height:auto;" src="' + user.photoURL + '"/>');
        });
    });

  // Redireccionamos a la vista interests
  $('#next-view').on('click', function() {
    var nicknameUser = $('#nicknameinput').val();
    localStorage.setItem('nickname_google', nicknameUser);
    window.location.href = '../views/intereses.html';
  });

  // Funcion que cambia los datos default por los datos del usuario actual

  $('#min-photo-user').on('click', function() {
    var user = firebase.auth().currentUser;
    $('#my-photo').attr('src', user.photoURL);
    $('#user-name').text(user.displayName);
    $('#user-email').text(user.email);
    console.log(user.displayName);
  });

  // Guardar información de los usuarios en  la base de datos
  function saveDataUser(user) {
    var myUser = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      movieGeneros: {},
    };
    firebase.database().ref('myUsersData/' + user.uid)
      .set(myUser);
  };
});
