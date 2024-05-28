async function login(email, password) {
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  const user = await response.json();
  if (!user.token) return false;
  console.log(user);
  return user;
}

let loginForm = document.getElementById("login");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  let target = event.target;

  if (target.email.value == "" || target.password.value == "") {
    throw new Error("empty value");
  } else {
    const user = await login(target.email.value, target.password.value);
    if (user) {
      document.cookie = "token= " + user.token;
      console.log(document.cookie);
      document.location.href = "index.html";
    } else {
      document.querySelector(".error").style.display = "block";
      throw new Error("error 404");
    }
  }
});
