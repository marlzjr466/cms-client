import theme from "./theme"
import auth from "./auth"
import doctors from "./doctors"
import attendants from "./attendants"

export default () => ([
  auth(),
  theme(),
  doctors(),
  attendants()
])