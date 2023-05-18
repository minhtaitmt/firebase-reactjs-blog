import React, { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const initialState = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
};

const Auth = ({setActive, setUser}) => {
	const [state, setState] = useState(initialState);
	const [signUp, setSignUp] = useState(false);

	const { email, password, firstName, lastName, confirmPassword } = state;

  const navigate = useNavigate()

	const handleChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value });
	};

  const handleAuth = async (e) => {
    e.preventDefault();
    if(!signUp){
      if(email && password){
        const {user} = await signInWithEmailAndPassword(auth, email, password);
        setActive("home")
      } else {
        return toast.error("All fields must be filled!")
      }
    } else {
      if(password !== confirmPassword){
        return toast.error("Password does not match!")
      }
      if(firstName && lastName && email && password){
        const {user} = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(user, {displayName: `${firstName} ${lastName}`})
		setUser(user)
        setActive("home");
      } else{
        return toast.error("All fields must be filled!")
      }
    }
    navigate("/")
  }
	return (
		<div class="container-fluid mb-4">
			<div class="container">
				<div class="col-12 text-center">
					<div class="text-center heading py-2">
						{!signUp ? "Sign-In" : "Sign-Up"}
					</div>
				</div>
				<div class="row h-100 justify-content-center align-items-center">
					<div class="col-10 col-md-8 col-lg-6">
						<form action="" class="row" onSubmit={handleAuth}>
							{signUp && (
								<>
									<div class="col-6 py-3">
										<input
											type="text"
											class="form-control input-text-box"
											placeholder="First name"
											name="firstName"
											value={firstName}
											onChange={handleChange}
										/>
									</div>
									<div class="col-6 py-3">
										<input
											type="text"
											class="form-control input-text-box"
											placeholder="Last name"
											name="lastName"
											value={lastName}
											onChange={handleChange}
										/>
									</div>
								</>
							)}
							<div class="col-12 py-3">
								<input
									type="email"
									class="form-control input-text-box"
									placeholder="Email"
									name="email"
									value={email}
									onChange={handleChange}
								/>
							</div>
							<div class="col-12 py-3">
								<input
									type="password"
									class="form-control input-text-box"
									placeholder="Password"
									name="password"
									value={password}
									onChange={handleChange}
								/>
							</div>
              {signUp && (
                <div class="col-12 py-3">
                  <input
                    type="password"
                    class="form-control input-text-box"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                  />
							</div>
              )}
              
							<div class="col-12 py-3 text-center">
								<button
									className={`btn ${
										!signUp ? "btn-sign-in" : "btn-sign-up"
									}`}
									type="submit"
								>
									{!signUp ? "Sign-in" : "Sign-up"}
								</button>
							</div>
						</form>
						<div>
							{!signUp ? (
								<div class="text-center justify-content-center mt-2 pt-2">
									<p class="small fw-bold mt-2 pt-1 mb-0">
										Don't have an account ?&nbsp;
										<span
											class="link-danger"
											style={{
												textDecoration: "none",
												cursor: "pointer",
											}}
											onClick={() => setSignUp(true)}
										>
											Sign Up
										</span>
									</p>
								</div>
							) : (
								<div class="text-center justify-content-center mt-2 pt-2">
									<p class="small fw-bold mt-2 pt-1 mb-0">
										Already have an account ?&nbsp;
										<span
											style={{
												textDecoration: "none",
												cursor: "pointer",
												color: "#298af2",
											}}
											onClick={() => setSignUp(false)}
										>
											Sign In
										</span>
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Auth;
