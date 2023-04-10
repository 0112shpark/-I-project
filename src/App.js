import "./App.css";

function App() {
  //   const start = () => {
  //     /* ===========================
  //     Elements Selectors
  // ============================ */

  //     const elm = {
  //       arrow: document.querySelector(".form-container__arrow"),
  //       overlay: document.querySelector(".overlay"),
  //       title: document.querySelector(".title"),
  //       signUpButton: document.querySelector(".buttons__signup"),
  //       loginButton: document.querySelector(".buttons__signup--login"),
  //       loginForm: document.querySelector(".login-form"),
  //       registerForm: document.querySelector(".login-form--register"),
  //     };

  //     /* ===========================
  //     Properties Object
  // ============================ */

  //     const props = {
  //       left: "left: 20px;",
  //       bottom: "bottom: -500px;",
  //       transition1: "transition: bottom 1s;",
  //       transition2: "transition: bottom 2s;",
  //       opacity0: "opacity: 0;",
  //       opacity1: "opacity: 1;",
  //       trnsDelay: "transition-delay: 1s;",
  //       zIndex: "z-index: 6;",
  //       left0: "left: 0;",
  //       trnsDelay0: "transition-delay: 0s;",
  //       zIndex0: "z-index: 0;",
  //       leftM120: "left: -120px;",
  //     };

  //     /* ===========================
  //     Elements Array
  // ============================ */

  //     const elms = [
  //       elm.arrow,
  //       elm.overlay,
  //       elm.title,
  //       elm.signUpButton,
  //       elm.loginButton,
  //       elm.loginForm,
  //       elm.registerForm,
  //     ];

  //     function transition(elements, props) {
  //       for (let i = 0; i < elements.length; i++) {
  //         elements[i].setAttribute("style", `${props[i]}`);
  //       }
  //     }

  //     /* ===========================
  //     Events
  // ============================ */

  //     document.getElementById("signUp").onclick = function () {
  //       const properties = [
  //         props.left,
  //         props.opacity0,
  //         props.opacity0,
  //         `${props.transition1} ${props.bottom}`,
  //         `${props.transition2} ${props.bottom}`,
  //         props.opacity0,
  //         `${props.opacity1} ${props.trnsDelay} ${props.zIndex}`,
  //       ];

  //       transition(elms, properties);
  //     };

  //     document.getElementById("login").onclick = function () {
  //       const properties = [
  //         props.left,
  //         props.opacity0,
  //         props.opacity0,
  //         `${props.transition1} ${props.bottom}`,
  //         `${props.transition2} ${props.bottom}`,
  //         `${props.opacity1} ${props.trnsDelay} ${props.zIndex}`,
  //         props.opacity0,
  //       ];

  //       transition(elms, properties);
  //     };

  //     document.getElementById("arrowClick").onclick = function () {
  //       const properties = [
  //         props.leftM120,
  //         props.opacity1,
  //         props.opacity1,
  //         props.opacity1,
  //         props.opacity1,
  //         `${props.opacity0} ${props.trnsDelay0} ${props.zIndex0}`,
  //         `${props.opacity0} ${props.trnsDelay0} ${props.zIndex0}`,
  //       ];

  //       transition(elms, properties);
  //     };
  //   };
  //   window.addEventListener("load", start);

  return (
    <section className="form-container">
      <span id="arrowClick" className="form-container__arrow">
        <i className="fa fa-arrow-circle-left" aria-hidden="true"></i>
      </span>
      <div className="overlay"></div>
      <div className="choose-form">
        <div className="title">
          <h1 className="title__h1">
            Welcome
            <br />
            Start for free
          </h1>
        </div>
        <div className="buttons">
          <a id="signUp" className="buttons__signup" href="#">
            Sign up
          </a>
          <a
            id="login"
            className="buttons__signup buttons__signup--login"
            href="#"
          >
            Login
          </a>
        </div>
      </div>

      <div className="login-form">
        <div className="form-wrapper">
          <form method="post">
            <label className="form-wrapper__label" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              className="form-wrapper__input"
              type="text"
              placeholder="Username"
              name="username"
              required
            />
            <label className="form-wrapper__label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="form-wrapper__input"
              type="password"
              placeholder="Password"
              name="password"
              pattern=".{3,}"
              title="Password must contain at least 3 characters"
              required
            />
            <a className="login-form__forgot-password" href="#">
              Forgot password?
            </a>
            <button
              className="buttons__signup buttons__signup--login-form"
              type="submit"
              href="#"
            >
              Login
            </button>
          </form>

          <div className="social-media">
            <h6 className="title__h2">Or connect with</h6>
            <a className="buttons__signup buttons__signup--social" href="#">
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
              &nbsp;facebook
            </a>
            <a className="buttons__signup buttons__signup--social" href="#">
              <i className="fab fa-google" aria-hidden="true"></i>&nbsp;google
            </a>
          </div>
        </div>
      </div>

      <div className="login-form login-form--register">
        <div className="form-wrapper">
          <form method="post">
            <label className="form-wrapper__label" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              className="form-wrapper__input"
              type="email"
              placeholder="example@hotmail.com"
              name="email"
              required
            />
            <label className="form-wrapper__label" htmlFor="signup-username">
              Username
            </label>
            <input
              id="signup-username"
              className="form-wrapper__input"
              type="text"
              placeholder="Username"
              name="username"
              required
            />
            <label className="form-wrapper__label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              className="form-wrapper__input"
              type="password"
              placeholder="Password"
              name="password"
              pattern=".{3,}"
              title="Password must contain at least 3 characters"
              required
            />
            <button
              className="buttons__signup buttons__signup--sign-up-form"
              type="submit"
            >
              Sign up
            </button>
          </form>

          <div className="social-media">
            <h2 className="title__h2">Or connect with</h2>
            <a className="buttons__signup buttons__signup--social" href="#">
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
              &nbsp;facebook
            </a>
            <a className="buttons__signup buttons__signup--social" href="#">
              <i className="fab fa-google" aria-hidden="true"></i>&nbsp;google
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
