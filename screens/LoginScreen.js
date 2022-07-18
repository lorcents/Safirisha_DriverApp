import { useContext, useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import AuthContent from "../components/Auth/AuthContent";
import { login } from "../util/auth";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const Authctx = useContext(AuthContext);
  async function LoginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      // console.log(token);
      Authctx.authenticate(token);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Authentication failed",
        "Could not log you in.Please check your credentials or try again later"
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Loaging user..." />;
  }

  return <AuthContent isLogin onAuthenticate={LoginHandler} />;
}

export default LoginScreen;
