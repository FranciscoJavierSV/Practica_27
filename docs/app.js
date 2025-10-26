// --- Manejo del modal de login (funciona en cualquier página) ---
document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');

  if (loginBtn && loginModal && closeModal) {
    loginBtn.onclick = function() {
      loginModal.style.display = 'block';
    };
    closeModal.onclick = function() {
      loginModal.style.display = 'none';
    };
    window.onclick = function(event) {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    };
  }
});

// Capturamos el formulario
const form = document.getElementById("formLogin");

// Escuchamos el evento "submit"
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // evita que la página se recargue

  // Obtener los valores escritos por el usuario
  const login = document.getElementById("login").value;
  const contrasena = document.getElementById("password").value;

  // Enviar los datos al servidor usando fetch + async/await
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cuenta: login, // nombre del campo esperado el backend
        contrasena: contrasena
      })
    });

    // Intentamos parsear el JSON (puede fallar si el servidor responde vacío)
    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      console.warn("Respuesta no JSON del servidor", parseErr);
      data = {};
    }

    // Revisar la respuesta
    if (res.ok) {
      const cuenta = data.usuario?.cuenta;
      if (cuenta) {
        // Mostrar modal de éxito
        Swal.fire({ icon: 'success', title: 'Acceso permitido', text: cuenta });
        console.log("Usuario recibido:", data.usuario);
        // mostrar el nombre junto al candado
        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = cuenta;
        // cerrar modal automáticamente
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'none';

        // Guardar credenciales en localStorage =============================================
        try {
          localStorage.setItem('practica26_cuenta', login);
          localStorage.setItem('practica26_contrasena', contrasena);
          console.log('Credenciales guardadas en localStorage');
        } catch (err) {
          console.warn('No fue posible guardar en localStorage', err);
        }
        //====================================================================================
        
      } else {
        console.warn('200 OK sin usuario:', data);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Respuesta incompleta del servidor. No se permite el acceso.' });
      }
    } else {
      // LOGIN INCORRECTO: modal de error con el mensaje del backend
      Swal.fire({ icon: 'error', title: 'Error', text: data?.error ?? `Error ${res.status}` });
      // limpiar campos
      const loginInput = document.getElementById("login");
      const passInput = document.getElementById("password");
      if (loginInput) loginInput.value = "";
      if (passInput) passInput.value = "";
    }

  } catch (err) {
    // ERROR DE CONEXIÓN
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servidor.' });
  }
});
