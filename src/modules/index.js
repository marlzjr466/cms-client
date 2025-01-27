import theme from "./theme"
import auth from "./auth"
import doctors from "./doctors"

export default () => ([
  auth(),
  theme(),
  doctors()
])